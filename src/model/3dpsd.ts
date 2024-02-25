import { generateShellSegments } from "./shellSegments";
import { generateInterlockingTabs } from "./interlockingTabs";
import { generateBearingEdges } from "./bearingEdges";
import { Drum, ShellConstants } from "./types";
import { getShellConstants } from "./constants";

export const generate3DPSD = (
  drum: Drum,
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
  drum: Drum;
  updateProgress: (number: number) => void;
}) => {
  updateProgress(0.25);
  const { interlockingTabPockets, interlockingTabs } = generateInterlockingTabs(
    {
      shellConstants,
      drum,
    }
  );
  updateProgress(0.5);
  const { bearingEdgesTop, bearingEdgesBottom } = generateBearingEdges({
    shellConstants,
    drum,
    interlockingTabPockets,
  });
  updateProgress(0.75);
  const shellSegments = generateShellSegments({
    shellConstants,
    drum,
    interlockingTabPockets,
  });
  updateProgress(1);

  return [
    ...shellSegments,
    ...interlockingTabs,
    ...bearingEdgesTop,
    ...bearingEdgesBottom,
  ];
};
