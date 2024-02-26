import React from "react";
import { Button } from "@mui/material";
import { NumberInput } from "../CustomNumberInput";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import SelectInput from "../SelectInput";
import { ShellParameterOptions } from "./ShellParameterOptions";
import { LugParameterOptions } from "./LugParameterOptions";
import { BearingEdgeParameterOptions } from "./BearingEdgeParameterOptions";

export const ParameterSelector = ({
  printableDrum,
  setPrintableDrum,
  shell,
  setShell,
  lugs,
  setLugs,
  bearingEdges,
  setBearingEdges,
  generateModel,
}) => {
  const updateState = (state, setState, value, propertyName) => {
        function setPropertyValue(obj: {}, path: string, value: any) {
      let schema = obj;
      const pList = path.split(".");
      const len = pList.length;
      for (let i = 0; i < len - 1; i++) {
        const elem = pList[i];
        schema = schema[elem];
      }

      schema[pList[len - 1]] = value;
    }
    let newState = { ...state };
    setPropertyValue(newState, propertyName, value);
    setState(newState);
  };
  const inputRef = React.useRef<HTMLInputElement | null>(null);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        fontFamily: "Roboto",
        flexDirection: "column",
        width: "350px",
        gap: "10px",
        padding: "10px",
        position: "absolute",
        margin: "20px",
        zIndex: 100,
        backgroundColor: "#FFF",
        height: "calc(100vh - 60px)",
        borderRadius: "10px",
      }}
    >
      <div
        style={{
          overflowY: "scroll",
          height: "100%",
          padding: "5px",
          scrollbarGutter: "stable both-edges",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <h1 style={{ lineHeight: 1, margin: "10px" }}>Print-A-Drum</h1>
        <ShellParameterOptions
          printableDrum={printableDrum}
          setPrintableDrum={setPrintableDrum}
          shell={shell}
          setShell={setShell}
          updateState={updateState}
        />
        <LugParameterOptions
          updateState={updateState}
          shell={shell}
          lugs={lugs}
          setLugs={setLugs}
        />
        <BearingEdgeParameterOptions
          updateState={updateState}
          shell={shell}
          bearingEdges={bearingEdges}
          setBearingEdges={setBearingEdges}
        />
      </div>

      <Button variant="contained" onClick={() => generateModel()}>
        Generate
      </Button>
    </div>
  );
};
