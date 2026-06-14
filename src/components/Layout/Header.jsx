// frontend/src/components/Layout/Header.jsx
import React, { useState } from 'react';

const CLUB_LOGO = "https://upload.wikimedia.org/wikipedia/id/thumb/a/a1/Persebaya_logo.svg/1280px-Persebaya_logo.svg.png";

export default function Header({ 
  activeTab, 
  onTabChange, 
  isAdmin, 
  onLogout, 
  onLoginClick,
  globalSearch,
  setGlobalSearch,
  showGlobalSearch,
  setShowGlobalSearch,
  searchResults,
  onSearchItemClick,
  isDarkMode,
  isDarkModeToggle,
  toggleDarkMode
}) {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);

  const tabs = [
    { id: 'home', label: 'HOME', icon: '🏠' },
    { id: 'news', label: 'BERITA', icon: '📰' },
    { id: 'schedule', label: 'PERTANDINGAN', icon: '📅' },
    { id: 'players', label: 'TIM', icon: '👥' },
    { id: 'events', label: 'EVENT', icon: '🎉' },
    { id: 'fans', label: 'FANS', icon: '👥' },
    { id: 'history', label: 'SEJARAH', icon: '📜' }
  ];

  return (
    <>
      {/* Desktop Header */}
      <div className="bg-persebaya-green sticky top-0 z-50 shadow-lg hidden lg:block">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          {/* Logo */}
          <img 
            src={CLUB_LOGO} 
            alt="Persebaya" 
            className="h-12 w-12 md:h-16 md:w-16 object-contain bg-white rounded-lg p-1 cursor-pointer" 
            onClick={() => onTabChange('home')} 
          />
          
          {/* Desktop Navigation */}
          <nav className="flex items-center gap-2 flex-1 justify-center">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`px-3 md:px-4 py-2 font-semibold uppercase text-xs md:text-sm rounded transition-all ${
                  activeTab === tab.id 
                    ? 'bg-persebaya-dark text-white' 
                    : 'text-white hover:bg-persebaya-dark/50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {/* Dark Mode Toggle */}
            {isDarkModeToggle && (
              <button 
                onClick={toggleDarkMode}
                className="flex items-center justify-center w-10 h-8 bg-white/20 rounded-lg hover:bg-white/30 transition"
                title={isDarkMode ? 'Light Mode' : 'Dark Mode'}
              >
                {isDarkMode ? <span className="text-yellow-300 text-xl">☀️</span> : <span className="text-blue-200 text-xl">🌙</span>}
              </button>
            )}
            
            {/* Search Input */}
            <div className="relative">
              <input
                type="text"
                placeholder="Cari berita, event, pemain..."
                value={globalSearch}
                onChange={(e) => setGlobalSearch(e.target.value)}
                onFocus={() => setShowGlobalSearch(true)}
                onBlur={() => setTimeout(() => setShowGlobalSearch(false), 200)}
                className="px-4 py-2 rounded-full border-2 border-white bg-white/10 text-white placeholder-white/70 focus:outline-none focus:bg-white focus:text-gray-800 focus:placeholder-gray-500 w-48 md:w-64 transition-all text-sm"
              />
              {/* Search Results */}
              {showGlobalSearch && globalSearch.trim() && searchResults.length > 0 && (
                <div className={`absolute top-full right-0 mt-2 w-72 md:w-80 rounded-lg shadow-xl z-50 max-h-96 overflow-y-auto ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
                  {searchResults.map((result, idx) => (
                    <div 
                      key={idx} 
                      className={`p-3 border-b hover:bg-gray-50 cursor-pointer ${isDarkMode ? 'border-gray-700 hover:bg-gray-700' : 'border-gray-200'}`}
                      onClick={() => onSearchItemClick(result)}
                    >
                      <span className="text-xs font-bold text-persebaya-green uppercase">{result.type}</span>
                      <div className={`font-semibold text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{result.title || result.name}</div>
                      <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{result.excerpt || result.description || result.position}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Auth Button */}
            {isAdmin ? (
              <button onClick={onLogout} className="bg-white text-persebaya-green px-4 py-2 rounded font-bold text-xs md:text-sm hover:bg-gray-100">ADMIN</button>
            ) : (
              <button onClick={onLoginClick} className="bg-white text-persebaya-green px-4 py-2 rounded font-bold text-xs md:text-sm hover:bg-gray-100">LOGIN</button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Header */}
      <div className="bg-persebaya-green sticky top-0 z-50 shadow-lg lg:hidden">
        <div className="px-3 py-2 flex items-center justify-between">
          {/* Logo */}
          <img 
            src={CLUB_LOGO} 
            alt="Persebaya" 
            className="h-10 w-10 object-contain bg-white rounded-lg p-1 cursor-pointer" 
            onClick={() => onTabChange('home')} 
          />
          
          {/* Right Actions */}
          <div className="flex items-center gap-2">
            {/* Dark Mode */}
            {isDarkModeToggle && (
              <button 
                onClick={toggleDarkMode}
                className="p-2 bg-white/20 rounded-lg"
              >
                {isDarkMode ? <span className="text-yellow-300">☀️</span> : <span className="text-blue-200">🌙</span>}
              </button>
            )}
            {/* Search Toggle */}
            <button 
              onClick={() => setShowMobileSearch(!showMobileSearch)}
              className="p-2 text-white"
            >
              🔍
            </button>
            {/* Menu Toggle */}
            <button 
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="p-2 text-white text-xl"
            >
              {showMobileMenu ? '✕' : '☰'}
            </button>
          </div>
        </div>
        
        {/* Mobile Search Bar */}
        {showMobileSearch && (
          <div className="px-3 pb-3">
            <input
              type="text"
              placeholder="Cari..."
              value={globalSearch}
              onChange={(e) => setGlobalSearch(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border-2 border-white bg-white/10 text-white placeholder-white/70 text-xs"
            />
            {/* Mobile Search Results */}
            {showGlobalSearch && globalSearch.trim() && searchResults.length > 0 && (
              <div className={`mt-2 rounded-lg shadow-xl max-h-64 overflow-y-auto ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
                {searchResults.map((result, idx) => (
                  <div 
                    key={idx} 
                    className={`p-3 border-b cursor-pointer ${isDarkMode ? 'border-gray-700 hover:bg-gray-700' : 'border-gray-200 hover:bg-gray-50'}`}
                    onClick={() => { onSearchItemClick(result); setShowMobileSearch(false); }}
                  >
                    <span className="text-xs font-bold text-persebaya-green uppercase">{result.type}</span>
                    <div className={`font-semibold text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{result.title || result.name}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        
        {/* Mobile Menu */}
        {showMobileMenu && (
          <div className="bg-persebaya-dark/95 border-t border-white/20">
            <div className="grid grid-cols-4 gap-1 p-2">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => { onTabChange(tab.id); setShowMobileMenu(false); }}
                  className={`flex flex-col items-center gap-1 p-2 rounded-lg ${activeTab === tab.id ? 'bg-white text-persebaya-green' : 'text-white hover:bg-white/10'}`}
                >
                  <span className="text-lg">{tab.icon}</span>
                  <span className="text-[10px] font-semibold">{tab.label}</span>
                </button>
              ))}
            </div>
            {/* Mobile Auth */}
            <div className="p-3 border-t border-white/10">
              {isAdmin ? (
                <button onClick={() => { onLogout(); setShowMobileMenu(false); }} className="w-full bg-white text-persebaya-green px-4 py-2 rounded font-bold text-xs">ADMIN</button>
              ) : (
                <button onClick={() => { onLoginClick(); setShowMobileMenu(false); }} className="w-full bg-white text-persebaya-green px-4 py-2 rounded font-bold text-xs">LOGIN</button>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}