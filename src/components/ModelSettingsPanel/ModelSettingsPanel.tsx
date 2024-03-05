import React, { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { DrumSchema, drumSchemaObject } from "./inputSchema";
import { ShellParameterOptions } from "./ShellParameterOptions";
import { LugParameterOptions } from "./LugParameterOptions";
import { BearingEdgeParameterOptions } from "./BearingEdgeParameterOptions";
import { SnareParameterOptions } from "./SnareParameterOptions";
import { TailSpin } from "react-loader-spinner";
import { Documentation } from "../Documentation";
import { UnitSelector } from "./UnitSelector";

export const ModelSettingsPanel = ({
  printableDrum,
  generateModel,
  loading,
}) => {
  const [showDocumentation, setShowDocumentation] = useState(false);
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
    console.log(drumSchema);
    // generateModel(drumSchema);
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

  const linkStyle = {
    textDecoration: "underline",
    cursor: "pointer",
  };

  return (
    <div
      style={{
        display: "flex",
        fontFamily: "Roboto",
        flexDirection: "row",
        position: "absolute",
        margin: "20px",
        zIndex: 100,
        height: "calc(100vh - 40px)",
        borderRadius: "5px",
      }}
    >
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
          zIndex: 100,
          backgroundColor: "#FFF",
          borderRadius: "5px",
          border: "1px solid #f0f0f0",
        }}
      >
        <div
          style={{
            overflowY: "scroll",
            height: "100%",
            padding: "5px",
            scrollbarGutter: "stable both-edges",
            display: "flex",
            gap: "10px",
            paddingTop: "10px",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <h1 style={{ lineHeight: 1, margin: 0 }}>Print-A-Drum</h1>
          <p style={{ margin: 0 }}>
            {!showDocumentation && (
              <>
                Need help?{" "}
                <a
                  onClick={() => setShowDocumentation(!showDocumentation)}
                  style={linkStyle}
                >
                  {`See documentation >`}
                </a>
              </>
            )}
          </p>
          <UnitSelector />
          <div>
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

      {showDocumentation && (
        <div
          style={{
            backgroundColor: "#FFF",
            margin: "10px 0px",
            borderRadius: "0 5px 5px 0",
            padding: "20px",
            minWidth: "600px",
            maxWidth: "calc(100vw - (370px * 2))",
          }}
        >
          <div style={{ margin: "0 0 10px 15px" }}>
            <a
              onClick={() => setShowDocumentation(!showDocumentation)}
              style={linkStyle}
            >
              {`< Hide documentation`}
            </a>
          </div>

          <Documentation
            style={{
              height: "calc(100% - 20px)",
              overflowY: "scroll",
              scrollbarGutter: "stable both-edges",
            }}
          />
        </div>
      )}
    </div>
  );
};
