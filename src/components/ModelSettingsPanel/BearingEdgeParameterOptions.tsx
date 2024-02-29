import React from "react";
import { ParameterAccordion } from "./ParameterAccordion";
import { TextInput, SelectInput } from "./Input";

const capitalizeFirstLetter = (string: string): string => {
  if (string)
    return (
      string.charAt(0).toUpperCase() +
      string
        .slice(1)
        .split(/(?=[A-Z])/)
        .join(" ")
    );
  return "";
};

const bearingEdgeProfileEnum = [
  {
    value: "roundover",
    label: "Roundover",
  },
  {
    value: "chamfer",
    label: "45° Chamfer",
  },
  {
    value: "customChamfer",
    label: "Custom Chamfer",
  },
  {
    value: "none",
    label: "None",
  },
];

export const BearingEdgeParameterOptions = ({
  printableDrum,
  register,
  errors,
  watch,
  style,
}) => {
  const topOuterProfile = watch(
    "bearingEdges.topBearingEdge.outerEdge.profileType"
  );
  const topInnerProfile = watch(
    "bearingEdges.topBearingEdge.innerEdge.profileType"
  );
  const bottomOuterProfile = watch(
    "bearingEdges.bottomBearingEdge.outerEdge.profileType"
  );
  const bottomInnerProfile = watch(
    "bearingEdges.bottomBearingEdge.innerEdge.profileType"
  );
  return (
    <ParameterAccordion title="Bearing Edge Settings">
      <div style={style}>
        <TextInput
          label="Lugs Per Bearing Edge Segment"
          initialValue={printableDrum.bearingEdges.lugsPerSegment}
          register={register}
          registerTo="bearingEdges.lugsPerSegment"
          errors={errors?.bearingEdges?.lugsPerSegment}
        />
        <h4>Top Bearing Edge Settings</h4>
        <BearingEdgeInputs
          register={register}
          bearingEdgeProfileEnum={bearingEdgeProfileEnum}
          outerProfile={topOuterProfile}
          innerProfile={topInnerProfile}
          bearingEdgeLocation="topBearingEdge"
          errors={errors}
          printableDrum={printableDrum}
        />
        <h4>Bottom Bearing Edge Settings</h4>
        <BearingEdgeInputs
          register={register}
          bearingEdgeProfileEnum={bearingEdgeProfileEnum}
          outerProfile={bottomOuterProfile}
          innerProfile={bottomInnerProfile}
          bearingEdgeLocation="bottomBearingEdge"
          errors={errors}
          printableDrum={printableDrum}
        />
      </div>
    </ParameterAccordion>
  );
};

const BearingEdgeInputs = ({
  register,
  bearingEdgeProfileEnum,
  outerProfile,
  innerProfile,
  bearingEdgeLocation,
  errors,
  printableDrum,
}) => {
  return (
    <>
      <SelectInput
        label="Outer Edge Profile"
        register={register}
        registerTo={`bearingEdges.${bearingEdgeLocation}.outerEdge.profileType`}
        inputOptions={bearingEdgeProfileEnum}
        errors={
          errors?.bearingEdges?.[bearingEdgeLocation]?.outerEdge?.profileType
        }
        initialValue={
          printableDrum.bearingEdges[bearingEdgeLocation].outerEdge.profileType
        }
      />
      {outerProfile !== "none" && (
        <TextInput
          label={`Outer ${capitalizeFirstLetter(outerProfile)} Size`}
          initialValue={
            printableDrum.bearingEdges[bearingEdgeLocation].outerEdge
              .profileSize
          }
          register={register}
          registerTo={`bearingEdges.${bearingEdgeLocation}.outerEdge.profileSize`}
          errors={
            errors?.bearingEdges?.[bearingEdgeLocation]?.outerEdge?.profileSize
          }
        />
      )}
      {outerProfile === "customChamfer" && (
        <TextInput
          label={`Outer ${capitalizeFirstLetter(outerProfile)} Angle`}
          initialValue={
            printableDrum.bearingEdges[bearingEdgeLocation].outerEdge
          }
          register={register}
          registerTo={`bearingEdges.${bearingEdgeLocation}.outerEdge.customChamferAngle`}
          errors={
            errors?.bearingEdges?.[bearingEdgeLocation]?.outerEdge
              ?.customChamferAngle
          }
        />
      )}
      <SelectInput
        label="Inner Edge Profile"
        register={register}
        registerTo={`bearingEdges.${bearingEdgeLocation}.innerEdge.profileType`}
        inputOptions={bearingEdgeProfileEnum}
        errors={
          errors?.bearingEdges?.[bearingEdgeLocation]?.innerEdge?.profileType
        }
        initialValue={
          printableDrum.bearingEdges[bearingEdgeLocation].innerEdge.profileType
        }
      />
      {innerProfile === "customChamfer" && (
        <TextInput
          label={`Inner ${capitalizeFirstLetter(innerProfile)} Angle`}
          initialValue={
            printableDrum.bearingEdges[bearingEdgeLocation].innerEdge
              .customChamferAngle
          }
          register={register}
          registerTo={`bearingEdges.${bearingEdgeLocation}.innerEdge.customChamferAngle`}
          errors={
            errors?.bearingEdges?.[bearingEdgeLocation]?.innerEdge
              ?.customChamferAngle
          }
        />
      )}
      <TextInput
        label="Bearing Edge Thickness"
        initialValue={printableDrum.bearingEdges[bearingEdgeLocation].thickness}
        register={register}
        registerTo={`bearingEdges.${bearingEdgeLocation}.thickness`}
        errors={errors?.bearingEdges?.[bearingEdgeLocation]?.thickness}
      />
    </>
  );
};
