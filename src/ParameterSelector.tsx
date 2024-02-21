import { NumberInput } from "@mui/base/Unstable_NumberInput/NumberInput";
import { Button, FormLabel, Input, TextField } from "@mui/material";
import React from "react";
import { CustomNumberInput } from "./components/CustomNumberInput";

export const ParameterSelector = ({
  shellParameters,
  setShellParameters,
  generateModel,
}) => {
  // const [shellParameters, setShellParameters] = useState({
  //   lugs: 8,
  //   diameterInches: 14,
  //   depthInches: 6.5,
  //   shellThickness: 9,
  //   lugHoleDiameter: 5,
  //   lugHoleSpacing: 50,
  //   fitmentTolerance: 0.2,
  // });

  const updateShellDimensions = ({
    newDiameterInches,
    newDepthInches,
    newShellThickness,
    newLugs,
    newLugHoleDiameter,
    newLugHoleSpacing,
    newFitmentTolerance,
  }: Partial<{
    newDiameterInches: number;
    newDepthInches: number;
    newShellThickness: number;
    newLugs: number;
    newLugHoleDiameter: number;
    newLugHoleSpacing: number;
    newFitmentTolerance: number;
  }>) => {
    setShellParameters({
      diameterInches: newDiameterInches ?? shellParameters.diameterInches,
      depthInches: newDepthInches ?? shellParameters.depthInches,
      shellThickness: newShellThickness ?? shellParameters.shellThickness,
      lugs: newLugs ?? shellParameters.lugs,
      lugHoleDiameter: newLugHoleDiameter ?? shellParameters.lugHoleDiameter,
      lugHoleSpacing: newLugHoleSpacing ?? shellParameters.lugHoleSpacing,
      fitmentTolerance: newFitmentTolerance ?? shellParameters.fitmentTolerance,
    });
  };

  const NumInput = ({ label, defaultValue, min, max, step, propertyName }) => {
    return (
      <div>
        <FormLabel sx={{fontSize: '14px',}}>{label}</FormLabel>
        <CustomNumberInput
          aria-label={label}
          value={defaultValue}
          min={min}
          max={max}
          step={step}
          onChange={(event, val) =>
            updateShellDimensions({ [propertyName]: val })
          }
        />
      </div>
    );
  };

  const inputRef = React.useRef<HTMLInputElement | null>(null);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        padding: "10px",
        position: "absolute",
        marginTop: "50px",
        marginLeft: "20px",
        zIndex: 100,
        backgroundColor: "#FFF",
      }}
    >
      <NumInput
        label="Diameter (Inches)"
        defaultValue={shellParameters.diameterInches}
        min={8}
        max={16}
        step={1}
        propertyName="newDiameterInches"
      />
      <NumInput
        label="Depth (inches)"
        defaultValue={shellParameters.depthInches}
        min={4}
        max={16}
        step={0.25}
        propertyName="newDepthInches"
      />
      <NumInput
        label="Lugs"
        defaultValue={shellParameters.lugs}
        min={6}
        max={12}
        step={1}
        propertyName="newLugs"
      />
      <NumInput
        label="Lug Hole Diameter"
        defaultValue={shellParameters.lugHoleDiameter}
        min={1}
        max={8}
        step={0.1}
        propertyName="newLugHoleDiameter"
      />
      <NumInput
        label="Lug Hole Spacing"
        defaultValue={shellParameters.lugHoleSpacing}
        min={0}
        max={
          shellParameters.depthInches * 25.4 -
          60 -
          shellParameters.lugHoleDiameter * 2
        }
        step={1}
        propertyName="newLugHoleSpacing"
      />
      <NumInput
        label="Shell Thickness"
        defaultValue={shellParameters.shellThickness}
        min={6}
        max={(shellParameters.diameterInches * 25.4) / 3}
        step={1}
        propertyName="newShellThickness"
      />
      <NumInput
        label="Fitment Tolerance"
        defaultValue={shellParameters.fitmentTolerance}
        min={0}
        max={1}
        step={0.05}
        propertyName="newFitmentTolerance"
      />
      <Button variant="contained" onClick={() => generateModel()}>
        Generate
      </Button>
    </div>
  );
};
