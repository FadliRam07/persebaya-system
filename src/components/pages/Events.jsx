// frontend/src/components/pages/Events.jsx
import React, { useState } from 'react';
import EventCard from '../Cards/EventCard';
import EventForm from '../Forms/EventForm';
import { uploadFile } from '../../utils/api';

export default function Events({ eventsList, isAdmin, onGoToDetail, isDarkMode }) {
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);

  const handleEdit = (event) => {
    setEditing(event);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditing(null);
  };

  const handleSubmit = async (formData, id) => {
    try {
      await uploadFile('/events', formData, id, id ? 'put' : 'post');
      handleCloseForm();
      window.location.reload();
      alert('✅ Event berhasil disimpan!');
    } catch (err) {
      alert(`❌ Gagal: ${err.response?.data?.error || err.message}`);
    }
  };

  const handleDelete = async (id, imageUrl) => {
    if (!window.confirm('Yakin ingin menghapus event ini?')) return;
    try {
      const api = (await import('../../utils/api')).default;
      const { deleteImageFromStorage } = await import('../../utils/api');
      
      // Hapus gambar dari storage dulu (jika ada)
      if (imageUrl) {
        await deleteImageFromStorage(imageUrl);
      }
      
      await api.delete(`/events/${id}`);
      window.location.reload();
      alert('✅ Event berhasil dihapus!');
    } catch (err) {
      alert(`❌ Gagal: ${err.message}`);
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header - Responsive */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-persebaya-green dark:text-green-400 uppercase">Event & Kegiatan</h2>
        {isAdmin && (
          <button 
            onClick={() => { setEditing(null); setShowForm(true); }} 
            className="bg-persebaya-green text-white px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg font-bold hover:bg-persebaya-dark text-xs sm:text-sm md:text-base shadow-lg w-full sm:w-auto"
          >
            ➕ Tambah Event
          </button>
        )}
      </div>

      {/* Form */}
      {isAdmin && showForm && (
        <EventForm editing={editing} onSubmit={handleSubmit} onClose={handleCloseForm} isDarkMode={isDarkMode} />
      )}

      {/* Events Grid - Responsive: 1 col mobile, 2 cols desktop */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        {(eventsList || []).map(event => (
          <EventCard 
            key={event.id} 
            event={event} 
            isAdmin={isAdmin} 
            onEdit={handleEdit} 
            onDelete={() => handleDelete(event.id, event.image)}
            onClick={() => onGoToDetail(event)}
            isDarkMode={isDarkMode}
          />
        ))}
      </div>

      {/* Empty State - Responsive */}
      {(!eventsList || eventsList.length === 0) && (
        <div className={`text-center py-8 sm:py-12 ${isDarkMode ? 'text-gray-400 bg-gray-800' : 'text-gray-500 bg-white'} rounded-xl sm:rounded-2xl shadow-lg`}>
          <p className="text-base sm:text-lg">Belum ada event</p>
          {isAdmin && <p className="text-xs sm:text-sm mt-2">Klik "Tambah Event" untuk menambahkan</p>}
        </div>
      )}
    </div>
  );
}