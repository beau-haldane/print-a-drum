import { Drum, ShapeArray, ShellConstants, WrappedShapeArray } from "./types";
import { generateChamferCuttingTool, generateSegmentBody } from "./utils";
import { Compound, Plane, Solid, makePlane } from "replicad";

export const generateBearingEdges = ({
  shellConstants,
  drum,
  interlockingTabPockets,
  updateProgress,
}: {
  shellConstants: ShellConstants;
  drum: Drum;
  interlockingTabPockets: ShapeArray;
  updateProgress: (number: number, message?: string) => void;
}): {
  bearingEdgesTop: WrappedShapeArray;
  bearingEdgesBottom: WrappedShapeArray;
} => {
  const {
    bearingEdgeHeight,
    radius,
    shellSegmentVertexAngle,
    shellSegmentHeight,
    basePlane,
  } = shellConstants;
  const { bearingEdges } = drum;
  const { shellThickness } = drum.shell;
  const bearingEdgeVertexAngle =
    shellSegmentVertexAngle * drum.bearingEdges.lugsPerSegment;

  const { topBearingEdge, bottomBearingEdge } = bearingEdges;

  const bottomBearingEdgeThickness =
    bottomBearingEdge.thickness && bottomBearingEdge.thickness > shellThickness
      ? bottomBearingEdge.thickness
      : shellThickness;

  const topBearingEdgeThickness =
    topBearingEdge.thickness && topBearingEdge.thickness > shellThickness
      ? topBearingEdge.thickness
      : shellThickness;

  updateProgress(0.25, "Generating base bearing edge segments");
  
  const bottomBearingEdgeBase = generateBearingEdgeSegment({
    shellConstants,
    drum,
    interlockingTabPockets,
    bearingEdgeVertexAngle,
    bearingEdgeThickness: bottomBearingEdgeThickness,
  });

  const topBearingEdgeBase =
    JSON.stringify(topBearingEdge) === JSON.stringify(bottomBearingEdge)
      ? bottomBearingEdgeBase
      : generateBearingEdgeSegment({
          shellConstants,
          drum,
          interlockingTabPockets,
          bearingEdgeVertexAngle,
          bearingEdgeThickness: topBearingEdgeThickness,
        });

  const findEdge = (e, edgeRadius, plane = basePlane) =>
    e.ofCurveType("CIRCLE").atDistance(edgeRadius, [0, 0]).inPlane(plane);

  const bearingEdgeModels: {
    bearingEdgesTop: WrappedShapeArray;
    bearingEdgesBottom: WrappedShapeArray;
  } = { bearingEdgesTop: [], bearingEdgesBottom: [] };

  updateProgress(0.3, "Duplicating bearing edge segments and cut bearing edges");

  for (let i = 0; i < 360 / bearingEdgeVertexAngle; i++) {
    // Top Edges
    const { outerEdge: topOuterEdge, innerEdge: topInnerEdge } = topBearingEdge;
    let topBearingEdgeProcessed = topBearingEdgeBase
      .clone()
      .rotate(i * bearingEdgeVertexAngle);
    // Cut outer bearing edge
    if (topOuterEdge.profileType === "roundover") {
      topBearingEdgeProcessed = topBearingEdgeProcessed.fillet(
        topOuterEdge.profileSize - 0.01,
        (e) => findEdge(e, radius)
      );
    } else if (topOuterEdge.profileType === "chamfer") {
      topBearingEdgeProcessed = topBearingEdgeProcessed.chamfer(
        topOuterEdge.profileSize - 0.01,
        (e) => findEdge(e, radius)
      );
    } else if (
      topOuterEdge.profileType === "customChamfer" &&
      topOuterEdge.customChamferAngle
    ) {
      const cuttingTool = generateChamferCuttingTool({
        plane: makePlane("XZ"),
        startRadius: radius - bearingEdges.topBearingEdge.outerEdge.profileSize,
        chamferAngle: topOuterEdge.customChamferAngle,
        chamferWidth:
          topBearingEdge.thickness -
          bearingEdges.topBearingEdge.outerEdge.profileSize,
        chamferStartHeight: 0,
        chamferUp: true,
        edgeInner: false,
      });

      topBearingEdgeProcessed = topBearingEdgeProcessed.cut(cuttingTool);
    }
    // Cut inner bearing edge
    if (topInnerEdge.profileType === "roundover") {
      topBearingEdgeProcessed = topBearingEdgeProcessed.fillet(
        topBearingEdgeThickness - topOuterEdge.profileSize - 0.01,
        (e) => findEdge(e, radius - topBearingEdgeThickness)
      );
    } else if (topInnerEdge.profileType === "chamfer") {
      topBearingEdgeProcessed = topBearingEdgeProcessed.chamfer(
        topBearingEdgeThickness - topOuterEdge.profileSize - 0.01,
        (e) => findEdge(e, radius - topBearingEdgeThickness)
      );
    } else if (
      topInnerEdge.profileType === "customChamfer" &&
      topInnerEdge.customChamferAngle
    ) {
      const cuttingTool = generateChamferCuttingTool({
        plane: makePlane("XZ"),
        startRadius: radius - bearingEdges.topBearingEdge.outerEdge.profileSize,
        chamferAngle: topInnerEdge.customChamferAngle,
        chamferWidth:
          topBearingEdge.thickness -
          bearingEdges.topBearingEdge.outerEdge.profileSize,
        chamferStartHeight: 0,
        chamferUp: true,
        edgeInner: true,
      });

      topBearingEdgeProcessed = topBearingEdgeProcessed.cut(cuttingTool);
    }

    bearingEdgeModels.bearingEdgesTop.push({
      shape: topBearingEdgeProcessed
        .mirror("XY", [0, 0])
        .translateZ(shellSegmentHeight + bearingEdgeHeight * 2),
      name: `Bearing Edge Top ${i + 1}`,
    });

    // Bottom Edges
    const { outerEdge: bottomOuterEdge, innerEdge: bottomInnerEdge } =
      bottomBearingEdge;
    let bottomBearingEdgeProcessed = bottomBearingEdgeBase
      .clone()
      .rotate(i * bearingEdgeVertexAngle);
    // Cut outer bearing edge
    if (bottomOuterEdge.profileType === "roundover") {
      bottomBearingEdgeProcessed = bottomBearingEdgeProcessed.fillet(
        bottomOuterEdge.profileSize - 0.01,
        (e) => findEdge(e, radius)
      );
    } else if (bottomOuterEdge.profileType === "chamfer") {
      bottomBearingEdgeProcessed = bottomBearingEdgeProcessed.chamfer(
        bottomOuterEdge.profileSize - 0.01,
        (e) => findEdge(e, radius)
      );
    } else if (
      bottomOuterEdge.profileType === "customChamfer" &&
      bottomOuterEdge.customChamferAngle
    ) {
      const cuttingTool = generateChamferCuttingTool({
        plane: makePlane("XZ"),
        startRadius:
          radius - bearingEdges.bottomBearingEdge.outerEdge.profileSize,
        chamferAngle: bottomOuterEdge.customChamferAngle,
        chamferWidth:
          bottomBearingEdge.thickness -
          bearingEdges.bottomBearingEdge.outerEdge.profileSize,
        chamferStartHeight: 0,
        chamferUp: true,
        edgeInner: false,
      });

      bottomBearingEdgeProcessed = bottomBearingEdgeProcessed.cut(cuttingTool);
    }
    // Cut inner bearing edge
    if (bottomInnerEdge.profileType === "roundover") {
      bottomBearingEdgeProcessed = bottomBearingEdgeProcessed.fillet(
        bottomBearingEdgeThickness - bottomOuterEdge.profileSize - 0.01,
        (e) => findEdge(e, radius - bottomBearingEdgeThickness)
      );
    } else if (bottomInnerEdge.profileType === "chamfer") {
      bottomBearingEdgeProcessed = bottomBearingEdgeProcessed.chamfer(
        bottomBearingEdgeThickness - bottomOuterEdge.profileSize - 0.1,
        (e) => findEdge(e, radius - bottomBearingEdgeThickness)
      );
    } else if (
      bottomInnerEdge.profileType === "customChamfer" &&
      bottomInnerEdge.customChamferAngle
    ) {
      const cuttingTool = generateChamferCuttingTool({
        plane: makePlane("XZ"),
        startRadius:
          radius - bearingEdges.bottomBearingEdge.outerEdge.profileSize,
        chamferAngle: bottomInnerEdge.customChamferAngle,
        chamferWidth:
          bottomBearingEdge.thickness -
          bearingEdges.bottomBearingEdge.outerEdge.profileSize,
        chamferStartHeight: 0,
        chamferUp: true,
        edgeInner: true,
      });

      bottomBearingEdgeProcessed = bottomBearingEdgeProcessed.cut(cuttingTool);
    }
    bearingEdgeModels.bearingEdgesBottom.push({
      shape: bottomBearingEdgeProcessed,
      name: `Bearing Edge Bottom ${i + 1}`,
    });
  }

  return bearingEdgeModels;
};

const generateBearingEdgeSegment = ({
  shellConstants,
  drum,
  interlockingTabPockets,
  bearingEdgeVertexAngle,
  bearingEdgeThickness,
}: {
  shellConstants: ShellConstants;
  drum: Drum;
  interlockingTabPockets: ShapeArray;
  bearingEdgeVertexAngle: number;
  bearingEdgeThickness: number;
}): Compound => {
  const {
    basePlane,
    bearingEdgeHeight,
    radius,
    tabVertexAngle,
    tabThickness,
    tabOuterRadius,
    tabFitmentToleranceDegrees,
  } = shellConstants;
  const { fitmentTolerance } = drum;
  const { shellThickness } = drum.shell;
  let bearingEdgeSegmentBase = generateSegmentBody(
    radius,
    bearingEdgeVertexAngle,
    bearingEdgeThickness,
    bearingEdgeHeight,
    basePlane
  );

  if (bearingEdgeThickness > shellThickness) {
    const cuttingTool = generateChamferCuttingTool({
      plane: makePlane("XZ"),
      startRadius: radius - shellThickness,
      chamferAngle: 30,
      chamferWidth: bearingEdgeThickness - shellThickness,
      chamferStartHeight: bearingEdgeHeight,
      chamferUp: false,
      edgeInner: true,
    });
    bearingEdgeSegmentBase = bearingEdgeSegmentBase.cut(cuttingTool);
  }

  const bearingEdgeTabHeight = bearingEdgeHeight - 10;
  const bearingEdgeTabPlane = makePlane(
    "XY",
    bearingEdgeHeight - bearingEdgeTabHeight
  );
  const bearingEdgeSegmentTab = generateSegmentBody(
    tabOuterRadius,
    tabVertexAngle,
    tabThickness,
    bearingEdgeTabHeight,
    bearingEdgeTabPlane
  ).rotate(-(bearingEdgeVertexAngle / 2 + tabVertexAngle / 2));

  const bearingEdgeSegmentTabPocket = generateSegmentBody(
    tabOuterRadius + fitmentTolerance,
    tabVertexAngle + tabFitmentToleranceDegrees * 2,
    tabThickness + fitmentTolerance * 2,
    bearingEdgeTabHeight,
    bearingEdgeTabPlane
  ).rotate(bearingEdgeVertexAngle / 2 - tabVertexAngle / 2);

  const bearingEdgeSegment: Solid = bearingEdgeSegmentBase
    .fuse(bearingEdgeSegmentTab)
    .cut(bearingEdgeSegmentTabPocket);

  const bearingEdgeSegmentWithTabPockets = interlockingTabPockets.reduce(
    (bearingEdgeSegment, tabPocket) => {
      // @ts-ignore - TODO - fix this
      return bearingEdgeSegment.cut(tabPocket);
    },
    bearingEdgeSegment
  );

  return bearingEdgeSegmentWithTabPockets as Compound;
};
