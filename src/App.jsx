import "replicad-opencascadejs/src/replicad_single.wasm?url";

import React from "react";


import ReloadPrompt from "./ReloadPrompt.jsx";
import LoadingScreen from "./components/LoadingScreen.jsx";

const Workbench = React.lazy(() => import("./workbench/Workbench.jsx"));

export default function App() {
  return (
    <>
      <ReloadPrompt />
      <React.Suspense fallback={<LoadingScreen />}>
        <Workbench />
      </React.Suspense>
    </>
  );
}
