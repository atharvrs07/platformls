const fs = require("fs");
const path = require("path");

// Touch Passenger's restart file so the freshly built version goes live
// immediately. The build sandbox may run before the `current` symlink is
// swapped, so cover both locations defensively.
const targets = [
  path.join(process.cwd(), "tmp", "restart.txt"),
  "/home/u986983151/domains/liquistudio.com/hbuilds/current/nodejs/tmp/restart.txt",
];

for (const t of targets) {
  try {
    fs.mkdirSync(path.dirname(t), { recursive: true });
    fs.writeFileSync(t, String(Date.now()));
    console.log("[postbuild] touched " + t);
  } catch (e) {
    console.log("[postbuild] skipped " + t + ": " + e.message);
  }
}
