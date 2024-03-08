// @ts-expect-error - TODO: Fix implementation of worker to play nicely with TS
import cadWorker from "./worker.js?worker";
import React, { useState, useEffect } from "react";
import * as THREE from "three";
import { wrap, proxy } from "comlink";
import JSZip from "jszip";
import { fileSave } from "browser-fs-access";
import { ModelSettingsPanel } from "./components/ModelSettingsPanel/ModelSettingsPanel.tsx";
import {
  DrumSchema,
  drumSchemaObject,
} from "./components/ModelSettingsPanel/inputSchema.ts";
import { defaultDrum } from "./model/defaultDrum.ts";
import { ModelViewer } from "./components/ModelViewer.tsx";
import { Provider } from "react-redux";
import { store } from "./state/store.ts";
import LZString from "lz-string";
import { TailSpin } from "react-loader-spinner";

THREE.Object3D.DEFAULT_UP.set(0, 0, 1);


const cad = wrap(new cadWorker());

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
  const [printableDrum, setPrintableDrum] = useState<DrumSchema | null>(
    null
  );

  const updateModelProgress = (progress: number, message?: string) => {
    const modelProgressState = { ...modelProgress };
    modelProgressState.progress = progress;
    if (message) modelProgressState.messages.push(message);
    setModelProgress(modelProgressState);
  };

  const updateModel = (model) => {
    setModel(model);
  };

  const generateModel = (drumSchema: DrumSchema) => {
    setPrintableDrum(drumSchema);
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
    const queryParams = new URLSearchParams(document.location.search).get(
      "drumParams"
    );

    if (queryParams) {
      const decodedParams = JSON.parse(
        LZString.decompressFromEncodedURIComponent(queryParams)
      );
      const { success: validParams } =
        drumSchemaObject.safeParse(decodedParams);

      if (validParams) {
        generateModel(decodedParams);
      }
    } else {
      generateModel(defaultDrum);
    }
  }, []);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        background: `radial-gradient(
          circle,
          rgba(250, 250, 250, 1) 0%,
          rgba(208, 212, 213, 1) 100%
        )`,
      }}
    >
      <Provider store={store}><ModelSettingsPanel
        printableDrum={printableDrum}
        generateModel={generateModel}
        loading={loading}
        style={{
          width: "20%",
          margin: "20px",
          zIndex: 100,
          height: "calc(100vh - 40px)",
          borderRadius: "5px",
        }}
      />
      <ModelViewer
        printableDrum={printableDrum}
        downloadModel={downloadModel}
        loading={loading}
        model={model}
        modelProgress={modelProgress}
        style={{ height: "100vh", width: "80%" }}
      /></Provider>
      
    </div>
  );
}
