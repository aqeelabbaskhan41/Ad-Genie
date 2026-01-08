import React from 'react';

const FilterPanel = ({ filters, activeFilterId, onApplyFilter }) => {
  return (
    <div className="p-4">
      <h3 className="text-white font-medium mb-4">Filters</h3>
      <div className="grid grid-cols-2 gap-3">
        {filters.map(filter => (
          <button
             key={filter.id}
             onClick={() => onApplyFilter(filter.value)}
             style={{ 
               padding: '12px',
               borderRadius: '8px',
               backgroundColor: activeFilterId === filter.value ? '#333' : '#222',
               border: activeFilterId === filter.value ? '1px solid #5bf0a5' : '1px solid #333',
               color: 'white',
               textAlign: 'left'
             }}
             className="hover:bg-[#333] transition-colors"
          >
             <span className="font-medium text-sm">{filter.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default FilterPanel;
