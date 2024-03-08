import { makePlane } from "replicad";
import { ShellConstants } from "./types";
import { calculateVertexAngle, inchesToMillimeters } from "./utils";

export const getShellConstants = (
  depthInches: number,
  diameterInches: number,
  lugNumber: number,
  shellThickness: number,
  fitmentTolerance: number
): ShellConstants => {
  const depth = inchesToMillimeters(depthInches);
  const bearingEdgeHeight = 30;
  const shellSegmentHeight = depth - bearingEdgeHeight * 2;
  const radius = (inchesToMillimeters(diameterInches) / 2) - 2;
  const tabWidth = 10;
  const tabThickness = Math.floor(shellThickness / 3);
  const basePlane = makePlane("XY", 0);
  const shellSegmentPlane = makePlane("XY", bearingEdgeHeight);
  return {
    bearingEdgeHeight,
    bearingEdgeSegmentCoverage: 2,
    depth,
    radius,
    shellSegmentVertexAngle: 360 / lugNumber,
    shellSegmentHeight,
    shellCenterPoint: bearingEdgeHeight + shellSegmentHeight / 2,
    tabWidth,
    tabVertexAngle: calculateVertexAngle(radius, tabWidth),
    tabThickness,
    tabOuterRadius: radius - (shellThickness - tabThickness) / 2,
    tabFitmentToleranceDegrees: calculateVertexAngle(radius, fitmentTolerance),
    interlockingTabHeight: 10,
    diameterInches,
    shellThickness,
    fitmentTolerance,
    lugNumber,
    basePlane,
    shellSegmentPlane,
  };
};
