import {
  CompSolid,
  Compound,
  Plane,
  Shell,
  Solid,
} from "replicad";

export type SolidShape =
  | Shell
  | Solid
  | CompSolid
  | Compound

export type ShapeArray = Array<SolidShape>;

export type WrappedShapeArray = Array<{
  shape: SolidShape;
  name: string;
}>;

export type ShellConstants = {
  bearingEdgeHeight: number;
  bearingEdgeSegmentCoverage: number;
  depth: number;
  radius: number;
  shellSegmentVertexAngle: number;
  shellSegmentHeight: number;
  shellCenterPoint: number;
  tabWidth: number;
  tabVertexAngle: number;
  tabThickness: number;
  tabOuterRadius: number;
  tabFitmentToleranceDegrees: number;
  interlockingTabHeight: number;
  diameterInches: number;
  shellThickness: number;
  fitmentTolerance: number;
  lugNumber: number;
  basePlane: Plane;
  shellSegmentPlane: Plane;
};
