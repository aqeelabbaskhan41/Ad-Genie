import React, { useRef, useEffect, useState } from 'react';
import { Canvas, Image as FabricImage, Rect, IText, filters as FabricFilters } from 'fabric';

const EditorCanvas = ({
  imageSrc,
  canvasRef,
  filters,
  adjustments,
  transformations,
  textOverlays,
  cropData,
  activeTool,
  setCanvasSize,
  hideOverlays = false,
  onTextClick,
  onTextDoubleClick,
  onTextUpdate,
  onTextBlur,
  onTextDragEnd, 
  editingTextId, 
  onFabricCanvasReady
}) => {
  const containerRef = useRef(null);
  const [fabricCanvas, setFabricCanvas] = useState(null);
  const [mainImage, setMainImage] = useState(null);

  // Initialize Fabric Canvas
  useEffect(() => {
    if (!canvasRef.current || fabricCanvas) return;

    console.log("Initializing Fabric Canvas");
    const canvas = new Canvas(canvasRef.current, {
      selection: true, // Enable selection for interactivity
      preserveObjectStacking: true
    });
    
    // Customize controls
    // Fabric 6+ syntax might slightly differ for prototype, usually these are static defaults or set on instance
    // For now keeping prototype mutation if it works, or verify v6.
    // In v6, defaults are often on the class or defaults object.
    // Safe to leave for now, but canvas instance configuration is key.
    
    setFabricCanvas(canvas);

    // Event Listeners
    canvas.on('selection:created', (e) => {
        const active = e.selected[0];
        if (active && active.id) {
            onTextClick && onTextClick(active.id);
        }
    });

    canvas.on('selection:updated', (e) => {
        const active = e.selected[0];
        if (active && active.id) {
            onTextClick && onTextClick(active.id);
        }
    });

    canvas.on('selection:cleared', (e) => {
        onTextClick && onTextClick(null);
    });

    canvas.on('object:modified', (e) => {
        const target = e.target;
        if (target && target.id && (target.type === 'i-text' || target.type === 'text')) {
             // Sync back to parent
             const newProps = {
                 x: target.left,
                 y: target.top,
                 // Normalize scale to font size
                 size: target.fontSize * target.scaleY, 
                 rotation: target.angle
             };
             
             // Reset scale on object for consistency (visuals stay same, but internal props cleaner)
             target.set({ scaleX: 1, scaleY: 1, fontSize: newProps.size });
             
             // Call parent update
             onTextUpdate && onTextUpdate(target.id, newProps);
             onTextDragEnd && onTextDragEnd();
        } else if (target) {
            // Other objects
            onTextDragEnd && onTextDragEnd();
        }
    });

    onFabricCanvasReady && onFabricCanvasReady(canvas);

    return () => {
        console.log("Disposing Fabric Canvas");
        canvas.dispose();
        setFabricCanvas(null);
        onFabricCanvasReady && onFabricCanvasReady(null);
    };
  }, [canvasRef]); 

  // Load Image
  useEffect(() => {
    if (!fabricCanvas || !imageSrc) return;

    let isMounted = true;

    FabricImage.fromURL(imageSrc, { crossOrigin: 'anonymous' })
      .then((img) => {
        if (!isMounted || !img) return;
        
        // Ensure canvas is not disposed
        // In v6, we might check `fabricCanvas.destroyed` if available, or rely on our ref mgmt.
        
        fabricCanvas.clear(); 
        
        img.set({
            selectable: false, 
            evented: false, 
            originX: 'center',
            originY: 'center'
        });

        setMainImage(img);
        
        // Resize canvas to fit image
        // Use setDimensions for v6 compatibility
        fabricCanvas.setDimensions({ width: img.width, height: img.height });
        
        if (setCanvasSize) setCanvasSize({ width: img.width, height: img.height });

        // Center the image
        fabricCanvas.centerObject(img);
        fabricCanvas.add(img);
        // sendToBack is removed in v6? use moveObjectTo or just add first.
        // If it's the only object (cleared above), it's already at back.
        // But to be safe:
        if (fabricCanvas.moveObjectTo) {
             fabricCanvas.moveObjectTo(img, 0);
        }
        
        fabricCanvas.renderAll();
      })
      .catch((err) => {
        console.error("Error loading image for Fabric:", err);
      });
      
    return () => {
        isMounted = false;
    };

  }, [fabricCanvas, imageSrc]);

  // Apply Adjustments & Filters (Brightness, Contrast, etc.)
  useEffect(() => {
    if (!fabricCanvas || !mainImage) return;

    // Remove old filters
    mainImage.filters = [];

    // 1. Adjustments
    const brightnessVal = (adjustments.brightness - 100) / 100; // -1 to 1
    const contrastVal = (adjustments.contrast - 100) / 100; // -1 to 1
    const satVal = (adjustments.saturation - 100) / 100; // -1 to 1

    if (adjustments.brightness !== 100) {
        mainImage.filters.push(new FabricFilters.Brightness({ brightness: brightnessVal }));
    }
    if (adjustments.contrast !== 100) {
        mainImage.filters.push(new FabricFilters.Contrast({ contrast: contrastVal }));
    }
    if (adjustments.saturation !== 100) {
        mainImage.filters.push(new FabricFilters.Saturation({ saturation: satVal }));
    }

    // 2. Preset Filters (using CSS filter approximation or Fabric equivalents)
    // Fabric has specific filters. Mapping "Vibrant", "Warm" etc is complex without custom matrices.
    // Simplifying: If user selects a filter, we try to map it to a simple tint or overlay if possible, 
    // or just rely on the CSS 'filter' property? 
    // Fabric DOES NOT support CSS-string filters easily.
    // We must use Fabric filters.
    
    // For this MVP, let's implement a few basic color matrices or simple filters based on names.
    const activeFilter = filters.find(f => f.active);
    if (activeFilter && activeFilter.value !== 'none') {
        if (activeFilter.name === 'Grayscale' || activeFilter.name === 'B&W') {
             mainImage.filters.push(new FabricFilters.Grayscale());
        }
        else if (activeFilter.name === 'Sepia' || activeFilter.name === 'Vintage') {
             mainImage.filters.push(new FabricFilters.Sepia());
        }
        else if (activeFilter.name === 'Warm') {
             mainImage.filters.push(new FabricFilters.BlendColor({ color: '#ff9900', mode: 'tint', alpha: 0.2 }));
        }
        else if (activeFilter.name === 'Cool') {
             mainImage.filters.push(new FabricFilters.BlendColor({ color: '#0000ff', mode: 'tint', alpha: 0.2 }));
        }
        // ... add more mappings as needed
    }

    mainImage.applyFilters();
    fabricCanvas.renderAll();

  }, [fabricCanvas, mainImage, adjustments, filters]);

  // Apply Transformations (Rotate, Flip)
  useEffect(() => {
      if (!fabricCanvas || !mainImage) return;

      // Reset
      // mainImage.set({ scaleX: 1, scaleY: 1, angle: 0 }); // Be careful not to lose original scale if needed
      
      // Fabric handles rotation easier
      mainImage.rotate(transformations.rotation);
      
      let scaleX = transformations.scale;
      let scaleY = transformations.scale;
      if (transformations.flipHorizontal) scaleX *= -1;
      if (transformations.flipVertical) scaleY *= -1;

      mainImage.set({ 
          scaleX, 
          scaleY,
          skewX: transformations.skewX || 0,
          skewY: transformations.skewY || 0
      });
      
      fabricCanvas.centerObject(mainImage);
      fabricCanvas.renderAll();

  }, [fabricCanvas, mainImage, transformations]);

  // Sync Text Overlays (Parent -> Fabric)
  // NOTE: This can be tricky. Ideally Fabric IS the source of truth for text.
  // But our app has state in parent. 
  // Strategy: On initial load or 'Undo', we clear and rebuild text.
  // When user types in parent, we update specific ID.
  useEffect(() => {
    if (!fabricCanvas) return;

    // Check if we need to full sync (e.g. undo/redo or init)
    // Simple heuristic: if counts differ, or we forced a re-render.
    // Let's iterate and update/create.
    
    textOverlays.forEach(textData => {
        let existing = null;
        fabricCanvas.getObjects().forEach(obj => {
            if (obj.id === textData.id) existing = obj;
        });

        if (!existing) {
            // Create
            const itext = new IText(textData.text, {
                left: textData.x,
                top: textData.y,
                fill: textData.color,
                fontSize: textData.size,
                fontFamily: textData.font || 'Inter',
                fontWeight: textData.bold ? 'bold' : 'normal',
                fontStyle: textData.italic ? 'italic' : 'normal',
                textAlign: textData.align,
                id: textData.id,
                originX: 'left', // Match manual system?
                originY: 'top'
            });
            fabricCanvas.add(itext);
            fabricCanvas.setActiveObject(itext); // Select newly added
        } else {
            // Update existing if changed (avoid loop if fabric updated passing back)
            // If this object is currently active (being dragged), IGNORE updates from parent to avoid stutter
            if (fabricCanvas.getActiveObject() !== existing) {
                 if (existing.text !== textData.text) existing.set('text', textData.text);
                 if (existing.fill !== textData.color) existing.set('fill', textData.color);
                 if (Math.abs(existing.left - textData.x) > 1) existing.set('left', textData.x);
                 if (Math.abs(existing.top - textData.y) > 1) existing.set('top', textData.y);
                 
                 if (textData.size) {
                    existing.set({ fontSize: textData.size, scaleX: 1, scaleY: 1 });
                 }
                 
                 existing.setCoords();
            } else {
                // It IS the active object. We might still need to update non-geo props (like color) if changed externally
                if (existing.fill !== textData.color) existing.set('fill', textData.color);
                 if (existing.text !== textData.text) existing.set('text', textData.text);
            }
        }
    });

    // Remove deleted
    const ids = textOverlays.map(t => t.id);
    fabricCanvas.getObjects().forEach(obj => {
        if (obj.type === 'i-text' && !ids.includes(obj.id)) {
            fabricCanvas.remove(obj);
        }
    });
    
    fabricCanvas.requestRenderAll();

  }, [fabricCanvas, textOverlays]);


  // Crop Overlay
  // We can stick to the manual overlay for cropping since it's just a visual selection tool!
  // It renders ON TOP of the fabric canvas (via absolute positioning in generic DOM or a second canvas).
  // In `EditorCanvas.jsx` existing code, `drawCropOverlay` was part of the MAIN canvas.
  // With Fabric, we can either:
  // 1. Add a temporary Rect/Group to Fabric for the crop box. 
  // 2. Use a separate canvas on top (HTML structure dependent).
  // 3. Or just let the parent render a DOM overlay?
  //
  // Given the previous existing code drew it on the same canvas, let's try to add a "CropOverlay" Object to Fabric?
  // Or simpler: Just re-implement the DOM overlay approach or let the parent handle a separate overlay div.
  //
  // BUT the `EditorCanvas` component manages the canvas.
  // Let's implement crop as a simple visual overlay on Fabric if active.
  
  useEffect(() => {
    if (!fabricCanvas) return;
    
    // Clean up old crop rects
    fabricCanvas.getObjects().forEach(obj => {
        if (obj.name === 'crop-overlay' || obj.name === 'crop-selection') {
            fabricCanvas.remove(obj);
        }
    });

    if (cropData.mode && !hideOverlays) {
       const canvasW = fabricCanvas.getWidth();
       const canvasH = fabricCanvas.getHeight();
       
       // Darken everything (The "Hole" approach is complex, just dim everything behind?)
       // Actually, we want to see the image clearly INSIDE the selection.
       // A simple approach is 4 rectangles around the selection to dim the outside. 
       // But for now, let's just add the dimming layer BEHIND the selection with low opacity?
       // No, that dims the selection too if it's full screen. 
       // Let's stick to just the selection box for now to avoid complexity/bugs,
       // OR correctly implement the 4-rect strategy if we want semantic "dimming".
       // Let's rely on the Selection Box being clear.
       
       // user wanted "set them" - implying it should work like a real app.
       // Let's try to add the background overlay but make it "selectable: false".
       // And we need to ensure the selection is ABOVE it.
       
       // Current bug in my previous code: `overlay` was not added. 
       // And `overlay` covered the WHOLE screen with 0.5 opacity.
       // This would dim the INSIDE of the crop too.
       // Fixing this: Use a hollow rect? Fabric doesn't support hollow rects easily.
       // Correct approach: 4 rects (top, bottom, left, right).
       
       const { x: pctX, y: pctY, width: pctW, height: pctH } = cropData.area;
       const x = (pctX / 100) * canvasW;
       const y = (pctY / 100) * canvasH;
       const w = (pctW / 100) * canvasW;
       const h = (pctH / 100) * canvasH;

       // 1. Top Rect
       const topRect = new Rect({
           left: 0, top: 0, width: canvasW, height: y,
           fill: 'rgba(0,0,0,0.5)', selectable: false, evented: false, name: 'crop-overlay'
       });
       // 2. Bottom Rect
       const bottomRect = new Rect({
           left: 0, top: y + h, width: canvasW, height: canvasH - (y + h),
           fill: 'rgba(0,0,0,0.5)', selectable: false, evented: false, name: 'crop-overlay'
       });
       // 3. Left Rect
       const leftRect = new Rect({
           left: 0, top: y, width: x, height: h,
           fill: 'rgba(0,0,0,0.5)', selectable: false, evented: false, name: 'crop-overlay'
       });
       // 4. Right Rect
       const rightRect = new Rect({
           left: x + w, top: y, width: canvasW - (x + w), height: h,
           fill: 'rgba(0,0,0,0.5)', selectable: false, evented: false, name: 'crop-overlay'
       });
       
       fabricCanvas.add(topRect, bottomRect, leftRect, rightRect);

       const selection = new Rect({
           left: x, top: y, width: w, height: h,
           fill: 'transparent',
           stroke: '#5bf0a5',
           strokeWidth: 2,
           strokeDashArray: [5, 5],
           selectable: true, 
           name: 'crop-selection',
           transparentCorners: false,
           cornerColor: 'white',
           cornerStrokeColor: '#5bf0a5',
           borderColor: '#5bf0a5',
           cornerSize: 12,
           padding: 0
       });
       
       fabricCanvas.add(selection);
       fabricCanvas.setActiveObject(selection);
       
       // Update cropData on modify
       selection.on('modified', () => {
           const nx = selection.left;
           const ny = selection.top;
           const nw = selection.width * selection.scaleX;
           const nh = selection.height * selection.scaleY;
           
           // Convert back to %
           onCropMove && onCropMove({ 
               detail: {
                   x: (nx / canvasW) * 100,
                   y: (ny / canvasH) * 100,
                   width: (nw / canvasW) * 100,
                   height: (nh / canvasH) * 100
               }
           });
       });
    }
  }, [fabricCanvas, cropData.mode, cropData.area, hideOverlays]);


  return (
    <div 
      ref={containerRef} 
      className="relative w-full h-full flex items-center justify-center bg-[#111] overflow-hidden"
    >
      <canvas ref={canvasRef} />
    </div>
  );
};

export default EditorCanvas;
