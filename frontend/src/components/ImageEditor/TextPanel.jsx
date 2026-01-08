import React from 'react';
import { FaBold, FaItalic, FaAlignLeft, FaAlignCenter, FaAlignRight, FaFont } from 'react-icons/fa';

const fonts = [
  { name: 'Inter', value: 'Inter' },
  { name: 'Roboto', value: 'Roboto' },
  { name: 'Lobster', value: 'Lobster' },
  { name: 'Playfair Display', value: 'Playfair Display' },
  { name: 'Montserrat', value: 'Montserrat' },
  { name: 'Open Sans', value: 'Open Sans' },
  { name: 'Oswald', value: 'Oswald' },
];

const TextPanel = ({ 
  selectedTextId, 
  textProperties, 
  onUpdateText, 
  onAddText, 
  onRemoveText,
  isAddingText
}) => {
  
  if (isAddingText) {
      return (
          <div className="p-4 flex flex-col items-center justify-center h-full text-center">
             <div className="animate-pulse text-[#5bf0a5] mb-4 text-4xl">●</div>
             <p className="text-white font-medium mb-2">Click on image</p>
             <p className="text-gray-500 text-sm">Click anywhere on the canvas to place your text.</p>
          </div>
      );
  }

  if (!selectedTextId) {
    return (
      <div className="p-4 flex flex-col items-center justify-center h-full text-center">
         <p className="text-gray-500 mb-4">Select text to edit or click below to add new text</p>
         <button
            onClick={onAddText}
            className="px-4 py-2 bg-[#5bf0a5] text-black rounded-lg font-medium hover:opacity-90 transition-opacity"
         >
            Add Text
         </button>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6">
      <div>
        <h3 className="text-white font-medium mb-4">Edit Text</h3>
        <textarea
           value={textProperties.text}
           onChange={(e) => onUpdateText('text', e.target.value)}
           className="w-full bg-[#222] border border-[#333] rounded-lg p-3 text-white focus:border-[#5bf0a5] outline-none resize-none font-sans"
           placeholder="Type something..."
           rows="3"
        />
      </div>

      <div>
        <label className="text-gray-400 text-sm mb-2 block">Font Family</label>
        <div className="relative">
            <select
                value={textProperties.font}
                onChange={(e) => onUpdateText('font', e.target.value)}
                className="w-full bg-[#222] border border-[#333] rounded-lg p-2 text-white outline-none appearance-none cursor-pointer hover:border-[#5bf0a5]"
            >
                {fonts.map(font => (
                    <option key={font.value} value={font.value} style={{ fontFamily: font.value }}>
                        {font.name}
                    </option>
                ))}
            </select>
            <div className="absolute right-3 top-3 pointer-events-none text-gray-500">
                <FaFont size={12} />
            </div>
        </div>
      </div>

      <div>
        <label className="text-gray-400 text-sm mb-2 block">Font Size (px)</label>
        <div className="flex items-center gap-3">
             <input 
              type="range" 
              min="12" 
              max="200" 
              value={textProperties.size} 
              onChange={(e) => onUpdateText('size', parseInt(e.target.value))}
              className="flex-1 accent-[#5bf0a5]"
            />
            <input 
                type="number" 
                value={textProperties.size}
                onChange={(e) => onUpdateText('size', Math.max(1, parseInt(e.target.value) || 0))}
                className="w-16 bg-[#222] border border-[#333] rounded p-1 text-center text-white text-sm focus:border-[#5bf0a5] outline-none"
            />
        </div>
      </div>

      <div>
        <label className="text-gray-400 text-sm mb-2 block">Color</label>
        <div className="flex gap-2 flex-wrap mb-2">
          {['#ffffff', '#000000', '#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'].map(color => (
            <button
               key={color}
               onClick={() => onUpdateText('color', color)}
               style={{ 
                 width: '24px', 
                 height: '24px', 
                 borderRadius: '4px', 
                 backgroundColor: color,
                 border: textProperties.color === color ? '2px solid white' : '1px solid #444'
               }}
            />
          ))}
        </div>
        <div className="flex items-center gap-2 bg-[#222] border border-[#333] rounded-lg p-2">
            <input 
                type="color" 
                value={textProperties.color} 
                onChange={(e) => onUpdateText('color', e.target.value)}
                className="w-6 h-6 rounded cursor-pointer bg-transparent border-0 p-0"
            />
            <input 
                type="text" 
                value={textProperties.color}
                onChange={(e) => onUpdateText('color', e.target.value)}
                className="bg-transparent text-white text-xs outline-none flex-1 font-mono uppercase"
            />
        </div>
      </div>

      <div className="flex gap-2 p-1 bg-[#222] rounded-lg border border-[#333]">
         <button
            onClick={() => onUpdateText('bold', !textProperties.bold)}
            className={`flex-1 p-2 rounded ${textProperties.bold ? 'bg-[#5bf0a5] text-black' : 'hover:bg-[#333] text-white'}`}
            title="Bold"
         >
           <FaBold className="mx-auto" />
         </button>
         <button
            onClick={() => onUpdateText('italic', !textProperties.italic)}
            className={`flex-1 p-2 rounded ${textProperties.italic ? 'bg-[#5bf0a5] text-black' : 'hover:bg-[#333] text-white'}`}
            title="Italic"
         >
           <FaItalic className="mx-auto" />
         </button>
         <div className="w-[1px] bg-[#444] my-1"></div>
         <button
            onClick={() => onUpdateText('align', 'left')}
            className={`flex-1 p-2 rounded ${textProperties.align === 'left' ? 'bg-[#5bf0a5] text-black' : 'hover:bg-[#333] text-white'}`}
            title="Align Left"
         >
           <FaAlignLeft className="mx-auto" />
         </button>
         <button
            onClick={() => onUpdateText('align', 'center')}
            className={`flex-1 p-2 rounded ${textProperties.align === 'center' ? 'bg-[#5bf0a5] text-black' : 'hover:bg-[#333] text-white'}`}
            title="Align Center"
         >
           <FaAlignCenter className="mx-auto" />
         </button>
         <button
            onClick={() => onUpdateText('align', 'right')}
            className={`flex-1 p-2 rounded ${textProperties.align === 'right' ? 'bg-[#5bf0a5] text-black' : 'hover:bg-[#333] text-white'}`}
             title="Align Right"
         >
           <FaAlignRight className="mx-auto" />
         </button>
      </div>
      
       <button
          onClick={() => onRemoveText(selectedTextId)}
          className="w-full py-2 bg-red-500/10 text-red-500 border border-red-500/20 rounded-lg hover:bg-red-500/20 transition-colors mt-4 text-sm font-medium"
       >
          Remove Text
       </button>
    </div>
  );
};

export default TextPanel;
