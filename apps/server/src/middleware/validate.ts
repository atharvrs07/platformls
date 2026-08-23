import { NextFunction, Request, Response } from "express";
import { ZodSchema, ZodError } from "zod";
import { ApiError } from "../utils/apiError.js";

type Source = "body" | "query" | "params";

export function validate(schema: ZodSchema, source: Source = "body") {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      const result = schema.parse(req[source]);
      req[source] = result;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        next(
          ApiError.validation(
            "Validation failed",
            error.errors.map((e) => ({ path: e.path.join("."), message: e.message }))
          )
        );
        return;
      }
      next(error);
    }
  };
}
