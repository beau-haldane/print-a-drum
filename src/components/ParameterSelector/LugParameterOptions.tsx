import React from "react";
import { NumberInput } from "../CustomNumberInput";
import SelectInput from "../SelectInput";
import { ParameterAccordion } from "./ParameterAccordion";

export const LugParameterOptions = ({
  updateState,
  shell,
  lugs,
  setLugs,
}) => {
  return (
    <ParameterAccordion title='Lug Settings'>
      <SelectInput
        label="Lug Type"
        defaultValue={lugs.lugType}
        values={[
          { value: "singlePoint", displayText: "Single Point" },
          { value: "doublePoint", displayText: "Double Point" },
        ]}
        propertyName="lugType"
        updateState={updateState}
        state={lugs}
        setState={setLugs}
      />
      <NumberInput
        label="Lugs"
        defaultValue={lugs.lugNumber}
        min={6}
        max={12}
        step={1}
        propertyName="lugNumber"
        updateState={updateState}
        state={lugs}
        setState={setLugs}
      />
      <SelectInput
        label="Lug Rows"
        defaultValue={lugs.lugRows}
        values={[
          { value: 1, displayText: 1 },
          { value: 2, displayText: 2 },
        ]}
        propertyName="lugRows"
        updateState={updateState}
        state={lugs}
        setState={setLugs}
      />
      {lugs.lugType === "doublePoint" && (
        <NumberInput
          label="Lug Hole Spacing"
          defaultValue={lugs.lugHoleSpacing}
          min={0}
          max={shell.depthInches * 25.4 - 60 - lugs.lugHoleDiameter * 2}
          step={1}
          propertyName="lugHoleSpacing"
          updateState={updateState}
          state={lugs}
          setState={setLugs}
        />
      )}
      {lugs.lugRows === 2 && (
        <NumberInput
          label="Lug Distance From Edge"
          defaultValue={lugs.lugHoleDistanceFromEdge}
          min={0}
          max={(shell.depthInches * 25.4 - 60) / 2}
          step={1}
          propertyName="lugHoleDistanceFromEdge"
          updateState={updateState}
          state={lugs}
          setState={setLugs}
        />
      )}
      <NumberInput
        label="Lug Hole Diameter"
        defaultValue={lugs.lugHoleDiameter}
        min={1}
        max={8}
        step={0.1}
        propertyName="lugHoleDiameter"
        updateState={updateState}
        state={lugs}
        setState={setLugs}
      />
      <NumberInput
        label="Lug Hole Pocket Diameter"
        defaultValue={lugs.lugHolePocketDiameter}
        min={1}
        max={12}
        step={0.1}
        propertyName="lugHolePocketDiameter"
        updateState={updateState}
        state={lugs}
        setState={setLugs}
      />
      <NumberInput
        label="Lug Hole Pocket Depth"
        defaultValue={lugs.lugHolePocketDepth}
        min={0}
        max={shell.shellThickness}
        step={0.1}
        propertyName="lugHolePocketDepth"
        updateState={updateState}
        state={lugs}
        setState={setLugs}
      />
    </ParameterAccordion>
  );
};
