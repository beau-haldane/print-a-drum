import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { observer } from "mobx-react";
import useEditorStore, {
  EditorContextProvider,
} from "../visualiser/editor/useEditorStore";
import { Pane } from "./panes";
import VisualizerPane, { VisualizerButtons } from "./VisualizerPane";

export const WorkbenchStructure = observer(function WorkbenchStructure() {
  const [diameterInches, setDiameterInches] = useState(14);
  const [depthInches, setDepthInches] = useState(6.5);
  const [lugs, setLugs] = useState(8);
  const [lugHoleDiameter, setLugHoleDiameter] = useState(5);
  const [lugHoleSpacing, setLugHoleSpacing] = useState(50);
  const [shellThickness, setShellThickness] = useState(9);
  const [fitmentTolerance, setFitmentTolerance] = useState(0.2);

  const ParameterSelector = (button) => {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "10px", padding: "10px" }}>
        <label>
          Diameter (inches): <br />
          <input
            value={diameterInches}
            onChange={(e) => setDiameterInches(Number(e.target.value))}
          />
        </label>
        <label>
          Depth (inches): <br />
          <input
            value={depthInches}
            onChange={(e) => setDepthInches(Number(e.target.value))}
          />
        </label>
        <label>
          Lugs: <br />
          <input
            value={lugs}
            onChange={(e) => setLugs(Number(e.target.value))}
          />
        </label>
        <label>
          Lug Hole Diameter: <br />
          <input
            value={lugHoleDiameter}
            onChange={(e) => setLugHoleDiameter(Number(e.target.value))}
          />
        </label>
        <label>
          Lug Hole Spacing: <br />
          <input
            value={lugHoleSpacing}
            onChange={(e) => setLugHoleSpacing(Number(e.target.value))}
          />
        </label>
        <label>
          Shell Thickness: <br />
          <input
            value={shellThickness}
            onChange={(e) => setShellThickness(Number(e.target.value))}
          />
        </label>
        <label>
          Fitment Tolerance: <br />
          <input
            value={fitmentTolerance}
            onChange={(e) => setFitmentTolerance(Number(e.target.value))}
          />
        </label>
        <button onClick={() => store.process({
          diameterInches,
          depthInches,
          lugs,
          lugHoleDiameter,
          lugHoleSpacing,
          shellThickness,
          fitmentTolerance,
        })}>Generate</button>
      </div>
    );
  };

  const store = useEditorStore();
  useEffect(() => {
    store.process({
      diameterInches,
      depthInches,
      lugs,
      lugHoleDiameter,
      lugHoleSpacing,
      shellThickness,
      fitmentTolerance,
    });
  }, [store]);

  return (
    <>
      <div style={{
        position: "absolute",
        marginTop: "100px",
        zIndex: 100,
        backgroundColor: "#FFF"
      }}>
        <ParameterSelector />

      </div>
      <Pane buttons={<VisualizerButtons />}>
        <VisualizerPane />
      </Pane>

    </>
  );
});

const WorkbenchWrapper = styled.div`
  height: 100vh;
  width: 100vw;
  max-height: 100vh;
  max-width: 100vw;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow-y: hidden;

  & .custom-gutter-theme {
    background-color: var(--color-primary-light);
  }
`;

export default function Workbench() {
  return (
    <WorkbenchWrapper>
      <EditorContextProvider>
        <WorkbenchStructure />
      </EditorContextProvider>
    </WorkbenchWrapper>
  );
}
