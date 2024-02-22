import { BearingEdges, ShapeArray, WrappedShapeArray } from "./types";
import { generateSegmentBody } from "./utils";
import { Compound, Plane, Solid, makePlane } from "replicad";

export const generateBearingEdges = (
  shellSegmentVertexAngle: number,
  interlockingTabPockets: ShapeArray,
  radius: number,
  thickness: number,
  bearingEdgeHeight: number,
  tabOuterRadius: number,
  tabVertexAngle: number,
  tabThickness: number,
  fitmentTolerance: number,
  tabFitmentToleranceDegrees: number,
  basePlane: Plane,
  shellSegmentHeight: number,
  segmentCoverage = 2,
  bearingEdgeParameters: BearingEdges
): {
  bearingEdgesTop: WrappedShapeArray;
  bearingEdgesBottom: WrappedShapeArray;
} => {
  const bearingEdgeVertexAngle = shellSegmentVertexAngle * segmentCoverage;
  const generateBearingEdgeSegment = (
    interlockingTabPockets: ShapeArray,
    plane: Plane,
    thickness
  ): Compound => {
    const bearingEdgeSegmentBase = generateSegmentBody(
      radius,
      bearingEdgeVertexAngle,
      thickness,
      bearingEdgeHeight,
      plane
    );

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

  const { topBearingEdge, bottomBearingEdge } = bearingEdgeParameters;

  const bottomBearingEdgeThickness =
    bottomBearingEdge.thickness && bottomBearingEdge.thickness > thickness
      ? bottomBearingEdge.thickness
      : thickness;

  const topBearingEdgeThickness =
    topBearingEdge.thickness && topBearingEdge.thickness > thickness
      ? topBearingEdge.thickness
      : thickness;

  const bottomBearingEdgeBase = generateBearingEdgeSegment(
    interlockingTabPockets,
    basePlane,
    bottomBearingEdgeThickness
  );

  let topBearingEdgeBase =
    JSON.stringify(topBearingEdge) === JSON.stringify(bottomBearingEdge)
      ? bottomBearingEdgeBase
      : generateBearingEdgeSegment(
          interlockingTabPockets,
          basePlane,
          topBearingEdgeThickness
        );

  const findEdge = (e, edgeRadius, plane = basePlane) =>
    e.ofCurveType("CIRCLE").atDistance(edgeRadius, [0, 0]).inPlane(plane);

  const bearingEdges: {
    bearingEdgesTop: WrappedShapeArray;
    bearingEdgesBottom: WrappedShapeArray;
  } = { bearingEdgesTop: [], bearingEdgesBottom: [] };
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
    }
    
    bearingEdges.bearingEdgesTop.push({
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
        bottomOuterEdge.profileSize,
        (e) => findEdge(e, radius)
      );
    } else if (bottomOuterEdge.profileType === "chamfer") {
      bottomBearingEdgeProcessed = bottomBearingEdgeProcessed.chamfer(
        bottomOuterEdge.profileSize,
        (e) => findEdge(e, radius)
      );
    }
    // Cut inner bearing edge
    if (bottomInnerEdge.profileType === "roundover") {
      bottomBearingEdgeProcessed = bottomBearingEdgeProcessed.fillet(
        bottomOuterEdge.profileSize + 0.1 - bottomBearingEdgeThickness,
        (e) => findEdge(e, radius - bottomBearingEdgeThickness)
      );
    } else if (bottomInnerEdge.profileType === "chamfer") {
      bottomBearingEdgeProcessed = bottomBearingEdgeProcessed.chamfer(
        bottomBearingEdgeThickness - bottomOuterEdge.profileSize - 0.1,
        (e) => findEdge(e, radius - bottomBearingEdgeThickness)
      );
    }
    bearingEdges.bearingEdgesBottom.push({
      shape: bottomBearingEdgeProcessed,
      name: `Bearing Edge Bottom ${i + 1}`,
    });
  }

  return bearingEdges;
};
