import { makePlane } from "replicad";
import {
  inchesToMillimeters,
  calculateVertexAngle,
} from "./utils";
import { generateShellSegments } from "./shellSegments";
import { generateInterlockingTabs } from "./interlockingTabs";
import { generateBearingEdges } from "./bearingEdges";

// Drum Generator
export const generate3DPSD = ({
  fitmentTolerance,
  shell,
  lugs,
}, updateProgress: (number: number) => string) => {
  const { depthInches, diameterInches, shellThickness } = shell;
  const { lugNumber } = lugs;
  // Bearing Edge Constants
  const bearingEdgeHeight = 30;
  const bearingEdgeSegmentCoverage = 2
  // Shell Constants
  const depth = inchesToMillimeters(depthInches);
  const radius = inchesToMillimeters(diameterInches) / 2;
  const shellSegmentVertexAngle = 360 / lugNumber;
  const shellSegmentHeight = depth - bearingEdgeHeight * 2;
  const shellCenterPoint = bearingEdgeHeight + shellSegmentHeight / 2;
  // Tab Constants
  const tabWidth = 10;
  const tabVertexAngle = calculateVertexAngle(radius, tabWidth);
  const tabThickness = Math.floor(shellThickness / 3);
  const tabOuterRadius = radius - (shellThickness - tabThickness) / 2;
  const tabFitmentToleranceDegrees = calculateVertexAngle(
    radius,
    fitmentTolerance
  );
  const interlockingTabHeight = 10;
  // Planes
  const basePlane = makePlane("XY", 0);
  const shellSegmentPlane = makePlane("XY", bearingEdgeHeight);

  const generateShellAssembly = () => {
    updateProgress(0.25);
    const { interlockingTabPockets, interlockingTabs } =
      generateInterlockingTabs(
        diameterInches,
        tabOuterRadius,
        shellSegmentVertexAngle,
        tabThickness,
        interlockingTabHeight,
        shellSegmentPlane,
        fitmentTolerance,
        tabFitmentToleranceDegrees,
        lugNumber,
        shellSegmentHeight
      );
      updateProgress(0.5);
    const { bearingEdgesTop, bearingEdgesBottom } = generateBearingEdges(
      shellSegmentVertexAngle,
      interlockingTabPockets,
      radius,
      shellThickness,
      bearingEdgeHeight,
      tabOuterRadius,
      tabVertexAngle,
      tabThickness,
      fitmentTolerance,
      tabFitmentToleranceDegrees,
      basePlane,
      shellSegmentHeight,
      bearingEdgeSegmentCoverage
    );
    updateProgress(0.75);
    const shellSegments = generateShellSegments(
      depth,
      radius,
      shellSegmentVertexAngle,
      shellThickness,
      shellSegmentHeight,
      shellSegmentPlane,
      tabOuterRadius,
      tabVertexAngle,
      tabThickness,
      fitmentTolerance,
      tabFitmentToleranceDegrees,
      shellCenterPoint,
      interlockingTabPockets,
      lugs
    );
    updateProgress(1);

    return [
      ...shellSegments,
      ...interlockingTabs,
      ...bearingEdgesTop,
      ...bearingEdgesBottom,
    ];
  };

  return generateShellAssembly();
};
