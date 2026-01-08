import React from 'react';
import { FaFilter, FaPalette, FaTextHeight, FaExpandArrowsAlt, FaCropAlt } from 'react-icons/fa';

const EditorToolbar = ({ activeTool, setActiveTool }) => {
  const tools = [
    { id: 'filter', icon: <FaFilter size={20} />, label: 'Filters' },
    { id: 'adjust', icon: <FaPalette size={20} />, label: 'Adjust' },
    { id: 'text', icon: <FaTextHeight size={20} />, label: 'Text' },
    { id: 'transform', icon: <FaExpandArrowsAlt size={20} />, label: 'Resize' },
    { id: 'crop', icon: <FaCropAlt size={20} />, label: 'Crop' },
  ];

  return (
    <div style={{ 
      width: '72px', 
      backgroundColor: '#111', 
      borderRight: '1px solid #333',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      paddingTop: '20px',
      gap: '12px'
    }}>
      {tools.map(tool => (
        <button
          key={tool.id}
          onClick={() => setActiveTool(tool.id)}
          style={{ 
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            color: activeTool === tool.id ? '#000' : '#888',
            backgroundColor: activeTool === tool.id ? '#5bf0a5' : 'transparent',
            transition: 'all 0.2s ease'
          }}
          className="hover:text-white"
        >
          {tool.icon}
          <span style={{ fontSize: '10px', marginTop: '2px', fontWeight: '500' }}>
            {tool.label}
          </span>
        </button>
      ))}
    </div>
  );
};

export default EditorToolbar;
