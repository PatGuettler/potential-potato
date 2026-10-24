import type { CourseSpec } from "./dsl";
import { technologyCourses } from "./new/technology";
import { technologyCourses2 } from "./new/technology2";
import { engineeringCourses } from "./new/engineering";
import { engineeringCourses2 } from "./new/engineering2";

export const newCourses: CourseSpec[] = [...technologyCourses, ...technologyCourses2, ...engineeringCourses, ...engineeringCourses2];
