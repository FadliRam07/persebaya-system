// frontend/src/components/pages/History.jsx
import React, { useState } from 'react';
import HistoryCard from '../Cards/HistoryCard';
import HistoryForm from '../Forms/HistoryForm';
import { uploadFile } from '../../utils/api';

export default function History({ isAdmin, isDarkMode }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);

  React.useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const api = (await import('../../utils/api')).default;
      const res = await api.get('/history', { params: { order: 'year:desc' } });
      setItems(res.data || []);
    } catch (err) {
      console.error('Error fetching history:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item) => {
    setEditing(item);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditing(null);
  };

  const handleSubmit = async (formData, id) => {
    try {
      await uploadFile('/history', formData, id, id ? 'put' : 'post');
      handleCloseForm();
      fetchHistory();
      alert('✅ Sejarah berhasil disimpan!');
    } catch (err) {
      alert(`❌ Gagal: ${err.response?.data?.error || err.message}`);
    }
  };

  const handleDelete = async (id, imageUrl) => {
    if (!window.confirm('Yakin ingin menghapus sejarah ini?')) return;
    try {
      const api = (await import('../../utils/api')).default;
      const { deleteImageFromStorage } = await import('../../utils/api');
      
      // Hapus gambar dari storage dulu (jika ada)
      if (imageUrl) {
        await deleteImageFromStorage(imageUrl);
      }
      
      await api.delete(`/history/${id}`);
      fetchHistory();
      alert('✅ Sejarah berhasil dihapus!');
    } catch (err) {
      alert(`❌ Gagal: ${err.message}`);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[300px] sm:min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-4 border-persebaya-green border-t-transparent mx-auto mb-4"></div>
          <p className={`text-sm sm:text-base ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header - Responsive */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-persebaya-green dark:text-green-400">Sejarah Persebaya</h2>
        {isAdmin && (
          <button 
            onClick={() => { setEditing(null); setShowForm(true); }} 
            className="bg-persebaya-green text-white px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg font-bold hover:bg-persebaya-dark text-xs sm:text-sm md:text-base shadow-lg w-full sm:w-auto"
          >
            ➕ Tambah Sejarah
          </button>
        )}
      </div>

      {/* Form */}
      {isAdmin && showForm && (
        <HistoryForm editing={editing} onSubmit={handleSubmit} onClose={handleCloseForm} isDarkMode={isDarkMode} />
      )}

      {/* History List */}
      <div className="space-y-4 sm:space-y-6">
        {(items || []).map((item) => (
          <HistoryCard 
            key={item.id} 
            item={item} 
            isAdmin={isAdmin} 
            onEdit={handleEdit} 
            onDelete={() => handleDelete(item.id, item.image)}
            isDarkMode={isDarkMode}
          />
        ))}
      </div>

      {/* Empty State - Responsive */}
      {(!items || items.length === 0) && (
        <div className={`text-center py-8 sm:py-12 ${isDarkMode ? 'text-gray-400 bg-gray-800' : 'text-gray-500 bg-white'} rounded-xl sm:rounded-2xl shadow-lg`}>
          <p className="text-base sm:text-lg">Belum ada data sejarah</p>
          {isAdmin && <p className="text-xs sm:text-sm mt-2">Klik "Tambah Sejarah" untuk menambahkan</p>}
        </div>
      )}
    </div>
  );
}