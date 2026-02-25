import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

// ─── Icons (inline SVG to avoid import issues) ──────────────────────────────
const Icon = ({ d, size = 16, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d={d} />
  </svg>
);

const Icons = {
  undo: 'M3 7v6h6M21 17a9 9 0 00-9-9 9 9 0 00-6 2.3L3 13',
  redo: 'M21 7v6h-6M3 17a9 9 0 019-9 9 9 0 016 2.3l3-2.3',
  download: 'M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3',
  check: 'M20 6L9 17l-5-5',
  x: 'M18 6L6 18M6 6l12 12',
  filter: 'M22 3H2l8 9.46V19l4 2v-8.54L22 3',
  sliders: 'M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M1 14h6M9 8h6M17 16h6',
  type: 'M4 7V4h16v3M9 20h6M12 4v16',
  crop: 'M6.13 1L6 16a2 2 0 002 2h15M1 6.13l15-.13a2 2 0 012 2V23',
  layers: 'M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5',
  rotate: 'M23 4v6h-6M1 20v-6h6M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15',
  flipH: 'M8 3H5a2 2 0 00-2 2v14c0 1.1.9 2 2 2h3M16 3h3a2 2 0 012 2v14a2 2 0 01-2 2h-3M12 20v2M12 14v2M12 8v2M12 2v2',
  trash: 'M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a1 1 0 011-1h4a1 1 0 011 1v2',
  plus: 'M12 5v14M5 12h14',
  bold: 'M6 4h8a4 4 0 014 4 4 4 0 01-4 4H6zM6 12h9a4 4 0 014 4 4 4 0 01-4 4H6z',
  italic: 'M19 4h-9M14 20H5M15 4L9 20',
  alignLeft: 'M17 10H3M21 6H3M21 14H3M17 18H3',
  alignCenter: 'M21 10H3M21 6H3M21 14H3M21 18H3',
  alignRight: 'M21 10H7M21 6H3M21 14H3M21 18H7',
  image: 'M21 19V5a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2zM8.5 10a1.5 1.5 0 100-3 1.5 1.5 0 000 3zM21 15l-5-5L5 21',
  eyedropper: 'M2 22l1-1h3l9-9M3 21v-3l9-9M15 6l3.4-3.4a2.1 2.1 0 013 3L18 9l.9.9a2.1 2.1 0 010 3L16 15l-1-1 2-2-.9-.9-3 3-.9-.9 2-2-.9-.9-2 2-1-1 2.9-2.9-.9-.9-3.1 3',
  move: 'M5 9l-3 3 3 3M9 5l3-3 3 3M15 19l-3 3-3-3M19 9l3 3-3 3M2 12h20M12 2v20',
};

// ─── Fabric.js Loader ────────────────────────────────────────────────────────
let fabricPromise = null;
const loadFabric = () => {
  if (fabricPromise) return fabricPromise;
  fabricPromise = new Promise((resolve, reject) => {
    if (window.fabric) { resolve(window.fabric); return; }
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/fabric.js/5.3.1/fabric.min.js';
    script.onload = () => resolve(window.fabric);
    script.onerror = reject;
    document.head.appendChild(script);
  });
  return fabricPromise;
};

// ─── Constants ───────────────────────────────────────────────────────────────
const TOOLS = [
  { id: 'filter', label: 'Filters', icon: 'filter' },
  { id: 'adjust', label: 'Adjust', icon: 'sliders' },
  { id: 'text', label: 'Text', icon: 'type' },
  { id: 'crop', label: 'Crop', icon: 'crop' },
  { id: 'layers', label: 'Layers', icon: 'layers' },
  { id: 'transform', label: 'Transform', icon: 'rotate' },
];

const FILTERS = [
  { id: 'original', name: 'Original', css: '' },
  { id: 'vibrant', name: 'Vibrant', css: 'saturate(2) contrast(1.2)' },
  { id: 'warm', name: 'Warm', css: 'sepia(0.4) hue-rotate(-10deg) brightness(1.1)' },
  { id: 'cool', name: 'Cool', css: 'hue-rotate(180deg) saturate(1.3)' },
  { id: 'contrast', name: 'Contrast', css: 'contrast(1.8) brightness(1.1)' },
  { id: 'vintage', name: 'Vintage', css: 'sepia(0.7) contrast(1.2) saturate(1.1)' },
  { id: 'bw', name: 'B&W', css: 'grayscale(1) contrast(1.5)' },
  { id: 'fade', name: 'Fade', css: 'brightness(1.1) contrast(0.8) saturate(0.7)' },
  { id: 'chrome', name: 'Chrome', css: 'saturate(1.4) contrast(1.3) brightness(1.05)' },
  { id: 'noir', name: 'Noir', css: 'grayscale(1) brightness(0.7) contrast(2)' },
];

const FONTS = ['Arial', 'Georgia', 'Courier New', 'Verdana', 'Times New Roman', 'Trebuchet MS', 'Impact', 'Comic Sans MS'];

// ─── Utility: build CSS filter string ────────────────────────────────────────
const buildFilterString = (activeFilter, adj) => {
  const base = activeFilter?.css || '';
  const a = `brightness(${adj.brightness / 100}) contrast(${adj.contrast / 100}) saturate(${adj.saturation / 100}) blur(${adj.blur}px)`;
  return `${base} ${a}`.trim();
};

// ─── Small sub-components ─────────────────────────────────────────────────────
const Slider = ({ label, value, min, max, step = 1, onChange, unit = '' }) => (
  <div className="mb-4">
    <div className="flex justify-between mb-1">
      <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">{label}</span>
      <span className="text-xs text-[#5bf0a5] font-mono">{value}{unit}</span>
    </div>
    <div className="relative h-6 flex items-center">
      <div className="absolute w-full h-1 rounded-full bg-[#333]" />
      <div
        className="absolute h-1 rounded-full bg-gradient-to-r from-[#5bf0a5] to-[#00d4ff]"
        style={{ width: `${((value - min) / (max - min)) * 100}%` }}
      />
      <input
        type="range" min={min} max={max} step={step} value={value}
        onChange={e => onChange(Number(e.target.value))}
        className="absolute w-full h-full opacity-0 cursor-pointer z-10"
        style={{ WebkitAppearance: 'none' }}
      />
      <div
        className="absolute w-4 h-4 rounded-full bg-white shadow-lg border-2 border-[#5bf0a5] pointer-events-none"
        style={{ left: `calc(${((value - min) / (max - min)) * 100}% - 8px)` }}
      />
    </div>
  </div>
);

const FilterThumbnail = ({ filter, imageSrc, isActive, onClick }) => (
  <div
    onClick={onClick}
    className={`cursor-pointer rounded-lg overflow-hidden border-2 transition-all duration-200 ${isActive ? 'border-[#5bf0a5] scale-105' : 'border-transparent hover:border-white/30'}`}
  >
    <div className="aspect-square overflow-hidden bg-[#222]">
      {imageSrc ? (
        <img
          src={imageSrc}
          alt={filter.name}
          className="w-full h-full object-cover"
          style={{ filter: filter.css || 'none' }}
        />
      ) : (
        <div className="w-full h-full bg-gradient-to-br from-[#333] to-[#222]" style={{ filter: filter.css || 'none' }} />
      )}
    </div>
    <div className={`text-center text-xs py-1.5 font-medium ${isActive ? 'text-[#5bf0a5]' : 'text-gray-400'}`}>
      {filter.name}
    </div>
  </div>
);

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
const ImageEditingPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const initialImage = location.state?.image ||
    location.state?.originalImage?.url ||
    location.state?.originalImage?.imageUrl ||
    location.state?.imageUrl;

  // Canvas refs
  const canvasElRef = useRef(null);
  const fabricRef = useRef(null);
  const mainImageRef = useRef(null); // fabric Image object
  const cropRectRef = useRef(null);
  const isDirty = useRef(false);

  // UI State
  const [activeTool, setActiveTool] = useState('filter');
  const [isReady, setIsReady] = useState(false);
  const [imageSrc, setImageSrc] = useState(initialImage || null);
  const [demoMode, setDemoMode] = useState(!initialImage);

  // Layer state (tracks all objects)
  const [layers, setLayers] = useState([]);
  const [selectedLayerId, setSelectedLayerId] = useState(null);

  // Filter/Adjust state
  const [activeFilterId, setActiveFilterId] = useState('original');
  const [adjustments, setAdjustments] = useState({
    brightness: 100, contrast: 100, saturation: 100, blur: 0,
    hue: 0, sharpness: 0, vignette: 0, opacity: 100
  });

  // Text state
  const [textProps, setTextProps] = useState({
    text: 'Your Text Here', color: '#ffffff', size: 48,
    font: 'Arial', bold: false, italic: false, align: 'center',
    stroke: false, strokeColor: '#000000', strokeWidth: 2,
    shadow: false, shadowColor: '#000000', shadowBlur: 5,
    letterSpacing: 0, lineHeight: 1.2,
    bgColor: 'transparent', bgPadding: 10,
  });

  // Transform state
  const [transforms, setTransforms] = useState({
    scaleX: 1, scaleY: 1, rotation: 0,
    flipH: false, flipV: false, skewX: 0, skewY: 0
  });

  // Crop state
  const [isCropping, setIsCropping] = useState(false);
  const [cropAspect, setCropAspect] = useState('free');
  const CROP_ASPECTS = [
    { id: 'free', label: 'Free' },
    { id: '1:1', label: '1:1', w: 1, h: 1 },
    { id: '16:9', label: '16:9', w: 16, h: 9 },
    { id: '4:3', label: '4:3', w: 4, h: 3 },
    { id: '3:2', label: '3:2', w: 3, h: 2 },
    { id: '9:16', label: '9:16', w: 9, h: 16 },
  ];

  // History
  const [history, setHistory] = useState([]);
  const [redoStack, setRedoStack] = useState([]);

  // Selected object props (updates when user selects object on canvas)
  const [selectedObjProps, setSelectedObjProps] = useState(null);

  // ── Init Fabric ──────────────────────────────────────────────────────────────
  useEffect(() => {
    let destroyed = false;
    loadFabric().then(fabric => {
      if (destroyed || !canvasElRef.current) return;

      const container = canvasElRef.current.parentElement;
      const W = container.clientWidth || 800;
      const H = container.clientHeight || 600;

      const fc = new fabric.Canvas(canvasElRef.current, {
        width: W, height: H,
        backgroundColor: '#111',
        preserveObjectStacking: true,
        selection: true,
      });
      fabricRef.current = fc;

      // Selection events
      fc.on('selection:created', e => handleFabricSelection(e.selected?.[0]));
      fc.on('selection:updated', e => handleFabricSelection(e.selected?.[0]));
      fc.on('selection:cleared', () => { setSelectedLayerId(null); setSelectedObjProps(null); });
      fc.on('object:modified', () => { syncLayers(); markDirty(); });
      fc.on('object:added', syncLayers);
      fc.on('object:removed', syncLayers);

      // Load image
      if (imageSrc) {
        loadImageOnCanvas(fabric, fc, imageSrc, W, H);
      } else {
        // Demo: colored rect
        const rect = new fabric.Rect({ left: 100, top: 100, width: 300, height: 200, fill: 'linear-gradient(45deg, #5bf0a5, #00d4ff)', selectable: false });
        fc.add(rect);
        setIsReady(true);
      }
    });
    return () => {
      destroyed = true;
      if (fabricRef.current) { fabricRef.current.dispose(); fabricRef.current = null; }
    };
  }, []);

  const loadImageOnCanvas = useCallback((fabric, fc, src, W, H) => {
    fabric.Image.fromURL(src, (img) => {
      if (!img || !fc) return;
      mainImageRef.current = img;
      const scaleX = W / img.width;
      const scaleY = H / img.height;
      const scale = Math.min(scaleX, scaleY, 1) * 0.9;
      img.set({
        left: W / 2, top: H / 2,
        originX: 'center', originY: 'center',
        scaleX: scale, scaleY: scale,
        selectable: true,
        data: { type: 'image', id: 'main-image', name: 'Background Image' }
      });
      fc.clear();
      fc.backgroundColor = '#111';
      fc.add(img);
      fc.renderAll();
      setIsReady(true);
      syncLayers();
      applyImageFilter(img);
    }, { crossOrigin: 'anonymous' });
  }, []);

  // Reload image when imageSrc changes (after crop etc)
  useEffect(() => {
    if (!fabricRef.current || !imageSrc || !isReady) return;
    const fabric = window.fabric;
    const fc = fabricRef.current;
    const W = fc.width; const H = fc.height;
    // Keep non-image objects
    const nonImageObjects = fc.getObjects().filter(o => o.data?.type !== 'image');
    loadImageOnCanvas(fabric, fc, imageSrc, W, H);
    setTimeout(() => {
      nonImageObjects.forEach(o => fc.add(o));
      fc.renderAll();
      syncLayers();
    }, 100);
  }, [imageSrc]);

  const syncLayers = useCallback(() => {
    if (!fabricRef.current) return;
    const objects = fabricRef.current.getObjects();
    setLayers(objects.map((o, i) => ({
      id: o.data?.id || `obj-${i}`,
      name: o.data?.name || (o.type === 'i-text' ? `Text: ${o.text?.substring(0, 15)}` : o.type === 'image' ? 'Image' : `Shape ${i + 1}`),
      type: o.type,
      visible: !o.data?.hidden,
      locked: o.data?.locked || false,
      object: o,
      index: i,
    })));
  }, []);

  const handleFabricSelection = useCallback((obj) => {
    if (!obj) return;
    const id = obj.data?.id || obj.__uid;
    setSelectedLayerId(id);
    if (obj.type === 'i-text' || obj.type === 'textbox') {
      setSelectedObjProps({ type: 'text', obj });
      setActiveTool('text');
    }
  }, []);

  const markDirty = () => { isDirty.current = true; };

  // ── Apply filter/adjustments to main image ────────────────────────────────
  const applyImageFilter = useCallback((imgObj) => {
    if (!imgObj || !window.fabric) return;
    const fabric = window.fabric;
    imgObj.filters = [];
    const adj = adjustments;
    const activeFilter = FILTERS.find(f => f.id === activeFilterId);
    // Brightness
    if (adj.brightness !== 100) imgObj.filters.push(new fabric.Image.filters.Brightness({ brightness: (adj.brightness - 100) / 100 }));
    // Contrast
    if (adj.contrast !== 100) imgObj.filters.push(new fabric.Image.filters.Contrast({ contrast: (adj.contrast - 100) / 100 }));
    // Saturation
    if (adj.saturation !== 100) imgObj.filters.push(new fabric.Image.filters.Saturation({ saturation: (adj.saturation - 100) / 100 }));
    // Blur
    if (adj.blur > 0) imgObj.filters.push(new fabric.Image.filters.Blur({ blur: adj.blur / 20 }));
    // Hue
    if (adj.hue !== 0) imgObj.filters.push(new fabric.Image.filters.HueRotation({ rotation: adj.hue / 180 * Math.PI }));
    // Filter presets
    if (activeFilter && activeFilter.id !== 'original') {
      switch (activeFilter.id) {
        case 'bw': case 'noir': imgObj.filters.push(new fabric.Image.filters.Grayscale()); break;
        case 'vintage': case 'warm': imgObj.filters.push(new fabric.Image.filters.Sepia()); break;
        default: break;
      }
      if (['vibrant', 'chrome', 'contrast'].includes(activeFilter.id)) imgObj.filters.push(new fabric.Image.filters.Contrast({ contrast: 0.3 }));
      if (['vibrant', 'chrome'].includes(activeFilter.id)) imgObj.filters.push(new fabric.Image.filters.Saturation({ saturation: 0.5 }));
      if (['cool'].includes(activeFilter.id)) imgObj.filters.push(new fabric.Image.filters.HueRotation({ rotation: Math.PI }));
      if (['noir'].includes(activeFilter.id)) { imgObj.filters.push(new fabric.Image.filters.Brightness({ brightness: -0.3 })); imgObj.filters.push(new fabric.Image.filters.Contrast({ contrast: 0.5 })); }
      if (['fade'].includes(activeFilter.id)) { imgObj.filters.push(new fabric.Image.filters.Brightness({ brightness: 0.1 })); imgObj.filters.push(new fabric.Image.filters.Contrast({ contrast: -0.2 })); }
    }
    imgObj.applyFilters();
    if (fabricRef.current) fabricRef.current.renderAll();
  }, [activeFilterId, adjustments]);

  useEffect(() => {
    if (mainImageRef.current) applyImageFilter(mainImageRef.current);
  }, [activeFilterId, adjustments]);

  // ── Apply transforms to main image ──────────────────────────────────────────
  useEffect(() => {
    if (!mainImageRef.current || !fabricRef.current) return;
    const img = mainImageRef.current;
    img.set({
      scaleX: (img._originalScale || img.scaleX) * transforms.scaleX * (transforms.flipH ? -1 : 1),
      scaleY: (img._originalScale || img.scaleY) * transforms.scaleY * (transforms.flipV ? -1 : 1),
      angle: transforms.rotation,
      skewX: transforms.skewX,
      skewY: transforms.skewY,
    });
    fabricRef.current.renderAll();
  }, [transforms]);

  // ── History ──────────────────────────────────────────────────────────────────
  const saveHistory = useCallback(() => {
    if (!fabricRef.current) return;
    const json = fabricRef.current.toJSON(['data']);
    setHistory(prev => [...prev.slice(-49), { json, activeFilterId, adjustments, transforms }]);
    setRedoStack([]);
  }, [activeFilterId, adjustments, transforms]);

  const handleUndo = useCallback(() => {
    if (history.length === 0) return;
    const current = { json: fabricRef.current?.toJSON(['data']), activeFilterId, adjustments, transforms };
    setRedoStack(prev => [...prev, current]);
    const prev = history[history.length - 1];
    setHistory(h => h.slice(0, -1));
    restoreState(prev);
  }, [history, activeFilterId, adjustments, transforms]);

  const handleRedo = useCallback(() => {
    if (redoStack.length === 0) return;
    const current = { json: fabricRef.current?.toJSON(['data']), activeFilterId, adjustments, transforms };
    setHistory(prev => [...prev, current]);
    const next = redoStack[redoStack.length - 1];
    setRedoStack(r => r.slice(0, -1));
    restoreState(next);
  }, [redoStack, activeFilterId, adjustments, transforms]);

  const restoreState = (state) => {
    if (!fabricRef.current || !state) return;
    setActiveFilterId(state.activeFilterId);
    setAdjustments(state.adjustments);
    setTransforms(state.transforms);
    fabricRef.current.loadFromJSON(state.json, () => {
      fabricRef.current.renderAll();
      syncLayers();
      mainImageRef.current = fabricRef.current.getObjects().find(o => o.data?.type === 'image') || null;
      if (mainImageRef.current) applyImageFilter(mainImageRef.current);
    });
  };

  // ── Add Text ─────────────────────────────────────────────────────────────────
  const handleAddText = useCallback(() => {
    if (!fabricRef.current || !window.fabric) return;
    saveHistory();
    const fabric = window.fabric;
    const fc = fabricRef.current;
    const id = `text-${Date.now()}`;
    const t = new fabric.IText(textProps.text, {
      left: fc.width / 2, top: fc.height / 2,
      originX: 'center', originY: 'center',
      fontSize: textProps.size,
      fill: textProps.color,
      fontFamily: textProps.font,
      fontWeight: textProps.bold ? 'bold' : 'normal',
      fontStyle: textProps.italic ? 'italic' : 'normal',
      textAlign: textProps.align,
      charSpacing: textProps.letterSpacing * 10,
      lineHeight: textProps.lineHeight,
      stroke: textProps.stroke ? textProps.strokeColor : null,
      strokeWidth: textProps.stroke ? textProps.strokeWidth : 0,
      shadow: textProps.shadow ? new fabric.Shadow({ color: textProps.shadowColor, blur: textProps.shadowBlur, offsetX: 2, offsetY: 2 }) : null,
      backgroundColor: textProps.bgColor !== 'transparent' ? textProps.bgColor : '',
      padding: textProps.bgColor !== 'transparent' ? textProps.bgPadding : 0,
      data: { type: 'text', id, name: `Text: ${textProps.text.substring(0, 15)}` },
      selectable: true,
      editable: true,
    });
    fc.add(t);
    fc.setActiveObject(t);
    t.enterEditing();
    fc.renderAll();
    syncLayers();
    setActiveTool('text');
  }, [textProps, saveHistory]);

  // ── Update selected text ──────────────────────────────────────────────────
  const updateSelectedText = useCallback((props) => {
    const fc = fabricRef.current;
    if (!fc) return;
    const obj = fc.getActiveObject();
    if (!obj || (obj.type !== 'i-text' && obj.type !== 'textbox')) return;
    const fabric = window.fabric;
    const updates = {};
    if (props.color !== undefined) updates.fill = props.color;
    if (props.size !== undefined) updates.fontSize = props.size;
    if (props.font !== undefined) updates.fontFamily = props.font;
    if (props.bold !== undefined) updates.fontWeight = props.bold ? 'bold' : 'normal';
    if (props.italic !== undefined) updates.fontStyle = props.italic ? 'italic' : 'normal';
    if (props.align !== undefined) updates.textAlign = props.align;
    if (props.letterSpacing !== undefined) updates.charSpacing = props.letterSpacing * 10;
    if (props.lineHeight !== undefined) updates.lineHeight = props.lineHeight;
    if (props.stroke !== undefined || props.strokeColor !== undefined || props.strokeWidth !== undefined) {
      const useStroke = props.stroke !== undefined ? props.stroke : textProps.stroke;
      updates.stroke = useStroke ? (props.strokeColor || textProps.strokeColor) : null;
      updates.strokeWidth = useStroke ? (props.strokeWidth || textProps.strokeWidth) : 0;
    }
    if (props.shadow !== undefined || props.shadowColor !== undefined || props.shadowBlur !== undefined) {
      const useShadow = props.shadow !== undefined ? props.shadow : textProps.shadow;
      updates.shadow = useShadow ? new fabric.Shadow({ color: props.shadowColor || textProps.shadowColor, blur: props.shadowBlur || textProps.shadowBlur, offsetX: 2, offsetY: 2 }) : null;
    }
    if (props.bgColor !== undefined) {
      updates.backgroundColor = props.bgColor !== 'transparent' ? props.bgColor : '';
      updates.padding = props.bgColor !== 'transparent' ? (props.bgPadding || textProps.bgPadding) : 0;
    }
    obj.set(updates);
    fc.renderAll();
    syncLayers();
  }, [textProps]);

  // ── Crop ──────────────────────────────────────────────────────────────────────
  const startCrop = useCallback(() => {
    if (!fabricRef.current || !window.fabric || !mainImageRef.current) return;
    const fabric = window.fabric;
    const fc = fabricRef.current;
    const img = mainImageRef.current;
    const bounds = img.getBoundingRect();
    setIsCropping(true);

    // Create a crop rect
    const aspect = CROP_ASPECTS.find(a => a.id === cropAspect);
    let cW = bounds.width * 0.8;
    let cH = bounds.height * 0.8;
    if (aspect && aspect.w) { cH = cW * (aspect.h / aspect.w); }

    const rect = new fabric.Rect({
      left: bounds.left + bounds.width / 2 - cW / 2,
      top: bounds.top + bounds.height / 2 - cH / 2,
      width: cW, height: cH,
      fill: 'rgba(0,0,0,0.01)',
      stroke: '#5bf0a5', strokeWidth: 2,
      strokeDashArray: [6, 4],
      hasRotatingPoint: false,
      cornerColor: '#5bf0a5',
      cornerSize: 10,
      transparentCorners: false,
      data: { type: 'crop-rect', id: 'crop-rect' }
    });

    // Dim overlay
    const overlay = new fabric.Rect({
      left: 0, top: 0,
      width: fc.width, height: fc.height,
      fill: 'rgba(0,0,0,0.5)',
      selectable: false, evented: false,
      data: { type: 'crop-overlay', id: 'crop-overlay' }
    });

    cropRectRef.current = rect;
    fc.add(overlay);
    fc.add(rect);
    fc.setActiveObject(rect);
    fc.renderAll();
  }, [cropAspect]);

  const applyCrop = useCallback(async () => {
    if (!fabricRef.current || !cropRectRef.current) return;
    saveHistory();
    const fc = fabricRef.current;
    const rect = cropRectRef.current;
    const { left, top, width, height, scaleX = 1, scaleY = 1 } = rect;
    const realW = width * scaleX;
    const realH = height * scaleY;

    // Remove crop UI
    const toRemove = fc.getObjects().filter(o => o.data?.type === 'crop-overlay' || o.data?.type === 'crop-rect');
    toRemove.forEach(o => fc.remove(o));
    cropRectRef.current = null;
    setIsCropping(false);
    fc.renderAll();
    await new Promise(r => setTimeout(r, 30));

    // Export cropped
    const dataUrl = fc.toDataURL({ left, top, width: realW, height: realH, format: 'png', multiplier: 1 });
    setImageSrc(dataUrl);
  }, [saveHistory]);

  const cancelCrop = useCallback(() => {
    if (!fabricRef.current) return;
    const fc = fabricRef.current;
    const toRemove = fc.getObjects().filter(o => o.data?.type === 'crop-overlay' || o.data?.type === 'crop-rect');
    toRemove.forEach(o => fc.remove(o));
    cropRectRef.current = null;
    fc.renderAll();
    setIsCropping(false);
  }, []);

  // ── Layer ops ────────────────────────────────────────────────────────────────
  const moveLayerUp = useCallback((obj) => {
    if (!fabricRef.current) return;
    fabricRef.current.bringForward(obj);
    fabricRef.current.renderAll();
    syncLayers();
  }, [syncLayers]);

  const moveLayerDown = useCallback((obj) => {
    if (!fabricRef.current) return;
    fabricRef.current.sendBackwards(obj);
    fabricRef.current.renderAll();
    syncLayers();
  }, [syncLayers]);

  const deleteLayer = useCallback((obj) => {
    if (!fabricRef.current) return;
    saveHistory();
    fabricRef.current.remove(obj);
    fabricRef.current.renderAll();
    syncLayers();
  }, [syncLayers, saveHistory]);

  const toggleLayerVisibility = useCallback((obj) => {
    if (!fabricRef.current) return;
    obj.set({ visible: !obj.visible, data: { ...obj.data, hidden: obj.visible } });
    fabricRef.current.renderAll();
    syncLayers();
  }, [syncLayers]);

  const selectLayer = useCallback((obj) => {
    if (!fabricRef.current) return;
    fabricRef.current.setActiveObject(obj);
    fabricRef.current.renderAll();
    setSelectedLayerId(obj.data?.id);
  }, []);

  // ── Add shape ────────────────────────────────────────────────────────────────
  const addShape = useCallback((shape) => {
    if (!fabricRef.current || !window.fabric) return;
    saveHistory();
    const fabric = window.fabric;
    const fc = fabricRef.current;
    const id = `shape-${Date.now()}`;
    let obj;
    const commonProps = {
      left: fc.width / 2, top: fc.height / 2,
      originX: 'center', originY: 'center',
      fill: '#5bf0a5', stroke: 'transparent', strokeWidth: 0,
      data: { type: 'shape', id, name: `${shape} Shape` }
    };
    if (shape === 'rect') obj = new fabric.Rect({ ...commonProps, width: 200, height: 120, rx: 8, ry: 8 });
    else if (shape === 'circle') obj = new fabric.Circle({ ...commonProps, radius: 80 });
    else if (shape === 'triangle') obj = new fabric.Triangle({ ...commonProps, width: 160, height: 140 });
    else if (shape === 'line') obj = new fabric.Line([0, 0, 200, 0], { ...commonProps, stroke: '#5bf0a5', fill: 'transparent', strokeWidth: 3 });
    if (obj) { fc.add(obj); fc.setActiveObject(obj); fc.renderAll(); syncLayers(); }
  }, [saveHistory, syncLayers]);

  // ── Upload image as layer ────────────────────────────────────────────────────
  const handleUploadLayer = useCallback((e) => {
    const file = e.target.files?.[0];
    if (!file || !fabricRef.current || !window.fabric) return;
    saveHistory();
    const fabric = window.fabric;
    const reader = new FileReader();
    reader.onload = (ev) => {
      fabric.Image.fromURL(ev.target.result, (img) => {
        const fc = fabricRef.current;
        const id = `img-${Date.now()}`;
        const scale = Math.min(200 / img.width, 200 / img.height);
        img.set({
          left: fc.width / 2, top: fc.height / 2,
          originX: 'center', originY: 'center',
          scaleX: scale, scaleY: scale,
          data: { type: 'image-layer', id, name: file.name }
        });
        fc.add(img);
        fc.setActiveObject(img);
        fc.renderAll();
        syncLayers();
      });
    };
    reader.readAsDataURL(file);
  }, [saveHistory, syncLayers]);

  // ── Export ───────────────────────────────────────────────────────────────────
  const exportCanvas = useCallback((format = 'png') => {
    if (!fabricRef.current) return null;
    // Deselect before export
    fabricRef.current.discardActiveObject();
    fabricRef.current.renderAll();
    return fabricRef.current.toDataURL({ format, quality: 0.95, multiplier: 1 });
  }, []);

  const handleDownload = useCallback(() => {
    const url = exportCanvas('png');
    if (!url) return;
    const a = document.createElement('a');
    a.href = url;
    a.download = `edited-${Date.now()}.png`;
    a.click();
  }, [exportCanvas]);

  const handleDone = useCallback(() => {
    const url = exportCanvas('png');
    navigate('/chat', { state: { editedImage: url, originalImage: initialImage } });
  }, [exportCanvas, navigate, initialImage]);

  // ── Demo image for testing ──────────────────────────────────────────────────
  useEffect(() => {
    if (!imageSrc && isReady) {
      // draw a gradient canvas as placeholder
    }
  }, [isReady, imageSrc]);

  // ── Handle image drop on canvas ───────────────────────────────────────────
  const handleDrop = useCallback((e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file || !file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (ev) => setImageSrc(ev.target.result);
    reader.readAsDataURL(file);
  }, []);

  // ── Keyboard shortcuts ────────────────────────────────────────────────────
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Delete' || e.key === 'Backspace') {
        if (document.activeElement === document.body) {
          const obj = fabricRef.current?.getActiveObject();
          if (obj && obj.type !== 'i-text') { saveHistory(); fabricRef.current.remove(obj); fabricRef.current.renderAll(); syncLayers(); }
        }
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') { e.preventDefault(); handleUndo(); }
      if ((e.ctrlKey || e.metaKey) && e.key === 'y') { e.preventDefault(); handleRedo(); }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [handleUndo, handleRedo, saveHistory, syncLayers]);

  // ── Resize canvas on window resize ───────────────────────────────────────
  useEffect(() => {
    const handleResize = () => {
      const container = canvasElRef.current?.parentElement;
      if (!container || !fabricRef.current) return;
      // Keep aspect ratio
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // ── Render ───────────────────────────────────────────────────────────────────
  const activeFilter = FILTERS.find(f => f.id === activeFilterId);

  return (
    <div
      className="fixed inset-0 flex flex-col z-50 overflow-hidden"
      style={{ background: '#0d0d0d', fontFamily: "'DM Sans', 'Segoe UI', sans-serif", color: '#fff' }}
    >
      {/* ── TOP BAR ─────────────────────────────────────────────────────────── */}
      <div className="h-14 flex items-center justify-between px-5 border-b border-white/10 bg-[#111] shrink-0">
        {/* Left */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center font-bold text-sm text-black" style={{ background: 'linear-gradient(135deg, #5bf0a5, #00d4ff)' }}>
              E
            </div>
            <span className="font-semibold text-sm text-white/90">Image Studio</span>
          </div>
          <div className="w-px h-5 bg-white/10" />
          {/* Undo/Redo */}
          <div className="flex gap-1">
            {[['undo', handleUndo, history.length === 0], ['redo', handleRedo, redoStack.length === 0]].map(([icon, fn, disabled]) => (
              <button
                key={icon}
                onClick={fn}
                disabled={disabled}
                title={icon.charAt(0).toUpperCase() + icon.slice(1)}
                className="w-8 h-8 flex items-center justify-center rounded-md transition-all"
                style={{ color: disabled ? '#444' : '#aaa', background: disabled ? 'transparent' : undefined }}
                onMouseEnter={e => { if (!disabled) e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = disabled ? '#444' : '#fff'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = disabled ? '#444' : '#aaa'; }}
              >
                <Icon d={Icons[icon]} size={14} />
              </button>
            ))}
          </div>
          <div className="w-px h-5 bg-white/10" />
          {/* Add shapes */}
          <div className="flex items-center gap-1">
            <span className="text-xs text-white/30 mr-1">ADD</span>
            {[
              { id: 'rect', label: '▭ Rect' },
              { id: 'circle', label: '○ Circle' },
              { id: 'triangle', label: '△ Tri' },
              { id: 'line', label: '─ Line' },
            ].map(s => (
              <button
                key={s.id}
                onClick={() => addShape(s.id)}
                className="px-2 py-1 text-xs rounded-md text-white/50 transition-all hover:text-white hover:bg-white/10"
              >
                {s.label}
              </button>
            ))}
            {/* Upload layer */}
            <label className="px-2 py-1 text-xs rounded-md text-white/50 transition-all hover:text-white hover:bg-white/10 cursor-pointer">
              🖼 Image
              <input type="file" accept="image/*" className="hidden" onChange={handleUploadLayer} />
            </label>
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleDownload}
            className="flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-medium transition-all"
            style={{ background: 'rgba(255,255,255,0.07)', color: '#ccc', border: '1px solid rgba(255,255,255,0.1)' }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.12)'; e.currentTarget.style.color = '#fff'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.07)'; e.currentTarget.style.color = '#ccc'; }}
          >
            <Icon d={Icons.download} size={13} />
            Download
          </button>
          <button
            onClick={handleDone}
            className="flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-semibold text-black transition-all hover:opacity-90 hover:scale-105"
            style={{ background: 'linear-gradient(135deg, #5bf0a5, #00d4ff)' }}
          >
            <Icon d={Icons.check} size={13} />
            Done
          </button>
          <button
            onClick={() => navigate('/chat')}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-white/30 hover:text-white hover:bg-white/10 transition-all"
          >
            <Icon d={Icons.x} size={15} />
          </button>
        </div>
      </div>

      {/* ── MAIN AREA ────────────────────────────────────────────────────────── */}
      <div className="flex-1 flex min-h-0">
        {/* Left: Tool tabs */}
        <div className="w-16 bg-[#111] border-r border-white/10 flex flex-col items-center py-4 gap-1 shrink-0">
          {TOOLS.map(tool => (
            <button
              key={tool.id}
              onClick={() => setActiveTool(tool.id)}
              title={tool.label}
              className="w-11 h-11 flex flex-col items-center justify-center rounded-xl gap-1 transition-all relative"
              style={{
                background: activeTool === tool.id ? 'rgba(91,240,165,0.1)' : 'transparent',
                color: activeTool === tool.id ? '#5bf0a5' : 'rgba(255,255,255,0.35)',
                border: activeTool === tool.id ? '1px solid rgba(91,240,165,0.3)' : '1px solid transparent',
              }}
              onMouseEnter={e => { if (activeTool !== tool.id) { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = 'rgba(255,255,255,0.7)'; } }}
              onMouseLeave={e => { if (activeTool !== tool.id) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(255,255,255,0.35)'; } }}
            >
              <Icon d={Icons[tool.icon]} size={16} />
              <span style={{ fontSize: '9px', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>{tool.label}</span>
            </button>
          ))}
        </div>

        {/* Canvas Area */}
        <div
          className="flex-1 relative flex items-center justify-center"
          style={{ background: 'radial-gradient(ellipse at 50% 50%, #1a1a1a 0%, #0d0d0d 100%)' }}
          onDrop={handleDrop}
          onDragOver={e => e.preventDefault()}
        >
          {/* Canvas checkerboard bg hint */}
          <div
            className="relative rounded-lg overflow-hidden shadow-2xl"
            style={{
              boxShadow: '0 0 0 1px rgba(255,255,255,0.08), 0 40px 80px rgba(0,0,0,0.6)',
              background: `repeating-conic-gradient(#1c1c1c 0% 25%, #141414 0% 50%) 0 0 / 20px 20px`
            }}
          >
            <canvas ref={canvasElRef} style={{ display: 'block' }} />
          </div>
          {!isReady && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex flex-col items-center gap-3">
                <div className="w-10 h-10 rounded-full border-2 border-[#5bf0a5] border-t-transparent animate-spin" />
                <span className="text-sm text-white/40">Initializing canvas…</span>
              </div>
            </div>
          )}
          {!imageSrc && isReady && (
            <label
              className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer"
              style={{ background: 'rgba(0,0,0,0.5)' }}
            >
              <div className="p-8 rounded-2xl border-2 border-dashed border-white/20 flex flex-col items-center gap-3 hover:border-[#5bf0a5]/60 transition-colors">
                <Icon d={Icons.image} size={36} className="text-white/25" />
                <p className="text-white/50 font-medium">Drop an image or click to upload</p>
                <p className="text-white/25 text-sm">PNG, JPG, WebP supported</p>
              </div>
              <input type="file" accept="image/*" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) { const r = new FileReader(); r.onload = ev => setImageSrc(ev.target.result); r.readAsDataURL(f); } }} />
            </label>
          )}
          {/* Crop action bar */}
          {isCropping && (
            <div
              className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3 px-5 py-3 rounded-2xl"
              style={{ background: 'rgba(10,10,10,0.9)', border: '1px solid rgba(91,240,165,0.3)', backdropFilter: 'blur(12px)' }}
            >
              <span className="text-sm text-white/60">Drag handles to adjust crop</span>
              <div className="w-px h-4 bg-white/15" />
              <button onClick={cancelCrop} className="text-sm text-white/50 hover:text-white transition-colors px-2 py-1 rounded-md hover:bg-white/10">Cancel</button>
              <button
                onClick={applyCrop}
                className="text-sm font-semibold text-black px-4 py-1.5 rounded-lg transition-all hover:opacity-90"
                style={{ background: 'linear-gradient(135deg, #5bf0a5, #00d4ff)' }}
              >
                Apply Crop
              </button>
            </div>
          )}
        </div>

        {/* Right: Panel */}
        <div className="w-72 bg-[#111] border-l border-white/10 flex flex-col shrink-0 overflow-hidden">
          <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: 'thin', scrollbarColor: '#333 transparent' }}>
            {/* ── FILTER PANEL ────────────────────────────────────────────── */}
            {activeTool === 'filter' && (
              <div className="p-4">
                <PanelTitle>Filters</PanelTitle>
                <div className="grid grid-cols-3 gap-2 mb-2">
                  {FILTERS.map(f => (
                    <FilterThumbnail
                      key={f.id}
                      filter={f}
                      imageSrc={imageSrc}
                      isActive={activeFilterId === f.id}
                      onClick={() => { saveHistory(); setActiveFilterId(f.id); }}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* ── ADJUST PANEL ─────────────────────────────────────────────── */}
            {activeTool === 'adjust' && (
              <div className="p-4">
                <PanelTitle>Adjustments</PanelTitle>
                <Slider label="Brightness" value={adjustments.brightness} min={0} max={200} onChange={v => setAdjustments(a => ({ ...a, brightness: v }))} unit="%" />
                <Slider label="Contrast" value={adjustments.contrast} min={0} max={200} onChange={v => setAdjustments(a => ({ ...a, contrast: v }))} unit="%" />
                <Slider label="Saturation" value={adjustments.saturation} min={0} max={200} onChange={v => setAdjustments(a => ({ ...a, saturation: v }))} unit="%" />
                <Slider label="Blur" value={adjustments.blur} min={0} max={20} onChange={v => setAdjustments(a => ({ ...a, blur: v }))} unit="px" />
                <Slider label="Hue Rotation" value={adjustments.hue} min={-180} max={180} onChange={v => setAdjustments(a => ({ ...a, hue: v }))} unit="°" />
                <Slider label="Opacity" value={adjustments.opacity} min={0} max={100} onChange={v => { setAdjustments(a => ({ ...a, opacity: v })); if (mainImageRef.current && fabricRef.current) { mainImageRef.current.set({ opacity: v / 100 }); fabricRef.current.renderAll(); } }} unit="%" />
                <button
                  onClick={() => setAdjustments({ brightness: 100, contrast: 100, saturation: 100, blur: 0, hue: 0, sharpness: 0, vignette: 0, opacity: 100 })}
                  className="w-full py-2 text-sm rounded-lg mt-2 transition-all text-white/40 hover:text-white hover:bg-white/10"
                  style={{ border: '1px solid rgba(255,255,255,0.08)' }}
                >
                  Reset All
                </button>
              </div>
            )}

            {/* ── TEXT PANEL ───────────────────────────────────────────────── */}
            {activeTool === 'text' && (
              <div className="p-4">
                <PanelTitle>Text</PanelTitle>
                <button
                  onClick={handleAddText}
                  className="w-full py-2.5 text-sm font-semibold rounded-xl mb-4 text-black transition-all hover:opacity-90 active:scale-95"
                  style={{ background: 'linear-gradient(135deg, #5bf0a5, #00d4ff)' }}
                >
                  + Add Text Layer
                </button>
                <Divider />
                <SectionLabel>Content</SectionLabel>
                <textarea
                  value={textProps.text}
                  onChange={e => { setTextProps(p => ({ ...p, text: e.target.value })); updateSelectedText({ text: e.target.value }); }}
                  rows={2}
                  className="w-full rounded-lg px-3 py-2 text-sm text-white resize-none mb-3"
                  style={{ background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.1)', outline: 'none' }}
                  placeholder="Enter text…"
                  onFocus={e => { e.target.style.borderColor = 'rgba(91,240,165,0.4)'; }}
                  onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; }}
                />
                <SectionLabel>Font</SectionLabel>
                <select
                  value={textProps.font}
                  onChange={e => { setTextProps(p => ({ ...p, font: e.target.value })); updateSelectedText({ font: e.target.value }); }}
                  className="w-full rounded-lg px-3 py-2 text-sm text-white mb-3 cursor-pointer"
                  style={{ background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.1)', outline: 'none' }}
                >
                  {FONTS.map(f => <option key={f} value={f}>{f}</option>)}
                </select>
                <Slider label="Size" value={textProps.size} min={8} max={200} onChange={v => { setTextProps(p => ({ ...p, size: v })); updateSelectedText({ size: v }); }} unit="px" />
                <Slider label="Letter Spacing" value={textProps.letterSpacing} min={-5} max={20} onChange={v => { setTextProps(p => ({ ...p, letterSpacing: v })); updateSelectedText({ letterSpacing: v }); }} />
                <Slider label="Line Height" value={Math.round(textProps.lineHeight * 10)} min={8} max={30} onChange={v => { const lh = v / 10; setTextProps(p => ({ ...p, lineHeight: lh })); updateSelectedText({ lineHeight: lh }); }} />
                <SectionLabel>Style</SectionLabel>
                <div className="flex gap-2 mb-3">
                  {[
                    { key: 'bold', icon: 'bold', label: 'B', mono: true },
                    { key: 'italic', icon: 'italic', label: 'I', mono: true },
                  ].map(s => (
                    <button
                      key={s.key}
                      onClick={() => { const nv = !textProps[s.key]; setTextProps(p => ({ ...p, [s.key]: nv })); updateSelectedText({ [s.key]: nv }); }}
                      className="flex-1 py-2 rounded-lg text-sm font-semibold transition-all"
                      style={{
                        background: textProps[s.key] ? 'rgba(91,240,165,0.15)' : '#1a1a1a',
                        border: `1px solid ${textProps[s.key] ? 'rgba(91,240,165,0.4)' : 'rgba(255,255,255,0.1)'}`,
                        color: textProps[s.key] ? '#5bf0a5' : '#aaa',
                        fontStyle: s.key === 'italic' ? 'italic' : 'normal',
                        fontWeight: s.key === 'bold' ? 'bold' : 'normal',
                      }}
                    >
                      {s.label}
                    </button>
                  ))}
                  {['left', 'center', 'right'].map(align => (
                    <button
                      key={align}
                      onClick={() => { setTextProps(p => ({ ...p, align })); updateSelectedText({ align }); }}
                      className="flex-1 py-2 rounded-lg transition-all flex items-center justify-center"
                      style={{
                        background: textProps.align === align ? 'rgba(91,240,165,0.15)' : '#1a1a1a',
                        border: `1px solid ${textProps.align === align ? 'rgba(91,240,165,0.4)' : 'rgba(255,255,255,0.1)'}`,
                        color: textProps.align === align ? '#5bf0a5' : '#aaa',
                      }}
                    >
                      <Icon d={Icons[`align${align.charAt(0).toUpperCase() + align.slice(1)}`]} size={13} />
                    </button>
                  ))}
                </div>
                <SectionLabel>Color</SectionLabel>
                <div className="flex items-center gap-2 mb-3">
                  <input
                    type="color" value={textProps.color}
                    onChange={e => { setTextProps(p => ({ ...p, color: e.target.value })); updateSelectedText({ color: e.target.value }); }}
                    className="w-10 h-10 rounded-lg cursor-pointer border-0"
                    style={{ background: 'none', padding: 0 }}
                  />
                  <input
                    type="text" value={textProps.color}
                    onChange={e => { setTextProps(p => ({ ...p, color: e.target.value })); updateSelectedText({ color: e.target.value }); }}
                    className="flex-1 px-3 py-2 rounded-lg text-sm font-mono text-white"
                    style={{ background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.1)', outline: 'none' }}
                  />
                </div>
                {/* Presets */}
                <div className="flex gap-1.5 flex-wrap mb-4">
                  {['#ffffff', '#000000', '#5bf0a5', '#00d4ff', '#ff6b6b', '#ffd93d', '#ff9f43'].map(c => (
                    <button
                      key={c}
                      onClick={() => { setTextProps(p => ({ ...p, color: c })); updateSelectedText({ color: c }); }}
                      className="w-6 h-6 rounded-full border-2 transition-transform hover:scale-110"
                      style={{ background: c, borderColor: textProps.color === c ? '#fff' : 'transparent' }}
                    />
                  ))}
                </div>
                <Divider />
                <SectionLabel>Stroke</SectionLabel>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-white/50">Enable Stroke</span>
                  <Toggle value={textProps.stroke} onChange={v => { setTextProps(p => ({ ...p, stroke: v })); updateSelectedText({ stroke: v }); }} />
                </div>
                {textProps.stroke && (
                  <>
                    <div className="flex items-center gap-2 mb-2">
                      <input type="color" value={textProps.strokeColor} onChange={e => { setTextProps(p => ({ ...p, strokeColor: e.target.value })); updateSelectedText({ strokeColor: e.target.value }); }} className="w-8 h-8 rounded cursor-pointer" style={{ padding: 0, border: 'none' }} />
                      <span className="text-xs text-white/50 flex-1">{textProps.strokeColor}</span>
                    </div>
                    <Slider label="Stroke Width" value={textProps.strokeWidth} min={1} max={20} onChange={v => { setTextProps(p => ({ ...p, strokeWidth: v })); updateSelectedText({ strokeWidth: v }); }} unit="px" />
                  </>
                )}
                <Divider />
                <SectionLabel>Shadow</SectionLabel>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-white/50">Enable Shadow</span>
                  <Toggle value={textProps.shadow} onChange={v => { setTextProps(p => ({ ...p, shadow: v })); updateSelectedText({ shadow: v }); }} />
                </div>
                {textProps.shadow && (
                  <>
                    <div className="flex items-center gap-2 mb-2">
                      <input type="color" value={textProps.shadowColor} onChange={e => { setTextProps(p => ({ ...p, shadowColor: e.target.value })); updateSelectedText({ shadowColor: e.target.value }); }} className="w-8 h-8 rounded cursor-pointer" style={{ padding: 0, border: 'none' }} />
                    </div>
                    <Slider label="Shadow Blur" value={textProps.shadowBlur} min={0} max={30} onChange={v => { setTextProps(p => ({ ...p, shadowBlur: v })); updateSelectedText({ shadowBlur: v }); }} unit="px" />
                  </>
                )}
                <Divider />
                <SectionLabel>Background</SectionLabel>
                <div className="flex items-center gap-2 mb-2">
                  <input type="color" value={textProps.bgColor === 'transparent' ? '#000000' : textProps.bgColor}
                    onChange={e => { setTextProps(p => ({ ...p, bgColor: e.target.value })); updateSelectedText({ bgColor: e.target.value }); }}
                    className="w-8 h-8 rounded cursor-pointer" style={{ padding: 0, border: 'none' }} />
                  <span className="text-xs text-white/50 flex-1">Background Color</span>
                  <button onClick={() => { setTextProps(p => ({ ...p, bgColor: 'transparent' })); updateSelectedText({ bgColor: 'transparent' }); }}
                    className="text-xs px-2 py-1 rounded text-white/40 hover:text-white hover:bg-white/10">Clear</button>
                </div>
              </div>
            )}

            {/* ── CROP PANEL ───────────────────────────────────────────────── */}
            {activeTool === 'crop' && (
              <div className="p-4">
                <PanelTitle>Crop</PanelTitle>
                <SectionLabel>Aspect Ratio</SectionLabel>
                <div className="grid grid-cols-3 gap-2 mb-4">
                  {CROP_ASPECTS.map(a => (
                    <button
                      key={a.id}
                      onClick={() => setCropAspect(a.id)}
                      className="py-2 text-xs rounded-lg font-medium transition-all"
                      style={{
                        background: cropAspect === a.id ? 'rgba(91,240,165,0.15)' : '#1a1a1a',
                        border: `1px solid ${cropAspect === a.id ? 'rgba(91,240,165,0.4)' : 'rgba(255,255,255,0.08)'}`,
                        color: cropAspect === a.id ? '#5bf0a5' : '#aaa',
                      }}
                    >
                      {a.label}
                    </button>
                  ))}
                </div>
                {isCropping ? (
                  <div className="space-y-2">
                    <button onClick={applyCrop} className="w-full py-2.5 text-sm font-semibold rounded-xl text-black transition-all hover:opacity-90" style={{ background: 'linear-gradient(135deg, #5bf0a5, #00d4ff)' }}>
                      ✓ Apply Crop
                    </button>
                    <button onClick={cancelCrop} className="w-full py-2 text-sm rounded-xl text-white/50 hover:text-white transition-all" style={{ border: '1px solid rgba(255,255,255,0.1)', background: '#1a1a1a' }}>
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={startCrop}
                    className="w-full py-2.5 text-sm font-semibold rounded-xl text-black transition-all hover:opacity-90"
                    style={{ background: 'linear-gradient(135deg, #5bf0a5, #00d4ff)' }}
                  >
                    Start Crop
                  </button>
                )}
                <Divider />
                <p className="text-xs text-white/30 leading-relaxed">
                  Click "Start Crop" to show the crop handles. Drag to reposition, drag corners to resize. Click "Apply Crop" to commit.
                </p>
              </div>
            )}

            {/* ── LAYERS PANEL ─────────────────────────────────────────────── */}
            {activeTool === 'layers' && (
              <div className="p-4">
                <PanelTitle>Layers</PanelTitle>
                {layers.length === 0 ? (
                  <p className="text-xs text-white/30 text-center py-6">No layers yet.<br />Add text, shapes, or images.</p>
                ) : (
                  <div className="space-y-1">
                    {[...layers].reverse().map((layer) => (
                      <div
                        key={layer.id}
                        onClick={() => selectLayer(layer.object)}
                        className="flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-all group"
                        style={{
                          background: selectedLayerId === layer.id ? 'rgba(91,240,165,0.1)' : 'rgba(255,255,255,0.03)',
                          border: `1px solid ${selectedLayerId === layer.id ? 'rgba(91,240,165,0.25)' : 'rgba(255,255,255,0.06)'}`,
                        }}
                      >
                        {/* Layer type icon */}
                        <div className="w-7 h-7 rounded-md flex items-center justify-center shrink-0" style={{ background: '#1f1f1f' }}>
                          <Icon d={Icons[layer.type === 'image' ? 'image' : layer.type === 'i-text' ? 'type' : 'layers']} size={12} className={selectedLayerId === layer.id ? 'text-[#5bf0a5]' : 'text-white/40'} />
                        </div>
                        {/* Name */}
                        <span className="flex-1 text-xs truncate" style={{ color: selectedLayerId === layer.id ? '#5bf0a5' : 'rgba(255,255,255,0.6)' }}>
                          {layer.name}
                        </span>
                        {/* Actions */}
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={e => { e.stopPropagation(); toggleLayerVisibility(layer.object); }}
                            className="w-5 h-5 flex items-center justify-center rounded text-white/40 hover:text-white hover:bg-white/10 text-xs"
                            title={layer.visible ? 'Hide' : 'Show'}
                          >
                            {layer.visible !== false ? '👁' : '🙈'}
                          </button>
                          <button onClick={e => { e.stopPropagation(); moveLayerUp(layer.object); }} className="w-5 h-5 flex items-center justify-center rounded text-white/40 hover:text-white hover:bg-white/10 text-xs" title="Move Up">↑</button>
                          <button onClick={e => { e.stopPropagation(); moveLayerDown(layer.object); }} className="w-5 h-5 flex items-center justify-center rounded text-white/40 hover:text-white hover:bg-white/10 text-xs" title="Move Down">↓</button>
                          {layer.type !== 'image' && (
                            <button onClick={e => { e.stopPropagation(); deleteLayer(layer.object); }} className="w-5 h-5 flex items-center justify-center rounded text-red-400/50 hover:text-red-400 hover:bg-red-500/10 text-xs" title="Delete">×</button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                <Divider />
                <p className="text-xs text-white/25">Click a layer to select. Use ↑↓ to reorder. Del key removes selected layer.</p>
              </div>
            )}

            {/* ── TRANSFORM PANEL ──────────────────────────────────────────── */}
            {activeTool === 'transform' && (
              <div className="p-4">
                <PanelTitle>Transform</PanelTitle>
                <SectionLabel>Rotation</SectionLabel>
                <Slider label="Angle" value={transforms.rotation} min={-180} max={180} onChange={v => setTransforms(t => ({ ...t, rotation: v }))} unit="°" />
                <div className="flex gap-2 mb-4">
                  {[0, 90, 180, 270].map(a => (
                    <button key={a} onClick={() => setTransforms(t => ({ ...t, rotation: a }))} className="flex-1 py-1.5 text-xs rounded-lg text-white/50 hover:text-white transition-all" style={{ background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.08)' }}>{a}°</button>
                  ))}
                </div>
                <Divider />
                <SectionLabel>Scale</SectionLabel>
                <Slider label="Scale X" value={Math.round(transforms.scaleX * 100)} min={10} max={300} onChange={v => setTransforms(t => ({ ...t, scaleX: v / 100 }))} unit="%" />
                <Slider label="Scale Y" value={Math.round(transforms.scaleY * 100)} min={10} max={300} onChange={v => setTransforms(t => ({ ...t, scaleY: v / 100 }))} unit="%" />
                <Divider />
                <SectionLabel>Flip</SectionLabel>
                <div className="flex gap-2 mb-4">
                  <button
                    onClick={() => setTransforms(t => ({ ...t, flipH: !t.flipH }))}
                    className="flex-1 py-2 text-sm rounded-lg transition-all"
                    style={{
                      background: transforms.flipH ? 'rgba(91,240,165,0.15)' : '#1a1a1a',
                      border: `1px solid ${transforms.flipH ? 'rgba(91,240,165,0.4)' : 'rgba(255,255,255,0.08)'}`,
                      color: transforms.flipH ? '#5bf0a5' : '#aaa',
                    }}
                  >⟺ Flip H</button>
                  <button
                    onClick={() => setTransforms(t => ({ ...t, flipV: !t.flipV }))}
                    className="flex-1 py-2 text-sm rounded-lg transition-all"
                    style={{
                      background: transforms.flipV ? 'rgba(91,240,165,0.15)' : '#1a1a1a',
                      border: `1px solid ${transforms.flipV ? 'rgba(91,240,165,0.4)' : 'rgba(255,255,255,0.08)'}`,
                      color: transforms.flipV ? '#5bf0a5' : '#aaa',
                    }}
                  >⟻ Flip V</button>
                </div>
                <Divider />
                <SectionLabel>Skew</SectionLabel>
                <Slider label="Skew X" value={transforms.skewX} min={-45} max={45} onChange={v => setTransforms(t => ({ ...t, skewX: v }))} unit="°" />
                <Slider label="Skew Y" value={transforms.skewY} min={-45} max={45} onChange={v => setTransforms(t => ({ ...t, skewY: v }))} unit="°" />
                <Divider />
                <button
                  onClick={() => setTransforms({ scaleX: 1, scaleY: 1, rotation: 0, flipH: false, flipV: false, skewX: 0, skewY: 0 })}
                  className="w-full py-2 text-sm rounded-lg text-white/40 hover:text-white transition-all"
                  style={{ border: '1px solid rgba(255,255,255,0.08)', background: '#1a1a1a' }}
                >
                  Reset Transform
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── STATUS BAR ───────────────────────────────────────────────────────── */}
      <div className="h-7 flex items-center px-5 gap-4 border-t border-white/5 shrink-0" style={{ background: '#0a0a0a' }}>
        <span className="text-xs text-white/20">{isReady ? 'Canvas ready' : 'Loading…'}</span>
        {layers.length > 0 && <span className="text-xs text-white/20">{layers.length} layer{layers.length !== 1 ? 's' : ''}</span>}
        {selectedLayerId && <span className="text-xs" style={{ color: 'rgba(91,240,165,0.5)' }}>1 selected · Del to remove</span>}
        <div className="flex-1" />
        <span className="text-xs text-white/15">Ctrl+Z undo · Ctrl+Y redo · Del remove</span>
      </div>
    </div>
  );
};

// ─── Small helper components ─────────────────────────────────────────────────
const PanelTitle = ({ children }) => (
  <h3 className="text-sm font-semibold text-white mb-4" style={{ letterSpacing: '-0.01em' }}>{children}</h3>
);

const SectionLabel = ({ children }) => (
  <p className="text-xs font-semibold mb-2 mt-1" style={{ color: 'rgba(255,255,255,0.3)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>{children}</p>
);

const Divider = () => <div className="my-4 border-t border-white/[0.06]" />;

const Toggle = ({ value, onChange }) => (
  <button
    onClick={() => onChange(!value)}
    className="relative w-9 h-5 rounded-full transition-all duration-200"
    style={{ background: value ? '#5bf0a5' : 'rgba(255,255,255,0.1)' }}
  >
    <div
      className="absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-md transition-all duration-200"
      style={{ left: value ? '17px' : '2px' }}
    />
  </button>
);

export default ImageEditingPage;
