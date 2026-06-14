import React, { useState, useEffect } from 'react';
import api, { uploadFile, deleteImageFromStorage } from '../../utils/api';
import FansForms from '../Forms/FansForms';

export default function Fans({ isAdmin, onGoToGallery, isDarkMode }) {
  const [stats, setStats] = useState([]);
  const [activities, setActivities] = useState([]);
  const [gallery, setGallery] = useState([]);
  
  const [showForm, setShowForm] = useState({ 
    stats: false, 
    activities: false,
    gallery: false 
  });
  
  const [editing, setEditing] = useState({ 
    stats: null, 
    activities: null,
    gallery: null 
  });
  
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchFansData();
  }, []);

  const fetchFansData = async () => {
    try {
      setLoading(true);
      // ✅ PERUBAHAN: Gunakan nama tabel yang benar (underscore, bukan slash)
      const [statsRes, activitiesRes, galleryRes] = await Promise.all([
        api.get('/fans_stats', { params: { order: 'sort_order:asc' } }),
        api.get('/fans_activities', { params: { order: 'sort_order:asc' } }),
        api.get('/fans_gallery', { params: { order: 'sort_order:asc' } })
      ]);
      setStats(statsRes.data || []);
      setActivities(activitiesRes.data || []);
      setGallery(galleryRes.data || []);
    } catch (err) {
      console.error('❌ Error fetching fans data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (endpoint, id, type, imageUrl = null) => {
    if (!isAdmin) return alert('⚠️ Login admin dulu!');
    if (!window.confirm(`Yakin ingin menghapus ${type.toLowerCase()} ini?`)) return;
    
    try {
      // Hapus gambar dari storage dulu (jika ada & ini gallery)
      if (imageUrl && type === 'Galeri') {
        await deleteImageFromStorage(imageUrl);
      }
      
      await api.delete(`${endpoint}/${id}`);
      await fetchFansData();
      alert('✅ Berhasil dihapus!');
    } catch (err) {
      console.error('❌ Delete error:', err);
      alert(`❌ Gagal menghapus: ${err.response?.data?.error || err.message}`);
    }
  };

  const handleSubmit = async (type, data, id = null) => {
    if (!isAdmin) return alert('⚠️ Login admin dulu!');
    
    setSubmitting(true);
    try {
      // ✅ PERUBAHAN: Gunakan endpoint yang sesuai nama tabel Supabase
      if (type === 'stats') {
        if (id) {
          await api.put(`/fans_stats/${id}`, data);
        } else {
          await api.post('/fans_stats', data);
        }
      } else if (type === 'activities') {
        if (id) {
          await api.put(`/fans_activities/${id}`, data);
        } else {
          await api.post('/fans_activities', data);
        }
      } else if (type === 'gallery') {
        const formData = data instanceof FormData ? data : new FormData();
        if (id) {
          await uploadFile(`/fans_gallery`, formData, id, 'put');
        } else {
          await uploadFile(`/fans_gallery`, formData, null, 'post');
        }
      }
      
      setShowForm(prev => ({ ...prev, [type]: false }));
      setEditing(prev => ({ ...prev, [type]: null }));
      await fetchFansData();
      alert('✅ Berhasil disimpan!');
    } catch (err) {
      console.error(`❌ Error submitting ${type}:`, err);
      alert(`❌ Gagal: ${err.response?.data?.error || err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[300px] sm:min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-4 border-persebaya-green border-t-transparent mx-auto mb-4"></div>
          <p className={`text-sm sm:text-base ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Memuat data Bonek...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header Banner - Responsive */}
      <div className="bg-gradient-to-br from-persebaya-green to-persebaya-dark text-white rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 text-center shadow-2xl relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10">
          <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold mb-2 sm:mb-4">BONEK</h2>
          <p className="text-lg sm:text-xl md:text-2xl mb-2 font-light">BONDO NEKAT</p>
          <p className="text-xs sm:text-sm md:text-lg opacity-90 max-w-3xl mx-auto leading-relaxed px-2">
            Bonek (Bondo Nekat) adalah suporter fanatik Persebaya Surabaya yang dikenal dengan semangat dan loyalitasnya yang tak tergoyahkan sejak 1980-an.
          </p>
        </div>
      </div>

      {/* Admin Action Buttons - Responsive */}
      {isAdmin && (
        <div className={`flex flex-wrap gap-2 sm:gap-3 p-3 sm:p-4 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-md`}>
          <button 
            onClick={() => { setEditing(prev => ({ ...prev, stats: null })); setShowForm(prev => ({ ...prev, stats: true })); }} 
            className="bg-persebaya-green text-white px-3 sm:px-4 py-2 rounded-lg font-bold hover:bg-persebaya-dark transition shadow-md flex items-center gap-2 text-xs sm:text-sm"
            disabled={submitting}
          >
            <span>➕</span> Tambah Stat
          </button>
          <button 
            onClick={() => { setEditing(prev => ({ ...prev, activities: null })); setShowForm(prev => ({ ...prev, activities: true })); }} 
            className="bg-persebaya-green text-white px-3 sm:px-4 py-2 rounded-lg font-bold hover:bg-persebaya-dark transition shadow-md flex items-center gap-2 text-xs sm:text-sm"
            disabled={submitting}
          >
            <span>➕</span> Tambah Kegiatan
          </button>
          <button 
            onClick={() => { setEditing(prev => ({ ...prev, gallery: null })); setShowForm(prev => ({ ...prev, gallery: true })); }} 
            className="bg-persebaya-green text-white px-3 sm:px-4 py-2 rounded-lg font-bold hover:bg-persebaya-dark transition shadow-md flex items-center gap-2 text-xs sm:text-sm"
            disabled={submitting}
          >
            <span>➕</span> Tambah Galeri
          </button>
        </div>
      )}

      {/* Submitting Overlay */}
      {submitting && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-4 sm:p-6 shadow-2xl text-center mx-4`}>
            <div className="animate-spin rounded-full h-8 w-8 sm:h-10 sm:w-10 border-4 border-persebaya-green border-t-transparent mx-auto mb-4"></div>
            <p className={`text-sm sm:text-base font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>Menyimpan data...</p>
          </div>
        </div>
      )}

      {/* Forms Section */}
      <div className="space-y-4 sm:space-y-6">
        {showForm.stats && (
          <FansForms type="stats" editing={editing.stats} onSubmit={handleSubmit} onClose={() => { setShowForm(prev => ({ ...prev, stats: false })); setEditing(prev => ({ ...prev, stats: null })); }} disabled={submitting} isDarkMode={isDarkMode} />
        )}
        {showForm.activities && (
          <FansForms type="activities" editing={editing.activities} onSubmit={handleSubmit} onClose={() => { setShowForm(prev => ({ ...prev, activities: false })); setEditing(prev => ({ ...prev, activities: null })); }} disabled={submitting} isDarkMode={isDarkMode} />
        )}
        {showForm.gallery && (
          <FansForms type="gallery" editing={editing.gallery} onSubmit={handleSubmit} onClose={() => { setShowForm(prev => ({ ...prev, gallery: false })); setEditing(prev => ({ ...prev, gallery: null })); }} disabled={submitting} isDarkMode={isDarkMode} />
        )}
      </div>

      {/* Stats Grid - Responsive: 2 cols mobile, 4 cols desktop */}
      <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6`}>
        <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-persebaya-green dark:text-green-400 mb-4 sm:mb-6 pb-3 sm:pb-4 border-b border-gray-100 dark:border-gray-700">
          📊 Statistik Bonek
        </h3>
        {(!stats || stats.length === 0) ? (
          <div className={`text-center py-6 sm:py-8 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            <p className="text-base sm:text-lg mb-2">Belum ada data statistik</p>
            {isAdmin && <p className="text-xs sm:text-sm">Klik "Tambah Stat" untuk menambahkan</p>}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            {stats.map((stat) => (
              <div 
                key={stat.id} 
                className={`${isDarkMode ? 'bg-gradient-to-br from-gray-700 to-gray-600 border-gray-600' : 'bg-gradient-to-br from-gray-50 to-white border-gray-100'} rounded-xl p-3 sm:p-4 md:p-6 text-center relative group border hover:shadow-md transition-shadow`}
              >
                <div className="text-xl sm:text-2xl md:text-4xl font-bold text-persebaya-green dark:text-green-400 mb-1 sm:mb-2">
                  {stat.value}
                </div>
                <div className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} text-[10px] sm:text-xs md:text-sm font-medium`}>
                  {stat.label}
                </div>
                {isAdmin && (
                  <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => { setEditing(prev => ({ ...prev, stats: stat })); setShowForm(prev => ({ ...prev, stats: true })); }} className="bg-blue-500 text-white p-1.5 sm:p-2 rounded-lg hover:bg-blue-600 transition shadow-md" title="Edit">✏️</button>
                    <button onClick={() => handleDelete('/fans_stats', stat.id, 'Stat')} className="bg-red-500 text-white p-1.5 sm:p-2 rounded-lg hover:bg-red-600 transition shadow-md" title="Hapus">🗑️</button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Activities Section */}
      <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6`}>
        <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-persebaya-green dark:text-green-400 mb-4 sm:mb-6 pb-3 sm:pb-4 border-b border-gray-100 dark:border-gray-700">
          🎉 Kegiatan Bonek
        </h3>
        {(!activities || activities.length === 0) ? (
          <div className={`text-center py-6 sm:py-8 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            <p className="text-base sm:text-lg mb-2">Belum ada data kegiatan</p>
            {isAdmin && <p className="text-xs sm:text-sm">Klik "Tambah Kegiatan" untuk menambahkan</p>}
          </div>
        ) : (
          <div className="space-y-4 sm:space-y-6">
            {activities.map((act) => (
              <div 
                key={act.id} 
                className={`border-l-4 border-persebaya-green pl-3 sm:pl-4 md:pl-6 py-2 sm:py-3 relative group ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'} rounded-r-lg transition-colors`}
              >
                <h4 className={`text-base sm:text-lg md:text-xl font-bold mb-1 sm:mb-2 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{act.title}</h4>
                <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} text-xs sm:text-sm md:text-base leading-relaxed`}>{act.description}</p>
                {isAdmin && (
                  <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => { setEditing(prev => ({ ...prev, activities: act })); setShowForm(prev => ({ ...prev, activities: true })); }} className="bg-blue-500 text-white p-1.5 sm:p-2 rounded-lg hover:bg-blue-600 transition shadow-md" title="Edit">✏️</button>
                    <button onClick={() => handleDelete('/fans_activities', act.id, 'Kegiatan')} className="bg-red-500 text-white p-1.5 sm:p-2 rounded-lg hover:bg-red-600 transition shadow-md" title="Hapus">🗑️</button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Gallery Section - Responsive Grid */}
      <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6`}>
        <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-persebaya-green dark:text-green-400 mb-4 sm:mb-6 pb-3 sm:pb-4 border-b border-gray-100 dark:border-gray-700">
          🖼️ Galeri Bonek
        </h3>
        <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} mb-4 sm:mb-6 text-xs sm:text-sm`}>
          <code className={`${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'} px-2 sm:px-3 py-1 rounded text-persebaya-green dark:text-green-400 font-medium`}>
            💡 Klik foto untuk melihat detail
          </code>
        </p>
        
        {(!gallery || gallery.length === 0) ? (
          <div className={`text-center py-8 sm:py-12 ${isDarkMode ? 'text-gray-400 bg-gray-700' : 'text-gray-500 bg-gray-50'} rounded-xl`}>
            <p className="text-base sm:text-lg mb-2">Belum ada foto galeri</p>
            {isAdmin && <p className="text-xs sm:text-sm">Klik "Tambah Galeri" untuk menambahkan</p>}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
            {gallery.map((photo) => (
              <div 
                key={photo.id} 
                className={`${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'} rounded-xl overflow-hidden cursor-pointer hover:shadow-xl transition-all duration-300 group aspect-square relative`} 
                onClick={() => onGoToGallery(photo)}
              >
                <img 
                  src={photo.image} 
                  alt={photo.caption || 'Galeri Bonek'} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/400x400?text=Foto+Tidak+Ditemukan'; }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3 sm:p-4">
                  <p className="text-white text-[10px] sm:text-sm font-medium line-clamp-2">{photo.caption || 'Tanpa keterangan'}</p>
                </div>
                {isAdmin && (
                  <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10" onClick={e => e.stopPropagation()}>
                    <button onClick={() => { setEditing(prev => ({ ...prev, gallery: photo })); setShowForm(prev => ({ ...prev, gallery: true })); }} className="bg-blue-500 text-white p-1.5 sm:p-2 rounded-lg hover:bg-blue-600 transition shadow-lg" title="Edit">✏️</button>
                    <button onClick={() => handleDelete('/fans_gallery', photo.id, 'Galeri', photo.image)} className="bg-red-500 text-white p-1.5 sm:p-2 rounded-lg hover:bg-red-600 transition shadow-lg" title="Hapus">🗑️</button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}