import { generateShellSegments } from "./shellSegments";
import { generateInterlockingTabs } from "./interlockingTabs";
import { generateBearingEdges } from "./bearingEdges";
import { ShellConstants } from "./types";
import { getShellConstants } from "./constants";
import { DrumSchema } from "../components/ModelSettingsPanel/inputSchema";

export const generate3DPSD = (
  drum: DrumSchema,
  updateProgress: (number: number) => string
) => {
  const { depthInches, diameterInches, shellThickness } = drum.shell;
  const { lugNumber } = drum.lugs;
  const shellConstants = getShellConstants(
    depthInches,
    diameterInches,
    lugNumber,
    shellThickness,
    drum.fitmentTolerance
  );
  return generateShellAssembly({ shellConstants, drum, updateProgress });
};

const generateShellAssembly = ({
  shellConstants,
  drum,
  updateProgress,
}: {
  shellConstants: ShellConstants;
  drum: DrumSchema;
  updateProgress: (number: number, message?: string) => void;
}) => {
  updateProgress(0.1, 'Generating interlocking tabs');
  const { interlockingTabPockets, interlockingTabs } = generateInterlockingTabs(
    {
      shellConstants,
      drum,
      updateProgress,
    }
  );
  updateProgress(0.2, 'Generating bearing edges');
  const { bearingEdgesTop, bearingEdgesBottom } = generateBearingEdges({
    shellConstants,
    drum,
    interlockingTabPockets,
    updateProgress,
  });
  updateProgress(0.5, 'Generating shell segments');
  const shellSegments = generateShellSegments({
    shellConstants,
    drum,
    interlockingTabPockets,
    updateProgress,
  });
  updateProgress(1, 'Rendering model');

  return [
    ...shellSegments,
    ...interlockingTabs,
    ...bearingEdgesTop,
    ...bearingEdgesBottom,
  ];
};
