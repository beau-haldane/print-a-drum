import React from "react";
import PropTypes from "prop-types";
import Canvas from "./Canvas.jsx";
import Material from "./Material.tsx";
import Controls from "./Controls.jsx";
import { ShapeGeometries } from "./ShapeGeometry.jsx";
import DefaultGeometry from "./DefaultGeometry.jsx";
import InfiniteGrid from "./InfiniteGrid.jsx";

const PresentationViewer = ({
  shapes,
  disableAutoPosition = false,
  disableDamping = false,
  hideGrid = false,
}) => {
  const geometryReady = shapes && shapes.length && shapes[0].name;

  return (
    <Canvas>
      {!hideGrid && <InfiniteGrid />}
      <Controls hideGizmo={!geometryReady} enableDamping={!disableDamping}>
        {shapes !== "error" && shapes.length && (
          <ShapeGeometries
            shapes={shapes}
            selectMode="none"
            disableAutoPosition={disableAutoPosition}
            FaceMaterial={Material}
          />
        )}
        {shapes === "error" && <DefaultGeometry />}
      </Controls>
    </Canvas>
  );
};

PresentationViewer.propTypes = {
  shapes: PropTypes.array.isRequired,
  disableAutoPosition: PropTypes.bool,
  disableDamping: PropTypes.bool,
  hideGrid: PropTypes.bool,
};

export default React.memo(PresentationViewer);
