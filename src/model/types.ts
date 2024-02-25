import {
  CompSolid,
  Compound,
  Edge,
  Face,
  Plane,
  Shape,
  Shell,
  Solid,
  Vertex,
  Wire,
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

export interface Drum {
  fitmentTolerance: number;
  shell: DrumShell;
  bearingEdges: BearingEdges;
  lugs: Lugs;
}

export interface DrumShell {
  diameterInches: number;
  depthInches: number;
  shellThickness: number;
  lugsPerSegment: number;
}

export interface BearingEdges {
  lugsPerSegment: number;
  topBearingEdge: BearingEdgeProfile;
  bottomBearingEdge: BearingEdgeProfile;
}

export interface BearingEdgeProfile {
  thickness: number;
  outerEdge: {
    profileType: ProfileType;
    profileSize: number;
    customChamferAngle?: number;
  };
  innerEdge: { profileType: ProfileType; customChamferAngle?: number };
}

export type ProfileType = "roundover" | "chamfer" | "customChamfer" | "none";

export interface Lugs {
  lugType: "singlePoint" | "doublePoint";
  lugRows: 1 | 2;
  lugNumber: number;
  lugHoleSpacing: number;
  lugHoleDiameter: number;
  lugHolePocketDiameter: number;
  lugHolePocketDepth: number;
  lugHoleDistanceFromEdge?: number;
}

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
