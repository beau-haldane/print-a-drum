import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { DrumSchema, drumSchemaObject } from "./inputSchema";
import { ShellParameterOptions } from "./ShellParameterOptions";
import { LugParameterOptions } from "./LugParameterOptions";
import { BearingEdgeParameterOptions } from "./BearingEdgeParameterOptions";

export const ParameterSelector = ({ printableDrum, generateModel }) => {
  const {
    watch,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DrumSchema>({
    mode: "all",
    resolver: zodResolver(drumSchemaObject),
  });

  const onSubmit: SubmitHandler<DrumSchema> = (drumSchema) => {
    generateModel(drumSchema);
  };

  const accordionStyle = {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  };

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
          alignItems: "center",
        }}
      >
        <h1 style={{ lineHeight: 1, margin: "10px" }}>Print-A-Drum</h1>
        <ShellParameterOptions
          printableDrum={printableDrum}
          register={register}
          errors={errors}
          style={accordionStyle}
        />
        <LugParameterOptions
          printableDrum={printableDrum}
          register={register}
          errors={errors}
          watch={watch}
          style={accordionStyle}
        />
        <BearingEdgeParameterOptions
          printableDrum={printableDrum}
          register={register}
          errors={errors}
          watch={watch}
          style={accordionStyle}
        />
      </div>
      <button type="submit">Generate</button>
    </form>
  );
};
