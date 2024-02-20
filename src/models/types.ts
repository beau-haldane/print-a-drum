import { CompSolid, Compound, Edge, Face, Shape, Shell, Solid, Vertex, Wire } from "replicad";

export type ShapeArray = Array<Shell | Solid | CompSolid | Compound | Vertex | Edge | Wire | Face>

export type WrappedShapeArray = Array<{
  shape: Shell | Solid | CompSolid | Compound | Vertex | Edge | Wire | Face,
  name: string
}>