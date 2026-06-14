// frontend/src/components/pages/Players.jsx
import React, { useState } from 'react';
import PlayerCard from '../Cards/PlayerCard';
import PlayerForm from '../Forms/PlayerForm';
import { uploadFile } from '../../utils/api';

const POSITIONS = [
  { value: 'all', label: 'Semua Pemain' },
  { value: 'Goalkeeper', label: 'Penjaga Gawang' },
  { value: 'Defender', label: 'Pemain Belakang' },
  { value: 'Midfielder', label: 'Gelandang' },
  { value: 'Forward', label: 'Penyerang' }
];

const getPlayerCategory = (position) => {
  if (!position) return 'Midfielder';
  
  const pos = position.toLowerCase();
  
  if (pos.includes('goalkeeper') || pos.includes('kiper') || pos.includes('penjaga gawang')) return 'Goalkeeper';
  if (pos.includes('defender') || pos.includes('bek') || pos.includes('center back') || 
      pos.includes('full back') || pos.includes('left back') || pos.includes('right back') ||
      pos.includes('stopper') || pos.includes('sweeper')) return 'Defender';
  if (pos.includes('midfielder') || pos.includes('gelandang') || pos.includes('winger') || 
      pos.includes('sayap') || pos.includes('holding') || pos.includes('attacking midfielder') || 
      pos.includes('defensive midfielder')) return 'Midfielder';
  if (pos.includes('forward') || pos.includes('penyerang') || pos.includes('striker') || 
      pos.includes('center forward') || pos.includes('second striker')) return 'Forward';
  
  return 'Midfielder';
};

export default function Players({ players, isAdmin, onGoToDetail, isDarkMode }) {
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPosition, setSelectedPosition] = useState('all');

  const handleEdit = (player) => {
    setEditing(player);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditing(null);
  };

  const handleSubmit = async (formData, id) => {
    try {
      await uploadFile('/players', formData, id, id ? 'put' : 'post');
      handleCloseForm();
      // Refresh data via parent component (lebih baik daripada reload)
      window.location.reload();
      alert('✅ Pemain berhasil disimpan!');
    } catch (err) {
      alert(`❌ Gagal: ${err.response?.data?.error || err.message}`);
    }
  };

  const handleDelete = async (id, imageUrl) => {
    if (!window.confirm('Yakin ingin menghapus pemain ini?')) return;
    try {
      const api = (await import('../../utils/api')).default;
      const { deleteImageFromStorage } = await import('../../utils/api');
      
      // Hapus gambar dari storage dulu (jika ada)
      if (imageUrl) {
        await deleteImageFromStorage(imageUrl);
      }
      
      await api.delete(`/players/${id}`);
      window.location.reload();
      alert('✅ Pemain berhasil dihapus!');
    } catch (err) {
      alert(`❌ Gagal: ${err.message}`);
    }
  };

  const filteredPlayers = players.filter(p => {
    const matchSearch = p.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                       p.position?.toLowerCase().includes(searchQuery.toLowerCase());
    const playerCategory = getPlayerCategory(p.position);
    const matchPosition = selectedPosition === 'all' || playerCategory === selectedPosition;
    return matchSearch && matchPosition;
  });

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header - Responsive */}
      <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-lg`}>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-persebaya-green dark:text-green-400 mb-1">Skuad Resmi Persebaya</h2>
            <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} text-xs sm:text-sm`}>Musim 2025/2026 - BRI Liga 1</p>
          </div>
          {isAdmin && (
            <button 
              onClick={() => { setEditing(null); setShowForm(true); }} 
              className="bg-persebaya-green text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-bold hover:bg-persebaya-dark text-xs sm:text-sm md:text-base shadow-lg transition-all flex items-center gap-2 w-full sm:w-auto justify-center"
            >
              <span>➕</span> Tambah Pemain
            </button>
          )}
        </div>
      </div>

      {/* Search dan Filter - Responsive */}
      <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-lg space-y-3 sm:space-y-4`}>
        {/* Search Bar */}
        <div className="relative">
          <input 
            type="text" 
            placeholder="🔍 Cari pemain berdasarkan nama atau posisi..." 
            value={searchQuery} 
            onChange={(e) => setSearchQuery(e.target.value)} 
            className={`w-full px-4 sm:px-6 py-3 sm:py-4 rounded-xl border-2 focus:outline-none focus:border-persebaya-green focus:ring-4 focus:ring-persebaya-green/10 text-xs sm:text-sm md:text-base transition-all ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-200'}`} 
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className={`absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 ${isDarkMode ? 'text-gray-500 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'}`}
            >
              ✕
            </button>
          )}
        </div>

        {/* Filter Posisi - Horizontal Scroll */}
        <div className="flex gap-2 sm:gap-3 overflow-x-auto pb-2 scrollbar-thin">
          {POSITIONS.map(pos => {
            const count = pos.value === 'all' 
              ? (players || []).length 
              : (players || []).filter(p => getPlayerCategory(p.position) === pos.value).length;
            
            return (
              <button
                key={pos.value}
                onClick={() => setSelectedPosition(pos.value)}
                className={`px-3 sm:px-5 py-2 sm:py-3 rounded-xl font-semibold text-xs sm:text-sm md:text-base whitespace-nowrap transition-all flex items-center gap-1 sm:gap-2 flex-shrink-0 ${
                  selectedPosition === pos.value
                    ? 'bg-persebaya-green text-white shadow-lg'
                    : `${isDarkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`
                }`}
              >
                <span>{pos.label}</span>
                {pos.value !== 'all' && (
                  <span className={`text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 rounded-full ${
                    selectedPosition === pos.value 
                      ? 'bg-white/20' 
                      : isDarkMode ? 'bg-gray-600' : 'bg-gray-300'
                  }`}>
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Result Count */}
        <div className={`flex items-center justify-between pt-2 border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-100'}`}>
          <p className={`text-xs sm:text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Menampilkan <span className="font-bold text-persebaya-green dark:text-green-400">{filteredPlayers.length}</span> pemain
          </p>
          {selectedPosition !== 'all' && (
            <button 
              onClick={() => setSelectedPosition('all')}
              className="text-xs sm:text-sm text-persebaya-green dark:text-green-400 hover:underline font-semibold"
            >
              Reset Filter
            </button>
          )}
        </div>
      </div>

      {/* Form Tambah/Edit */}
      {isAdmin && showForm && (
        <PlayerForm editing={editing} onSubmit={handleSubmit} onClose={handleCloseForm} isDarkMode={isDarkMode} />
      )}

      {/* Players Grid - 1 col mobile, 2 cols tablet, 3 cols desktop */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
        {(filteredPlayers || []).map(player => (
          <PlayerCard 
            key={player.id} 
            player={player} 
            isAdmin={isAdmin} 
            onEdit={handleEdit} 
            onDelete={() => handleDelete(player.id, player.image)}
            onClick={() => onGoToDetail(player)}
            isDarkMode={isDarkMode}
          />
        ))}
      </div>

      {/* Empty State - Responsive */}
      {(!filteredPlayers || filteredPlayers.length === 0) && (
        <div className={`text-center py-12 sm:py-16 ${isDarkMode ? 'text-gray-400 bg-gray-800' : 'text-gray-500 bg-white'} rounded-xl sm:rounded-2xl shadow-lg`}>
          <div className="text-5xl sm:text-7xl mb-3 sm:mb-4">😔</div>
          <p className="text-base sm:text-xl font-semibold mb-2">Tidak ada pemain yang ditemukan</p>
          <p className="text-xs sm:text-sm mb-3 sm:mb-4">Coba ubah filter atau kata kunci pencarian</p>
          {isAdmin && (
            <button 
              onClick={() => { setShowForm(true); setSearchQuery(''); setSelectedPosition('all'); }}
              className="bg-persebaya-green text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-bold hover:bg-persebaya-dark transition text-xs sm:text-sm"
            >
              ➕ Tambah Pemain Pertama
            </button>
          )}
        </div>
      )}
    </div>
  );
}