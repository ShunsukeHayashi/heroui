import { TLRecord } from "@tldraw/tldraw";

export interface Project {
  id: string;
  name: string;
  description?: string;
  lastModified: Date;
  canvasSnapshot?: string;
  thumbnailUrl?: string;
  canvasState?: Record<string, TLRecord>; // Add tldraw state
}
