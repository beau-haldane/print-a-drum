// @ts-expect-error - TODO: Fix implementation of worker to play nicely with TS
import cadWorker from "./worker.js?worker";
import React, { useState, useEffect } from "react";
import * as THREE from "three";
import { wrap, proxy } from "comlink";
import PresentationViewer from "./replicad-studio-components/PresentationViewer.jsx";
import { ParameterSelector } from "./ParameterSelector.tsx";

// @ts-expect-error - Property 'DefaultUp' does not exist on type 'typeof Object3D', however this code executes fine and is necessary to the correct rotational axis
THREE.Object3D.DefaultUp.set(0, 0, 1);

const cad = wrap(new cadWorker());

function convertToPercentage(number) {
  const percentage = number * 100;
  return percentage.toFixed(2) + "%";
}

export default function ReplicadApp() {
  const [model, setModel] = useState(null);
  const [modelProgress, setModelProgress] = useState("0%");
  const [shellParameters, setShellParameters] = useState({
    lugs: 8,
    diameterInches: 12,
    depthInches: 8,
    shellThickness: 9,
    lugHoleDiameter: 5,
    lugHoleSpacing: 65,
    fitmentTolerance: 0.2,
  });
  
  const updateModelProgress = (number) => {
    setModelProgress(convertToPercentage(number));
  };
  const updateModel = (model) => {
    setModel(model);
  };

  const generateModel = () => {
    setModelProgress("0%");
    // @ts-expect-error - see TODO on line 1
    cad.createAssembly(
      shellParameters,
      proxy(updateModelProgress),
      proxy(updateModel)
    );
  };

  // const downloadModel = async () => {
  //   const blob = await cad.createBlob(shellParameters);
  //   FileSaver.saveAs(blob, "drum.stl");
  // };

  useEffect(() => {
    generateModel();
  }, []);

  return (
    <>
      <ParameterSelector
        shellParameters={shellParameters}
        setShellParameters={setShellParameters}
        generateModel={generateModel}
      />
      <section style={{ height: "100vh" }}>
        {model ? (
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
            }}
          >
            <span>
              {model
                ? "Model Generated ✅"
                : `Generating Drum Shell Model ${modelProgress}`}
            </span>
          </div>
        )}
      </section>
    </>
  );
}
