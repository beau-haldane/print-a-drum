import opencascadeWasm from "replicad-opencascadejs/src/replicad_single.wasm?url";
import opencascade from "replicad-opencascadejs/src/replicad_single.js";
import { setOC } from "replicad";
import { expose } from "comlink";
import { generate3DPSD } from "./model/3dpsd";
import * as replicad from "replicad";

let loaded = false;
const init = async () => {
  if (loaded) return Promise.resolve(true);

  // @ts-ignore - default function from package throws unexpected argument error
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

export class Api {
  public createAssembly(
    shellParameters,
    updateModelProgress,
    updateModel
  ) {
    return started
      .then(() => {
        return generate3DPSD(shellParameters, updateModelProgress);
      })
      // .then((drumAssembly) => {
      //   return drumAssembly
      //     .filter(
      //       ({ shape }) =>
      //         !(shape instanceof replicad.Drawing) || shape.innerShape
      //     )
      //     .map(
      //       ({
      //         name,
      //         shape,
      //         color,
      //         strokeType,
      //         opacity,
      //         highlight: inputHighlight,
      //         highlightEdge,
      //         highlightFace,
      //       }) => {
      //         let highlight =
      //           inputHighlight ||
      //           (highlightEdge && highlightEdge(new replicad.EdgeFinder())) ||
      //           (highlightFace && highlightFace(new replicad.FaceFinder()));
  
      //         const shapeInfo = { name, color, strokeType, opacity };
  
      //         if (isBlueprintLike(shape)) {
      //           shapeInfo.format = "svg";
      //           shapeInfo.paths = shape.toSVGPaths();
      //           shapeInfo.viewbox = shape.toSVGViewBox();
      //           return shapeInfo;
      //         }
  
      //         try {
      //           shapeInfo.mesh = shape.mesh({
      //             tolerance: 0.1,
      //             angularTolerance: 30,
      //           });
      //           shapeInfo.edges = shape.meshEdges({ keepMesh: true });
      //         } catch (e) {
      //           console.error(e);
      //           shapeInfo.error = true;
      //           return shapeInfo;
      //         }
  
      //         if (highlight)
      //           try {
      //             shapeInfo.highlight = highlight.find(shape).map((s) => {
      //               return s.hashCode;
      //             });
      //           } catch (e) {
      //             console.error(e);
      //           }
  
      //         return shapeInfo;
      //       }
      //     );
      // })
      .then((shapes) => updateModel(shapes));
  }

  public exit(): void {
    return process.exit();
  }
}

expose(new Api());
