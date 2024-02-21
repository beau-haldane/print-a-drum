import { Plane, Point2D, Solid, draw } from "replicad";

export const inchesToMillimeters = (inch: number) => inch * 25.4;

export const calculateXY = (
  hypotenuseLength: number,
  angleX: number
): Point2D => {
  const angleRadians = (angleX * Math.PI) / 180;
  const x = hypotenuseLength * Math.sin(angleRadians);
  const y = hypotenuseLength * Math.cos(angleRadians);

  return [x, y];
};

export const calculateVertexAngle = (
  radius: number,
  widthMillimeters: number
) => {
  const cosC =
    (2 * radius * radius - widthMillimeters * widthMillimeters) /
    (2 * radius * radius);
  const angleRadians = Math.acos(cosC);
  const angleDegrees = angleRadians * (180 / Math.PI);

  return angleDegrees;
};

export const generateSegmentBody = (
  outerRadius: number,
  vertexAngle: number,
  thickness: number,
  depth: number,
  plane: Plane
): Solid => {
  const segmentBody = draw()
    .movePointerTo(calculateXY(outerRadius, vertexAngle / 2))
    .threePointsArcTo(calculateXY(outerRadius, -vertexAngle / 2), [
      0,
      outerRadius,
    ])
    .lineTo(calculateXY(outerRadius - thickness, -vertexAngle / 2))
    .threePointsArcTo(calculateXY(outerRadius - thickness, vertexAngle / 2), [
      0,
      outerRadius - thickness,
    ])
    .close()
    .sketchOnPlane(plane)
    .extrude(depth);

  return segmentBody as Solid;
};

export const generateFilletedSegmentBody = (
  outerRadius: number,
  vertexAngle: number,
  thickness: number,
  depth: number,
  plane: Plane
): Solid => {
  const segmentBody = draw()
    .movePointerTo(calculateXY(outerRadius, vertexAngle / 2))
    .threePointsArcTo(calculateXY(outerRadius, -vertexAngle / 2), [
      0,
      outerRadius,
    ])
    .threePointsArcTo(
      calculateXY(outerRadius - thickness, -vertexAngle / 2),
      calculateXY(
        outerRadius - thickness / 2,
        -(
          vertexAngle / 2 +
          calculateVertexAngle(outerRadius - thickness / 2, thickness / 2)
        )
      )
    )
    .threePointsArcTo(calculateXY(outerRadius - thickness, vertexAngle / 2), [
      0,
      outerRadius - thickness,
    ])
    .threePointsArcTo(
      calculateXY(outerRadius, vertexAngle / 2),
      calculateXY(
        outerRadius - thickness / 2,
        vertexAngle / 2 +
          calculateVertexAngle(outerRadius - thickness / 2, thickness / 2)
      )
    )
    .close()
    .sketchOnPlane(plane)
    .extrude(depth);

  return segmentBody as Solid;
};
