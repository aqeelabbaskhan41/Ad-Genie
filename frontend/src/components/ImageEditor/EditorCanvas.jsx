import React, { useRef, useEffect, useState } from 'react';
import { Canvas, Image as FabricImage, Rect, IText, Textbox, filters as FabricFilters } from 'fabric';

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
  onFabricCanvasReady,
  zoomLevel = 1,
  isAddingText = false,
  onTextCreate,
  onTextRemove, // Added prop
  onUpdateText, // Added prop
  onAddText, // Added prop
  onCancelAdd, // Added prop
  onRemoveText // Added prop
}) => {
  const containerRef = useRef(null);
  const [fabricCanvas, setFabricCanvas] = useState(null);
  const [mainImage, setMainImage] = useState(null);
  
  // Drag-to-draw state
  const isDrawingTextRef = useRef(false);
  const startPosRef = useRef({ x: 0, y: 0 });
  const activeTextboxRef = useRef(null);

  // Update handlers ref on every render
  useEffect(() => {
    if (fabricCanvas) {
        fabricCanvas.handlersRef = { 
            onTextClick, 
            onTextUpdate, 
            onTextDragEnd,
            onTextRemove,
            onTextCreate
        };
    }
  }, [fabricCanvas, onTextClick, onTextUpdate, onTextDragEnd, onTextRemove, onTextCreate]);

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
    
    // Store handlers in a ref to avoid stale closures in Fabric events
    canvas.handlersRef = { 
        onTextClick, 
        onTextUpdate, 
        onTextDragEnd,
        onTextRemove,
        onTextCreate
    };

    // Event Listeners
    canvas.on('selection:created', (e) => {
        const active = e.selected[0];
        if (active && active.id) {
            canvas.handlersRef.onTextClick && canvas.handlersRef.onTextClick(active.id);
        }
    });

    canvas.on('selection:updated', (e) => {
        const active = e.selected[0];
        if (active && active.id) {
            canvas.handlersRef.onTextClick && canvas.handlersRef.onTextClick(active.id);
        }
    });

    canvas.on('selection:cleared', (e) => {
        canvas.handlersRef.onTextClick && canvas.handlersRef.onTextClick(null);
    });

    canvas.on('object:modified', (e) => {
        const target = e.target;
        if (target && target.id && (target.type === 'i-text' || target.type === 'textbox')) {
             // Sync back to parent
             const newProps = {
                 x: target.left,
                 y: target.top,
                 // Normalize scale to font size
                 size: target.fontSize * target.scaleY, 
                 rotation: target.angle,
                 width: target.width * target.scaleX // Save actual width
             };
             
             // Reset scale on object for consistency
             if (target.type === 'textbox') {
                 target.set({ width: target.width * target.scaleX, scaleX: 1, scaleY: 1, fontSize: newProps.size });
             } else {
                 target.set({ scaleX: 1, scaleY: 1, fontSize: newProps.size });
             }
             
             // Call parent update via Ref
             canvas.handlersRef.onTextUpdate && canvas.handlersRef.onTextUpdate(target.id, newProps);
             canvas.handlersRef.onTextDragEnd && canvas.handlersRef.onTextDragEnd();
        } else if (target) {
            // Other objects
            canvas.handlersRef.onTextDragEnd && canvas.handlersRef.onTextDragEnd();
        }
    });

    // Handle Text Content Changes (from on-canvas editing)
    canvas.on('text:changed', (e) => {
        const target = e.target;
        if (target && target.id) {
            canvas.handlersRef.onTextUpdate && canvas.handlersRef.onTextUpdate(target.id, { text: target.text });
        }
    });
    
    // Handle Textbox Reflow on Resize (Scaling)
    canvas.on('object:scaling', (e) => {
        const target = e.target;
        if (target && target.type === 'textbox') {
            // While scaling, update width to force reflow
            // Fabric v6 might need different handling, but v5 approach:
            // scales set, we want to keep font size maybe? or valid resizing?
            // "Text reflows inside resized container":
            // This means we treat scaleX as width change.
            target.set({
                width: target.width * target.scaleX,
                scaleX: 1,
                scaleY: 1 // Keep scaleY 1 to avoid stretching text vertically? 
                // Or if user drags corner, they might expect text text size to stay same but box to grow?
                // Standard PPT corner drag = scale text. Side drag = reflow.
                // Fabric Textbox: Middle controls change width (reflow). Corner controls change scale (size).
                // If user wants reflow, they use side handles. Fabric Textbox does this by default IF we configure it right.
            });
        }
    });

    onFabricCanvasReady && onFabricCanvasReady(canvas);

    // Handle keyboard events for deleting objects
    const handleKeyDown = (e) => {
        if (e.key === 'Delete' || e.key === 'Backspace') {
            const activeObject = canvas.getActiveObject();
            
            // If text is being edited, don't delete the whole object!
            if (activeObject && activeObject.isEditing) {
                return;
            }

            if (activeObject && activeObject.id && (activeObject.type === 'i-text' || activeObject.type === 'textbox')) {
                canvas.handlersRef.onTextRemove && canvas.handlersRef.onTextRemove(activeObject.id);
                canvas.remove(activeObject);
                canvas.discardActiveObject();
                canvas.requestRenderAll();
                e.preventDefault(); // Prevent browser back navigation
            }
        }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
        console.log("Disposing Fabric Canvas");
        window.removeEventListener('keydown', handleKeyDown); // Clean up event listener
        // Don't dispose if already disposed? 
        // Fabric doesn't have a public isDisposed property easily accessible across versions.
        // But double dispose usually throws or is no-op.
        try {
            canvas.dispose();
        } catch (e) {
            console.warn("Error disposing canvas:", e);
        }
        setFabricCanvas(null);
        onFabricCanvasReady && onFabricCanvasReady(null);
    };
  }, [canvasRef]); // Removed volatile deps, handlers updated via ref

  // Handle Auto-Edit Mode
  useEffect(() => {
    if (!fabricCanvas || !editingTextId) return;
    
    
    const obj = fabricCanvas.getObjects().find(o => o.id === editingTextId);
    if (obj && (obj.type === 'i-text' || obj.type === 'textbox')) {
        fabricCanvas.setActiveObject(obj);
        obj.enterEditing();
        obj.selectAll(); // Optional: select all text for easy replacement
        fabricCanvas.requestRenderAll();
    }
  }, [fabricCanvas, editingTextId]);

  // Load Image
  useEffect(() => {
    if (!fabricCanvas || !imageSrc) {
        console.log("EditorCanvas: Skipping image load", { fabricCanvas: !!fabricCanvas, imageSrc });
        return;
    }

    console.log("EditorCanvas: Loading image", imageSrc.substring(0, 50) + "...");
    let isMounted = true;

     FabricImage.fromURL(imageSrc, { crossOrigin: 'anonymous' })
      .then((img) => {
        if (!isMounted || !img) return;
        
        try {
            // Safety check: Canvas might be disposed in the microtask gap
            // We use a try-catch to handle any "disposed" errors gracefully
            
            fabricCanvas.clear(); 
            
            if (img.width === 0 || img.height === 0) {
                console.warn("Loaded image has 0 dimensions");
                return;
            }

            img.set({
                selectable: false, 
                evented: false, 
                originX: 'center',
                originY: 'center'
            });

            setMainImage(img);
            
            // Resize canvas to fit image
            // We intentionally don't wrap this in try-catch individually because the outer try-catch handles it.
            fabricCanvas.setDimensions({ width: img.width, height: img.height });
            
            if (setCanvasSize) setCanvasSize({ width: img.width, height: img.height });

            // Center the image
            fabricCanvas.centerObject(img);
            fabricCanvas.add(img);
            
            // sendToBack/moveObjectTo
            if (fabricCanvas.moveObjectTo) {
                 fabricCanvas.moveObjectTo(img, 0);
            }
            
            fabricCanvas.requestRenderAll();
        } catch (innerErr) {
            console.warn("Error adding image to canvas (race condition):", innerErr);
        }
      })
      .catch((err) => {
        console.error("Error loading image for Fabric:", err);
      });
      
    return () => {
        isMounted = false;
    };

  }, [fabricCanvas, imageSrc]);

  // Handle Zoom
  useEffect(() => {
    if (!fabricCanvas) return;
    
    // Safety check for disposed canvas (Fabric v6 usage)
    // Accessing methods on a disposed canvas can throw. 
    // We try/catch the property access itself if needed, or just wrap the logic.
    
    try {
        // If canvas is disposed, some properties might be null.
        // We'll rely on try/catch to suppress errors during unmount/remount races.
        
        // Set zoom
        fabricCanvas.setZoom(zoomLevel);
        
        // Adjust canvas dimensions if needed to allow scrolling
        if (mainImage) {
            const newWidth = mainImage.width * zoomLevel;
            const newHeight = mainImage.height * zoomLevel;
            fabricCanvas.setDimensions({ width: newWidth, height: newHeight });
        }
        
        fabricCanvas.requestRenderAll();
    } catch (e) {
        // Suppress "Unitialized" or "Disposed" errors common in StrictMode transitions
        // console.warn("Canvas operation failed (likely disposing):", e);
    }
  }, [fabricCanvas, zoomLevel, mainImage]);

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
            // Create New Textbox
            const textbox = new Textbox(textData.text, {
                left: textData.x,
                top: textData.y,
                width: textData.width || 200, // Default width or restored
                fill: textData.color,
                fontSize: textData.size,
                fontFamily: textData.font || 'Inter',
                fontWeight: textData.bold ? 'bold' : 'normal',
                fontStyle: textData.italic ? 'italic' : 'normal',
                textAlign: textData.align,
                id: textData.id,
                originX: 'left', 
                originY: 'top',
                splitByGrapheme: true, 
                editable: true,
                selectable: true,
                // UI Styling for selection
                borderColor: 'black',
                cornerColor: 'black',
                cornerSize: 10,
                transparentCorners: false,
                cornerStrokeColor: 'white',
                borderScaleFactor: 2,
                padding: 5
            });

            // Enable resizing from all sides (not just width change)
            // By default Textbox only allows width change via ml/mr. 
            // We want scaling behavior often expected by users.
            textbox.setControlsVisibility({
                mt: true, 
                mb: true,
                ml: true, 
                mr: true, 
                bl: true,
                br: true, 
                tl: true, 
                tr: true,
                mtr: true // Rotate
            });

            fabricCanvas.add(textbox);
            
            // Check if this new text should be immediately edited
            if (editingTextId === textData.id) {
                fabricCanvas.setActiveObject(textbox);
                textbox.enterEditing();
                textbox.selectAll();
            }
        } else {
            // Update existing if changed (avoid loop if fabric updated passing back)
            // If this object is currently active (being dragged), IGNORE updates from parent to avoid stutter
            if (fabricCanvas.getActiveObject() !== existing) {
                 if (existing.text !== textData.text) existing.set('text', textData.text);
                 if (existing.fill !== textData.color) existing.set('fill', textData.color);
                 
                 // Update position if significantly different
                 if (Math.abs(existing.left - textData.x) > 1) existing.set('left', textData.x);
                 if (Math.abs(existing.top - textData.y) > 1) existing.set('top', textData.y);
                 
                  if (textData.size) {
                    existing.set({ fontSize: textData.size, scaleX: 1, scaleY: 1 });
                 }

                 // Fix Font Family
                 if (existing.fontFamily !== textData.font) existing.set('fontFamily', textData.font);

                 // Fix Bold/Italic
                 const expectedWeight = textData.bold ? 'bold' : 'normal';
                 if (existing.fontWeight !== expectedWeight) existing.set('fontWeight', expectedWeight);
                 
                 const expectedStyle = textData.italic ? 'italic' : 'normal';
                 if (existing.fontStyle !== expectedStyle) existing.set('fontStyle', expectedStyle);

                 // Fix Alignment
                 if (existing.textAlign !== textData.align) existing.set('textAlign', textData.align);
                 
                 existing.setCoords();
            } else {
                // It IS the active object. We might still need to update non-geo props (like color) if changed externally
                if (existing.fill !== textData.color) existing.set('fill', textData.color);
                if (existing.text !== textData.text) existing.set('text', textData.text);
                
                // Fix Font Family on active object
                if (existing.fontFamily !== textData.font) existing.set('fontFamily', textData.font);

                // Also sync bold/italic on active object
                 const expectedWeight = textData.bold ? 'bold' : 'normal';
                 if (existing.fontWeight !== expectedWeight) existing.set('fontWeight', expectedWeight);
                 
                 const expectedStyle = textData.italic ? 'italic' : 'normal';
                 if (existing.fontStyle !== expectedStyle) existing.set('fontStyle', expectedStyle);

                 if (existing.textAlign !== textData.align) existing.set('textAlign', textData.align);
            }
        }
    });
    const ids = textOverlays.map(t => t.id);
    fabricCanvas.getObjects().forEach(obj => {
        if ((obj.type === 'i-text' || obj.type === 'textbox') && obj.id && !ids.includes(obj.id)) {
            fabricCanvas.remove(obj);
        }
    });
    
    fabricCanvas.requestRenderAll();

  }, [fabricCanvas, textOverlays]);

  // Handle Drag-to-Draw for Text
  useEffect(() => {
    if (!fabricCanvas) return;

    if (isAddingText) {
        // Set cursor
        fabricCanvas.defaultCursor = 'crosshair';
        fabricCanvas.selection = false; // Disable group selection while drawing
        
        const handleMouseDown = (opt) => {
            console.log("Drag-to-Draw: Mouse Down", opt);
            // Fabric v6 provides scenePoint directly
            const pointer = opt.scenePoint; 
            if (!pointer) return;
            
            isDrawingTextRef.current = true;
            startPosRef.current = { x: pointer.x, y: pointer.y };
            
            // Create placeholder Rect for visual feedback
            const rect = new Rect({
                left: pointer.x,
                top: pointer.y,
                width: 0,
                height: 0,
                stroke: '#5bf0a5',
                strokeWidth: 2,
                strokeDashArray: [5, 5],
                fill: 'rgba(91, 240, 165, 0.1)', // Light green tint
                selectable: false,
                evented: false,
            });
            
            activeTextboxRef.current = rect;
            fabricCanvas.add(rect);
        };
        
        const handleMouseMove = (opt) => {
            if (!isDrawingTextRef.current || !activeTextboxRef.current) return;
            // Fabric v6: use scenePoint
            const pointer = opt.scenePoint;
            if (!pointer) return;
            
            const w = pointer.x - startPosRef.current.x;
            const h = pointer.y - startPosRef.current.y;
            
            activeTextboxRef.current.set({ 
                width: Math.abs(w),
                height: Math.abs(h)
            });
            
            // Handle negative dragging logic if needed (shifting left/top)
            if (w < 0) activeTextboxRef.current.set({ left: pointer.x });
            if (h < 0) activeTextboxRef.current.set({ top: pointer.y });
            
            fabricCanvas.requestRenderAll();
        };
        
        const handleMouseUp = (opt) => {
            if (!isDrawingTextRef.current || !activeTextboxRef.current) return;
            isDrawingTextRef.current = false;
            
            const finalObj = activeTextboxRef.current;
            fabricCanvas.remove(finalObj); // Remove temp rect
            
            // If width is very small (just a click), default to standard size. 
            // Otherwise use drawn width.
            let finalWidth = finalObj.width;
            if (finalWidth < 40) finalWidth = 200; 
            const finalX = finalObj.left;
            const finalY = finalObj.top;

            // Notify parent to create real text
            // Notify parent to create real text
            if (fabricCanvas.handlersRef.onTextCreate) {
                fabricCanvas.handlersRef.onTextCreate({
                    text: "", 
                    x: finalX,
                    y: finalY,
                    width: finalWidth,
                });
            }
            
            activeTextboxRef.current = null;
        };

        fabricCanvas.on('mouse:down', handleMouseDown);
        fabricCanvas.on('mouse:move', handleMouseMove);
        fabricCanvas.on('mouse:up', handleMouseUp);
        
        console.log("Drag-to-Draw: Events Attached", { isAddingText });

        return () => {
            fabricCanvas.off('mouse:down', handleMouseDown);
            fabricCanvas.off('mouse:move', handleMouseMove);
            fabricCanvas.off('mouse:up', handleMouseUp);
            fabricCanvas.defaultCursor = 'default';
            fabricCanvas.selection = true;
        };
    } else {
        fabricCanvas.defaultCursor = 'default';
        fabricCanvas.selection = true;
    }
  }, [fabricCanvas, isAddingText, onTextCreate]);


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
      // Changed to simpler rendering for scroll support:
      // We removed "w-full h-full item-center justify-center". 
      // The container in parent is "overflow-auto flex items-center justify-center".
      // We just need this wrapper to fit the content so scrollbars appear on parent.
      className="relative"
      style={{ 
        width: mainImage ? mainImage.width * zoomLevel : '100%', 
        height: mainImage ? mainImage.height * zoomLevel : '100%' 
      }}
    >
      <canvas ref={canvasRef} />
    </div>
  );
};

export default EditorCanvas;
