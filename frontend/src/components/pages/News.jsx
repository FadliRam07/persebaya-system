// frontend/src/components/pages/News.jsx
import React, { useState } from 'react';
import NewsCard from '../Cards/NewsCard';
import NewsForm from '../Forms/NewsForm';
import { uploadFile } from '../../utils/api';

const IMG_URL = 'http://localhost:5000';

export default function News({ newsList, newsCategory = 'all', isAdmin, onGoToDetail, isDarkMode }) {
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [category, setCategory] = useState(newsCategory);

  const categories = ['all', 'Persebaya', 'Fans', 'Persebaya Future Lab', 'Persebaya Selamanya'];

  const handleEdit = (news) => {
    setEditing(news);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditing(null);
  };

  const handleSubmit = async (formData, id) => {
    try {
      await uploadFile('/news', formData, id, id ? 'put' : 'post');
      handleCloseForm();
      window.location.reload();
      alert('✅ Berita berhasil disimpan!');
    } catch (err) {
      alert(`❌ Gagal: ${err.response?.data?.error || err.message}`);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Yakin ingin menghapus berita ini?')) return;
    try {
      const api = (await import('../../utils/api')).default;
      await api.delete(`/news/${id}`);
      window.location.reload();
      alert('✅ Berita berhasil dihapus!');
    } catch (err) {
      alert(`❌ Gagal: ${err.message}`);
    }
  };

  const filteredNews = category === 'all' 
    ? newsList 
    : newsList.filter(n => n.category === category);

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header - Responsive */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-persebaya-green dark:text-green-400 uppercase">
          {category === 'all' ? 'Semua Berita' : category}
        </h2>
        <div className="flex gap-2 sm:gap-3 w-full sm:w-auto">
          {isAdmin && (
            <button 
              onClick={() => { setEditing(null); setShowForm(true); }} 
              className="bg-persebaya-green text-white px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg font-bold hover:bg-persebaya-dark text-xs sm:text-sm md:text-base shadow-lg flex-1 sm:flex-none"
            >
              ➕ Tambah Berita
            </button>
          )}
          <select 
            value={category} 
            onChange={(e) => setCategory(e.target.value)} 
            className={`px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-persebaya-green w-full sm:w-auto text-xs sm:text-sm ${isDarkMode ? 'bg-gray-800 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>
                {cat === 'all' ? 'Semua Berita' : cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Form */}
      {isAdmin && showForm && (
        <NewsForm editing={editing} onSubmit={handleSubmit} onClose={handleCloseForm} isDarkMode={isDarkMode} />
      )}

      {/* News Grid - 1 col mobile, 2 cols desktop */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
        {filteredNews.map(news => (
          <NewsCard 
            key={news.id} 
            news={news} 
            isAdmin={isAdmin} 
            onEdit={handleEdit} 
            onDelete={handleDelete}
            onClick={() => onGoToDetail(news)}
            isDarkMode={isDarkMode}
          />
        ))}
      </div>

      {/* Empty State - Responsive */}
      {filteredNews.length === 0 && (
        <div className={`text-center py-8 sm:py-12 ${isDarkMode ? 'text-gray-400 bg-gray-800' : 'text-gray-500 bg-white'} rounded-xl sm:rounded-2xl shadow-lg`}>
          <p className="text-base sm:text-lg">Belum ada berita</p>
          {isAdmin && <p className="text-xs sm:text-sm mt-2">Klik "Tambah Berita" untuk menambahkan</p>}
        </div>
      )}
    </div>
  );
}