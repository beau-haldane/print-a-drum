import { z } from "zod";

const profileTypeSchema = z.enum([
  "roundover",
  "chamfer",
  "customChamfer",
  "none",
]);

const bearingEdgeProfileSchema = z.object({
  thickness: z.coerce.number(),
  outerEdge: z.object({
    profileType: profileTypeSchema,
    profileSize: z.coerce.number(),
    customChamferAngle: z.optional(
      z.coerce
        .number()
        .min(0, { message: "Chamfer angle cannot be negative" })
        .max(70, { message: "Maximum chamfer angle is 70 degrees" })
    ),
  }),
  innerEdge: z.object({
    profileType: profileTypeSchema,
    customChamferAngle: z.optional(
      z.coerce
        .number()
        .min(0, { message: "Chamfer angle cannot be negative" })
        .max(70, { message: "Maximum chamfer angle is 70 degrees" })
    ),
  }),
});

const shellSchemaObject = z.object({
  diameterInches: z.coerce
    .number()
    .min(8, { message: "Diameter must be at least 8 inches" })
    .max(18, { message: "Diameter cannot be greater than 18 inches" }),
  depthInches: z.coerce
    .number()
    .min(4, { message: "Depth must be at least 4 inches" })
    .max(16, { message: "Depth cannot be greater than 16 inches" }),
  shellThickness: z.coerce
    .number()
    .min(6, { message: "Thickness must be at least 6mm" })
    .max(50, { message: "Thickness cannot be greater than 50mm" }),
  lugsPerSegment: z.coerce
    .number()
    .min(1, { message: "Must have at least 1 lug per segment" })
    .max(2, { message: "No more than 2 lugs per segment" }),
});

const lugSchemaObject = z.object({
  lugType: z.enum(["singlePoint", "doublePoint"]),
  lugRows: z.coerce
    .number()
    .min(1, { message: "Must have at least 1 lug per segment" })
    .max(2, { message: "No more than 2 lugs per segment" }),
  lugNumber: z.coerce
    .number()
    .min(4, { message: "There must be at least 4 lugs" })
    .max(12, { message: "No more than 12 lugs per drum" }),
  lugHoleSpacing: z.optional(z.coerce.number()),
  lugHoleDiameter: z.coerce.number(),
  lugHolePocketDiameter: z.coerce.number(),
  lugHolePocketDepth: z.coerce.number(),
  lugHoleDistanceFromEdge: z.optional(z.coerce.number()),
});

const bearingEdgeSchemaObject = z.object({
  lugsPerSegment: z.coerce
    .number()
    .min(1, { message: "Must have at least 1 lug per segment" })
    .max(2, { message: "No more than 2 lugs per segment" }),
  topBearingEdge: bearingEdgeProfileSchema,
  bottomBearingEdge: bearingEdgeProfileSchema,
});

export const drumSchemaObject = z.object({
  fitmentTolerance: z.coerce
    .number()
    .nonnegative({ message: "Tolerance cannot be negative" })
    .max(1, { message: "Tolerance cannot be greater than 1mm" }),
  shell: shellSchemaObject,
  lugs: lugSchemaObject,
  bearingEdges: bearingEdgeSchemaObject,
});

export type DrumSchema = z.infer<typeof drumSchemaObject>;
export type ShellSchema = z.infer<typeof shellSchemaObject>;
export type LugSchema = z.infer<typeof lugSchemaObject>;
export type BearingEdgeSchema = z.infer<typeof bearingEdgeSchemaObject>;
