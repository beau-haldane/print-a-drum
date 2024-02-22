import React from "react";
import { NumberInput } from "../CustomNumberInput";
import { ParameterAccordion } from "./ParameterAccordion";
import SelectInput from "../SelectInput";

export const BearingEdgeParameterOptions = ({
  updateState,
  shell,
  bearingEdges,
  setBearingEdges,
}) => {
  const capitalizeFirstLetter = (string: string): string => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  return (
    <ParameterAccordion title="Bearing Edge Settings">
      <ParameterAccordion title="Top Bearing Edge">
        <SelectInput
          label="Outer Edge Profile"
          defaultValue={bearingEdges.topBearingEdge.outerEdge.profileType}
          values={[
            { value: "roundover", displayText: "Roundover" },
            { value: "chamfer", displayText: "Chamfer" },
            { value: 'none', displayText: "None" },
          ]}
          propertyName="topBearingEdge.outerEdge.profileType"
          updateState={updateState}
          state={bearingEdges}
          setState={setBearingEdges}
        />
        <NumberInput
          label={`Outer ${capitalizeFirstLetter(
            bearingEdges.topBearingEdge.outerEdge.profileType
          )} Size`}
          defaultValue={bearingEdges.topBearingEdge.outerEdge.profileSize}
          min={0}
          max={bearingEdges.topBearingEdge.thickness}
          step={1}
          propertyName="topBearingEdge.outerEdge.profileSize"
          updateState={updateState}
          state={bearingEdges}
          setState={setBearingEdges}
        />
        <SelectInput
          label="Inner Edge Profile"
          defaultValue={bearingEdges.topBearingEdge.innerEdge.profileType}
          values={[
            { value: "roundover", displayText: "Roundover" },
            { value: "chamfer", displayText: "Chamfer" },
            { value: 'none', displayText: "None" },
          ]}
          propertyName="topBearingEdge.innerEdge.profileType"
          updateState={updateState}
          state={bearingEdges}
          setState={setBearingEdges}
        />
        <NumberInput
          label="Bearing Edge Thickness"
          defaultValue={bearingEdges.topBearingEdge.thickness}
          min={shell.shellThickness}
          max={25} // TODO calculate this
          step={1}
          propertyName="topBearingEdge.thickness"
          updateState={updateState}
          state={bearingEdges}
          setState={setBearingEdges}
        />
      </ParameterAccordion>
      <ParameterAccordion title="Bottom Bearing Edge">
        <SelectInput
          label="Outer Edge Profile"
          defaultValue={bearingEdges.bottomBearingEdge.outerEdge.profileType}
          values={[
            { value: "roundover", displayText: "Roundover" },
            { value: "chamfer", displayText: "Chamfer" },
            { value: 'none', displayText: "None" },
          ]}
          propertyName="bottomBearingEdge.outerEdge.profileType"
          updateState={updateState}
          state={bearingEdges}
          setState={setBearingEdges}
        />
        <NumberInput
          label={`Outer ${capitalizeFirstLetter(
            bearingEdges.bottomBearingEdge.outerEdge.profileType
          )} Size`}
          defaultValue={bearingEdges.bottomBearingEdge.outerEdge.profileSize}
          min={0}
          max={bearingEdges.bottomBearingEdge.thickness}
          step={1}
          propertyName="bottomBearingEdge.outerEdge.profileSize"
          updateState={updateState}
          state={bearingEdges}
          setState={setBearingEdges}
        />
        <SelectInput
          label="Inner Edge Profile"
          defaultValue={bearingEdges.bottomBearingEdge.innerEdge.profileType}
          values={[
            { value: "roundover", displayText: "Roundover" },
            { value: "chamfer", displayText: "Chamfer" },
            { value: 'none', displayText: "None" },
          ]}
          propertyName="bottomBearingEdge.innerEdge.profileType"
          updateState={updateState}
          state={bearingEdges}
          setState={setBearingEdges}
        />
        <NumberInput
          label="Bearing Edge Thickness"
          defaultValue={bearingEdges.bottomBearingEdge.thickness}
          min={shell.shellThickness}
          max={25} // TODO calculate this
          step={1}
          propertyName="bottomBearingEdge.thickness"
          updateState={updateState}
          state={bearingEdges}
          setState={setBearingEdges}
        />
      </ParameterAccordion>
    </ParameterAccordion>
  );
};
