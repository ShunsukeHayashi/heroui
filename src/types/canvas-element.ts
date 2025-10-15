import { TLShapeId } from "@tldraw/tldraw";

export interface CanvasElement {
  id: TLShapeId;
  type: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  props: Record<string, any>;
}
