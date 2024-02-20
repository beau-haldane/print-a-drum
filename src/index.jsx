import React from "react";
import App from "./App.jsx";
import GlobalStyle from "./GlobalStyles.jsx";
import { createRoot } from "react-dom/client";
import * as THREE from "three";
import '@fontsource/inter';
import "replicad-opencascadejs/src/replicad_single.wasm?url";

THREE.Object3D.DEFAULT_UP.set(0, 0, 1);

const root = createRoot(document.getElementById("root"));

root.render(
  <>
    <GlobalStyle />
    <App />
  </>
);
