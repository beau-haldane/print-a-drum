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
  diameterInches,
  depthInches,
  lugs,
  lugHoleDiameter,
  lugHoleSpacing,
  shellThickness: thickness,
  fitmentTolerance,
}, updateProgress) => {
  // Bearing Edge Constants
  const bearingEdgeHeight = 30;
  const bearingEdgeSegmentCoverage = 2
  // Shell Constants
  const depth = inchesToMillimeters(depthInches);
  const radius = inchesToMillimeters(diameterInches) / 2;
  const shellSegmentVertexAngle = 360 / lugs;
  const shellSegmentHeight = depth - bearingEdgeHeight * 2;
  const shellCenterPoint = bearingEdgeHeight + shellSegmentHeight / 2;
  // Tab Constants
  const tabWidth = 10;
  const tabVertexAngle = calculateVertexAngle(radius, tabWidth);
  const tabThickness = Math.floor(thickness / 3);
  const tabOuterRadius = radius - (thickness - tabThickness) / 2;
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
        lugs,
        shellSegmentHeight
      );
      updateProgress(0.5);
    const { bearingEdgesTop, bearingEdgesBottom } = generateBearingEdges(
      shellSegmentVertexAngle,
      interlockingTabPockets,
      radius,
      thickness,
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
      radius,
      shellSegmentVertexAngle,
      thickness,
      shellSegmentHeight,
      shellSegmentPlane,
      tabOuterRadius,
      tabVertexAngle,
      tabThickness,
      fitmentTolerance,
      tabFitmentToleranceDegrees,
      lugHoleDiameter,
      lugHoleSpacing,
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
