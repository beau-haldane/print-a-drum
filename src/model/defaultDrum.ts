import { DrumSchema } from "../components/ModelSettingsPanel/inputSchema";

export const defaultDrum: DrumSchema = {
  drumType: "snare",
  fitmentTolerance: 0.2,
  shell: {
    diameterInches: 14,
    depthInches: 6.5,
    shellThickness: 10,
    lugsPerSegment: 2,
    ventHoleDiameter: 10,
  },
  lugs: {
    lugType: "singlePoint",
    lugRows: 1,
    lugNumber: 8,
    lugHoleSpacing: 20,
    lugHoleDiameter: 5,
    lugHolePocketDiameter: 8,
    lugHolePocketDepth: 2,
    lugHoleDistanceFromEdge: 40,
  },
  bearingEdges: {
    lugsPerSegment: 2,
    topBearingEdge: {
      thickness: 10,
      outerEdge: {
        profileType: "roundover",
        profileSize: 10 / 2,
        customChamferAngle: 0,
      },
      innerEdge: {
        profileType: "chamfer",
        customChamferAngle: 0,
      },
    },
    bottomBearingEdge: {
      thickness: 10,
      outerEdge: {
        profileType: "roundover",
        profileSize: 10 / 2,
        customChamferAngle: 0,
      },
      innerEdge: {
        profileType: "chamfer",
        customChamferAngle: 0,
      },
    },
  },
  snareBeds: {
    snareBedAngle: 10,
    snareBedRadius: 400,
    snareBedDepth: 2.5,
  },
}