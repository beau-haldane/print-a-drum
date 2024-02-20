import JSZip from "jszip";

async function importFileContents(filePath) {
  try {
    // Fetch the file contents using an HTTP request
    const response = await fetch(filePath);

    if (!response.ok) {
      throw new Error(`Failed to fetch file: ${response.status} ${response.statusText}`);
    }

    // Read the response body as text
    const fileContents = await response.text();
    return fileContents;
  } catch (error) {
    console.error(`Error importing file: ${error}`);
    return null;
  }
}

const DEFAULT_SCRIPT = `
const { draw, drawRoundedRectangle, drawCircle, makePlane } = replicad;

const calculateXY = (hypotenuseLength, angleX) => {
  const angleRadians = angleX * Math.PI / 180;
  const adjacentSideLength = hypotenuseLength * Math.cos(angleRadians);
  const oppositeSideLength = hypotenuseLength * Math.sin(angleRadians);
  
  return {oppositeSideLength, adjacentSideLength};
}

const calculateVertexAngle = (a, c) => {
    const cosC = (2 * a * a - c * c) / (2 * a * a);
    const angleRadians = Math.acos(cosC);
    const angleDegrees = angleRadians * (180 / Math.PI);

    return angleDegrees;
}

// User Parameters
const lugs = 8
const radius = 150
const thickness = 12
const depth = 150
const lugHoleDiameter = 5
const lugHoleSpacing = 60
const fitmentTolerance = 0.2

// Constants - Segments
const segmentAngle = (360 / lugs)
const {oppositeSideLength: outerX, adjacentSideLength: outerY} = calculateXY(radius, segmentAngle / 2)
const {oppositeSideLength: innerX, adjacentSideLength: innerY} = calculateXY((radius - thickness), segmentAngle / 2)
// Constants - Interlocking Tabs
const tabWidthDegrees = 4
const tabThickness = Math.floor(thickness / 3)
const tabOuterRadius = radius - ((thickness - tabThickness) / 2)
const tabInnerRadius = (radius - thickness) + ((thickness - tabThickness) / 2)
const tabFitmentToleranceDegrees = calculateVertexAngle(tabInnerRadius, fitmentTolerance)
const tabHeight = 30
const {oppositeSideLength: tabOuterX, adjacentSideLength: tabOuterY} = calculateXY(tabOuterRadius, tabWidthDegrees / 2)
const {oppositeSideLength: tabInnerX, adjacentSideLength: tabInnerY} = calculateXY(tabInnerRadius, tabWidthDegrees / 2)
const {oppositeSideLength: tabHoleOuterX, adjacentSideLength: tabHoleOuterY} = calculateXY(tabOuterRadius + fitmentTolerance, (tabWidthDegrees / 2) + tabFitmentToleranceDegrees)
const {oppositeSideLength: tabHoleInnerX, adjacentSideLength: tabHoleInnerY} = calculateXY(tabInnerRadius - fitmentTolerance, (tabWidthDegrees / 2) + tabFitmentToleranceDegrees)

// Shell Segment Bodies
const shellSegmentBase = draw()
  .movePointerTo([outerX, outerY])
  .threePointsArcTo([-outerX, outerY], [0, radius])
  .lineTo([-innerX, innerY])
  .threePointsArcTo([innerX, innerY], [0, radius - thickness])
  .close()
  .sketchOnPlane()
  .extrude(depth)

const interlockingTab = draw()
  .movePointerTo([tabOuterX, tabOuterY])
  .threePointsArcTo([-tabOuterX, tabOuterY], [0, tabOuterRadius])
  .lineTo([-tabInnerX, tabInnerY])
  .threePointsArcTo([tabInnerX, tabInnerY], [0, tabInnerRadius])
  .close()
  .rotate(-((segmentAngle / 2) + (tabWidthDegrees / 2)))
  .sketchOnPlane("XY")
  .extrude(depth)

const interlockingTabHole = draw()
  .movePointerTo([tabHoleOuterX, tabHoleOuterY])
  .threePointsArcTo([-tabHoleOuterX, tabHoleOuterY], [0, tabOuterRadius + fitmentTolerance])
  .lineTo([-tabHoleInnerX, tabHoleInnerY])
  .threePointsArcTo([tabHoleInnerX, tabHoleInnerY], [0, tabInnerRadius - fitmentTolerance])
  .close()
  .rotate(((segmentAngle / 2) - (tabWidthDegrees / 2)))
  .sketchOnPlane("XY")
  .extrude(depth)

const lugHole = drawCircle(lugHoleDiameter /2)
  .sketchOnPlane("XZ", -(radius + 5))
  .extrude((thickness + 10))

const main = () => {
  // Assemble Shell Segment
  const shellSegment = shellSegmentBase
    .fuse(interlockingTab)
    .cut(interlockingTabHole)
    .cut(lugHole.clone().rotate((segmentAngle / 2) - (tabWidthDegrees / 2)).translateZ((depth / 2) - (lugHoleSpacing / 2)))
    .cut(lugHole.clone().rotate((segmentAngle / 2) - (tabWidthDegrees / 2)).translateZ((depth / 2) + (lugHoleSpacing / 2)))
    .cut(lugHole.clone().rotate((-segmentAngle / 2) - (tabWidthDegrees / 2)).translateZ((depth / 2) - (lugHoleSpacing / 2)))
    .cut(lugHole.clone().rotate((-segmentAngle / 2) - (tabWidthDegrees / 2)).translateZ((depth / 2) + (lugHoleSpacing / 2)))


  const copies = [];
  for (let i = 0; i < lugs; i++) {
    copies.push(shellSegment.clone().rotate(i * segmentAngle));
  }
  return copies;
  // return [shellSegment];
}
`;

export const exportCode = async (rawCode) => {
  const zip = new JSZip();
  zip.file("code.js", rawCode);
  const content = await zip.generateAsync({
    type: "base64",
    compression: "DEFLATE",
    compressionOptions: {
      level: 6,
    },
  });
  const code = encodeURIComponent(content);

  var url = new URL(window.location);
  url.searchParams.set("code", code);

  return url.toString();
};
export default async function codeInit() {
  const filePath = 'src/models/3dpsd.js';
  const defaultScript = importFileContents(filePath)
    .then(fileContents => {
      if (fileContents) {
        return fileContents
      }
    })
    .catch(error => {
      console.error(`Error importing file: ${error}`);
    });
  return defaultScript;
}
