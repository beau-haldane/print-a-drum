import React, { ReactNode } from "react";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

export const ParameterAccordion = ({
  children,
  title,
}: {
  children: ReactNode;
  title: string;
}) => {
  return (
    <Accordion disableGutters sx={{ width: "100%" }}>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls={title.toLowerCase().split(" ").join("-")}
        id={title.toLowerCase().split(" ").join("-")}
      >
        <strong>{title}</strong>
      </AccordionSummary>
      <AccordionDetails>{children}</AccordionDetails>
    </Accordion>
  );
};
