import React from 'react';

export default function PlayerCard({ player, isAdmin, onEdit, onDelete, onClick, isDarkMode }) {
  return (
    <div 
      className={`group ${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl sm:rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 sm:hover:-translate-y-2 cursor-pointer border ${isDarkMode ? 'border-gray-700' : 'border-gray-100'}`}
      onClick={onClick}
    >
      {/* Photo Container - Responsive Height */}
      <div className={`relative h-64 sm:h-72 md:h-80 ${isDarkMode ? 'bg-gradient-to-b from-gray-700 to-gray-600' : 'bg-gradient-to-b from-gray-50 to-gray-100'} overflow-hidden`}>
        {player.image ? (
          <img 
            src={player.image} 
            alt={player.name}
            className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-500"
            onError={(e) => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/400x500?text=No+Image'; }}
          />
        ) : (
          <div className={`flex items-center justify-center h-full text-6xl sm:text-7xl md:text-8xl ${isDarkMode ? 'text-gray-600' : 'text-gray-300'}`}>
            👤
          </div>
        )}
        
        {/* Jersey Number - Responsive Size */}
        <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 bg-persebaya-green text-white w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center font-bold text-lg sm:text-xl shadow-lg border-2 sm:border-3 border-white group-hover:scale-110 transition-transform">
          {player.jersey_number}
        </div>
        
        {/* Admin Controls - Responsive */}
        {isAdmin && (
          <div 
            className="absolute top-3 left-3 sm:top-4 sm:left-4 flex gap-1 sm:gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-20"
            onClick={e => e.stopPropagation()}
          >
            <button 
              onClick={() => onEdit(player)} 
              className="bg-blue-500 text-white p-1.5 sm:p-2 md:p-3 rounded-lg sm:rounded-xl hover:bg-blue-600 shadow-lg hover:scale-110 transition-all text-xs sm:text-sm"
              title="Edit Pemain"
            >
              ✏️
            </button>
            <button 
              onClick={() => onDelete(player.id)} 
              className="bg-red-500 text-white p-1.5 sm:p-2 md:p-3 rounded-lg sm:rounded-xl hover:bg-red-600 shadow-lg hover:scale-110 transition-all text-xs sm:text-sm"
              title="Hapus Pemain"
            >
              🗑️
            </button>
          </div>
        )}
      </div>

      {/* Player Info - Responsive Padding & Typography */}
      <div className={`p-3 sm:p-4 md:p-5 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <h3 className={`font-bold text-base sm:text-lg md:text-xl mb-1 sm:mb-2 ${isDarkMode ? 'text-white' : 'text-gray-800'} group-hover:text-persebaya-green transition-colors line-clamp-1`}>
          {player.name}
        </h3>
        
        {/* Position */}
        <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} text-xs sm:text-sm mb-2 sm:mb-3`}>
          {player.position}
        </p>

        {/* Nationality (jika ada) */}
        {player.nationality && (
          <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'} text-[10px] sm:text-xs flex items-center gap-1`}>
            <span>🌍</span> {player.nationality}
          </p>
        )}

        {/* Click Hint */}
        <p className={`text-[10px] sm:text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'} mt-2 sm:mt-3 text-center group-hover:text-persebaya-green transition-colors`}>
          Klik untuk lihat detail →
        </p>
      </div>
    </div>
  );
}