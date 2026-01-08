import React, { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaCheck, FaDownload, FaTimes, FaUndo, FaRedo } from 'react-icons/fa';
import EditorCanvas from '../components/ImageEditor/EditorCanvas';
import EditorToolbar from '../components/ImageEditor/EditorToolbar';
import FilterPanel from '../components/ImageEditor/FilterPanel';
import TextPanel from '../components/ImageEditor/TextPanel';
import AdjustmentPanel from '../components/ImageEditor/AdjustmentPanel';
import TransformPanel from '../components/ImageEditor/TransformPanel';

const ImageEditingPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const initialImage = location.state?.image;
  
  const canvasRef = useRef(null);
  const fabricCanvasRef = useRef(null); // Valid Fabric instance

  
  // State
  const [activeToolId, setActiveToolId] = useState('filter'); // filter, adjust, text, transform, crop
  const [canvasSize, setCanvasSize] = useState({ width: 800, height: 600 });
  const [imageSrc, setImageSrc] = useState(null);

  useEffect(() => {
    if (initialImage) {
        setImageSrc(initialImage);
    }
  }, [initialImage]);
  
  // Edit States
  const [filters, setFilters] = useState([
    { id: 1, name: "Original", value: "none", active: true },
    { id: 2, name: "Vibrant", value: "saturate(2) contrast(1.2)", active: false },
    { id: 3, name: "Warm", value: "sepia(0.4) hue-rotate(-10deg) brightness(1.1)", active: false },
    { id: 4, name: "Cool", value: "hue-rotate(180deg) saturate(1.3)", active: false },
    { id: 5, name: "Contrast", value: "contrast(1.8) brightness(1.1)", active: false },
    { id: 6, name: "Vintage", value: "sepia(0.7) contrast(1.2) saturate(1.1)", active: false },
    { id: 7, name: "B&W", value: "grayscale(1) contrast(1.5)", active: false },
  ]);
  
  const [adjustments, setAdjustments] = useState({
    brightness: 100,
    contrast: 100,
    saturation: 100
  });
  
  const [transformations, setTransformations] = useState({
    scale: 1,
    rotation: 0,
    flipHorizontal: false,
    flipVertical: false,
    skewX: 0,
    skewY: 0,
    translateX: 0,
    translateY: 0
  });

  const [textOverlays, setTextOverlays] = useState([]);
  const [selectedTextId, setSelectedTextId] = useState(null);
  const [editingTextId, setEditingTextId] = useState(null); // ID of text currently being typed in
  
  const [cropData, setCropData] = useState({
    mode: false,
    area: { x: 10, y: 10, width: 80, height: 80 }
  });

  const [history, setHistory] = useState([]);
  const [redoStack, setRedoStack] = useState([]);
  const [isAddingText, setIsAddingText] = useState(false);
  const [isCropping, setIsCropping] = useState(false);
  const [cropStart, setCropStart] = useState(null);
  const [isExporting, setIsExporting] = useState(false); // State to trigger clean render

  useEffect(() => {
    if (!initialImage) {
        // Redirect if no image provided
        // navigate('/chat'); // Commented out for dev safety, generally good practice
    }
  }, [initialImage, navigate]);

  // History Management
  const addToHistory = () => {
    const currentState = {
      filters: JSON.parse(JSON.stringify(filters)),
      adjustments: { ...adjustments },
      transformations: { ...transformations },
      textOverlays: JSON.parse(JSON.stringify(textOverlays)),
      cropData: JSON.parse(JSON.stringify(cropData))
    };
    setHistory(prev => [...prev, currentState]);
    setRedoStack([]);
  };

  const handleUndo = () => {
    if (history.length === 0) return;
    const previousState = history[history.length - 1];
    const newHistory = history.slice(0, -1);
    
    // Save current state to redo
    const currentState = {
      filters: JSON.parse(JSON.stringify(filters)),
      adjustments: { ...adjustments },
      transformations: { ...transformations },
      textOverlays: JSON.parse(JSON.stringify(textOverlays)),
      cropData: JSON.parse(JSON.stringify(cropData))
    };
    setRedoStack(prev => [...prev, currentState]);
    
    // Apply previous
    setHistory(newHistory);
    setFilters(previousState.filters);
    setAdjustments(previousState.adjustments);
    setTransformations(previousState.transformations);
    setTextOverlays(previousState.textOverlays);
    setCropData(previousState.cropData);
  };

  const handleRedo = () => {
    if (redoStack.length === 0) return;
    const nextState = redoStack[redoStack.length - 1];
    const newRedoStack = redoStack.slice(0, -1);
    
    // Save current to history
    const currentState = {
        filters: JSON.parse(JSON.stringify(filters)),
        adjustments: { ...adjustments },
        transformations: { ...transformations },
        textOverlays: JSON.parse(JSON.stringify(textOverlays)),
        cropData: JSON.parse(JSON.stringify(cropData))
      };
    setHistory(prev => [...prev, currentState]);

    setRedoStack(newRedoStack);
    setFilters(nextState.filters);
    setAdjustments(nextState.adjustments);
    setTransformations(nextState.transformations);
    setTextOverlays(nextState.textOverlays);
    setCropData(nextState.cropData);
  };


  // Actions
  const handleApplyFilter = (filterValue) => {
    addToHistory();
    setFilters(prev => prev.map(f => ({ ...f, active: f.value === filterValue })));
  };

  const handleUpdateAdjustment = (key, value) => {
    // Debounce history addition? ideally yes, but for now specific events or lazy
    // For sliders, onMouseUp is better for history but onChange needed for live preview.
    // Simplifying: Add history only if difference is significant or simpler: just do it.
    // Optimization: Don't add to history on every drag step. Just update state.
    // Use onMouseUp equivalent if possible, but standard input range onChange fires continuously.
    setAdjustments(prev => ({ ...prev, [key]: value }));
  };

  const handleUpdateTransform = (key, value) => {
    setTransformations(prev => ({ ...prev, [key]: value }));
  };

  // Crop Handlers
  const handleStartCrop = () => {
    setCropData(prev => ({ ...prev, mode: true }));
    setActiveToolId('crop');
  };

  const handleApplyCrop = async () => {
      // Robust Crop using Fabric.js toDataURL with cropping parameters
      if (!fabricCanvasRef.current) return;
      
      const canvas = fabricCanvasRef.current;
      
      // 1. Hide the crop overlay (we don't want it in the final image)
      setIsExporting(true); // Triggers EditorCanvas to remove 'crop-overlay' objects
      
      // Wait for React/Fabric update
      await new Promise(resolve => setTimeout(resolve, 50));
      
      // 2. Calculate crop rectangle
      const { x: pctX, y: pctY, width: pctW, height: pctH } = cropData.area;
      const w = canvas.width; // Real canvas dimensions
      const h = canvas.height;
      
      const left = (pctX / 100) * w;
      const top = (pctY / 100) * h;
      const width = (pctW / 100) * w;
      const height = (pctH / 100) * h;
      
      // 3. Export cropped region
      // Note: toDataURL multipliers might be needed if canvas is scaled on screen?
      // Fabric canvas usually has 1:1 with logical pixels if width/height set correctly.
      // But verify 'retina' scaling.
      const multiplier = 1; // Default
      
      const croppedUrl = canvas.toDataURL({
          left,
          top,
          width,
          height,
          format: 'png',
          multiplier
      });
      
      setIsExporting(false);
      
      addToHistory();
      setImageSrc(croppedUrl);
      
      // Reset crop
      setCropData(prev => ({ ...prev, mode: false, area: { x: 10, y: 10, width: 80, height: 80 } }));
      setTransformations({
        scale: 1, rotation: 0, flipHorizontal: false, flipVertical: false, 
        skewX: 0, skewY: 0, translateX: 0, translateY: 0
      });
  };

  const handleCancelCrop = () => {
      setCropData(prev => ({ ...prev, mode: false }));
      setActiveToolId('filter');
  };

  // Removed manual drag handlers (handled by Fabric)
  const handleCropStart = null;
  const handleCropMove = (e) => {
      // EditorCanvas calls this with { detail: { x, y, width, height } } (percentages)
      // or similar structure we defined
      if (e && e.detail) {
          setCropData(prev => ({ ...prev, area: e.detail }));
      }
  };
  const handleCropEnd = null;

  const handleAddText = () => {
    setIsAddingText(true);
    setSelectedTextId(null);
  };

  const handleCanvasClick = (x, y) => {
      if (isAddingText) {
          addToHistory();
          const newText = {
            id: Date.now(),
            text: "Double click to edit",
            x: x || canvasSize.width / 2,
            y: y || canvasSize.height / 2,
            color: "#ffffff",
            size: 40,
            font: "Inter",
            bold: false,
            italic: false,
            align: "center"
          };
          setTextOverlays(prev => [...prev, newText]);
          setSelectedTextId(newText.id);
          setEditingTextId(newText.id); // Start editing immediately
          setIsAddingText(false);
      } else {
          setSelectedTextId(null);
      }
  };

  const handleTextDoubleClick = (id) => {
      setEditingTextId(id);
      setIsAddingText(false);
  };
  
  const handleTextBlur = () => {
      setEditingTextId(null);
  };

  const handleUpdateText = (idOrKey, propsOrValue) => {
    // Check if handling bulk update from Fabric (id, object) or single key update from toolbar (key, value)
    if (typeof idOrKey === 'string' && typeof propsOrValue === 'object') {
        // Bulk update from Fabric
        const id = idOrKey;
        const props = propsOrValue;
        setTextOverlays(prev => prev.map(t => 
             t.id === id ? { ...t, ...props } : t
        ));
    } else {
        // Legacy single key update
        const key = idOrKey;
        const value = propsOrValue;
        const targetId = editingTextId || selectedTextId || activeTool.selectedTextId;
        if (targetId) {
             setTextOverlays(prev => prev.map(t => 
                t.id === targetId ? { ...t, [key]: value } : t
             ));
        }
    }
  };
  
  const handleRemoveText = (id) => {
      addToHistory();
      setTextOverlays(prev => prev.filter(t => t.id !== id));
      if (selectedTextId === id) setSelectedTextId(null);
  };

  const handleTextDragStart = null;
  const handleTextDrag = null;
  // Called by EditorCanvas when fabric object is modified (dragged/rotated/resized)
  const handleTextDragEnd = () => {
      addToHistory();
  };

  const handleSave = () => {
      if (!canvasRef.current) return;
      const dataUrl = canvasRef.current.toDataURL('image/png');
      // Pass back to chat
      // We could use history.replace to overwrite the state or just navigate back
      // Since we want to update the "generatedImages" list in ChatbotPage, we typically need to persist the change.
      // Since we don't have a backend, we can pass it back in navigation state or just download it.
      // The original code passed it to `setGeneratedImages`.
      // We'll navigate back with the result.
      navigate('/chat', { state: { editedImage: dataUrl, originalImage: initialImage } });
  };
  
  const handleDownload = () => {
      if (!canvasRef.current) return;
      const link = document.createElement('a');
      link.download = `adgenie-edited-${Date.now()}.png`;
      link.href = canvasRef.current.toDataURL('image/png');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 bg-[#1E1E1E] flex flex-col z-50 overflow-hidden font-sans text-white">
      {/* Header */}
      <div className="h-[60px] border-b border-[#333] flex items-center justify-between px-6 bg-[#1E1E1E] z-10 shadow-md">
        <div className="flex items-center gap-4">
             <div className="w-8 h-8 rounded-lg bg-[#5bf0a5] flex items-center justify-center font-bold text-black">
                 E
             </div>
             <h2 className="font-semibold text-lg">Image Editor</h2>
             <span className="text-gray-600">|</span>
             <div className="flex gap-2">
                 <button onClick={handleUndo} disabled={history.length === 0} className={`p-2 rounded ${history.length === 0 ? 'text-gray-600' : 'text-white hover:bg-white/10'}`}><FaUndo /></button>
                 <button onClick={handleRedo} disabled={redoStack.length === 0} className={`p-2 rounded ${redoStack.length === 0 ? 'text-gray-600' : 'text-white hover:bg-white/10'}`}><FaRedo /></button>
             </div>
        </div>
        
        <div className="flex items-center gap-3">
            <button onClick={handleSave} className="flex items-center gap-2 px-5 py-2 rounded-lg bg-[#5bf0a5] text-black font-semibold hover:scale-105 transition-transform">
                <FaCheck /> Done
            </button>
            <button onClick={handleDownload} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#333] text-white hover:bg-white/20 transition-colors">
                <FaDownload /> Download
            </button>
            <button onClick={() => navigate('/chat')} className="w-9 h-9 flex items-center justify-center rounded-lg text-gray-400 hover:text-white hover:bg-white/10 ml-2">
                <FaTimes size={20} />
            </button>
        </div>
      </div>

      {/* Workspace */}
      <div className="flex-1 flex min-h-0">
          {/* Toolbar */}
          <EditorToolbar activeTool={activeToolId} setActiveTool={setActiveToolId} />

          {/* Canvas Area */}
          <div className="flex-1 relative bg-[#0a0a0a] overflow-hidden flex items-center justify-center p-8">
              {imageSrc ? (
                  <EditorCanvas 
                      imageSrc={imageSrc}
                      canvasRef={canvasRef}
                      filters={filters}
                      adjustments={adjustments}
                      transformations={transformations}
                      textOverlays={textOverlays}
                      cropData={cropData}
                      activeTool={{ id: activeToolId, selectedTextId }}
                      
                      onFabricCanvasReady={(canvas) => {
                          fabricCanvasRef.current = canvas;
                      }}
                      onTextClick={(id) => {
                          setSelectedTextId(id);
                          setActiveToolId('text');
                      }}
                      onCanvasClick={(x, y) => handleCanvasClick(x, y)}
                      onTextUpdate={handleUpdateText}
                      onTextBlur={handleTextBlur}
                      editingTextId={editingTextId}
                      
                      onTextDragEnd={handleTextDragEnd}
                      
                      onCropMove={handleCropMove}
                      
                      setCanvasSize={setCanvasSize}
                      hideOverlays={isExporting} // Hide UI when exporting
                  />
                  

              ) : (
                  <div className="text-gray-500">No image loaded</div>
              )}
          </div>

          {/* Properties Panel (Right Sidebar) */}
          <div className="w-[320px] bg-[#1a1a1a] border-l border-[#333] overflow-y-auto">
              {activeToolId === 'filter' && (
                  <FilterPanel 
                      filters={filters} 
                      activeFilterId={filters.find(f => f.active)?.value}
                      onApplyFilter={handleApplyFilter}
                  />
              )}
              {activeToolId === 'adjust' && (
                  <AdjustmentPanel 
                      adjustments={adjustments}
                      onUpdateAdjustment={handleUpdateAdjustment}
                  />
              )}
              {activeToolId === 'text' && (
                  <TextPanel 
                      selectedTextId={selectedTextId}
                      textProperties={textOverlays.find(t => t.id === selectedTextId) || {}}
                      onUpdateText={handleUpdateText}
                      onAddText={handleAddText}
                      onRemoveText={handleRemoveText}
                      isAddingText={isAddingText}
                  />
              )}
              {(activeToolId === 'transform' || activeToolId === 'resize') && (
                  <TransformPanel 
                      transformations={transformations}
                      onUpdateTransform={handleUpdateTransform}
                  />
              )}
               {activeToolId === 'crop' && (
                  <div className="p-4 space-y-4">
                      <h3 className="text-white font-medium mb-4">Crop Image</h3>
                      <p className="text-gray-400 text-sm mb-4">Drag corner to resize, drag center to move.</p>
                      
                      <button 
                        onClick={handleApplyCrop}
                        className="w-full py-2 bg-[#5bf0a5] text-black font-semibold rounded-lg hover:opacity-90 transition-opacity"
                      >
                        Apply Crop
                      </button>
                      
                      <button 
                        onClick={handleCancelCrop}
                        className="w-full py-2 bg-[#333] text-white font-semibold rounded-lg hover:bg-[#444] transition-colors"
                      >
                        Cancel
                      </button>
                  </div>
              )}
          </div>
      </div>
    </div>
  );
};

export default ImageEditingPage;
