// frontend/src/components/pages/Home.jsx
import React from 'react';
import AIChatBot from '../AIChatBot';

const HERO_SLIDES = [
  { 
    id: 1, 
    title: "PERSEBAYA PANAS, BAJOL IJO MULAI MENGGIGIT", 
    subtitle: "Tim tampil gemilang dan agresif di laga terakhir", 
    img: "https://assets.ileague.id/uploads/images/club/lineup_PERSEBAYA_SURABAYA_1754842142.JPG" 
  },
  { 
    id: 2, 
    title: "SKUAD PERSEBAYA 2025/2026", 
    subtitle: "Siap bertarung di BRI Liga 1", 
    img: "https://beritajatim.com/wp-content/uploads/2025/11/Persebaya-vs-Arema-3_11zon-1024x629.jpg" 
  }
];

const IMG_URL = 'http://localhost:5000';

export default function Home({ newsList, onGoToNews, onGoToPlayers, onGoToSchedule, isDarkMode }) {
  return (
    <>
      {/* Hero Slider - Responsive Height */}
      <div className="relative h-48 sm:h-64 md:h-80 lg:h-96 rounded-xl sm:rounded-2xl overflow-hidden shadow-2xl">
        {HERO_SLIDES.map((slide, idx) => (
          <div 
            key={slide.id} 
            className={`absolute inset-0 transition-opacity duration-500 ${idx === 0 ? 'opacity-100' : 'opacity-0'}`} 
            style={{ backgroundImage: `url(${slide.img})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 md:p-6 text-white">
              <h1 className="text-base sm:text-xl md:text-3xl lg:text-4xl font-bold mb-1 sm:mb-2 uppercase leading-tight">{slide.title}</h1>
              <p className="text-xs sm:text-sm md:text-lg opacity-90">{slide.subtitle}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Latest News Section - Responsive */}
      <div className="flex justify-between items-center mb-3 sm:mb-4 mt-4 sm:mt-6">
        <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-persebaya-green dark:text-green-400 uppercase">Berita Terbaru</h2>
        <button onClick={onGoToNews} className="text-persebaya-green dark:text-green-400 font-bold hover:underline text-xs sm:text-sm md:text-base">
          Lihat Semua →
        </button>
      </div>
      
      {/* News Grid - 1 col mobile, 2 cols desktop */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 md:gap-6 mb-6 sm:mb-8">
        {newsList.slice(0, 2).map(news => (
          <div 
            key={news.id} 
            className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl sm:rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow cursor-pointer`} 
            onClick={() => onGoToNews(news)}
          >
            {news.image && (
              <img src={`${IMG_URL}${news.image}`} alt={news.title} className="w-full h-32 sm:h-40 md:h-48 lg:h-56 object-cover" />
            )}
            <div className="p-3 sm:p-4 md:p-5">
              <span className="inline-block bg-persebaya-green text-white px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-bold mb-2 sm:mb-3">
                {news.category}
              </span>
              <h3 className={`text-sm sm:text-base md:text-lg font-bold mb-1 sm:mb-2 leading-tight ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{news.title}</h3>
              <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} text-xs sm:text-sm`}>{news.excerpt}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Access Cards - Stack on mobile */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 md:gap-6 mb-6 sm:mb-8">
        <div className="bg-gradient-to-br from-persebaya-green to-persebaya-dark text-white rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 text-center shadow-xl">
          <h3 className="text-base sm:text-xl md:text-2xl font-bold mb-1 sm:mb-2">MEET THE TEAM</h3>
          <p className="mb-3 sm:mb-4 text-xs sm:text-sm md:text-base">PERSEBAYA 2025/2026</p>
          <button 
            onClick={onGoToPlayers} 
            className="bg-white text-persebaya-green px-4 sm:px-5 md:px-6 py-2 sm:py-2.5 md:py-3 rounded-xl font-bold hover:bg-gray-100 text-xs sm:text-sm md:text-base shadow-lg w-full sm:w-auto"
          >
            Lihat Skuad
          </button>
        </div>
        <div className="bg-gradient-to-br from-persebaya-dark to-persebaya-green text-white rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 text-center shadow-xl">
          <h3 className="text-base sm:text-xl md:text-2xl font-bold mb-1 sm:mb-2">JADWAL PERTANDINGAN</h3>
          <p className="mb-3 sm:mb-4 text-xs sm:text-sm md:text-base">Pantau setiap laga Persebaya</p>
          <button 
            onClick={onGoToSchedule} 
            className="bg-white text-persebaya-green px-4 sm:px-5 md:px-6 py-2 sm:py-2.5 md:py-3 rounded-xl font-bold hover:bg-gray-100 text-xs sm:text-sm md:text-base shadow-lg w-full sm:w-auto"
          >
            Lihat Jadwal
          </button>
        </div>
      </div>

      {/* AI ChatBot Component */}
      <AIChatBot isDarkMode={isDarkMode} />
    </>
  );
}