import {
  Drum,
  ShapeArray,
  ShellConstants,
  SolidShape,
  WrappedShapeArray,
} from "./types";
import { generateSegmentBody } from "./utils";
import { Shape3D, drawCircle } from "replicad";

export const generateShellSegment = ({
  shellConstants,
  drum,
  interlockingTabPockets,
  updateProgress,
}: {
  shellConstants: ShellConstants;
  drum: Drum;
  interlockingTabPockets: ShapeArray;
  updateProgress: (number: number, message?: string) => void;
}) => {
  const {
    depth,
    radius,
    shellSegmentHeight,
    shellCenterPoint,
    tabVertexAngle,
    tabThickness,
    tabOuterRadius,
    tabFitmentToleranceDegrees,
    shellSegmentPlane,
  } = shellConstants;
  let { shellSegmentVertexAngle } = shellConstants;
  const { fitmentTolerance, lugs } = drum;
  const { shellThickness, lugsPerSegment } = drum.shell;
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
      .extrude(shellThickness + 10) as SolidShape;

    if (lugHolePocketDiameter && lugHolePocketDepth) {
      const lugHolePocket = drawCircle(lugHolePocketDiameter / 2)
        .sketchOnPlane("XZ", -radius)
        .extrude(lugHolePocketDepth) as SolidShape;
      lugHole = lugHole.fuse(lugHolePocket);
    }

    const lugHoles: SolidShape[] = [];
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
    shellThickness,
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

  const shellSegment: SolidShape = shellSegmentBase
    .fuse(shellSegmentTab)
    .cut(shellSegmentTabPocket);

  updateProgress(0.5, "Generating lug holes");
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

  updateProgress(0.6, "Cutting lug holes and tab pockets");
  const cutOperations: ShapeArray = [...interlockingTabPockets, ...lugHoles];
  const { shellSegment: shellSegmentFinal } = cutOperations.reduce(
    ({shellSegment, progress}, operation, i) => {
      const segment = shellSegment.cut(operation);
      progress = progress + ((i + 1) / cutOperations.length * 0.4)
      updateProgress(progress);
      
      return { shellSegment: segment, progress: 0.6 };
    },
    { shellSegment: shellSegment, progress: 0.6 }
  );

  return shellSegmentFinal;
};

export const generateShellSegments = ({
  shellConstants,
  drum,
  interlockingTabPockets,
  updateProgress,
}: {
  shellConstants: ShellConstants;
  drum: Drum;
  interlockingTabPockets: ShapeArray;
  updateProgress: (number: number, message?: string) => void;
}) => {
  const { lugsPerSegment } = drum.shell;
  shellConstants.shellSegmentVertexAngle =
    shellConstants.shellSegmentVertexAngle * lugsPerSegment;
  const { shellSegmentVertexAngle } = shellConstants;

  updateProgress(0.4, "Generating base shell segment");
  const shellSegment = generateShellSegment({
    shellConstants,
    drum,
    interlockingTabPockets,
    updateProgress,
  });
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
