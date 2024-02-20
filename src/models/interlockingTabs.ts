import { Plane } from "replicad";
import { ShapeArray, WrappedShapeArray } from "./types";
import { generateFilletedSegmentBody } from "./utils";

export const generateInterlockingTabs = (
  diameterInches: number,
  tabOuterRadius: number,
  shellSegmentVertexAngle: number,
  tabThickness: number,
  interlockingTabHeight: number,
  shellSegmentPlane: Plane,
  fitmentTolerance: number,
  tabFitmentToleranceDegrees: number,
  lugs: number,
  shellSegmentHeight: number
) => {
  const tabsPerSegment = diameterInches >= 12 ? 2 : 1;

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
    interlockingTabHeight,
    shellSegmentPlane
  );

  // Generate Interlocking Tabs
  const tabsAndPockets: {
    interlockingTabs: WrappedShapeArray;
    interlockingTabPockets: ShapeArray;
  } = { interlockingTabs: [], interlockingTabPockets: [] };
  for (let i = 0; i < lugs * tabsPerSegment; i++) {
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
        .translateZ(shellSegmentHeight - interlockingTabHeight / 2)
        .rotate(rotationAngle)
    );
    tabsAndPockets.interlockingTabPockets.push(
      interlockingTabPocket
        .clone()
        .translateZ(-(interlockingTabHeight / 2))
        .rotate(rotationAngle)
    );
  }

  return tabsAndPockets;
};
