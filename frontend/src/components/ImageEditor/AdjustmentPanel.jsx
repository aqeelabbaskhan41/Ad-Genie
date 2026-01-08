import React from 'react';

const AdjustmentPanel = ({ adjustments, onUpdateAdjustment }) => {
  return (
    <div className="p-4 space-y-6">
      <h3 className="text-white font-medium mb-4">Adjustments</h3>
      
      <div>
        <div className="flex justify-between mb-2">
           <label className="text-gray-400 text-sm">Brightness</label>
           <span className="text-[#5bf0a5] text-xs">{adjustments.brightness}%</span>
        </div>
        <input 
          type="range" 
          min="0" 
          max="200" 
          value={adjustments.brightness} 
          onChange={(e) => onUpdateAdjustment('brightness', parseInt(e.target.value))}
          className="w-full accent-[#5bf0a5]"
        />
      </div>

      <div>
        <div className="flex justify-between mb-2">
           <label className="text-gray-400 text-sm">Contrast</label>
           <span className="text-[#5bf0a5] text-xs">{adjustments.contrast}%</span>
        </div>
        <input 
          type="range" 
          min="0" 
          max="200" 
          value={adjustments.contrast} 
          onChange={(e) => onUpdateAdjustment('contrast', parseInt(e.target.value))}
          className="w-full accent-[#5bf0a5]"
        />
      </div>

      <div>
        <div className="flex justify-between mb-2">
           <label className="text-gray-400 text-sm">Saturation</label>
           <span className="text-[#5bf0a5] text-xs">{adjustments.saturation}%</span>
        </div>
        <input 
          type="range" 
          min="0" 
          max="200" 
          value={adjustments.saturation} 
          onChange={(e) => onUpdateAdjustment('saturation', parseInt(e.target.value))}
          className="w-full accent-[#5bf0a5]"
        />
      </div>
      
      <button
        onClick={() => {
            onUpdateAdjustment('brightness', 100);
            onUpdateAdjustment('contrast', 100);
            onUpdateAdjustment('saturation', 100);
        }}
        className="text-xs text-gray-500 underline hover:text-white"
      >
        Reset Adjustments
      </button>
    </div>
  );
};

export default AdjustmentPanel;
