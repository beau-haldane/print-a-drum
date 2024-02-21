// @ts-expect-error - TODO: Fix implementation of worker to play nicely with TS
import cadWorker from "./worker.js?worker";
import React, { useState, useEffect } from "react";
import * as THREE from "three";
import { wrap, proxy } from "comlink";
import PresentationViewer from "./replicad-studio-components/PresentationViewer.jsx";
import { ParameterSelector } from "./components/ParameterSelector.tsx";
import { DrumShell, Lugs } from "./model/types.ts";

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
  const [shell, setShell] = useState<DrumShell>({
    diameterInches: 14,
    depthInches: 6.5,
    shellThickness: 12,
  });
  const [lugs, setLugs] = useState<Lugs>({
    lugType: 'doublePoint',
    lugRows: 2,
    lugNumber: 8,
    lugHoleSpacing: 20,
    lugHoleDiameter: 5,
    lugHolePocketDiameter: 8,
    lugHolePocketDepth: 2,
    lugHoleDistanceFromEdge: 45
  })
  const [printableDrum, setPrintableDrum] = useState({
    fitmentTolerance: 0.2,
    shell,
    lugs,
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
      printableDrum,
      proxy(updateModelProgress),
      proxy(updateModel)
    );
  };

  useEffect(() => {
    generateModel();
  }, []);

  useEffect(() => {
    setPrintableDrum({
      lugs,
      shell,
      fitmentTolerance: 0.2,
    })
  }, [shell, lugs])

  return (
    <>
      <ParameterSelector
        printableDrum={printableDrum}
        setPrintableDrum={setPrintableDrum}
        shell={shell}
        setShell={setShell}
        lugs={lugs}
        setLugs={setLugs}
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
