import React from "react";
import styled from "styled-components";
import { observer } from "mobx-react";
import { EditorContextProvider } from "../visualiser/editor/useEditorStore";
import { Pane } from "./panes";
import { ParameterSelector } from "./ParameterSelector";
import VisualizerPane, { VisualizerButtons } from "./VisualizerPane";

export const WorkbenchStructure = observer(function WorkbenchStructure() {
  return (
    <>
      <ParameterSelector />
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
