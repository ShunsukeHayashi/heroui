import { TLShapeId } from "@tldraw/tldraw";

export interface GenerationContext {
  text: string[];
  images: ImageData[];
  shapes: ShapeData[];
  combinedText: string;
  selectionType: SelectionType;
}

export interface ImageData {
  id: TLShapeId;
  assetId: string;
  w: number;
  h: number;
}

export interface ShapeData {
  id: TLShapeId;
  type: string;
  x: number;
  y: number;
  rotation: number;
  props: Record<string, any>;
}

export type SelectionType = 
  | "none" 
  | "text" 
  | "image" 
  | "shape" 
  | "text+image" 
  | "text+shape" 
  | "image+shape" 
  | "mixed";
