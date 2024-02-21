import { Lugs, ShapeArray, WrappedShapeArray } from "./types";
import { generateSegmentBody } from "./utils";
import { Compound, Shape3D, Plane, Vertex, drawCircle } from "replicad";

export const generateShellSegment = (
  depth: number,
  radius: number,
  shellSegmentVertexAngle: number,
  thickness: number,
  shellSegmentHeight: number,
  shellSegmentPlane: Plane,
  tabOuterRadius: number,
  tabVertexAngle: number,
  tabThickness: number,
  fitmentTolerance: number,
  tabFitmentToleranceDegrees: number,
  shellCenterPoint: number,
  interlockingTabPockets,
  lugs: Lugs
) => {
  const {
    lugType,
    lugRows,
    lugHoleDiameter,
    lugHoleSpacing,
    lugHoleDistanceFromEdge,
    lugHolePocketDiameter,
    lugHolePocketDepth,
  } = lugs;

  const generateLugHoles = (lugHolesDistance = 0) => {
    let lugHole = drawCircle(lugHoleDiameter / 2)
      .sketchOnPlane("XZ", -radius)
      .extrude(thickness + 10) as Shape3D;

    if (lugHolePocketDiameter && lugHolePocketDepth) {
      const lugHolePocket = drawCircle(lugHolePocketDiameter / 2)
        .sketchOnPlane("XZ", -radius)
        .extrude(lugHolePocketDepth) as Shape3D;
        lugHole = lugHole.fuse(lugHolePocket);
    }

    const lugHoles: Shape3D[] = [];
    for (let i = 0; i < (lugHolesDistance ? 2 : 4); i++) {
      lugHoles.push(
        lugHole
          .clone()
          .translateZ(shellCenterPoint - lugHolesDistance / 2)
          .rotate(shellSegmentVertexAngle / 2)
      );
      lugHoles.push(
        lugHole
          .clone()
          .translateZ(shellCenterPoint - lugHolesDistance / 2)
          .rotate(-shellSegmentVertexAngle / 2)
      );
      if (lugHolesDistance) {
        lugHoles.push(
          lugHole
            .clone()
            .translateZ(shellCenterPoint + lugHolesDistance / 2)
            .rotate(shellSegmentVertexAngle / 2)
        );
        lugHoles.push(
          lugHole
            .clone()
            .translateZ(shellCenterPoint + lugHolesDistance / 2)
            .rotate(-shellSegmentVertexAngle / 2)
        );
      }
    }

    return lugHoles;
  };
  const shellSegmentBase = generateSegmentBody(
    radius,
    shellSegmentVertexAngle,
    thickness,
    shellSegmentHeight,
    shellSegmentPlane
  ).rotate(tabVertexAngle / 2);
  const shellSegmentTab = generateSegmentBody(
    tabOuterRadius,
    tabVertexAngle,
    tabThickness,
    shellSegmentHeight,
    shellSegmentPlane
  ).rotate(-shellSegmentVertexAngle / 2);
  const shellSegmentTabPocket = generateSegmentBody(
    tabOuterRadius + fitmentTolerance,
    tabVertexAngle + tabFitmentToleranceDegrees * 2,
    tabThickness + fitmentTolerance * 2,
    shellSegmentHeight,
    shellSegmentPlane
  ).rotate(shellSegmentVertexAngle / 2);

  let lugHoles: ShapeArray = [];
  if (lugRows === 1) {
    lugType === "singlePoint"
      ? (lugHoles = generateLugHoles())
      : (lugHoles = generateLugHoles(lugHoleSpacing));
  } else if (lugRows === 2 && lugHoleDistanceFromEdge) {
    lugType === "singlePoint"
      ? (lugHoles = generateLugHoles(depth - lugHoleDistanceFromEdge * 2))
      : (lugHoles = [
          ...generateLugHoles(depth - lugHoleDistanceFromEdge * 2),
          ...generateLugHoles(
            depth - (lugHoleDistanceFromEdge + lugHoleSpacing) * 2
          ),
        ]);
  }
  // Add logic for doublePoint lugs here
  const cutOperations = [...interlockingTabPockets, ...lugHoles];

  const shellSegment: Compound = shellSegmentBase
    .fuse(shellSegmentTab)
    .cut(shellSegmentTabPocket);

  const shellSegmentFinal = cutOperations.reduce((shellSegment, operation) => {
    return shellSegment.cut(operation);
  }, shellSegment);

  return shellSegmentFinal;
};

export const generateShellSegments = (
  depth,
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
  shellCenterPoint,
  interlockingTabPockets,
  lugs: Lugs
) => {
  const { lugNumber } = lugs;
  const shellSegment = generateShellSegment(
    depth,
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
    shellCenterPoint,
    interlockingTabPockets,
    lugs
  );
  const shellSegments: WrappedShapeArray = [];
  for (let i = 0; i < lugNumber; i++) {
    shellSegments.push({
      shape: shellSegment.clone().rotate(i * shellSegmentVertexAngle),
      name: `Shell Segment ${i + 1}`,
    });
  }

  return shellSegments;
};
