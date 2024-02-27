import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { DrumSchema, drumSchemaObject } from "./inputSchema";
import { ShellParameterOptions } from "./ShellParameterOptions";
import { LugParameterOptions } from "./LugParameterOptions";
import { BearingEdgeParameterOptions } from "./BearingEdgeParameterOptions";
import { SnareParameterOptions } from "./SnareParameterOptions";
import { TailSpin } from "react-loader-spinner";

export const ParameterSelector = ({
  printableDrum,
  generateModel,
  loading,
}) => {
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

  const onError = (arg1, arg2) => {
    console.log("error: ", arg1, arg2);
  };

  const drumType = watch("drumType");

  const accordionStyle = {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit, onError)}
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
        borderRadius: "5px",
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
        <h1 style={{ lineHeight: 1, margin: "10px 10px 20px 10px" }}>
          Print-A-Drum
        </h1>
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
        {drumType === "snare" && (
          <SnareParameterOptions
            printableDrum={printableDrum}
            register={register}
            errors={errors}
            style={accordionStyle}
          />
        )}
      </div>
      <button
        type="submit"
        style={{ height: "2em", fontSize: "1em", fontWeight: 550 }}
        disabled={loading}
      >
        {loading ? (
          <TailSpin
            visible={true}
            height="20"
            width="20"
            color="#000"
            ariaLabel="tail-spin-loading"
            radius="1"
            wrapperStyle={{
              width: "100%",
              display: "flex",
              justifyContent: "center",
            }}
            wrapperClass=""
          />
        ) : (
          "Generate"
        )}
      </button>
    </form>
  );
};
