import { Plane, Point2D, draw } from "replicad";
import { SolidShape } from "./types";

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
) => {
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

  return segmentBody as SolidShape;
};

export const generateFilletedSegmentBody = (
  outerRadius: number,
  vertexAngle: number,
  thickness: number,
  depth: number,
  plane: Plane
) => {
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

  return segmentBody as SolidShape;
};

function findSideAAndHypotenuse(sideB: number, angleAlpha: number) {
  const angleRadians = (angleAlpha * Math.PI) / 180;
  const sideA = sideB * Math.tan(angleRadians);
  const hypotenuse = sideB / Math.cos(angleRadians);
  return { sideA, hypotenuse };
}

export const generateChamferCuttingTool = ({
  plane,
  startRadius,
  chamferAngle,
  chamferWidth,
  chamferStartHeight,
  chamferUp,
  edgeInner = true,
}: {
  plane: Plane;
  startRadius: number;
  chamferAngle: number;
  chamferWidth: number;
  chamferStartHeight: number;
  chamferUp: boolean;
  edgeInner: boolean;
}) => {
  const { hypotenuse } = findSideAAndHypotenuse(chamferWidth, chamferAngle);
  const cuttingTool = draw()
    .movePointerTo([startRadius, 0])
    .polarLine(hypotenuse, edgeInner ? 180 - chamferAngle : chamferAngle)
    .lineTo([
      edgeInner ? startRadius - chamferWidth : startRadius + chamferWidth,
      0,
    ])
    .close()
    .sketchOnPlane(plane)
    .revolve()
    .translateZ(chamferUp ? chamferStartHeight : -chamferStartHeight);

  if (!chamferUp) {
    return cuttingTool.mirror("XY", [0, 0]) as SolidShape;
  }
  return cuttingTool as SolidShape;
};
