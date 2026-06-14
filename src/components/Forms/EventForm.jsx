// frontend/src/components/Forms/EventForm.jsx
import React, { useState } from 'react';

export default function EventForm({ editing, onSubmit, onClose, isDarkMode }) {
  const [form, setForm] = useState({
    title: editing?.title || '',
    date: editing?.date || '',
    time: editing?.time || '',
    location: editing?.location || '',
    description: editing?.description || '',
    price: editing?.price || '',
    status: editing?.status || 'upcoming',
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
    formData.append('date', form.date);
    formData.append('time', form.time);
    formData.append('location', form.location);
    formData.append('description', form.description);
    formData.append('price', form.price);
    formData.append('status', form.status);
    if (form.image) {
      formData.append('image', form.image);
    }
    onSubmit(formData, editing?.id);
  };

  return (
    <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-6 md:p-8`}>
      <h3 className={`text-xl sm:text-2xl font-bold ${isDarkMode ? 'text-green-400' : 'text-persebaya-green'} mb-4 sm:mb-6`}>
        {editing ? '✏️ Edit Event' : '➕ Tambah Event Baru'}
      </h3>
      <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <input 
            name="title" 
            placeholder="Judul Event" 
            value={form.title} 
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
          <input 
            name="time" 
            type="time"
            value={form.time} 
            onChange={handleChange} 
            required 
            className={`px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg text-xs sm:text-sm ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'} border focus:outline-none focus:ring-2 focus:ring-persebaya-green/20`} 
          />
          <input 
            name="location" 
            placeholder="Lokasi" 
            value={form.location} 
            onChange={handleChange} 
            required 
            className={`px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg text-xs sm:text-sm ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300'} border focus:outline-none focus:ring-2 focus:ring-persebaya-green/20`} 
          />
          <input 
            name="price" 
            placeholder="Harga (contoh: Gratis / Rp 150.000)" 
            value={form.price} 
            onChange={handleChange} 
            className={`px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg text-xs sm:text-sm ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300'} border focus:outline-none focus:ring-2 focus:ring-persebaya-green/20`} 
          />
          <select 
            name="status" 
            value={form.status} 
            onChange={handleChange}
            className={`px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg text-xs sm:text-sm ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'} border focus:outline-none focus:ring-2 focus:ring-persebaya-green/20`}
          >
            <option value="upcoming">Akan Datang</option>
            <option value="completed">Selesai</option>
          </select>
        </div>
        <textarea 
          name="description" 
          placeholder="Deskripsi Event" 
          value={form.description} 
          onChange={handleChange} 
          required 
          rows="4"
          className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg text-xs sm:text-sm ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300'} border focus:outline-none focus:ring-2 focus:ring-persebaya-green/20`} 
        />
        <div>
          <label className={`block text-xs sm:text-sm font-bold mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Gambar Event</label>
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
            {editing ? '💾 Update Event' : '📅 Publikasikan Event'}
          </button>
          <button type="button" onClick={onClose} className="bg-gray-500 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg font-bold hover:bg-gray-600 flex-1 text-xs sm:text-sm transition-colors">
            Batal
          </button>
        </div>
      </form>
    </div>
  );
}