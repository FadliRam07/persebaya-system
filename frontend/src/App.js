// frontend/src/App.js
import React, { useState, useEffect, useRef } from 'react';
import api from './utils/api';

// Import Components
import Home from './components/pages/Home';
import News from './components/pages/News';
import Schedule from './components/pages/Schedule';
import Players from './components/pages/Players';
import Events from './components/pages/Events';
import Fans from './components/pages/Fans';
import History from './components/pages/History';
import DarkModeToggle from './components/DarkModeToggle';

const API_URL = 'http://localhost:5000/api';
const IMG_URL = 'http://localhost:5000';
const CLUB_LOGO = "https://upload.wikimedia.org/wikipedia/id/thumb/a/a1/Persebaya_logo.svg/1280px-Persebaya_logo.svg.png";

// Helper: Get position color
const getPositionColor = (position) => {
  const pos = position?.toLowerCase() || '';
  if (pos.includes('goalkeeper') || pos.includes('kiper')) return 'from-red-500 to-red-600';
  if (pos.includes('bek') || pos.includes('defender')) return 'from-blue-500 to-blue-600';
  if (pos.includes('gelandang') || pos.includes('midfielder')) return 'from-green-500 to-green-600';
  if (pos.includes('penyerang') || pos.includes('forward')) return 'from-yellow-500 to-yellow-600';
  return 'from-purple-500 to-purple-600';
};

function App() {
  // ==========================================
  // 1. STATE MANAGEMENT
  // ==========================================
  const [activeTab, setActiveTab] = useState('home');
  const [isAdmin, setIsAdmin] = useState(() => localStorage.getItem('persebaya_admin') === 'true');
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  
  // ✅ DARK MODE STATE
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('persebaya_darkmode');
    return saved ? JSON.parse(saved) : false;
  });
  
  // ✅ MOBILE MENU STATE
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  
  // Data Database
  const [players, setPlayers] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [newsList, setNewsList] = useState([]);
  const [eventsList, setEventsList] = useState([]);
  const [upcomingMatch, setUpcomingMatch] = useState(null);
  
  // Detail Pages
  const [detailPage, setDetailPage] = useState(null);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [selectedNews, setSelectedNews] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedGalleryImage, setSelectedGalleryImage] = useState(null);
  
  // Search & Filters
  const [globalSearch, setGlobalSearch] = useState('');
  const [showGlobalSearch, setShowGlobalSearch] = useState(false);
  const [newsCategory, setNewsCategory] = useState('all');
  
  // Refs
  const searchRef = useRef(null);
  const searchTimeoutRef = useRef(null);

  // ==========================================
  // 2. DARK MODE EFFECT
  // ==========================================
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('persebaya_darkmode', JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  // ==========================================
  // 3. DATA FETCHING
  // ==========================================
  
  useEffect(() => {
    if (activeTab === 'players') fetchPlayers();
    else if (activeTab === 'schedule') fetchSchedule();
    else if (activeTab === 'news') fetchNews();
    else if (activeTab === 'events') fetchEvents();
  }, [activeTab]);

  useEffect(() => {
    fetchNews();
    fetchEvents();
    fetchSchedule();
  }, []);

  const fetchPlayers = async () => { 
    try { setPlayers((await api.get('/players', { timeout: 5000 })).data); } 
    catch (err) { console.error(err); setPlayers([]); } 
  };

  const fetchSchedule = async () => {
    try {
      const res = await api.get('/schedule', { timeout: 5000 });
      const sorted = res.data.sort((a, b) => new Date(a.date) - new Date(b.date));
      setSchedules(sorted);
      
      const upcoming = sorted.find(s => s.status === 'upcoming' || s.status === 'live');
      if (upcoming) {
        setUpcomingMatch({
          competition: "BRI Super League 2025/2026",
          date: formatDateIndo(upcoming.date),
          venue: upcoming.venue,
          time: upcoming.time,
          homeTeam: "Persebaya Surabaya",
          awayTeam: upcoming.opponent,
          status: upcoming.status,
          home_score: upcoming.home_score,
          away_score: upcoming.away_score
        });
      } else {
        const latest = sorted[sorted.length - 1];
        if (latest) {
          setUpcomingMatch({
            competition: "BRI Super League 2025/2026",
            date: formatDateIndo(latest.date),
            venue: latest.venue,
            time: latest.time,
            homeTeam: "PERSEBAYA SURABAYA",
            awayTeam: latest.opponent,
            status: latest.status,
            home_score: latest.home_score,
            away_score: latest.away_score
          });
        }
      }
    } catch (err) { console.error(err); setSchedules([]); }
  };

  const fetchNews = async () => {
    try { setNewsList((await api.get('/news', { timeout: 5000 })).data); } 
    catch (err) { console.error(err); setNewsList([]); } 
  };

  const fetchEvents = async () => {
    try { setEventsList((await api.get('/events', { timeout: 5000 })).data); } 
    catch (err) { console.error(err); setEventsList([]); } 
  };

  const formatDateIndo = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  };

  // ==========================================
  // 4. AUTH & SEARCH HANDLERS
  // ==========================================
  
  const handleLogin = (e) => {
    e.preventDefault();
    if (loginForm.username === 'admin' && loginForm.password === 'admin123') {
      setIsAdmin(true);
      localStorage.setItem('persebaya_admin', 'true');
      setShowLoginModal(false);
      setLoginForm({ username: '', password: '' });
      alert('✅ Login berhasil!');
    } else { 
      alert('❌ Username atau password salah!'); 
    }
  };

  const handleLogout = () => { 
    setIsAdmin(false);
    localStorage.removeItem('persebaya_admin');
    alert('✅ Logout berhasil.');
  };

  const handleSearchFocus = () => { if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current); setShowGlobalSearch(true); };
  const handleSearchBlur = () => { searchTimeoutRef.current = setTimeout(() => setShowGlobalSearch(false), 200); };
  
  const globalSearchResults = () => {
    if (!globalSearch.trim()) return [];
    const q = globalSearch.toLowerCase();
    return [
      ...newsList.filter(n => n.title.toLowerCase().includes(q) || n.excerpt.toLowerCase().includes(q)).map(n => ({ type: 'news', ...n })),
      ...eventsList.filter(e => e.title.toLowerCase().includes(q) || e.description.toLowerCase().includes(q)).map(e => ({ type: 'event', ...e })),
      ...players.filter(p => p.name.toLowerCase().includes(q) || p.position.toLowerCase().includes(q)).map(p => ({ type: 'player', ...p }))
    ];
  };

  const handleSearchItemClick = (result) => {
    if (result.type === 'news') { setSelectedNews(result); setDetailPage('news'); }
    else if (result.type === 'event') { setSelectedEvent(result); setDetailPage('event'); }
    else if (result.type === 'player') { setSelectedPlayer(result); setDetailPage('player'); }
    setGlobalSearch(''); setShowGlobalSearch(false);
  };

  // ==========================================
  // 5. NAVIGATION HANDLERS
  // ==========================================
  
  const goToPlayerDetail = (p) => { setSelectedPlayer(p); setDetailPage('player'); window.scrollTo(0,0); };
  const goToNewsDetail = (n) => { setSelectedNews(n); setDetailPage('news'); window.scrollTo(0,0); };
  const goToEventDetail = (e) => { setSelectedEvent(e); setDetailPage('event'); window.scrollTo(0,0); };
  const goToGalleryDetail = (g) => { setSelectedGalleryImage(g); setDetailPage('gallery'); window.scrollTo(0,0); };
  
  const goBack = () => { 
    setDetailPage(null); 
    setSelectedPlayer(null); 
    setSelectedNews(null); 
    setSelectedEvent(null); 
    setSelectedGalleryImage(null); 
    window.scrollTo(0,0); 
  };
  
  const handleDaftarSekarang = () => window.open('https://www.persebaya.id', '_blank');

  // ==========================================
  // 6. RENDER DETAIL PAGES
  // ==========================================
  
  const renderDetail = () => {
    // PLAYER DETAIL
    if (detailPage === 'player' && selectedPlayer) {
      return (
        <div className={`min-h-screen py-6 sm:py-8 px-3 sm:px-4 ${isDarkMode ? 'bg-gradient-to-br from-gray-900 to-gray-800' : 'bg-gradient-to-br from-gray-50 to-gray-100'}`}>
          <div className="max-w-4xl sm:max-w-6xl mx-auto">
            <button onClick={goBack} className={`flex items-center gap-2 font-bold mb-4 sm:mb-6 hover:underline text-base sm:text-lg group ${isDarkMode ? 'text-green-400' : 'text-persebaya-green'}`}>
              <span className="group-hover:-translate-x-1 transition-transform">←</span> Kembali
            </button>
            <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden`}>
              <div className={`relative h-64 sm:h-96 md:h-[500px] ${isDarkMode ? 'bg-gradient-to-br from-gray-700 to-gray-600' : 'bg-gradient-to-br from-gray-100 to-gray-300'} overflow-hidden`}>
                {selectedPlayer.image ? (
                  <img 
                    src={`${IMG_URL}${selectedPlayer.image}`} 
                    alt={selectedPlayer.name} 
                    className="w-full h-full object-cover object-center"
                  />
                ) : (
                  <div className={`flex items-center justify-center h-full text-6xl sm:text-9xl ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>👤</div>
                )}
                <div className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 md:bottom-10 md:right-10 bg-persebaya-green text-white w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center text-2xl sm:text-4xl md:text-6xl font-bold border-2 sm:border-4 border-white shadow-2xl">
                  {selectedPlayer.jersey_number}
                </div>
              </div>
              
              <div className="p-4 sm:p-6 md:p-12">
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                  <h1 className={`text-2xl sm:text-4xl md:text-6xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{selectedPlayer.name}</h1>
                  <span className={`inline-block bg-gradient-to-r ${getPositionColor(selectedPlayer.position)} text-white px-4 sm:px-6 py-2 sm:py-3 rounded-full font-bold text-sm sm:text-lg shadow-lg`}>
                    {selectedPlayer.position}
                  </span>
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 md:gap-6 mb-6 sm:mb-10">
                  <div className={`${isDarkMode ? 'bg-gradient-to-br from-gray-700 to-gray-600 border-gray-600' : 'bg-gradient-to-br from-white to-gray-50 border-gray-100'} p-3 sm:p-5 rounded-xl sm:rounded-2xl text-center shadow-lg border`}>
                    <div className={`text-[10px] sm:text-xs uppercase font-bold mb-1 sm:mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>Klub</div>
                    <div className="font-bold text-persebaya-green text-sm sm:text-lg">Persebaya</div>
                  </div>
                  <div className={`${isDarkMode ? 'bg-gradient-to-br from-gray-700 to-gray-600 border-gray-600' : 'bg-gradient-to-br from-white to-gray-50 border-gray-100'} p-3 sm:p-5 rounded-xl sm:rounded-2xl text-center shadow-lg border`}>
                    <div className={`text-[10px] sm:text-xs uppercase font-bold mb-1 sm:mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>Status</div>
                    <div className="font-bold text-sm sm:text-lg">Aktif</div>
                  </div>
                  <div className={`${isDarkMode ? 'bg-gradient-to-br from-gray-700 to-gray-600 border-gray-600' : 'bg-gradient-to-br from-white to-gray-50 border-gray-100'} p-3 sm:p-5 rounded-xl sm:rounded-2xl text-center shadow-lg border`}>
                    <div className={`text-[10px] sm:text-xs uppercase font-bold mb-1 sm:mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>Nasionalitas</div>
                    <div className="font-bold text-sm sm:text-lg">{selectedPlayer.nationality || 'Indonesia'}</div>
                  </div>
                  <div className={`${isDarkMode ? 'bg-gradient-to-br from-gray-700 to-gray-600 border-gray-600' : 'bg-gradient-to-br from-white to-gray-50 border-gray-100'} p-3 sm:p-5 rounded-xl sm:rounded-2xl text-center shadow-lg border`}>
                    <div className={`text-[10px] sm:text-xs uppercase font-bold mb-1 sm:mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>Liga</div>
                    <div className="font-bold text-sm sm:text-lg">Liga 1</div>
                  </div>
                </div>
                
                {selectedPlayer.description && (
                  <div className={`${isDarkMode ? 'bg-gradient-to-br from-gray-700 to-gray-600 border-gray-600' : 'bg-gradient-to-br from-gray-50 to-white border-gray-100'} p-4 sm:p-6 md:p-8 rounded-xl sm:rounded-2xl shadow-lg border mb-6 sm:mb-10`}>
                    <h3 className={`text-lg sm:text-xl font-bold mb-3 sm:mb-4 flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                      <span>📝</span> Tentang Pemain
                    </h3>
                    <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'} leading-relaxed text-sm sm:text-lg whitespace-pre-line`}>
                      {selectedPlayer.description}
                    </p>
                  </div>
                )}
                
                {isAdmin && (
                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-6 sm:pt-8 border-t border-gray-200">
                    <button onClick={() => { /* edit logic */ }} className="bg-blue-500 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-bold hover:bg-blue-600 transition shadow-lg flex-1 text-sm sm:text-base">✏️ Edit Pemain</button>
                    <button onClick={() => { /* delete logic */ }} className="bg-red-500 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-bold hover:bg-red-600 transition shadow-lg flex-1 text-sm sm:text-base">🗑️ Hapus</button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      );
    }

    // NEWS DETAIL
    if (detailPage === 'news' && selectedNews) {
      return (
        <div className={`min-h-screen py-6 sm:py-8 px-3 sm:px-4 ${isDarkMode ? 'bg-gradient-to-br from-gray-900 to-gray-800' : 'bg-gradient-to-br from-gray-50 to-gray-100'}`}>
          <div className="max-w-3xl sm:max-w-4xl mx-auto">
            <button onClick={goBack} className={`flex items-center gap-2 font-bold mb-4 sm:mb-6 hover:underline text-base sm:text-lg ${isDarkMode ? 'text-green-400' : 'text-persebaya-green'}`}>← Kembali</button>
            <article className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden`}>
              {selectedNews.image && <img src={`${IMG_URL}${selectedNews.image}`} alt={selectedNews.title} className="w-full h-48 sm:h-64 md:h-80 object-cover" />}
              <div className="p-4 sm:p-6 md:p-12">
                <div className="flex flex-wrap gap-2 sm:gap-3 items-center mb-4 sm:mb-6">
                  <span className="inline-block bg-persebaya-green text-white px-3 sm:px-4 py-1 sm:py-2 rounded-full text-[10px] sm:text-sm font-bold">{selectedNews.category}</span>
                  <span className={`text-[10px] sm:text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{formatDateIndo(selectedNews.date)}</span>
                  <span className={`text-[10px] sm:text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>| Oleh: {selectedNews.author}</span>
                </div>
                <h1 className={`text-xl sm:text-3xl md:text-5xl font-bold mb-4 sm:mb-8 leading-tight ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{selectedNews.title}</h1>
                <div className={`prose max-w-none leading-relaxed text-sm sm:text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  <p className={`font-semibold mb-4 sm:mb-6 text-base sm:text-xl ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>{selectedNews.excerpt}</p>
                  <p>{selectedNews.content}</p>
                </div>
              </div>
            </article>
          </div>
        </div>
      );
    }

    // EVENT DETAIL
    if (detailPage === 'event' && selectedEvent) {
      return (
        <div className={`min-h-screen py-6 sm:py-8 px-3 sm:px-4 ${isDarkMode ? 'bg-gradient-to-br from-gray-900 to-gray-800' : 'bg-gradient-to-br from-gray-50 to-gray-100'}`}>
          <div className="max-w-3xl sm:max-w-4xl mx-auto">
            <button onClick={goBack} className={`flex items-center gap-2 font-bold mb-4 sm:mb-6 hover:underline text-base sm:text-lg ${isDarkMode ? 'text-green-400' : 'text-persebaya-green'}`}>← Kembali</button>
            <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden`}>
              {selectedEvent.image && <img src={`${IMG_URL}${selectedEvent.image}`} alt={selectedEvent.title} className="w-full h-48 sm:h-64 md:h-80 object-cover" />}
              <div className="p-4 sm:p-6 md:p-12">
                <div className="flex flex-col sm:flex-row justify-between items-start gap-3 sm:gap-4 mb-6 sm:mb-8">
                  <h1 className={`text-xl sm:text-3xl md:text-4xl font-bold flex-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{selectedEvent.title}</h1>
                  <span className={`px-4 sm:px-6 py-2 sm:py-3 rounded-full text-[10px] sm:text-sm font-bold whitespace-nowrap ${selectedEvent.status === 'upcoming' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                    {selectedEvent.status === 'upcoming' ? 'Akan Datang' : 'Selesai'}
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-10">
                  <div className={`${isDarkMode ? 'bg-gradient-to-br from-gray-700 to-gray-600' : 'bg-gradient-to-br from-gray-50 to-gray-100'} p-4 sm:p-6 rounded-xl sm:rounded-2xl`}><div className="text-2xl sm:text-3xl mb-2 sm:mb-3">📅</div><div className="font-bold text-sm sm:text-lg">{formatDateIndo(selectedEvent.date)}</div><div className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} text-xs sm:text-sm`}>{selectedEvent.time}</div></div>
                  <div className={`${isDarkMode ? 'bg-gradient-to-br from-gray-700 to-gray-600' : 'bg-gradient-to-br from-gray-50 to-gray-100'} p-4 sm:p-6 rounded-xl sm:rounded-2xl`}><div className="text-2xl sm:text-3xl mb-2 sm:mb-3">📍</div><div className="font-bold text-sm sm:text-lg">{selectedEvent.location}</div></div>
                  <div className={`${isDarkMode ? 'bg-gradient-to-br from-gray-700 to-gray-600' : 'bg-gradient-to-br from-gray-50 to-gray-100'} p-4 sm:p-6 rounded-xl sm:rounded-2xl`}><div className="text-2xl sm:text-3xl mb-2 sm:mb-3">💰</div><div className="font-bold text-persebaya-green text-sm sm:text-lg">{selectedEvent.price}</div></div>
                </div>
                <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'} leading-relaxed text-sm sm:text-lg mb-6 sm:mb-10`}>{selectedEvent.description}</p>
                {selectedEvent.status === 'upcoming' && <button onClick={handleDaftarSekarang} className="w-full sm:w-auto bg-gradient-to-r from-persebaya-green to-persebaya-dark text-white px-6 sm:px-10 py-3 sm:py-5 rounded-xl font-bold text-sm sm:text-xl hover:shadow-2xl transition shadow-lg">Daftar Sekarang →</button>}
              </div>
            </div>
          </div>
        </div>
      );
    }

    // GALLERY DETAIL
    if (detailPage === 'gallery' && selectedGalleryImage) {
      return (
        <div className="min-h-screen bg-black/95 flex items-center justify-center p-3 sm:p-4">
          <div className="max-w-4xl sm:max-w-6xl w-full">
            <button onClick={goBack} className="flex items-center gap-2 text-white font-bold mb-4 sm:mb-6 hover:text-gray-300 text-base sm:text-lg">
              ← Kembali ke Galeri
            </button>
            <div className="bg-gray-900 rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl">
              {selectedGalleryImage.image ? (
                <img 
                  src={`${IMG_URL}${selectedGalleryImage.image}`} 
                  alt={selectedGalleryImage.caption || 'Galeri Bonek'} 
                  className="w-full max-h-[60vh] sm:max-h-[70vh] object-contain"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/800x600?text=Foto+Tidak+Ditemukan';
                    e.target.onerror = null; 
                  }}
                />
              ) : (
                <div className="w-full h-64 sm:h-96 flex items-center justify-center text-gray-500">
                  <div className="text-center">
                    <div className="text-4xl sm:text-6xl mb-4">📷</div>
                    <p>Foto tidak tersedia</p>
                  </div>
                </div>
              )}
              
              <div className="p-6 sm:p-8 text-center text-white text-base sm:text-xl font-semibold">
                {selectedGalleryImage.caption || 'Tanpa keterangan'}
              </div>
            </div>
          </div>
        </div>
      );
    }

    return null;
  };

  // ==========================================
  // 7. RENDER DETAIL OVERLAY
  // ==========================================
  if (detailPage) {
    return (
      <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
        <div className="bg-persebaya-green sticky top-0 z-50 shadow-lg">
          <div className="max-w-7xl mx-auto px-3 sm:px-4 py-2 sm:py-3 flex items-center justify-between">
            <img src={CLUB_LOGO} alt="Persebaya" className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 object-contain bg-white rounded-lg p-1 cursor-pointer" onClick={goBack} />
            <button onClick={goBack} className="text-white font-bold hover:underline text-xs sm:text-sm md:text-base">← Kembali</button>
          </div>
        </div>
        {renderDetail()}
      </div>
    );
  }

  // ==========================================
  // 8. RENDER MAIN UI - RESPONSIVE
  // ==========================================
  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
      {/* TOP BAR - Responsive */}
      <div className="bg-persebaya-green sticky top-0 z-50 shadow-lg">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 py-2 sm:py-3 flex items-center justify-between gap-2 sm:gap-4">
          {/* Logo - Responsive Size */}
          <img 
            src={CLUB_LOGO} 
            alt="Persebaya" 
            className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 lg:h-16 lg:w-16 object-contain bg-white rounded-lg p-0.5 sm:p-1 cursor-pointer flex-shrink-0" 
            onClick={() => { setActiveTab('home'); setShowMobileMenu(false); }} 
          />
          
          {/* Desktop Navigation - Hidden on mobile */}
          <nav className="hidden lg:flex items-center gap-1 sm:gap-2 flex-1 justify-center overflow-x-auto">
            {['home', 'news', 'schedule', 'players', 'events', 'fans', 'history'].map(tab => (
              <button
                key={tab}
                onClick={() => { setActiveTab(tab); setShowMobileMenu(false); }}
                className={`px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 font-semibold uppercase text-[10px] sm:text-xs md:text-sm rounded transition-all whitespace-nowrap flex-shrink-0 ${activeTab === tab ? 'bg-persebaya-dark text-white' : 'text-white hover:bg-persebaya-dark/50'}`}
              >
                {tab === 'home' ? 'HOME' : tab === 'news' ? 'BERITA' : tab === 'schedule' ? 'PERTANDINGAN' : tab === 'players' ? 'TIM' : tab === 'events' ? 'EVENT' : tab === 'fans' ? 'FANS' : 'SEJARAH'}
              </button>
            ))}
          </nav>
          
          {/* Right side - Responsive */}
          <div className="flex items-center gap-1 sm:gap-2 md:gap-3">
            {/* Dark Mode Toggle - Smaller on mobile */}
            <DarkModeToggle isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
            
            {/* Search - Hidden on small mobile */}
            <div className="relative hidden sm:block" ref={searchRef}>
              <input
                type="text"
                placeholder="Cari..."
                value={globalSearch}
                onChange={(e) => setGlobalSearch(e.target.value)}
                onFocus={handleSearchFocus}
                onBlur={handleSearchBlur}
                className="px-2 sm:px-3 py-1 sm:py-1.5 rounded-full border-2 border-white bg-white/10 text-white placeholder-white/70 focus:outline-none focus:bg-white focus:text-gray-800 focus:placeholder-gray-500 w-24 sm:w-32 md:w-48 lg:w-64 transition-all text-xs sm:text-sm"
              />
              {showGlobalSearch && globalSearch.trim() && (
                <div className={`absolute top-full right-0 mt-1 sm:mt-2 w-64 sm:w-72 md:w-80 rounded-lg shadow-xl z-50 max-h-96 overflow-y-auto ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`} onMouseEnter={() => { if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current); }} onMouseLeave={() => { handleSearchBlur(); }}>
                  {globalSearchResults().length > 0 ? globalSearchResults().map((result, idx) => (
                    <div key={idx} className={`p-3 border-b hover:bg-gray-50 cursor-pointer ${isDarkMode ? 'border-gray-700 hover:bg-gray-700' : 'border-gray-200'}`} onClick={() => handleSearchItemClick(result)} onMouseDown={(e) => e.preventDefault()}>
                      <span className="text-xs font-bold text-persebaya-green uppercase">{result.type}</span>
                      <div className={`font-semibold text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{result.title || result.name}</div>
                      <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{result.excerpt || result.description || result.position}</div>
                    </div>
                  )) : <div className={`p-4 text-center text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Tidak ada hasil</div>}
                </div>
              )}
            </div>
            
            {/* Login/Admin Button - Hidden on mobile */}
            {isAdmin ? (
              <button onClick={handleLogout} className="hidden sm:block bg-white text-persebaya-green px-2 sm:px-3 md:px-4 py-1 sm:py-1.5 md:py-2 rounded font-bold text-[10px] sm:text-xs md:text-sm hover:bg-gray-100">ADMIN</button>
            ) : (
              <button onClick={() => setShowLoginModal(true)} className="hidden sm:block bg-white text-persebaya-green px-2 sm:px-3 md:px-4 py-1 sm:py-1.5 md:py-2 rounded font-bold text-[10px] sm:text-xs md:text-sm hover:bg-gray-100">LOGIN</button>
            )}
            
            {/* Mobile Menu Button */}
            <button 
              className="lg:hidden text-white text-xl sm:text-2xl p-1"
              onClick={() => setShowMobileMenu(!showMobileMenu)}
            >
              {showMobileMenu ? '✕' : '☰'}
            </button>
          </div>
        </div>
        
        {/* Mobile Navigation Menu - Show only on mobile when toggled */}
        {showMobileMenu && (
          <div className="lg:hidden bg-persebaya-dark/95 border-t border-white/20">
            <div className="flex flex-wrap gap-1 p-2">
              {['home', 'news', 'schedule', 'players', 'events', 'fans', 'history'].map(tab => (
                <button
                  key={tab}
                  onClick={() => { setActiveTab(tab); setShowMobileMenu(false); }}
                  className={`px-3 sm:px-4 py-2 font-semibold uppercase text-[10px] sm:text-xs rounded whitespace-nowrap flex-shrink-0 ${activeTab === tab ? 'bg-white text-persebaya-green' : 'text-white hover:bg-white/10'}`}
                >
                  {tab === 'home' ? '🏠 HOME' : tab === 'news' ? '📰 BERITA' : tab === 'schedule' ? '📅 JADWAL' : tab === 'players' ? '👥 TIM' : tab === 'events' ? '🎉 EVENT' : tab === 'fans' ? '👥 FANS' : '📜 SEJARAH'}
                </button>
              ))}
            </div>
            {/* Mobile Search */}
            <div className="p-2 border-t border-white/10">
              <input
                type="text"
                placeholder="Cari berita, event, pemain..."
                value={globalSearch}
                onChange={(e) => setGlobalSearch(e.target.value)}
                onFocus={handleSearchFocus}
                onBlur={handleSearchBlur}
                className="w-full px-3 py-2 rounded-lg border-2 border-white bg-white/10 text-white placeholder-white/70 focus:outline-none focus:bg-white focus:text-gray-800 text-xs"
              />
            </div>
            {/* Mobile Auth */}
            <div className="p-2 border-t border-white/10 flex gap-2">
              {isAdmin ? (
                <button onClick={handleLogout} className="flex-1 bg-white text-persebaya-green px-3 py-2 rounded font-bold text-xs">ADMIN</button>
              ) : (
                <button onClick={() => { setShowLoginModal(true); setShowMobileMenu(false); }} className="flex-1 bg-white text-persebaya-green px-3 py-2 rounded font-bold text-xs">LOGIN</button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* MAIN CONTENT - Responsive Layout */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6">
          
          {/* SIDEBAR - Hidden on mobile, visible on lg */}
          <aside className="hidden lg:block lg:col-span-1 space-y-4 sm:space-y-6">
            <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md overflow-hidden`}>
              <div className="bg-persebaya-green text-white px-4 py-3 font-bold text-sm sm:text-lg uppercase">BERITA</div>
              <nav className={`divide-y ${isDarkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
                {['all', 'Persebaya', 'Fans', 'Persebaya Future Lab', 'Persebaya Selamanya'].map(cat => (
                  <button 
                    key={cat} 
                    onClick={() => { setNewsCategory(cat); setActiveTab('news'); }} 
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
            
            {/* Upcoming Match */}
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
            
            <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md p-4 sm:p-5`}>
              <h3 className={`font-bold mb-3 uppercase text-xs sm:text-sm md:text-base ${isDarkMode ? 'text-green-400' : 'text-persebaya-green'}`}>Menu Cepat</h3>
              <div className="space-y-2">
                <button onClick={() => setActiveTab('schedule')} className={`block w-full text-left px-3 py-2 rounded text-xs sm:text-sm ${isDarkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100'}`}>📅 Jadwal Pertandingan</button>
                <button onClick={() => setActiveTab('players')} className={`block w-full text-left px-3 py-2 rounded text-xs sm:text-sm ${isDarkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100'}`}>👥 Skuad Pemain</button>
                <button onClick={() => setActiveTab('events')} className={`block w-full text-left px-3 py-2 rounded text-xs sm:text-sm ${isDarkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100'}`}>🎉 Event & Kegiatan</button>
              </div>
            </div>
          </aside>

          {/* MAIN AREA - Full width on mobile, 3/4 on desktop */}
          <main className="col-span-1 lg:col-span-3 space-y-4 sm:space-y-6">
            {activeTab === 'home' && <Home newsList={newsList} onGoToNews={goToNewsDetail} onGoToPlayers={() => setActiveTab('players')} onGoToSchedule={() => setActiveTab('schedule')} isDarkMode={isDarkMode} />}
            {activeTab === 'news' && <News newsList={newsList} newsCategory={newsCategory} isAdmin={isAdmin} onGoToDetail={goToNewsDetail} isDarkMode={isDarkMode} />}
            {activeTab === 'schedule' && <Schedule schedules={schedules} isAdmin={isAdmin} isDarkMode={isDarkMode} />}
            {activeTab === 'players' && <Players players={players} isAdmin={isAdmin} onGoToDetail={goToPlayerDetail} isDarkMode={isDarkMode} />}
            {activeTab === 'events' && <Events eventsList={eventsList} isAdmin={isAdmin} onGoToDetail={goToEventDetail} isDarkMode={isDarkMode} />}
            {activeTab === 'fans' && <Fans isAdmin={isAdmin} onGoToGallery={goToGalleryDetail} isDarkMode={isDarkMode} />}
            {activeTab === 'history' && <History isAdmin={isAdmin} isDarkMode={isDarkMode} />}
          </main>
        </div>
      </div>

      {/* LOGIN MODAL - Responsive */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-3 sm:p-4" onClick={() => setShowLoginModal(false)}>
          <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 max-w-md w-full shadow-2xl mx-2 sm:mx-4`} onClick={e => e.stopPropagation()}>
            <h2 className={`text-xl sm:text-2xl md:text-3xl font-bold mb-4 sm:mb-6 ${isDarkMode ? 'text-green-400' : 'text-persebaya-green'}`}>🔒 Login Admin</h2>
            <form onSubmit={handleLogin} className="space-y-3 sm:space-y-4">
              <input type="text" placeholder="Username" value={loginForm.username} onChange={e => setLoginForm({...loginForm, username: e.target.value})} required className={`w-full px-3 sm:px-4 py-2 sm:py-3 rounded-xl text-sm sm:text-base ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300'}`} />
              <input type="password" placeholder="Password" value={loginForm.password} onChange={e => setLoginForm({...loginForm, password: e.target.value})} required className={`w-full px-3 sm:px-4 py-2 sm:py-3 rounded-xl text-sm sm:text-base ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300'}`} />
              <button type="submit" className="w-full bg-persebaya-green text-white py-2.5 sm:py-3 md:py-4 rounded-xl font-bold hover:bg-persebaya-dark text-sm sm:text-base shadow-lg">Masuk</button>
            </form>
            <p className={`text-center mt-3 sm:mt-4 text-xs sm:text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Demo: <b>admin</b> / <b>admin123</b></p>
          </div>
        </div>
      )}

      {/* FOOTER - Responsive */}
      <footer className={`${isDarkMode ? 'bg-gray-900' : 'bg-gray-800'} text-white text-center py-4 sm:py-6 mt-8 sm:mt-12`}>
        <p className="font-semibold text-xs sm:text-sm md:text-base px-2">© 2026 Persebaya Surabaya | Sistem Manajemen Klub Terintegrasi</p>
        <p className="text-gray-400 text-[10px] sm:text-xs md:text-sm mt-1 sm:mt-2 px-2">Powered by React + Tailwind CSS + Node.js + MySQL</p>
        <p className="text-gray-400 text-[10px] sm:text-xs md:text-sm mt-1 px-2">Created by Fadli Ramadhan 2026 Project-Akhir</p>
      </footer>
    </div>
  );
}

export default App;