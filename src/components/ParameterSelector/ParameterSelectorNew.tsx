import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { DrumSchema, drumSchemaObject } from "./inputSchema";
import { SelectInput, TextInput } from "./Input";

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

export const ParameterSelectorNew = () => {
  const {
    watch,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DrumSchema>({
    mode: 'all',
    resolver: zodResolver(drumSchemaObject),
  });

  const onSubmit: SubmitHandler<DrumSchema> = (data) => {
    console.log(data);
  };

  const lugType = watch("lugs.lugType");
  const lugRows = watch("lugs.lugRows");
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

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
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
          gap: "4px",
          alignItems: "center",
        }}
      >
        <h1 style={{ lineHeight: 1, margin: "10px" }}>Print-A-Drum</h1>
        <h2>Shell Options</h2>
        <TextInput
          label="Fitment Tolerance"
          initialValue={0.2}
          register={register}
          registerTo="fitmentTolerance"
          errors={errors?.fitmentTolerance}
        />
        <TextInput
          label="Diameter"
          initialValue={14}
          register={register}
          registerTo="shell.diameterInches"
          errors={errors?.shell?.diameterInches}
        />
        <TextInput
          label="Depth"
          initialValue={6}
          register={register}
          registerTo="shell.depthInches"
          errors={errors?.shell?.depthInches}
        />
        <TextInput
          label="Thickness"
          initialValue={10}
          register={register}
          registerTo="shell.shellThickness"
          errors={errors?.shell?.shellThickness}
        />
        <TextInput
          label="Lugs Per Segment"
          initialValue={2}
          register={register}
          registerTo="shell.lugsPerSegment"
          errors={errors?.shell?.lugsPerSegment}
        />
        <h2>Lug Options</h2>
        <SelectInput
          label="Lug Type"
          register={register}
          registerTo="lugs.lugType"
          inputOptions={[
            {
              value: "singlePoint",
              label: "Single Point",
            },
            {
              value: "doublePoint",
              label: "Double Point",
            },
          ]}
          errors={errors?.lugs?.lugType}
        />
        <TextInput
          label="Lugs"
          initialValue={8}
          register={register}
          registerTo="lugs.lugNumber"
          errors={errors?.lugs?.lugNumber}
        />
        <SelectInput
          label="Lug Rows"
          register={register}
          registerTo="lugs.lugRows"
          inputOptions={[
            {
              value: 1,
              label: "1",
            },
            {
              value: 2,
              label: "2",
            },
          ]}
          errors={errors?.lugs?.lugRows}
        />
        {lugType === "doublePoint" && (
          <TextInput
            label="Lug Hole Spacing"
            initialValue={50}
            register={register}
            registerTo="lugs.lugHoleSpacing"
            errors={errors?.lugs?.lugHoleSpacing}
          />
        )}
        {lugRows === "2" && (
          <TextInput
            label="Lug Distance From Edge"
            initialValue={40}
            register={register}
            registerTo="lugs.lugHoleDistanceFromEdge"
            errors={errors?.lugs?.lugHoleDistanceFromEdge}
          />
        )}
        <TextInput
          label="Lug Hole Diameter"
          initialValue={5}
          register={register}
          registerTo="lugs.lugHoleDiameter"
          errors={errors?.lugs?.lugHoleDiameter}
        />
        <TextInput
          label="Lug Hole Pocket Diameter"
          initialValue={6.5}
          register={register}
          registerTo="lugs.lugHolePocketDiameter"
          errors={errors?.lugs?.lugHolePocketDiameter}
        />
        <TextInput
          label="Lug Hole Pocket Depth"
          initialValue={2}
          register={register}
          registerTo="lugs.lugHolePocketDepth"
          errors={errors?.lugs?.lugHolePocketDepth}
        />

        <h2>Bearing Edge Options</h2>
        <TextInput
          label="Lugs Per Segment"
          initialValue={2}
          register={register}
          registerTo="bearingEdges.lugsPerSegment"
          errors={errors?.bearingEdges?.lugsPerSegment}
        />

        <BearingEdgeInputs
          register={register}
          bearingEdgeProfileEnum={bearingEdgeProfileEnum}
          outerProfile={topOuterProfile}
          innerProfile={topInnerProfile}
          bearingEdgeLocation="topBearingEdge"
          errors={errors}
        />
        <BearingEdgeInputs
          register={register}
          bearingEdgeProfileEnum={bearingEdgeProfileEnum}
          outerProfile={bottomOuterProfile}
          innerProfile={bottomInnerProfile}
          bearingEdgeLocation="bottomBearingEdge"
          errors={errors}
        />
      </div>
      <button type="submit">Generate</button>
    </form>
  );
};

const BearingEdgeInputs = ({
  register,
  bearingEdgeProfileEnum,
  outerProfile,
  innerProfile,
  bearingEdgeLocation,
  errors,
}) => {
  return (
    <>
      <h3>{capitalizeFirstLetter(bearingEdgeLocation)}</h3>
      <SelectInput
        label="Outer Edge Profile"
        register={register}
        registerTo={`bearingEdges.${bearingEdgeLocation}.outerEdge.profileType`}
        inputOptions={bearingEdgeProfileEnum}
        errors={
          errors?.bearingEdges?.[bearingEdgeLocation]?.outerEdge?.profileType
        }
      />
      {outerProfile !== "none" && (
        <TextInput
          label={`Outer ${capitalizeFirstLetter(outerProfile)} Size`}
          initialValue={5}
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
          initialValue={30}
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
      />
      {innerProfile === "customChamfer" && (
        <TextInput
          label={`Inner ${capitalizeFirstLetter(innerProfile)} Angle`}
          initialValue={30}
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
        initialValue={10}
        register={register}
        registerTo={`bearingEdges.${bearingEdgeLocation}.thickness`}
        errors={errors?.bearingEdges?.[bearingEdgeLocation]?.thickness}
      />
    </>
  );
};
