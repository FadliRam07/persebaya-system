import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import api from './utils/api';

// Import Components
import Home from './components/pages/Home';
import News from './components/pages/News';
import Schedule from './components/pages/Schedule';
import Players from './components/pages/Players';
import Events from './components/pages/Events';
import Fans from './components/pages/Fans';
import History from './components/pages/History';
import Videos from './components/pages/Videos';
import DarkModeToggle from './components/DarkModeToggle';
import Login from './components/pages/Login';
import Register from './components/pages/Register';
import EditProfile from './components/pages/EditProfile';

const CLUB_LOGO = "https://upload.wikimedia.org/wikipedia/id/thumb/a/a1/Persebaya_logo.svg/1280px-Persebaya_logo.svg.png";

// Helper: Format tanggal Indonesia
const formatDateIndo = (dateStr) => {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('id-ID', { 
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
  });
};

// Helper: Get position color
const getPositionColor = (position) => {
  const pos = position?.toLowerCase() || '';
  if (pos.includes('goalkeeper') || pos.includes('kiper')) return 'from-red-500 to-red-600';
  if (pos.includes('bek') || pos.includes('defender')) return 'from-blue-500 to-blue-600';
  if (pos.includes('gelandang') || pos.includes('midfielder')) return 'from-green-500 to-green-600';
  if (pos.includes('penyerang') || pos.includes('forward')) return 'from-yellow-500 to-yellow-600';
  return 'from-purple-500 to-purple-600';
};

// ==========================================
// 🔐 AUTH & ROUTING WRAPPER
// ==========================================
function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('persebaya_admin') === 'true';
  });
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('persebaya_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('persebaya_darkmode');
    return saved ? JSON.parse(saved) : false;
  });

  useEffect(() => {
    if (isDarkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
    localStorage.setItem('persebaya_darkmode', JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  const handleLogin = (user) => {
    localStorage.setItem('persebaya_admin', 'true');
    localStorage.setItem('persebaya_user', JSON.stringify(user));
    setCurrentUser(user);
    setIsAuthenticated(true);
  };

  const handleRegister = async (userData) => {
    try {
      const { supabase } = await import('./supabaseClient');
      const { data: existing } = await supabase
        .from('users')
        .select('email')
        .eq('email', userData.email)
        .single();
      
      if (existing) {
        return { success: false, error: 'Email sudah terdaftar' };
      }

      const { data, error } = await supabase
        .from('users')
        .insert([{ 
          email: userData.email, 
          password: userData.password,
          name: userData.name,
          role: 'user'
        }])
        .select()
        .single();

      if (error) throw error;
      return { success: true, user: data };
    } catch (err) {
      console.error('Register error:', err);
      return { success: false, error: err.message };
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('persebaya_admin');
    localStorage.removeItem('persebaya_user');
    setCurrentUser(null);
    setIsAuthenticated(false);
  };

  return (
    <Router>
      <Routes>
        <Route path="/login" element={!isAuthenticated ? <Login onLogin={handleLogin} isDarkMode={isDarkMode} /> : <Navigate to="/" replace />} />
        <Route path="/register" element={!isAuthenticated ? <Register onRegister={handleRegister} isDarkMode={isDarkMode} /> : <Navigate to="/" replace />} />
        <Route path="/profile" element={isAuthenticated ? <EditProfile currentUser={currentUser} isDarkMode={isDarkMode} /> : <Navigate to="/login" replace />} />
        <Route path="/videos" element={isAuthenticated ? <Videos isDarkMode={isDarkMode} /> : <Navigate to="/login" replace />} />
        <Route path="/*" element={isAuthenticated ? <MainApp currentUser={currentUser} onLogout={handleLogout} isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} /> : <Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

// ==========================================
// 📱 MAIN APP CONTENT
// ==========================================
function MainApp({ currentUser, onLogout, isDarkMode, setIsDarkMode }) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('home');
  const isAdmin = currentUser?.role === 'admin';
  
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
  
  const searchRef = useRef(null);
  const searchTimeoutRef = useRef(null);
  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  // ==========================================
  // 📡 DATA FETCHING
  // ==========================================
  useEffect(() => {
    if (activeTab === 'players') fetchPlayers();
    else if (activeTab === 'schedule') fetchSchedule();
    else if (activeTab === 'news') fetchNews();
    else if (activeTab === 'events') fetchEvents();
  }, [activeTab]);

  useEffect(() => { fetchNews(); fetchEvents(); fetchSchedule(); }, []);

  const fetchPlayers = async () => { 
    try { 
      const { data } = await api.get('/players', { params: { order: 'jersey_number:asc' } });
      setPlayers(data || []);
    } catch (err) { setPlayers([]); } 
  };
  const fetchSchedule = async () => {
    try {
      const { data } = await api.get('/schedules', { params: { order: 'date:asc' } });
      const sorted = (data || []).sort((a, b) => new Date(a.date) - new Date(b.date));
      setSchedules(sorted);
      const upcoming = sorted.find(s => s.status === 'upcoming' || s.status === 'live');
      if (upcoming) {
        setUpcomingMatch({ competition: "BRI Super League 2025/2026", date: formatDateIndo(upcoming.date), venue: upcoming.venue, time: upcoming.time, homeTeam: "Persebaya Surabaya", awayTeam: upcoming.opponent, status: upcoming.status, home_score: upcoming.home_score, away_score: upcoming.away_score });
      } else {
        const latest = sorted[sorted.length - 1];
        if (latest) setUpcomingMatch({ competition: "BRI Super League 2025/2026", date: formatDateIndo(latest.date), venue: latest.venue, time: latest.time, homeTeam: "PERSEBAYA SURABAYA", awayTeam: latest.opponent, status: latest.status, home_score: latest.home_score, away_score: latest.away_score });
      }
    } catch (err) { setSchedules([]); } 
  };
  const fetchNews = async () => { try { const { data } = await api.get('/news', { params: { order: 'created_at:desc' } }); setNewsList(data || []); } catch (err) { setNewsList([]); } };
  const fetchEvents = async () => { try { const { data } = await api.get('/events', { params: { order: 'date:asc' } }); setEventsList(data || []); } catch (err) { setEventsList([]); } };

  // ==========================================
  // 🔍 SEARCH & NAVIGATION
  // ==========================================
  const handleSearchFocus = () => { if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current); setShowGlobalSearch(true); };
  const handleSearchBlur = () => { searchTimeoutRef.current = setTimeout(() => setShowGlobalSearch(false), 200); };
  
  const globalSearchResults = () => {
    if (!globalSearch.trim()) return [];
    const q = globalSearch.toLowerCase();
    return [
      ...(newsList || []).filter(n => n.title?.toLowerCase().includes(q) || n.excerpt?.toLowerCase().includes(q)).map(n => ({ type: 'news', ...n })),
      ...(eventsList || []).filter(e => e.title?.toLowerCase().includes(q) || e.description?.toLowerCase().includes(q)).map(e => ({ type: 'event', ...e })),
      ...(players || []).filter(p => p.name?.toLowerCase().includes(q) || p.position?.toLowerCase().includes(q)).map(p => ({ type: 'player', ...p }))
    ];
  };

  const handleSearchItemClick = (result) => {
    if (result.type === 'news') { setSelectedNews(result); setDetailPage('news'); }
    else if (result.type === 'event') { setSelectedEvent(result); setDetailPage('event'); }
    else if (result.type === 'player') { setSelectedPlayer(result); setDetailPage('player'); }
    setGlobalSearch(''); setShowGlobalSearch(false);
  };

  const goToPlayerDetail = (p) => { setSelectedPlayer(p); setDetailPage('player'); window.scrollTo(0,0); };
  const goToNewsDetail = (n) => { setSelectedNews(n); setDetailPage('news'); window.scrollTo(0,0); };
  const goToEventDetail = (e) => { setSelectedEvent(e); setDetailPage('event'); window.scrollTo(0,0); };
  const goToGalleryDetail = (g) => { setSelectedGalleryImage(g); setDetailPage('gallery'); window.scrollTo(0,0); };
  const goBack = () => { setDetailPage(null); setSelectedPlayer(null); setSelectedNews(null); setSelectedEvent(null); setSelectedGalleryImage(null); window.scrollTo(0,0); };
  const handleDaftarSekarang = () => window.open('https://www.persebaya.id', '_blank');

  // ==========================================
  // 🖼️ DETAIL PAGES RENDER
  // ==========================================
  const renderDetail = () => {
    if (detailPage === 'player' && selectedPlayer) {
      return (
        <div className={`min-h-screen py-6 sm:py-8 px-3 sm:px-4 ${isDarkMode ? 'bg-gradient-to-br from-gray-900 to-gray-800' : 'bg-gradient-to-br from-gray-50 to-gray-100'}`}>
          <div className="max-w-4xl sm:max-w-6xl mx-auto">
            <button onClick={goBack} className={`flex items-center gap-2 font-bold mb-4 sm:mb-6 hover:underline text-base sm:text-lg group ${isDarkMode ? 'text-green-400' : 'text-persebaya-green'}`}>
              <span className="group-hover:-translate-x-1 transition-transform">←</span> Kembali
            </button>
            <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden`}>
              <div className={`relative h-64 sm:h-96 md:h-[500px] ${isDarkMode ? 'bg-gradient-to-br from-gray-700 to-gray-600' : 'bg-gradient-to-br from-gray-100 to-gray-300'} overflow-hidden`}>
                {selectedPlayer.image ? <img src={selectedPlayer.image} alt={selectedPlayer.name} className="w-full h-full object-cover object-center" onError={(e) => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/800x500?text=No+Image'; }} /> : <div className={`flex items-center justify-center h-full text-6xl sm:text-9xl ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>👤</div>}
                <div className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 md:bottom-10 md:right-10 bg-persebaya-green text-white w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center text-2xl sm:text-4xl md:text-6xl font-bold border-2 sm:border-4 border-white shadow-2xl">{selectedPlayer.jersey_number}</div>
              </div>
              <div className="p-4 sm:p-6 md:p-12">
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                  <h1 className={`text-2xl sm:text-4xl md:text-6xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{selectedPlayer.name}</h1>
                  <span className={`inline-block bg-gradient-to-r ${getPositionColor(selectedPlayer.position)} text-white px-4 sm:px-6 py-2 sm:py-3 rounded-full font-bold text-sm sm:text-lg shadow-lg`}>{selectedPlayer.position}</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 md:gap-6 mb-6 sm:mb-10">
                  <div className={`${isDarkMode ? 'bg-gradient-to-br from-gray-700 to-gray-600 border-gray-600' : 'bg-gradient-to-br from-white to-gray-50 border-gray-100'} p-3 sm:p-5 rounded-xl sm:rounded-2xl text-center shadow-lg border`}><div className={`text-[10px] sm:text-xs uppercase font-bold mb-1 sm:mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>Klub</div><div className="font-bold text-persebaya-green text-sm sm:text-lg">Persebaya</div></div>
                  <div className={`${isDarkMode ? 'bg-gradient-to-br from-gray-700 to-gray-600 border-gray-600' : 'bg-gradient-to-br from-white to-gray-50 border-gray-100'} p-3 sm:p-5 rounded-xl sm:rounded-2xl text-center shadow-lg border`}><div className={`text-[10px] sm:text-xs uppercase font-bold mb-1 sm:mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>Status</div><div className="font-bold text-sm sm:text-lg">Aktif</div></div>
                  <div className={`${isDarkMode ? 'bg-gradient-to-br from-gray-700 to-gray-600 border-gray-600' : 'bg-gradient-to-br from-white to-gray-50 border-gray-100'} p-3 sm:p-5 rounded-xl sm:rounded-2xl text-center shadow-lg border`}><div className={`text-[10px] sm:text-xs uppercase font-bold mb-1 sm:mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>Nasionalitas</div><div className="font-bold text-sm sm:text-lg">{selectedPlayer.nationality || 'Indonesia'}</div></div>
                  <div className={`${isDarkMode ? 'bg-gradient-to-br from-gray-700 to-gray-600 border-gray-600' : 'bg-gradient-to-br from-white to-gray-50 border-gray-100'} p-3 sm:p-5 rounded-xl sm:rounded-2xl text-center shadow-lg border`}><div className={`text-[10px] sm:text-xs uppercase font-bold mb-1 sm:mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>Liga</div><div className="font-bold text-sm sm:text-lg">Liga 1</div></div>
                </div>
                {selectedPlayer.description && (<div className={`${isDarkMode ? 'bg-gradient-to-br from-gray-700 to-gray-600 border-gray-600' : 'bg-gradient-to-br from-gray-50 to-white border-gray-100'} p-4 sm:p-6 md:p-8 rounded-xl sm:rounded-2xl shadow-lg border mb-6 sm:mb-10`}><h3 className={`text-lg sm:text-xl font-bold mb-3 sm:mb-4 flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>📝 Tentang Pemain</h3><p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'} leading-relaxed text-sm sm:text-lg whitespace-pre-line`}>{selectedPlayer.description}</p></div>)}
              </div>
            </div>
          </div>
        </div>
      );
    }
    if (detailPage === 'news' && selectedNews) {
      return (
        <div className={`min-h-screen py-6 sm:py-8 px-3 sm:px-4 ${isDarkMode ? 'bg-gradient-to-br from-gray-900 to-gray-800' : 'bg-gradient-to-br from-gray-50 to-gray-100'}`}>
          <div className="max-w-3xl sm:max-w-4xl mx-auto">
            <button onClick={goBack} className={`flex items-center gap-2 font-bold mb-4 sm:mb-6 hover:underline text-base sm:text-lg ${isDarkMode ? 'text-green-400' : 'text-persebaya-green'}`}>← Kembali</button>
            <article className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden`}>
              {selectedNews.image && <img src={selectedNews.image} alt={selectedNews.title} className="w-full h-48 sm:h-64 md:h-80 object-cover" onError={(e) => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/800x400?text=No+Image'; }} />}
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
    if (detailPage === 'event' && selectedEvent) {
      return (
        <div className={`min-h-screen py-6 sm:py-8 px-3 sm:px-4 ${isDarkMode ? 'bg-gradient-to-br from-gray-900 to-gray-800' : 'bg-gradient-to-br from-gray-50 to-gray-100'}`}>
          <div className="max-w-3xl sm:max-w-4xl mx-auto">
            <button onClick={goBack} className={`flex items-center gap-2 font-bold mb-4 sm:mb-6 hover:underline text-base sm:text-lg ${isDarkMode ? 'text-green-400' : 'text-persebaya-green'}`}>← Kembali</button>
            <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden`}>
              {selectedEvent.image && <img src={selectedEvent.image} alt={selectedEvent.title} className="w-full h-48 sm:h-64 md:h-80 object-cover" onError={(e) => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/800x400?text=No+Image'; }} />}
              <div className="p-4 sm:p-6 md:p-12">
                <div className="flex flex-col sm:flex-row justify-between items-start gap-3 sm:gap-4 mb-6 sm:mb-8">
                  <h1 className={`text-xl sm:text-3xl md:text-4xl font-bold flex-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{selectedEvent.title}</h1>
                  <span className={`px-4 sm:px-6 py-2 sm:py-3 rounded-full text-[10px] sm:text-sm font-bold whitespace-nowrap ${selectedEvent.status === 'upcoming' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>{selectedEvent.status === 'upcoming' ? 'Akan Datang' : 'Selesai'}</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-10">
                  <div className={`${isDarkMode ? 'bg-gradient-to-br from-gray-700 to-gray-600' : 'bg-gradient-to-br from-gray-50 to-gray-100'} p-4 sm:p-6 rounded-xl sm:rounded-2xl`}><div className="text-2xl sm:text-3xl mb-2 sm:mb-3">📅</div><div className="font-bold text-sm sm:text-lg">{formatDateIndo(selectedEvent.date)}</div><div className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} text-xs sm:text-sm`}>{selectedEvent.time}</div></div>
                  <div className={`${isDarkMode ? 'bg-gradient-to-br from-gray-700 to-gray-600' : 'bg-gradient-to-br from-gray-50 to-gray-100'} p-4 sm:p-6 rounded-xl sm:rounded-2xl`}><div className="text-2xl sm:text-3xl mb-2 sm:mb-3">📍</div><div className="font-bold text-sm sm:text-lg">{selectedEvent.location}</div></div>
                  <div className={`${isDarkMode ? 'bg-gradient-to-br from-gray-700 to-gray-600' : 'bg-gradient-to-br from-gray-50 to-gray-100'} p-4 sm:p-6 rounded-xl sm:rounded-2xl`}><div className="text-2xl sm:text-3xl mb-2 sm:mb-3"></div><div className="font-bold text-persebaya-green text-sm sm:text-lg">{selectedEvent.price}</div></div>
                </div>
                <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'} leading-relaxed text-sm sm:text-lg mb-6 sm:mb-10`}>{selectedEvent.description}</p>
                {selectedEvent.status === 'upcoming' && <button onClick={handleDaftarSekarang} className="w-full sm:w-auto bg-gradient-to-r from-persebaya-green to-persebaya-dark text-white px-6 sm:px-10 py-3 sm:py-5 rounded-xl font-bold text-sm sm:text-xl hover:shadow-2xl transition shadow-lg">Daftar Sekarang →</button>}
              </div>
            </div>
          </div>
        </div>
      );
    }
    if (detailPage === 'gallery' && selectedGalleryImage) {
      return (
        <div className="min-h-screen bg-black/95 flex items-center justify-center p-3 sm:p-4">
          <div className="max-w-4xl sm:max-w-6xl w-full">
            <button onClick={goBack} className="flex items-center gap-2 text-white font-bold mb-4 sm:mb-6 hover:text-gray-300 text-base sm:text-lg">← Kembali ke Galeri</button>
            <div className="bg-gray-900 rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl">
              {selectedGalleryImage.image ? <img src={selectedGalleryImage.image} alt={selectedGalleryImage.caption || 'Galeri Bonek'} className="w-full max-h-[60vh] sm:max-h-[70vh] object-contain" onError={(e) => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/800x600?text=Foto+Tidak+Ditemukan'; }} /> : <div className="w-full h-64 sm:h-96 flex items-center justify-center text-gray-500"><div className="text-center"><div className="text-4xl sm:text-6xl mb-4">📷</div><p>Foto tidak tersedia</p></div></div>}
              <div className="p-6 sm:p-8 text-center text-white text-base sm:text-xl font-semibold">{selectedGalleryImage.caption || 'Tanpa keterangan'}</div>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  // ==========================================
  // 🎨 MAIN UI RENDER
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

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
      {/* TOP BAR - NAVIGATION IMPROVED */}
      <div className="bg-persebaya-green sticky top-0 z-50 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <img 
              src={CLUB_LOGO} 
              alt="Persebaya" 
              className="h-11 w-11 sm:h-12 sm:w-12 md:h-14 md:w-14 object-contain bg-white rounded-lg p-1 cursor-pointer shadow-sm hover:shadow-md transition" 
              onClick={() => setActiveTab('home')} 
            />
            
            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1.5 sm:gap-2 flex-1 justify-center overflow-hidden px-3">
              {['home', 'news', 'schedule', 'players', 'videos', 'events', 'fans', 'history'].map(tab => (
                <button 
                  key={tab} 
                  onClick={() => setActiveTab(tab)} 
                  className={`px-3 sm:px-4 md:px-4 py-2 font-semibold uppercase text-xs sm:text-sm rounded-lg transition-all whitespace-nowrap flex-shrink-0 ${activeTab === tab ? 'bg-persebaya-dark text-white shadow-md' : 'text-white/90 hover:bg-white/20 hover:text-white'}`}
                >
                  {tab === 'home' ? 'HOME' : tab === 'news' ? 'BERITA' : tab === 'schedule' ? 'PERTANDINGAN' : tab === 'players' ? 'TIM' : tab === 'videos' ? 'VIDEO' : tab === 'events' ? 'EVENT' : tab === 'fans' ? 'FANS' : 'SEJARAH'}
                </button>
              ))}
            </nav>
            
            {/* Right Actions */}
            <div className="flex items-center gap-2">
              <DarkModeToggle isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
              <button onClick={() => setShowMobileMenu(!showMobileMenu)} className="text-white p-2 rounded-lg hover:bg-white/20 transition">
                {showMobileMenu ? <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg> : <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>}
              </button>
            </div>
          </div>
          
          {/* Hamburger Dropdown */}
          {showMobileMenu && (
            <div className="absolute top-full right-3 sm:right-4 mt-2 w-64 sm:w-72">
              <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl shadow-2xl border overflow-hidden`}>
                {/* User Info */}
                <div className={`px-4 py-3 ${isDarkMode ? 'bg-gray-700/50' : 'bg-persebaya-green/10'} border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                  <div className="flex items-center gap-3">
                    <div 
                      onClick={() => { navigate('/profile'); setShowMobileMenu(false); }}
                      className="h-10 w-10 rounded-full bg-persebaya-green flex items-center justify-center text-white font-bold text-sm cursor-pointer hover:scale-105 transition"
                    >
                      {currentUser?.name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`font-bold text-sm truncate ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{currentUser?.name || 'User'}</p>
                      <p className={`text-xs truncate ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{currentUser?.email}</p>
                    </div>
                    {isAdmin && <span className="bg-yellow-400 text-black text-[10px] px-2 py-0.5 rounded-full font-bold">Admin</span>}
                  </div>
                </div>
                
                {/* Navigation - Grid Compact */}
                <div className="grid grid-cols-2 gap-1 p-2">
                  {['home', 'news', 'schedule', 'players', 'videos', 'events', 'fans', 'history'].map(tab => (
                    <button 
                      key={tab} 
                      onClick={() => { setActiveTab(tab); setShowMobileMenu(false); }} 
                      className={`px-3 py-2.5 font-semibold uppercase text-xs rounded-lg text-left transition ${activeTab === tab ? 'bg-persebaya-green text-white' : `${isDarkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'}`}`}
                    >
                      {tab === 'home' ? 'Home' : tab === 'news' ? 'Berita' : tab === 'schedule' ? 'Jadwal' : tab === 'players' ? 'Tim' : tab === 'videos' ? 'Video' : tab === 'events' ? 'Event' : tab === 'fans' ? 'Fans' : 'Sejarah'}
                    </button>
                  ))}
                </div>
                
                {/* Actions */}
                <div className={`border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} p-2 space-y-1`}>
                  <button onClick={() => { navigate('/profile'); setShowMobileMenu(false); }} className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm ${isDarkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'}`}>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                    <span>Edit Profil</span>
                  </button>
                  
                  <button onClick={() => { onLogout(); setShowMobileMenu(false); }} className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm bg-red-50 text-red-600 hover:bg-red-100 transition">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6">
          <aside className="hidden lg:block lg:col-span-1 space-y-4 sm:space-y-6">
            {/* Berita Categories */}
            <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md overflow-hidden`}>
              <div className="bg-persebaya-green text-white px-4 py-3 font-bold text-sm sm:text-lg uppercase">BERITA</div>
              <nav className={`divide-y ${isDarkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
                {['all', 'Persebaya', 'Fans', 'Persebaya Future Lab', 'Persebaya Selamanya'].map(cat => (
                  <button key={cat} onClick={() => { setNewsCategory(cat); setActiveTab('news'); }} className={`w-full text-left px-4 py-3 font-semibold transition-colors text-xs sm:text-sm md:text-base ${newsCategory === cat && activeTab === 'news' ? 'bg-persebaya-green text-white' : `${isDarkMode ? 'text-gray-300 hover:bg-gray-700' : 'hover:bg-persebaya-green hover:text-white'}`}`}>
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
                      <div className="flex-1 text-center"><div className="text-xl sm:text-2xl md:text-3xl mb-1">🟢</div><div className="text-[10px] sm:text-xs font-bold">{upcomingMatch.homeTeam}</div><div className="text-xl sm:text-2xl font-bold mt-1">{upcomingMatch.home_score}</div></div>
                      <div className="text-center px-2 py-1 bg-white/20 rounded"><div className="text-[10px] sm:text-xs font-bold">FULL TIME</div></div>
                      <div className="flex-1 text-center"><div className="text-xl sm:text-2xl md:text-3xl mb-1">🔴</div><div className="text-[10px] sm:text-xs font-bold">{upcomingMatch.awayTeam}</div><div className="text-xl sm:text-2xl font-bold mt-1">{upcomingMatch.away_score}</div></div>
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-between items-center gap-2">
                    <div className="flex-1 text-center"><div className="text-xl sm:text-2xl md:text-3xl mb-1"></div><div className="text-[10px] sm:text-xs font-bold">{upcomingMatch.homeTeam}</div></div>
                    <div className="text-center px-2 sm:px-3 py-2 bg-white/20 rounded"><div className="text-[10px] sm:text-xs font-bold">KICK OFF</div><div className="text-base sm:text-lg font-bold">{upcomingMatch.time}</div></div>
                    <div className="flex-1 text-center"><div className="text-xl sm:text-2xl md:text-3xl mb-1">🔴</div><div className="text-[10px] sm:text-xs font-bold">{upcomingMatch.awayTeam}</div></div>
                  </div>
                )}
              </div>
            )}
            
            {/* Menu Cepat */}
            <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md p-4 sm:p-5`}>
              <h3 className={`font-bold mb-3 uppercase text-xs sm:text-sm md:text-base ${isDarkMode ? 'text-green-400' : 'text-persebaya-green'}`}>Menu Cepat</h3>
              <div className="space-y-2">
                <button onClick={() => setActiveTab('schedule')} className={`block w-full text-left px-3 py-2 rounded text-xs sm:text-sm ${isDarkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100'}`}>📅 Jadwal Pertandingan</button>
                <button onClick={() => setActiveTab('players')} className={`block w-full text-left px-3 py-2 rounded text-xs sm:text-sm ${isDarkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100'}`}>👥 Skuad Pemain</button>
                <button onClick={() => setActiveTab('events')} className={`block w-full text-left px-3 py-2 rounded text-xs sm:text-sm ${isDarkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100'}`}>🎉 Event & Kegiatan</button>
              </div>
            </div>

            {/* ✅ AI CHATBOT PROMO - Small Sidebar Version */}
            <div className={`${isDarkMode ? 'bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700' : 'bg-gradient-to-br from-persebaya-green to-emerald-700'} rounded-lg shadow-lg p-4 sm:p-5 text-white border`}>
              {/* Icon */}
              <div className="flex justify-center mb-3">
                <div className="bg-white/20 backdrop-blur-sm rounded-full p-3">
                  <svg className="w-8 h-8 sm:w-10 sm:h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                </div>
              </div>
              
              {/* Content */}
              <div className="text-center mb-3">
                <h3 className="text-base sm:text-lg font-bold mb-1">AI ChatBot</h3>
                <p className="text-white/90 text-xs sm:text-sm leading-relaxed">
                  Tanyakan apapun tentang Persebaya! Available 24/7.
                </p>
              </div>
              
              {/* Features */}
              <div className="space-y-1.5 mb-3">
                <div className="flex items-center gap-1.5 text-xs sm:text-sm">
                  <svg className="w-4 h-4 text-green-300 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Jawaban Cepat</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs sm:text-sm">
                  <svg className="w-4 h-4 text-green-300 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>24 Jam Online</span>
                </div>
              </div>
              
              {/* CTA Button - Direct Chat Open */}
<button 
  onClick={() => {
    // Find and click chatbot toggle
    const chatbotToggle = document.querySelector('[data-chatbot-toggle]');
    if (chatbotToggle) {
      chatbotToggle.click();
    } else {
      // Try alternative selectors
      const buttons = document.querySelectorAll('button');
      buttons.forEach(btn => {
        if (btn.textContent.toLowerCase().includes('chat') || 
            btn.className.includes('chatbot') ||
            btn.title?.toLowerCase().includes('chat')) {
          btn.click();
        }
      });
    }
    
    // Scroll to bottom where chatbot is
    setTimeout(() => {
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    }, 100);
  }}
  className="w-full bg-white text-persebaya-green py-2 rounded-lg font-bold text-xs sm:text-sm hover:bg-gray-100 transition shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
>
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
  </svg>
  Chat Sekarang
</button>
            </div>
          </aside>

          <main className="col-span-1 lg:col-span-3 space-y-4 sm:space-y-6">
            {activeTab === 'home' && <Home newsList={newsList} onGoToNews={goToNewsDetail} onGoToPlayers={() => setActiveTab('players')} onGoToSchedule={() => setActiveTab('schedule')} isDarkMode={isDarkMode} />}
            {activeTab === 'news' && <News newsList={newsList} newsCategory={newsCategory} isAdmin={isAdmin} onGoToDetail={goToNewsDetail} isDarkMode={isDarkMode} />}
            {activeTab === 'schedule' && <Schedule schedules={schedules} isAdmin={isAdmin} isDarkMode={isDarkMode} />}
            {activeTab === 'players' && <Players players={players} isAdmin={isAdmin} onGoToDetail={goToPlayerDetail} isDarkMode={isDarkMode} />}
            {activeTab === 'videos' && <Videos isDarkMode={isDarkMode} />}
            {activeTab === 'events' && <Events eventsList={eventsList} isAdmin={isAdmin} onGoToDetail={goToEventDetail} isDarkMode={isDarkMode} />}
            {activeTab === 'fans' && <Fans isAdmin={isAdmin} onGoToGallery={goToGalleryDetail} isDarkMode={isDarkMode} />}
            {activeTab === 'history' && <History isAdmin={isAdmin} isDarkMode={isDarkMode} />}
          </main>
        </div>
      </div>

      {/* FOOTER */}
      <footer className={`${isDarkMode ? 'bg-gray-900' : 'bg-gray-800'} text-white text-center py-4 sm:py-6 mt-8 sm:mt-12`}>
        <p className="font-semibold text-xs sm:text-sm md:text-base px-2">© 2026 Persebaya Surabaya | Sistem Manajemen Klub Terintegrasi</p>
        <p className="text-gray-400 text-[10px] sm:text-xs md:text-sm mt-1 sm:mt-2 px-2">Powered by React + Tailwind CSS + Supabase</p>
        <p className="text-gray-400 text-[10px] sm:text-xs md:text-sm mt-1 px-2">Created by Fadli Ramadhan 2026 Project-Akhir</p>
      </footer>
    </div>
  );
}

export default App;