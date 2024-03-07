import opencascade from "replicad-opencascadejs/src/replicad_single.js";
import opencascadeWasm from "replicad-opencascadejs/src/replicad_single.wasm?url";
import { setOC } from "replicad";
import { expose } from "comlink";
import { generate3DPSD } from "./model/3dpds";
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
let model;

const buildBlob = (
  shape,
  fileType,
  meshConfig = {
    tolerance: 0.01,
    angularTolerance: 30,
  }
) => {
  if (fileType === "stl") return shape.blobSTL(meshConfig);
  if (fileType === "stl-binary")
    return shape.blobSTL({ ...meshConfig, binary: true });
  if (fileType === "step") return shape.blobSTEP();
  throw new Error(`Filetype "${fileType}" unknown for export.`);
};

function createBlobs() {
  return started
    .then(() => {
      return model.map(({ shape, name }) => ({
        blob: buildBlob(shape, "stl"),
        name,
      }));
    })
}

function createAssembly(shellParameters, updateModelProgress, updateModel) {
  return started
    .then(() => {
      model = generate3DPSD(shellParameters, updateModelProgress);
      return model;
    })
    .then((drumAssembly) => {
      return drumAssembly
        .filter(
          ({ shape }) =>
            !(shape instanceof replicad.Drawing) || shape.innerShape
        )
        .map(({ name, shape, color, strokeType, opacity }) => {
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
        });
    })
    .then((shapes) => updateModel(shapes));
}

expose({ createBlobs, createAssembly });
