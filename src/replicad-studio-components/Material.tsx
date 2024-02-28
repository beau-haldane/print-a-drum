// @ts-expect-error - Vite needs this to workaround declaring relative URLs
import matcap from "/textures/matcap-1.png?url";
import React from "react";
import { useTexture } from "@react-three/drei";

export default function Material(props) {
  const [matcap1] = useTexture([matcap]);
  return <meshMatcapMaterial color="#5a8296" matcap={matcap1} {...props} />;
}