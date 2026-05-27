// frontend/src/components/Cards/NewsCard.jsx
import React from 'react';

const IMG_URL = 'http://localhost:5000';

export default function NewsCard({ news, isAdmin, onEdit, onDelete, onClick, isDarkMode }) {
  return (
    <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl sm:rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow group`}>
      <div className="relative">
        {news.image && (
          <img src={`${IMG_URL}${news.image}`} alt={news.title} className="w-full h-40 sm:h-48 md:h-56 lg:h-64 object-cover" />
        )}
        {isAdmin && (
          <div className="absolute top-2 sm:top-3 right-2 sm:right-3 flex gap-1 sm:gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button 
              onClick={(e) => { e.stopPropagation(); onEdit(news); }} 
              className="bg-blue-500 text-white p-1.5 sm:p-2 rounded-lg hover:bg-blue-600 shadow-lg text-xs sm:text-sm"
              title="Edit Berita"
            >
              ✏️
            </button>
            <button 
              onClick={(e) => { e.stopPropagation(); onDelete(news.id); }} 
              className="bg-red-500 text-white p-1.5 sm:p-2 rounded-lg hover:bg-red-600 shadow-lg text-xs sm:text-sm"
              title="Hapus Berita"
            >
              🗑️
            </button>
          </div>
        )}
      </div>
      <div className="p-3 sm:p-4 md:p-5 cursor-pointer" onClick={onClick}>
        <div className="flex justify-between items-center mb-2 sm:mb-3">
          <span className="inline-block bg-persebaya-green text-white px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-bold">
            {news.category}
          </span>
          <span className={`text-[10px] sm:text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            {new Date(news.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
          </span>
        </div>
        <h3 className={`text-sm sm:text-base md:text-lg font-bold mb-1 sm:mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'} line-clamp-2`}>{news.title}</h3>
        <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} mb-3 sm:mb-4 text-xs sm:text-sm line-clamp-2`}>{news.excerpt}</p>
        <button className="text-persebaya-green dark:text-green-400 font-bold hover:underline text-xs sm:text-sm">
          Baca Selengkapnya →
        </button>
      </div>
    </div>
  );
}