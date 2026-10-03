/**
 * Validation layer — never trust raw AI output.
 *
 * Parse a blueprint against the schema and return either a fully-typed
 * blueprint or a human-readable list of problems (safe to feed back to the AI
 * or show to the user). This is what keeps AI from inventing section types or
 * breaking the renderer.
 */

import { StoreBlueprintSchema, type StoreBlueprint } from "./schema";

export type ValidationResult =
  | { ok: true; blueprint: StoreBlueprint }
  | { ok: false; errors: string[] };

export function validateBlueprint(input: unknown): ValidationResult {
  const result = StoreBlueprintSchema.safeParse(input);

  if (result.success) {
    return { ok: true, blueprint: result.data };
  }

  const errors = result.error.issues.map((issue) => {
    const path = issue.path.length ? issue.path.join(".") : "<root>";
    return `${path}: ${issue.message}`;
  });

  return { ok: false, errors };
}

/**
 * Convenience helper for the AI pipeline: returns the typed blueprint or
 * throws with a combined message. Use `validateBlueprint` when you want to
 * surface every error at once.
 */
export function parseBlueprintOrThrow(input: unknown): StoreBlueprint {
  const result = validateBlueprint(input);
  if (!result.ok) {
    throw new Error(`Invalid blueprint:\n- ${result.errors.join("\n- ")}`);
  }
  return result.blueprint;
}
