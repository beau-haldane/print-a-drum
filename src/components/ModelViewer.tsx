import React from "react";
import { TailSpin } from "react-loader-spinner";
import PresentationViewer from "../replicad-studio-components/PresentationViewer";

const convertToPercentage = (number) => {
  const percentage = number * 100;
  return percentage.toFixed(2) + "%";
};

export const ModelViewer = ({
  downloadModel,
  loading,
  model,
  modelProgress,
  style
}) => (
  <section style={style}>
    <button
      onClick={() => downloadModel()}
      style={{
        fontFamily: "Roboto",
        height: "2em",
        fontSize: "1em",
        fontWeight: 550,
        position: "absolute",
        right: "0px",
        margin: "20px",
        zIndex: 100,
      }}
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
        "Download STL Files"
      )}
    </button>
    {!loading && model ? (
      <PresentationViewer
        shapes={model}
        hideGrid={true}
        disableDamping={false}
        disableAutoPosition={true}
      />
    ) : (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "2em",
          fontFamily: "Roboto",
        }}
      >
        <span>{`Generating Drum Shell Model ${convertToPercentage(
          modelProgress.progress
        )}`}</span>
        {modelProgress.messages.map((message, i) => {
          const latestMessage = i + 1 === modelProgress.messages.length;
          return (
            <p
              style={{
                fontSize: "0.5em",
                margin: 0,
              }}
              key={i}
            >
              {message}
              {latestMessage ? "..." : " ✔️"}
            </p>
          );
        })}
      </div>
    )}
  </section>
);
