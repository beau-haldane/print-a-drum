import { WrappedShapeArray } from "./types";
import { generateSegmentBody } from "./utils";
import { Compound, Shape, Solid, Vertex, drawCircle } from "replicad";

export const generateShellSegment = (
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
  interlockingTabPockets
) => {
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

  const generateLugHoles = (lugHolesDistance = 0) => {
    const lugHole: Vertex = drawCircle(lugHoleDiameter / 2)
      .sketchOnPlane("XZ", -(radius + 5))
      .extrude(thickness + 10);

    const lugHoles: Vertex[] = [];
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
  const lugHoles = generateLugHoles(lugHoleSpacing)
  const cutOperations = [...interlockingTabPockets, ...lugHoles]

  const shellSegment: Compound = shellSegmentBase
    .fuse(shellSegmentTab)
    .cut(shellSegmentTabPocket);

  const shellSegmentFinal = cutOperations.reduce(
    (shellSegment, operation) => {
      return shellSegment.cut(operation);
    },
    shellSegment
  );

  return shellSegmentFinal;
};

export const generateShellSegments = (
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
) => {
  const shellSegment = generateShellSegment(radius,
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
    interlockingTabPockets);
  const shellSegments: WrappedShapeArray = [];
  for (let i = 0; i < lugs; i++) {
    shellSegments.push({
      shape: shellSegment.clone().rotate(i * shellSegmentVertexAngle),
      name: `Shell Segment ${i + 1}`,
    });
  }

  return shellSegments;
};
