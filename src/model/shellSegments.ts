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
  lugs: Lugs,
  lugsPerSegment: number
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

  const generateLugHoles = (lugsPerSegment, lugHolesDistance = 0) => {
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
          .translateZ(shellCenterPoint + lugHolesDistance / 2)
          .rotate(shellSegmentVertexAngle / 2)
      );

      if (lugHolesDistance) {
        lugHoles.push(
          lugHole
            .clone()
            .translateZ(shellCenterPoint + lugHolesDistance / 2)
            .rotate(-shellSegmentVertexAngle / 2)
        );
        lugHoles.push(
          lugHole
            .clone()
            .translateZ(shellCenterPoint - lugHolesDistance / 2)
            .rotate(-shellSegmentVertexAngle / 2)
        );
      }
      if (lugsPerSegment === 2) {
        lugHoles.push(
          lugHole.clone().translateZ(shellCenterPoint + lugHolesDistance / 2)
        );
        lugHoles.push(
          lugHole.clone().translateZ(shellCenterPoint - lugHolesDistance / 2)
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
    if (lugType === "singlePoint") {
      lugHoles = generateLugHoles(lugsPerSegment);
    } else if (lugType === "doublePoint") {
      lugHoles = generateLugHoles(lugsPerSegment, lugHoleSpacing);
    }
  } else if (lugRows === 2 && lugHoleDistanceFromEdge) {
    if (lugType === "singlePoint") {
      lugHoles = generateLugHoles(
        lugsPerSegment,
        depth - lugHoleDistanceFromEdge * 2
      );
    } else if (lugType === "doublePoint") {
      lugHoles = [
        ...generateLugHoles(
          lugsPerSegment,
          depth - lugHoleDistanceFromEdge * 2
        ),
        ...generateLugHoles(
          lugsPerSegment,
          depth - (lugHoleDistanceFromEdge + lugHoleSpacing) * 2
        ),
      ];
    }
  }
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
  interlockingTabPockets: ShapeArray,
  lugs: Lugs,
  lugsPerSegment: number
) => {
  shellSegmentVertexAngle = shellSegmentVertexAngle * lugsPerSegment;
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
    lugs,
    lugsPerSegment
  );
  const shellSegments: WrappedShapeArray = [];
  for (let i = 0; i < 360 / shellSegmentVertexAngle; i++) {
    if (lugsPerSegment === 1) {
      shellSegments.push({
        shape: shellSegment.clone().rotate(i * shellSegmentVertexAngle),
        name: `Shell Segment ${i + 1}`,
      });
    } else if (lugsPerSegment === 2) {
      shellSegments.push({
        shape: shellSegment
          .clone()
          .rotate(i * shellSegmentVertexAngle - shellSegmentVertexAngle / 4),
        name: `Shell Segment ${i + 1}`,
      });
    }
  }

  return shellSegments;
};
