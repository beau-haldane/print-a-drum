// @ts-expect-error - TODO: Fix implementation of worker to play nicely with TS
import cadWorker from "./worker.js?worker";
import React, { useState, useEffect } from "react";
import * as THREE from "three";
import { wrap, proxy } from "comlink";
import PresentationViewer from "./replicad-studio-components/PresentationViewer.jsx";
import JSZip from "jszip";
import { fileSave } from "browser-fs-access";
import { ParameterSelector } from "./components/ParameterSelector/ParameterSelector.tsx";
import { DrumSchema } from "./components/ParameterSelector/inputSchema.ts";

// @ts-expect-error - Property 'DefaultUp' does not exist on type 'typeof Object3D', however this code executes fine and is necessary to the correct rotational axis
THREE.Object3D.DefaultUp.set(0, 0, 1);

const cad = wrap(new cadWorker());

const convertToPercentage = (number) => {
  const percentage = number * 100;
  return percentage.toFixed(2) + "%";
};

const downloadModel = async () => {
  // @ts-expect-error - see TODO on line 1
  const shapes = await cad.createBlobs();
  const zip = new JSZip();
  shapes.forEach((shape, i) => {
    zip.file(`${shape.name || `shape-${i}`}.stl`, shape.blob);
  });
  const zipBlob = await zip.generateAsync({ type: "blob" });
  await fileSave(zipBlob, {
    id: "exports",
    description: "Save zip",
    fileName: `Printable-Drum.zip`,
    extensions: [".zip"],
  });
};

export default function ReplicadApp() {
  const [loading, setLoading] = useState(true);
  const [model, setModel] = useState(null);
  const [modelProgress, setModelProgress] = useState<{
    progress: number;
    messages: string[];
  }>({
    progress: 0,
    messages: [],
  });
  const [printableDrum, setPrintableDrum] = useState<DrumSchema>({
    fitmentTolerance: 0.2,
    shell: {
      diameterInches: 14,
      depthInches: 6.5,
      shellThickness: 10,
      lugsPerSegment: 2,
    },
    lugs: {
      lugType: "doublePoint",
      lugRows: 2,
      lugNumber: 8,
      lugHoleSpacing: 20,
      lugHoleDiameter: 5,
      lugHolePocketDiameter: 8,
      lugHolePocketDepth: 2,
      lugHoleDistanceFromEdge: 40,
    },
    bearingEdges: {
      lugsPerSegment: 2,
      topBearingEdge: {
        thickness: 10,
        outerEdge: {
          profileType: "roundover",
          profileSize: 10 / 2,
          customChamferAngle: 0,
        },
        innerEdge: {
          profileType: "chamfer",
          customChamferAngle: 0,
        },
      },
      bottomBearingEdge: {
        thickness: 10,
        outerEdge: {
          profileType: "roundover",
          profileSize: 10 / 2,
          customChamferAngle: 0,
        },
        innerEdge: {
          profileType: "chamfer",
          customChamferAngle: 0,
        },
      },
    },
  });

  const updateModelProgress = (progress: number, message?: string) => {
    const modelProgressState = { ...modelProgress };
    modelProgressState.progress = progress;
    if (message) modelProgressState.messages.push(message);
    setModelProgress(modelProgressState);
  };

  const updateModel = (model) => {
    setModel(model);
  };

  const generateModel = (drumSchema?: DrumSchema) => {
    if (drumSchema) setPrintableDrum(drumSchema);
    setLoading(true);
    cad // @ts-expect-error - see TODO on line 1
      .createAssembly(
        drumSchema || printableDrum,
        proxy(updateModelProgress),
        proxy(updateModel)
      )
      .then(() => {
        setModelProgress({
          progress: 0,
          messages: [],
        });
        setLoading(false);
      });
  };

  useEffect(() => {
    generateModel();
  }, []);

  return (
    <>
      <ParameterSelector
        printableDrum={printableDrum}
        generateModel={generateModel}
      />
      <section style={{ height: "100vh" }}>
        {/* <Button onClick={() => downloadModel()}>Download</Button> */}
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
              background: `radial-gradient(
                  circle,
                  rgba(250, 250, 250, 1) 0%,
                  rgba(208, 212, 213, 1) 100%
                )`,
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
    </>
  );
}
