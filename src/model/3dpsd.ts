import { generateShellSegments } from "./shellSegments";
import { generateInterlockingTabs } from "./interlockingTabs";
import { generateBearingEdges } from "./bearingEdges";
import { Drum, ShellConstants } from "./types";
import { getShellConstants } from "./constants";

export const generate3DPSD = (
  drum: Drum,
  updateProgress: (number: number) => string
) => {
  const { depthInches, diameterInches, shellThickness } = drum.shell;
  const { lugNumber } = drum.lugs;
  const shellConstants = getShellConstants(
    depthInches,
    diameterInches,
    lugNumber,
    shellThickness,
    drum.fitmentTolerance
  );
  return generateShellAssembly({ shellConstants, drum, updateProgress });
};

const generateShellAssembly = ({
  shellConstants,
  drum,
  updateProgress,
}: {
  shellConstants: ShellConstants;
  drum: Drum;
  updateProgress: (number: number) => void;
}) => {
  const {
    bearingEdgeHeight,
    bearingEdgeSegmentCoverage,
    depth,
    radius,
    shellSegmentVertexAngle,
    shellSegmentHeight,
    shellCenterPoint,
    tabVertexAngle,
    tabThickness,
    tabOuterRadius,
    tabFitmentToleranceDegrees,
    interlockingTabHeight,
    basePlane,
    shellSegmentPlane,
  } = shellConstants;
  const { diameterInches, shellThickness, lugsPerSegment } = drum.shell;
  const { lugNumber } = drum.lugs
  updateProgress(0.25);
  const { interlockingTabPockets, interlockingTabs } = generateInterlockingTabs(
    diameterInches,
    tabOuterRadius,
    shellSegmentVertexAngle,
    tabThickness,
    interlockingTabHeight,
    shellSegmentPlane,
    drum.fitmentTolerance,
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
    drum.fitmentTolerance,
    tabFitmentToleranceDegrees,
    basePlane,
    shellSegmentHeight,
    bearingEdgeSegmentCoverage,
    drum.bearingEdges
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
    drum.fitmentTolerance,
    tabFitmentToleranceDegrees,
    shellCenterPoint,
    interlockingTabPockets,
    drum.lugs,
    lugsPerSegment
  );
  updateProgress(1);

  return [
    ...shellSegments,
    ...interlockingTabs,
    ...bearingEdgesTop,
    ...bearingEdgesBottom,
  ];
};
