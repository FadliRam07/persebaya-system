// frontend/src/components/Forms/NewsForm.jsx
import React, { useState } from 'react';

export default function NewsForm({ editing, onSubmit, onClose, isDarkMode }) {
  const [form, setForm] = useState({
    title: editing?.title || '',
    category: editing?.category || 'Persebaya',
    excerpt: editing?.excerpt || '',
    content: editing?.content || '',
    author: editing?.author || '',
    date: editing?.date || new Date().toISOString().split('T')[0],
    image: null,
    preview: editing?.image ? `http://localhost:5000${editing.image}` : null
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setForm({ ...form, image: file, preview: URL.createObjectURL(file) });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', form.title);
    formData.append('category', form.category);
    formData.append('excerpt', form.excerpt);
    formData.append('content', form.content);
    formData.append('author', form.author);
    formData.append('date', form.date);
    if (form.image) {
      formData.append('image', form.image);
    }
    onSubmit(formData, editing?.id);
  };

  return (
    <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-6 md:p-8`}>
      <h3 className={`text-xl sm:text-2xl font-bold ${isDarkMode ? 'text-green-400' : 'text-persebaya-green'} mb-4 sm:mb-6`}>
        {editing ? '✏️ Edit Berita' : '➕ Tambah Berita Baru'}
      </h3>
      <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <input 
            name="title" 
            placeholder="Judul Berita" 
            value={form.title} 
            onChange={handleChange} 
            required 
            className={`px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg text-xs sm:text-sm ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300'} border focus:outline-none focus:ring-2 focus:ring-persebaya-green/20`} 
          />
          <select 
            name="category" 
            value={form.category} 
            onChange={handleChange}
            className={`px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg text-xs sm:text-sm ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'} border focus:outline-none focus:ring-2 focus:ring-persebaya-green/20`}
          >
            <option value="Persebaya">Persebaya</option>
            <option value="Fans">Fans</option>
            <option value="Persebaya Future Lab">Persebaya Future Lab</option>
            <option value="Persebaya Selamanya">Persebaya Selamanya</option>
          </select>
          <input 
            name="author" 
            placeholder="Penulis" 
            value={form.author} 
            onChange={handleChange} 
            required 
            className={`px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg text-xs sm:text-sm ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300'} border focus:outline-none focus:ring-2 focus:ring-persebaya-green/20`} 
          />
          <input 
            name="date" 
            type="date"
            value={form.date} 
            onChange={handleChange} 
            required 
            className={`px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg text-xs sm:text-sm ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'} border focus:outline-none focus:ring-2 focus:ring-persebaya-green/20`} 
          />
        </div>
        <textarea 
          name="excerpt" 
          placeholder="Ringkasan Berita (excerpt)" 
          value={form.excerpt} 
          onChange={handleChange} 
          required 
          rows="2"
          className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg text-xs sm:text-sm ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300'} border focus:outline-none focus:ring-2 focus:ring-persebaya-green/20 resize-none`} 
        />
        <textarea 
          name="content" 
          placeholder="Konten Berita Lengkap" 
          value={form.content} 
          onChange={handleChange} 
          required 
          rows="5"
          className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg text-xs sm:text-sm ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300'} border focus:outline-none focus:ring-2 focus:ring-persebaya-green/20 resize-none`} 
        />
        <div>
          <label className={`block text-xs sm:text-sm font-bold mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Gambar Berita</label>
          <input 
            type="file" 
            accept="image/*"
            onChange={handleImageChange} 
            className={`px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg text-xs sm:text-sm w-full ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'} border focus:outline-none focus:ring-2 focus:ring-persebaya-green/20`} 
          />
          {form.preview && (
            <img src={form.preview} alt="Preview" className="mt-3 w-full sm:w-48 md:w-64 h-24 sm:h-32 object-cover rounded-lg shadow-md" />
          )}
        </div>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-3 sm:pt-4">
          <button type="submit" className="bg-persebaya-green text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg font-bold hover:bg-persebaya-dark flex-1 text-xs sm:text-sm shadow-lg transition-colors">
            {editing ? '💾 Update Berita' : '📰 Publikasikan Berita'}
          </button>
          <button type="button" onClick={onClose} className="bg-gray-500 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg font-bold hover:bg-gray-600 flex-1 text-xs sm:text-sm transition-colors">
            Batal
          </button>
        </div>
      </form>
    </div>
  );
}