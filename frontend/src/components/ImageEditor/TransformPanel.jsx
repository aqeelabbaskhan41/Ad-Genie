import React from 'react';
import { 
  FaUndo, FaRedo, FaSearchPlus, FaSearchMinus,FaExpand,
  FaArrowsAltH, FaArrowsAltV 
} from 'react-icons/fa';
import { FaArrowRotateLeft, FaArrowRotateRight } from 'react-icons/fa6';

const TransformPanel = ({ transformations, onUpdateTransform }) => {
  return (
    <div className="p-4 space-y-6">
      <h3 className="text-white font-medium mb-4">Transform</h3>

      {/* Scale */}
      <div>
        <label className="text-gray-400 text-sm mb-2 block">Zoom & Scale</label>
        <div className="flex gap-4 items-center">
           <button onClick={() => onUpdateTransform('scale', Math.max(0.1, transformations.scale - 0.1))} className="p-2 bg-[#222] rounded hover:bg-[#333] text-white"><FaSearchMinus /></button>
           <span className="text-white w-12 text-center">{Math.round(transformations.scale * 100)}%</span>
           <button onClick={() => onUpdateTransform('scale', Math.min(3, transformations.scale + 0.1))} className="p-2 bg-[#222] rounded hover:bg-[#333] text-white"><FaSearchPlus /></button>
           <button onClick={() => onUpdateTransform('scale', 1)} className="p-2 bg-[#222] rounded hover:bg-[#333] text-white ml-2"><FaExpand /></button>
        </div>
      </div>

      {/* Rotation */}
      <div>
        <label className="text-gray-400 text-sm mb-2 block">Rotation</label>
        <div className="flex gap-4">
           <button onClick={() => onUpdateTransform('rotation', (transformations.rotation - 90) % 360)} className="p-2 bg-[#222] rounded hover:bg-[#333] text-white flex-1 flex justify-center"><FaArrowRotateLeft /></button>
           <button onClick={() => onUpdateTransform('rotation', (transformations.rotation + 90) % 360)} className="p-2 bg-[#222] rounded hover:bg-[#333] text-white flex-1 flex justify-center"><FaArrowRotateRight /></button>
        </div>
        <div className="mt-2 text-center">
            <input 
              type="range" 
              min="-180" 
              max="180" 
              value={transformations.rotation} 
              onChange={(e) => onUpdateTransform('rotation', parseInt(e.target.value))}
              className="w-full accent-[#5bf0a5]"
            />
            <div className="text-gray-500 text-xs mt-1">{transformations.rotation}°</div>
        </div>
      </div>

      {/* Flip */}
      <div>
        <label className="text-gray-400 text-sm mb-2 block">Flip</label>
        <div className="flex gap-4">
           <button onClick={() => onUpdateTransform('flipHorizontal', !transformations.flipHorizontal)} className={`p-2 rounded flex-1 flex justify-center ${transformations.flipHorizontal ? 'bg-[#5bf0a5] text-black' : 'bg-[#222] text-white'}`}>
             <FaArrowsAltH /> 
           </button>
           <button onClick={() => onUpdateTransform('flipVertical', !transformations.flipVertical)} className={`p-2 rounded flex-1 flex justify-center ${transformations.flipVertical ? 'bg-[#5bf0a5] text-black' : 'bg-[#222] text-white'}`}>
             <FaArrowsAltV />
           </button>
        </div>
      </div>
      
      {/* Skew */}
      <div>
          <label className="text-gray-400 text-sm mb-2 block">Skew X</label>
          <input 
              type="range" 
              min="-45" 
              max="45" 
              value={transformations.skewX} 
              onChange={(e) => onUpdateTransform('skewX', parseInt(e.target.value))}
              className="w-full accent-[#5bf0a5]"
            />
      </div>
       <div>
          <label className="text-gray-400 text-sm mb-2 block">Skew Y</label>
          <input 
              type="range" 
              min="-45" 
              max="45" 
              value={transformations.skewY} 
              onChange={(e) => onUpdateTransform('skewY', parseInt(e.target.value))}
              className="w-full accent-[#5bf0a5]"
            />
      </div>

    </div>
  );
};

export default TransformPanel;
