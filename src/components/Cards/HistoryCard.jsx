import React from 'react';

export default function HistoryCard({ item, isAdmin, onEdit, onDelete, isDarkMode }) {
  return (
    <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl sm:rounded-2xl shadow-lg overflow-hidden flex flex-col md:flex-row relative group`}>
      {item.image && (
        <img 
          src={item.image} 
          alt={item.title} 
          className="w-full md:w-1/3 h-40 sm:h-48 md:h-auto object-cover" 
          onError={(e) => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/400x300?text=No+Image'; }}
        />
      )}
      <div className="p-4 sm:p-6 md:p-8 flex-1">
        <span className="inline-block bg-persebaya-green text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-full font-bold mb-3 sm:mb-4 text-xs sm:text-sm">
          {item.year}
        </span>
        <h3 className={`text-base sm:text-xl md:text-2xl font-bold mb-2 sm:mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'} line-clamp-2`}>{item.title}</h3>
        <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} text-xs sm:text-sm md:text-base line-clamp-3 sm:line-clamp-none`}>{item.content}</p>
      </div>
      {isAdmin && (
        <div className="absolute top-3 sm:top-4 right-3 sm:right-4 flex gap-1 sm:gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button 
            onClick={() => onEdit(item)} 
            className="bg-blue-500 text-white p-1.5 sm:p-2 rounded-lg hover:bg-blue-600 shadow-lg text-xs sm:text-sm"
          >
            ✏️
          </button>
          <button 
            onClick={() => onDelete(item.id)} 
            className="bg-red-500 text-white p-1.5 sm:p-2 rounded-lg hover:bg-red-600 shadow-lg text-xs sm:text-sm"
          >
            🗑️
          </button>
        </div>
      )}
    </div>
  );
}