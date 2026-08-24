const fs = require("fs");
const cp = require("child_process");

const base = "/home/u986983151/domains/liquistudio.com";
const app = base + "/hbuilds/current/nodejs";
let out = "DIAG " + new Date().toISOString() + "\n";

function run(cmd) {
  try {
    out += "$ " + cmd + "\n" + cp.execSync(cmd, { cwd: app }).toString().slice(0, 5000) + "\n";
  } catch (e) {
    out += "$ " + cmd + "\nFAILED: " + (e.stdout ? e.stdout.toString() : "") + String(e.message || "") + "\n";
  }
}

run("ls -la " + app);
run("/opt/alt/alt-nodejs20/root/bin/node --version");
run("cat package.json | head -30");

try {
  out += "--- console.log tail ---\n" + fs.readFileSync(app + "/console.log", "utf8").slice(-8000) + "\n";
} catch (e) {
  out += "no console.log: " + e.message + "\n";
}

try {
  out += "--- boot-debug.log ---\n" + fs.readFileSync(base + "/public_html/boot-debug.log", "utf8").slice(-8000) + "\n";
} catch (e) {
  out += "no boot-debug.log in public_html\n";
}

try {
  fs.mkdirSync(app + "/tmp", { recursive: true });
  fs.writeFileSync(app + "/tmp/restart.txt", "");
  out += "restart.txt touched\n";
} catch (e) {
  out += "restart touch failed: " + e.message + "\n";
}

fs.writeFileSync(base + "/public_html/diag.txt", out);
