import React from "react";
import PresentationViewer from "../replicad-studio-components/PresentationViewer";
import { Button } from "./Button";
import LZString from "lz-string";

const convertToPercentage = (number) => {
  const percentage = number * 100;
  return percentage.toFixed(2) + "%";
};

const getShareableLink = (printableDrum) => {
  const encodedParams = LZString.compressToEncodedURIComponent(JSON.stringify(printableDrum))
  const currentURL = new URL(window.location.href)
  console.log(currentURL.origin);
  
  navigator.clipboard.writeText(`${currentURL.origin}/?drumParams=${encodedParams}`);
};

export const ModelViewer = ({
  printableDrum,
  downloadModel,
  loading,
  model,
  modelProgress,
  style,
}) => (
  <section style={style}>
    <div
      style={{
        position: "absolute",
        display: "flex",
        flexDirection: "row",
        gap: "0.5em",
        right: "0px",
        margin: "20px",
        zIndex: 100,
      }}
    >
      <Button onClick={downloadModel} buttonText="Download STLs" loading={loading} />
      <Button
        onClick={() => getShareableLink(printableDrum)}
        buttonText="Copy Link"
        loading={loading}
      />
    </div>
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
