import type { UnitSpec } from "./dsl";
import { mathElementaryExt } from "./ext/math-elementary";
import { mathSecondaryExt } from "./ext/math-secondary";
import { scienceElementaryExt } from "./ext/science-elementary";
import { scienceSecondaryExt } from "./ext/science-secondary";
import { techExt } from "./ext/technology";
import { engineeringExt } from "./ext/engineering";

/** Additional units for existing courses, keyed by course id. */
export const extensions: Record<string, UnitSpec[]> = {
  ...mathElementaryExt,
  ...mathSecondaryExt,
  ...scienceElementaryExt,
  ...scienceSecondaryExt,
  ...techExt,
  ...engineeringExt,
};
