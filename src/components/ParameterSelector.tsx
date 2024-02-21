import React from "react";
import { Button } from "@mui/material";
import { NumberInput } from "./CustomNumberInput";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import SelectInput from "./SelectInput";

export const ParameterSelector = ({
  printableDrum,
  setPrintableDrum,
  shell,
  setShell,
  lugs,
  setLugs,
  generateModel,
}) => {
  const updateState = (state, setState, property, propertyName) => {
    const newState = { ...state };
    newState[propertyName] = property;
    setState(newState);
  };
  const inputRef = React.useRef<HTMLInputElement | null>(null);

  return (
    <div
      style={{
        display: "flex",
        fontFamily: "Roboto",
        flexDirection: "column",
        width: "300px",
        gap: "10px",
        padding: "10px",
        position: "absolute",
        marginTop: "50px",
        marginLeft: "20px",
        zIndex: 100,
        backgroundColor: "#FFF",
      }}
    >
      <Accordion defaultExpanded>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1-content"
          id="panel1-header"
        >
          <strong>Drum Shell</strong>
        </AccordionSummary>
        <AccordionDetails>
          <NumberInput
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
          <NumberInput
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
          <NumberInput
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
          <NumberInput
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
        </AccordionDetails>
      </Accordion>
      <Accordion sx={{ width: "100%" }}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel2-content"
          id="panel2-header"
        >
          <strong>Lugs</strong>
        </AccordionSummary>
        <AccordionDetails>
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
              max={((shell.depthInches * 25.4) - (60)) / 2}
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
        </AccordionDetails>
      </Accordion>

      <Button variant="contained" onClick={() => generateModel()}>
        Generate
      </Button>
    </div>
  );
};
