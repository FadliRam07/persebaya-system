// frontend/src/components/Layout/Sidebar.jsx
import React from 'react';

export default function Sidebar({ 
  activeTab, 
  onTabChange, 
  newsCategory,
  setNewsCategory,
  upcomingMatch,
  isDarkMode 
}) {
  const newsCategories = ['all', 'Persebaya', 'Fans', 'Persebaya Future Lab', 'Persebaya Selamanya'];

  return (
    <aside className="hidden lg:block lg:col-span-1 space-y-4 sm:space-y-6">
      {/* News Categories */}
      <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md overflow-hidden`}>
        <div className="bg-persebaya-green text-white px-4 py-3 font-bold text-sm sm:text-lg uppercase">BERITA</div>
        <nav className={`divide-y ${isDarkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
          {newsCategories.map(cat => (
            <button
              key={cat}
              onClick={() => { setNewsCategory(cat); onTabChange('news'); }}
              className={`w-full text-left px-4 py-3 font-semibold transition-colors text-xs sm:text-sm md:text-base ${
                newsCategory === cat && activeTab === 'news'
                  ? 'bg-persebaya-green text-white' 
                  : `${isDarkMode ? 'text-gray-300 hover:bg-gray-700' : 'hover:bg-persebaya-green hover:text-white'}`
              }`}
            >
              {cat === 'all' ? 'SEMUA BERITA' : cat.toUpperCase()}
            </button>
          ))}
        </nav>
      </div>

      {/* Upcoming Match Card */}
      {upcomingMatch && (
        <div className="bg-gradient-to-br from-persebaya-green to-persebaya-dark text-white rounded-lg shadow-md p-4 sm:p-5">
          <div className="text-[10px] sm:text-xs md:text-sm opacity-90 mb-1">{upcomingMatch.competition}</div>
          <div className="text-xs sm:text-base md:text-lg font-bold mb-1">{upcomingMatch.date}</div>
          <div className="text-[10px] sm:text-xs md:text-sm opacity-90 mb-3 sm:mb-4">{upcomingMatch.venue}</div>
          
          {upcomingMatch.status === 'completed' && upcomingMatch.home_score !== null && upcomingMatch.away_score !== null ? (
            <div className="bg-white/20 rounded-lg sm:rounded-xl p-3 sm:p-4 backdrop-blur-sm">
              <div className="flex justify-between items-center gap-2">
                <div className="flex-1 text-center">
                  <div className="text-xl sm:text-2xl md:text-3xl mb-1">🟢</div>
                  <div className="text-[10px] sm:text-xs font-bold">{upcomingMatch.homeTeam}</div>
                  <div className="text-xl sm:text-2xl font-bold mt-1">{upcomingMatch.home_score}</div>
                </div>
                <div className="text-center px-2 py-1 bg-white/20 rounded">
                  <div className="text-[10px] sm:text-xs font-bold">FULL TIME</div>
                </div>
                <div className="flex-1 text-center">
                  <div className="text-xl sm:text-2xl md:text-3xl mb-1">🔴</div>
                  <div className="text-[10px] sm:text-xs font-bold">{upcomingMatch.awayTeam}</div>
                  <div className="text-xl sm:text-2xl font-bold mt-1">{upcomingMatch.away_score}</div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex justify-between items-center gap-2">
              <div className="flex-1 text-center">
                <div className="text-xl sm:text-2xl md:text-3xl mb-1">🟢</div>
                <div className="text-[10px] sm:text-xs font-bold">{upcomingMatch.homeTeam}</div>
              </div>
              <div className="text-center px-2 sm:px-3 py-2 bg-white/20 rounded">
                <div className="text-[10px] sm:text-xs font-bold">KICK OFF</div>
                <div className="text-base sm:text-lg font-bold">{upcomingMatch.time}</div>
              </div>
              <div className="flex-1 text-center">
                <div className="text-xl sm:text-2xl md:text-3xl mb-1">🔴</div>
                <div className="text-[10px] sm:text-xs font-bold">{upcomingMatch.awayTeam}</div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Quick Links */}
      <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md p-4 sm:p-5`}>
        <h3 className={`font-bold mb-3 uppercase text-xs sm:text-sm md:text-base ${isDarkMode ? 'text-green-400' : 'text-persebaya-green'}`}>Menu Cepat</h3>
        <div className="space-y-2">
          <button onClick={() => onTabChange('schedule')} className={`block w-full text-left px-3 py-2 rounded text-xs sm:text-sm ${isDarkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100'}`}>📅 Jadwal Pertandingan</button>
          <button onClick={() => onTabChange('players')} className={`block w-full text-left px-3 py-2 rounded text-xs sm:text-sm ${isDarkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100'}`}>👥 Skuad Pemain</button>
          <button onClick={() => onTabChange('events')} className={`block w-full text-left px-3 py-2 rounded text-xs sm:text-sm ${isDarkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100'}`}>🎉 Event & Kegiatan</button>
        </div>
      </div>
    </aside>
  );
}