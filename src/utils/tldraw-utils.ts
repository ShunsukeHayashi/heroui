import { Editor, TLShapeId, TLShape } from "@tldraw/tldraw";
import { GenerationContext } from "../types/generation-context";

/**
 * Extract relevant data from selected tldraw elements
 */
export function extractElementData(editor: Editor, selectedIds: TLShapeId[]): GenerationContext {
  const context: GenerationContext = {
    text: [],
    images: [],
    shapes: [],
    combinedText: "",
    selectionType: "none",
  };
  
  if (selectedIds.length === 0) return context;
  
  // Determine selection type based on what's selected
  let hasText = false;
  let hasImage = false;
  let hasShape = false;
  
  // Process each selected shape
  selectedIds.forEach(id => {
    const shape = editor.getShape(id);
    if (!shape) return;
    
    switch (shape.type) {
      case 'text':
        hasText = true;
        processTextShape(shape, context);
        break;
      case 'image':
        hasImage = true;
        processImageShape(shape, context);
        break;
      case 'draw':
      case 'rectangle':
      case 'ellipse':
      case 'triangle':
      case 'arrow':
      case 'line':
        hasShape = true;
        processShapeData(shape, context);
        break;
      default:
        // Handle other shape types if needed
        processShapeData(shape, context);
        break;
    }
  });
  
  // Set selection type based on what was found
  if (hasText && !hasImage && !hasShape) {
    context.selectionType = "text";
  } else if (hasImage && !hasText && !hasShape) {
    context.selectionType = "image";
  } else if (hasShape && !hasText && !hasImage) {
    context.selectionType = "shape";
  } else if (hasText && hasImage) {
    context.selectionType = "text+image";
  } else if (hasText && hasShape) {
    context.selectionType = "text+shape";
  } else if (hasImage && hasShape) {
    context.selectionType = "image+shape";
  } else if (hasText && hasImage && hasShape) {
    context.selectionType = "mixed";
  }
  
  // Create combined text from all text elements
  context.combinedText = context.text.join(" ");
  
  return context;
}

/**
 * Process text shape data
 */
function processTextShape(shape: TLShape, context: GenerationContext) {
  if (shape.props && 'text' in shape.props) {
    const text = shape.props.text as string;
    if (text && text.trim()) {
      context.text.push(text);
    }
  }
}

/**
 * Process image shape data
 */
function processImageShape(shape: TLShape, context: GenerationContext) {
  if (shape.props && 'assetId' in shape.props) {
    const assetId = shape.props.assetId as string;
    if (assetId) {
      // In a real implementation, we would get the actual image data
      // from the assets store using the assetId
      context.images.push({
        id: shape.id,
        assetId: assetId,
        w: shape.props.w as number,
        h: shape.props.h as number,
      });
    }
  }
}

/**
 * Process shape data (rectangles, ellipses, etc.)
 */
function processShapeData(shape: TLShape, context: GenerationContext) {
  context.shapes.push({
    id: shape.id,
    type: shape.type,
    x: shape.x,
    y: shape.y,
    rotation: shape.rotation,
    props: { ...shape.props },
  });
}

/**
 * Get a data URL from an image asset
 * This would need to be implemented based on how tldraw stores assets
 */
export async function getImageDataUrl(editor: Editor, assetId: string): Promise<string | null> {
  // In a real implementation, we would get the actual image data
  // from the assets store using the assetId
  // @ts-ignore - TODO: Fix tldraw TLAssetId type compatibility
  const asset = editor.getAsset(assetId);
  if (!asset || asset.type !== 'image') return null;

  // This is a placeholder - actual implementation would depend on
  // how assets are stored in your application
  return asset.props.src || null;
}
