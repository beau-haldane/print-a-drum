import { ShapeArray, WrappedShapeArray } from "./types";
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
  segmentCoverage = 2
): {
  bearingEdgesTop: WrappedShapeArray;
  bearingEdgesBottom: WrappedShapeArray;
} => {
  const bearingEdgeVertexAngle = shellSegmentVertexAngle * segmentCoverage;
  const generateBearingEdgeSegment = (
    interlockingTabPockets: ShapeArray,
    plane: Plane
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

  const bearingEdgeBase = generateBearingEdgeSegment(
    interlockingTabPockets,
    basePlane
  );

  const outerEdge = (e) =>
    e.ofCurveType("CIRCLE").atDistance(radius, [0, 0]).inPlane(basePlane);
  const innerEdge = (e) =>
    e
      .ofCurveType("CIRCLE")
      .atDistance(radius - thickness, [0, 0])
      .inPlane(basePlane);

  const bearingEdges: {
    bearingEdgesTop: WrappedShapeArray;
    bearingEdgesBottom: WrappedShapeArray;
  } = { bearingEdgesTop: [], bearingEdgesBottom: [] };
  for (let i = 0; i < 360 / bearingEdgeVertexAngle; i++) {
    bearingEdges.bearingEdgesBottom.push({
      shape: bearingEdgeBase
        .clone()
        .rotate(i * bearingEdgeVertexAngle)
        .fillet(thickness * 0.75 - 0.01, outerEdge)
        .chamfer(thickness * 0.25, innerEdge),
      name: `Bearing Edge Bottom ${i + 1}`,
    });
    bearingEdges.bearingEdgesTop.push({
      shape: bearingEdgeBase
        .clone()
        .fillet(thickness * 0.75 - 0.01, outerEdge)
        .chamfer(thickness * 0.25, innerEdge)
        .mirror("XY", [0,0])
        .rotate(i * bearingEdgeVertexAngle)
        .translateZ(shellSegmentHeight + bearingEdgeHeight * 2),
      name: `Bearing Edge Top ${i + 1}`,
    });
  }

  return bearingEdges;
};
