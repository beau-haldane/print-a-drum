import React from "react";
import { NumberInput } from "../CustomNumberInput";
import { ParameterAccordion } from "./ParameterAccordion";
import { SimplifiedInput } from "./Input";

export const ShellParameterOptions = ({
  printableDrum,
  setPrintableDrum,
  updateState,
  shell,
  setShell,
}) => {
  return (
    <ParameterAccordion title="Shell Settings">
      <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
        <SimplifiedInput
          label="Fitment Tolerance"
          defaultValue={printableDrum.fitmentTolerance}
          min={0}
          max={1}
          step={0.05}
          propertyName="fitmentTolerance"
          updateState={updateState}
          state={printableDrum}
          setState={setPrintableDrum}
        />
        <SimplifiedInput
          label="Diameter (Inches)"
          defaultValue={shell.diameterInches}
          min={8}
          max={16}
          step={1}
          propertyName="diameterInches"
          updateState={updateState}
          state={shell}
          setState={setShell}
        />
        <SimplifiedInput
          label="Depth (inches)"
          defaultValue={shell.depthInches}
          min={4}
          max={16}
          step={0.25}
          propertyName="depthInches"
          updateState={updateState}
          state={shell}
          setState={setShell}
        />
        <SimplifiedInput
          label="Shell Thickness"
          defaultValue={shell.shellThickness}
          min={6}
          max={(shell.diameterInches * 25.4) / 3}
          step={1}
          propertyName="shellThickness"
          updateState={updateState}
          state={shell}
          setState={setShell}
        />
        <SimplifiedInput
          label="Lugs Per Segment"
          defaultValue={shell.lugsPerSegment}
          min={1}
          max={2}
          step={1}
          propertyName="lugsPerSegment"
          updateState={updateState}
          state={shell}
          setState={setShell}
        />
      </div>
    </ParameterAccordion>
  );
};
