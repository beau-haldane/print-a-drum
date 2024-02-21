import React, { Suspense } from "react";
import { Canvas as ThreeCanvas } from "@react-three/fiber";
import styled from "styled-components";
import LoadingScreen from "./LoadingScreen.jsx";

const StyledCanvas = styled(ThreeCanvas)`
  width: 100%;
  height: 100%;
  background: rgb(250, 250, 250);
  background: radial-gradient(
    circle,
    rgba(250, 250, 250, 1) 0%,
    rgba(208, 212, 213, 1) 100%
  );
`;

export default function Canvas({ children, ...props }) {
  const dpr = Math.min(window.devicePixelRatio, 2);

  return (
    <Suspense fallback={<LoadingScreen />}>
      <StyledCanvas dpr={dpr} frameloop="demand" {...props}>
        {children}
      </StyledCanvas>
    </Suspense>
  );
}
