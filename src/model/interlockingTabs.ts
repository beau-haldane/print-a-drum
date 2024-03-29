import { DrumSchema } from "../components/ModelSettingsPanel/inputSchema";
import { ShapeArray, ShellConstants, WrappedShapeArray } from "./types";
import { generateFilletedSegmentBody } from "./utils";

export const generateInterlockingTabs = ({
  shellConstants,
  drum,
  updateProgress,
}: {
  shellConstants: ShellConstants;
  drum: DrumSchema;
  updateProgress: (number: number, message?: string) => void;
}) => {
  const {
    shellSegmentVertexAngle,
    shellSegmentHeight,
    tabThickness,
    tabOuterRadius,
    tabFitmentToleranceDegrees,
    interlockingTabHeight,
    shellSegmentPlane,
  } = shellConstants;
  const { fitmentTolerance } = drum;
  const { lugNumber } = drum.lugs;
  const { diameterInches } = drum.shell;
  const tabsPerSegment = diameterInches >= 12 ? 2 : 1;
  const interlockingTabPocketHeight = interlockingTabHeight + 0.5;

  // Generate Tabs
  const interlockingTab = generateFilletedSegmentBody(
    tabOuterRadius,
    shellSegmentVertexAngle / (2 * tabsPerSegment),
    tabThickness,
    interlockingTabHeight,
    shellSegmentPlane
  );

  const interlockingTabPocket = generateFilletedSegmentBody(
    tabOuterRadius + fitmentTolerance,
    shellSegmentVertexAngle / (2 * tabsPerSegment) + tabFitmentToleranceDegrees,
    tabThickness + fitmentTolerance * 2,
    interlockingTabPocketHeight,
    shellSegmentPlane
  );

  updateProgress(0.15, 'Positioning tabs')
  // Generate Interlocking Tabs
  const tabsAndPockets: {
    interlockingTabs: WrappedShapeArray;
    interlockingTabPockets: ShapeArray;
  } = { interlockingTabs: [], interlockingTabPockets: [] };
  for (let i = 0; i < lugNumber * tabsPerSegment; i++) {
    const rotationOffset =
      tabsPerSegment > 1 ? -shellSegmentVertexAngle / (tabsPerSegment * 2) : 0;
    const rotationAngle =
      rotationOffset + i * (shellSegmentVertexAngle / tabsPerSegment);

    tabsAndPockets.interlockingTabs.push({
      shape: interlockingTab
        .clone()
        .translateZ(shellSegmentHeight - interlockingTabHeight / 2)
        .rotate(rotationAngle),
      name: `Interlocking Tab ${tabsAndPockets.interlockingTabs.length + 1}`,
    });
    tabsAndPockets.interlockingTabs.push({
      shape: interlockingTab
        .clone()
        .translateZ(-(interlockingTabHeight / 2))
        .rotate(rotationAngle),
      name: `Interlocking Tab ${tabsAndPockets.interlockingTabs.length + 1}`,
    });
    tabsAndPockets.interlockingTabPockets.push(
      interlockingTabPocket
        .clone()
        .translateZ(shellSegmentHeight - interlockingTabPocketHeight / 2)
        .rotate(rotationAngle)
    );
    tabsAndPockets.interlockingTabPockets.push(
      interlockingTabPocket
        .clone()
        .translateZ(-(interlockingTabPocketHeight / 2))
        .rotate(rotationAngle)
    );
  }

  return tabsAndPockets;
};
