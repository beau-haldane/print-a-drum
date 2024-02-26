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
  const capitaliseFirstLetter = (string: string): string => {
    if (string) return string.charAt(0).toUpperCase() + string.slice(1).split(/(?=[A-Z])/).join(' ')
    return "";
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
            { value: "customChamfer", displayText: "Custom Chamfer" },
            { value: "none", displayText: "None" },
          ]}
          propertyName="topBearingEdge.outerEdge.profileType"
          updateState={updateState}
          state={bearingEdges}
          setState={setBearingEdges}
        />
        <NumberInput
          label={`Outer ${capitaliseFirstLetter(
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
        {bearingEdges.topBearingEdge.outerEdge.profileType ===
          "customChamfer" && (
          <NumberInput
            label={`Outer ${capitaliseFirstLetter(
              bearingEdges.topBearingEdge.outerEdge.profileType
            )} Angle`}
            defaultValue={bearingEdges.topBearingEdge.outerEdge.customChamferAngle}
            min={0}
            max={70}
            step={1}
            propertyName="topBearingEdge.outerEdge.customChamferAngle"
            updateState={updateState}
            state={bearingEdges}
            setState={setBearingEdges}
          />
        )}
        <SelectInput
          label="Inner Edge Profile"
          defaultValue={bearingEdges.topBearingEdge.innerEdge.profileType}
          values={[
            { value: "roundover", displayText: "Roundover" },
            { value: "chamfer", displayText: "Chamfer" },
            { value: "customChamfer", displayText: "Custom Chamfer" },
            { value: "none", displayText: "None" },
          ]}
          propertyName="topBearingEdge.innerEdge.profileType"
          updateState={updateState}
          state={bearingEdges}
          setState={setBearingEdges}
        />
        {bearingEdges.topBearingEdge.innerEdge.profileType ===
          "customChamfer" && (
          <NumberInput
            label={`Outer ${capitaliseFirstLetter(
              bearingEdges.topBearingEdge.outerEdge.profileType
            )} Angle`}
            defaultValue={bearingEdges.topBearingEdge.innerEdge.customChamferAngle}
            min={0}
            max={70}
            step={1}
            propertyName="topBearingEdge.innerEdge.customChamferAngle"
            updateState={updateState}
            state={bearingEdges}
            setState={setBearingEdges}
          />
        )}
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
            { value: "customChamfer", displayText: "Custom Chamfer" },
            { value: "none", displayText: "None" },
          ]}
          propertyName="bottomBearingEdge.outerEdge.profileType"
          updateState={updateState}
          state={bearingEdges}
          setState={setBearingEdges}
        />
        {bearingEdges.bottomBearingEdge.outerEdge.profileType ===
          "customChamfer" && (
          <NumberInput
            label={`Outer ${capitaliseFirstLetter(
              bearingEdges.bottomBearingEdge.outerEdge.profileType
            )} Angle`}
            defaultValue={bearingEdges.bottomBearingEdge.outerEdge.customChamferAngle}
            min={0}
            max={70}
            step={1}
            propertyName="bottomBearingEdge.outerEdge.customChamferAngle"
            updateState={updateState}
            state={bearingEdges}
            setState={setBearingEdges}
          />
        )}
        <NumberInput
          label={`Outer ${capitaliseFirstLetter(
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
            { value: "customChamfer", displayText: "Custom Chamfer" },
            { value: "none", displayText: "None" },
          ]}
          propertyName="bottomBearingEdge.innerEdge.profileType"
          updateState={updateState}
          state={bearingEdges}
          setState={setBearingEdges}
        />
        {bearingEdges.bottomBearingEdge.innerEdge.profileType ===
          "customChamfer" && (
          <NumberInput
            label={`Outer ${capitaliseFirstLetter(
              bearingEdges.bottomBearingEdge.innerEdge.profileType
            )} Angle`}
            defaultValue={bearingEdges.bottomBearingEdge.innerEdge.customChamferAngle}
            min={0}
            max={70}
            step={1}
            propertyName="bottomBearingEdge.innerEdge.customChamferAngle"
            updateState={updateState}
            state={bearingEdges}
            setState={setBearingEdges}
          />
        )}
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
