// frontend/src/components/Cards/EventCard.jsx
import React from 'react';

const IMG_URL = 'http://localhost:5000';

export default function EventCard({ event, isAdmin, onEdit, onDelete, onClick, isDarkMode }) {
  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('id-ID', { 
      weekday: 'long', 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    });
  };

  return (
    <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl sm:rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow group`}>
      <div className="relative">
        {event.image && (
          <img src={`${IMG_URL}${event.image}`} alt={event.title} className="w-full h-36 sm:h-40 md:h-48 lg:h-56 object-cover" />
        )}
        {isAdmin && (
          <div className="absolute top-2 sm:top-3 right-2 sm:right-3 flex gap-1 sm:gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button 
              onClick={(e) => { e.stopPropagation(); onEdit(event); }} 
              className="bg-blue-500 text-white p-1.5 sm:p-2 rounded-lg hover:bg-blue-600 shadow-lg text-xs sm:text-sm"
            >
              ✏️
            </button>
            <button 
              onClick={(e) => { e.stopPropagation(); onDelete(event.id); }} 
              className="bg-red-500 text-white p-1.5 sm:p-2 rounded-lg hover:bg-red-600 shadow-lg text-xs sm:text-sm"
            >
              🗑️
            </button>
          </div>
        )}
      </div>
      <div className="p-3 sm:p-4 md:p-5">
        <div className="flex justify-between items-start mb-2 sm:mb-3">
          <h3 className={`text-sm sm:text-base md:text-lg font-bold flex-1 ${isDarkMode ? 'text-white' : 'text-gray-900'} line-clamp-2`}>{event.title}</h3>
          <span className={`px-2 sm:px-3 py-1 rounded-full text-[10px] sm:text-xs font-bold ml-2 whitespace-nowrap ${
            event.status === 'upcoming' ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
          }`}>
            {event.status === 'upcoming' ? 'Akan Datang' : 'Selesai'}
          </span>
        </div>
        <div className="space-y-1.5 sm:space-y-2 mb-3 sm:mb-4 text-xs sm:text-sm">
          <div className={`flex items-center gap-1.5 sm:gap-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            <span>📅</span> 
            <span className="truncate">{formatDate(event.date)} | 🕐 {event.time}</span>
          </div>
          <div className={`flex items-center gap-1.5 sm:gap-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            <span>📍</span> 
            <span className="truncate">{event.location}</span>
          </div>
          <div className={`flex items-center gap-1.5 sm:gap-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            <span>💰</span> 
            <span>{event.price}</span>
          </div>
        </div>
        <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} mb-3 sm:mb-4 text-xs sm:text-sm line-clamp-2`}>{event.description}</p>
        <button 
          onClick={onClick} 
          className="w-full bg-persebaya-green text-white py-2 sm:py-2.5 md:py-3 rounded-lg sm:rounded-xl font-bold hover:bg-persebaya-dark text-xs sm:text-sm md:text-base shadow-lg transition-colors"
        >
          Detail Event
        </button>
      </div>
    </div>
  );
}