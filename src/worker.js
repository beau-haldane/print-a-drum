import opencascade from "replicad-opencascadejs/src/replicad_single.js";
import opencascadeWasm from "replicad-opencascadejs/src/replicad_single.wasm?url";
import { setOC } from "replicad";
import { expose } from "comlink";
import { generate3DPSD } from "./model/3dpsd";
import * as replicad from "replicad";

let loaded = false;
const init = async () => {
  if (loaded) return Promise.resolve(true);

  const OC = await opencascade({
    locateFile: () => opencascadeWasm,
  });

  loaded = true;
  setOC(OC);

  return true;
};

const started = init();

const isBlueprintLike = (shape) => {
  return (
    shape instanceof replicad.Blueprint ||
    shape instanceof replicad.Blueprints ||
    shape instanceof replicad.CompoundBlueprint ||
    shape instanceof replicad.Drawing
  );
};

function createBlob(shellParameters) {
  // note that you might want to do some caching for more complex models
  return started.then(() => {
    return generate3DPSD(shellParameters).blobSTL();
  });
}

function createAssembly(
  shellParameters,
  updateModelProgress,
  updateModel
) {
  return started
    .then(() => {
      return generate3DPSD(shellParameters, updateModelProgress);
    })
    .then((drumAssembly) => {
      return drumAssembly
        .filter(
          ({ shape }) =>
            !(shape instanceof replicad.Drawing) || shape.innerShape
        )
        .map(
          ({
            name,
            shape,
            color,
            strokeType,
            opacity
          }) => {
            const shapeInfo = { name, color, strokeType, opacity };

            try {
              shapeInfo.mesh = shape.mesh({
                tolerance: 0.1,
                angularTolerance: 30,
              });
              shapeInfo.edges = shape.meshEdges({ keepMesh: true });
            } catch (e) {
              console.error(e);
              shapeInfo.error = true;
              return shapeInfo;
            }

            return shapeInfo;
          }
        );
    })
    .then((shapes) => updateModel(shapes));
}

expose({ createBlob, createAssembly });
export default { createBlob, createAssembly}
