import { drawCircle, makePlane } from "replicad";
import {
  inchesToMillimeters,
  calculateVertexAngle,
  generateFilletedSegmentBody,
  generateSegmentBody,
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
}) => {
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

    return [
      ...shellSegments,
      ...interlockingTabs,
      ...bearingEdgesTop,
      ...bearingEdgesBottom,
    ];
  };

  return generateShellAssembly();
};
