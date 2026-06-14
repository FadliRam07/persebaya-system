// frontend/src/components/pages/Schedule.jsx
import React, { useState } from 'react';
import api from '../../utils/api';

export default function Schedule({ schedules, isAdmin, isDarkMode }) {
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    opponent: '',
    date: '',
    time: '',
    venue: '',
    status: 'upcoming',
    home_score: '',
    away_score: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    if (name === 'status' && value !== 'completed') {
      setForm(prev => ({ ...prev, home_score: '', away_score: '' }));
    }
  };

  const handleEdit = (schedule) => {
    setEditing(schedule);
    setForm({
      opponent: schedule.opponent,
      date: schedule.date,
      time: schedule.time,
      venue: schedule.venue || '',
      status: schedule.status || 'upcoming',
      home_score: schedule.home_score !== null ? schedule.home_score : '',
      away_score: schedule.away_score !== null ? schedule.away_score : ''
    });
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditing(null);
    setForm({ opponent: '', date: '', time: '', venue: '', status: 'upcoming', home_score: '', away_score: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // ✅ PERUBAHAN: '/schedules' (pakai 's')
      if (editing) {
        await api.put(`/schedules/${editing.id}`, form);
      } else {
        await api.post('/schedules', form);
      }
      handleCloseForm();
      window.location.reload();
      alert('✅ Jadwal berhasil disimpan!');
    } catch (err) {
      alert(` Gagal: ${err.response?.data?.error || err.message}`);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Yakin ingin menghapus jadwal ini?')) return;
    try {
      // ✅ PERUBAHAN: '/schedules' (pakai 's')
      await api.delete(`/schedules/${id}`);
      window.location.reload();
      alert('✅ Jadwal berhasil dihapus!');
    } catch (err) {
      alert(`❌ Gagal: ${err.message}`);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('id-ID', { 
      weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' 
    });
  };

  const getStatusBadge = (status) => {
    const badges = {
      upcoming: { bg: 'bg-blue-100 dark:bg-blue-900', text: 'text-blue-800 dark:text-blue-200', label: 'Akan Datang' },
      completed: { bg: 'bg-green-100 dark:bg-green-900', text: 'text-green-800 dark:text-green-200', label: 'Selesai' },
      postponed: { bg: 'bg-yellow-100 dark:bg-yellow-900', text: 'text-yellow-800 dark:text-yellow-200', label: 'Ditunda' },
      live: { bg: 'bg-red-100 dark:bg-red-900', text: 'text-red-800 dark:text-red-200', label: ' LIVE' }
    };
    const badge = badges[status] || badges.upcoming;
    return <span className={`inline-block px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-[10px] sm:text-xs font-bold ${badge.bg} ${badge.text}`}>{badge.label}</span>;
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header - Responsive */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-persebaya-green dark:text-green-400">Jadwal Pertandingan</h2>
        {isAdmin && (
          <button 
            onClick={() => { setEditing(null); setForm({ opponent: '', date: '', time: '', venue: '', status: 'upcoming', home_score: '', away_score: '' }); setShowForm(true); }} 
            className="bg-persebaya-green text-white px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg font-bold hover:bg-persebaya-dark text-xs sm:text-sm md:text-base shadow-lg w-full sm:w-auto"
          >
            ➕ Tambah Jadwal
          </button>
        )}
      </div>

      {/* Form - Responsive */}
      {isAdmin && showForm && (
        <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-6 md:p-8`}>
          <h3 className="text-xl sm:text-2xl font-bold text-persebaya-green dark:text-green-400 mb-4 sm:mb-6">
            {editing ? '✏️ Edit Jadwal' : '➕ Tambah Jadwal'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <input name="opponent" placeholder="Lawan (contoh: Arema FC)" value={form.opponent} onChange={handleChange} required className={`px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg text-xs sm:text-sm ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300'} border`} />
              <input name="date" type="date" value={form.date} onChange={handleChange} required className={`px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg text-xs sm:text-sm ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'} border`} />
              <input name="time" type="time" value={form.time} onChange={handleChange} required className={`px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg text-xs sm:text-sm ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'} border`} />
              <input name="venue" placeholder="Stadion" value={form.venue} onChange={handleChange} required className={`px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg text-xs sm:text-sm ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300'} border`} />
              <select name="status" value={form.status} onChange={handleChange} className={`px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg text-xs sm:text-sm ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'} border`}>
                <option value="upcoming">Akan Datang</option>
                <option value="live">🔴 LIVE</option>
                <option value="completed">Selesai</option>
                <option value="postponed">Ditunda</option>
              </select>
            </div>

            {/* Input Skor Dinamis */}
            {form.status === 'completed' && (
              <div className={`${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'} p-3 sm:p-4 rounded-xl border-2 border-persebaya-green/20`}>
                <h4 className="font-bold text-persebaya-green dark:text-green-400 mb-3 flex items-center gap-2 text-sm sm:text-base">
                  ⚽ Input Skor Pertandingan
                </h4>
                <div className="flex items-center justify-center gap-3 sm:gap-4 md:gap-8">
                  <div className="text-center flex-1">
                    <label className={`block text-[10px] sm:text-xs font-bold mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>PERSEBAYA</label>
                    <input 
                      name="home_score" 
                      type="number" 
                      min="0" 
                      value={form.home_score} 
                      onChange={handleChange} 
                      required={form.status === 'completed'}
                      className={`w-16 sm:w-20 text-center text-xl sm:text-2xl font-bold p-2 sm:p-3 border-2 border-persebaya-green rounded-xl focus:ring-4 focus:ring-persebaya-green/20 focus:outline-none ${isDarkMode ? 'bg-gray-600 border-gray-500 text-white' : 'bg-white border-persebaya-green'}`}
                      placeholder="0"
                    />
                  </div>
                  <div className={`text-xl sm:text-2xl font-bold ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>VS</div>
                  <div className="text-center flex-1">
                    <label className={`block text-[10px] sm:text-xs font-bold mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>LAWAN</label>
                    <input 
                      name="away_score" 
                      type="number" 
                      min="0" 
                      value={form.away_score} 
                      onChange={handleChange} 
                      required={form.status === 'completed'}
                      className={`w-16 sm:w-20 text-center text-xl sm:text-2xl font-bold p-2 sm:p-3 border-2 rounded-xl focus:ring-4 focus:ring-gray-200 focus:outline-none ${isDarkMode ? 'bg-gray-600 border-gray-500 text-white' : 'bg-white border-gray-300'}`}
                      placeholder="0"
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-3 sm:pt-4">
              <button type="submit" className="bg-persebaya-green text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg font-bold hover:bg-persebaya-dark flex-1 text-xs sm:text-sm shadow-lg">
                {editing ? '💾 Update' : 'Simpan'}
              </button>
              <button type="button" onClick={handleCloseForm} className="bg-gray-500 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg font-bold hover:bg-gray-600 flex-1 text-xs sm:text-sm">
                Batal
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Schedule List - Responsive */}
      <div className="space-y-3 sm:space-y-4">
        {(schedules || []).map(match => (
          <div key={match.id} className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 md:p-8 border-l-4 border-persebaya-green relative group hover:shadow-xl transition-shadow`}>
            <div className="flex flex-col md:flex-row justify-between items-start gap-3 sm:gap-4">
              <div className="flex-1 w-full">
                <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3 flex-wrap">
                  <h3 className="text-base sm:text-xl md:text-2xl font-bold text-persebaya-green dark:text-green-400">
                    Persebaya vs {match.opponent}
                  </h3>
                  {getStatusBadge(match.status)}
                </div>
                
                {/* Tampilan Skor */}
                {match.status === 'completed' && match.home_score !== null && match.away_score !== null && (
                  <div className="inline-flex items-center gap-3 sm:gap-4 bg-gradient-to-r from-persebaya-green to-persebaya-dark text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl shadow-lg mb-2 sm:mb-3">
                    <div className="text-center">
                      <div className="text-[10px] sm:text-xs opacity-80">PERSEBAYA</div>
                      <div className="text-2xl sm:text-3xl font-bold">{match.home_score}</div>
                    </div>
                    <div className="text-lg sm:text-xl font-light opacity-60">-</div>
                    <div className="text-center">
                      <div className="text-[10px] sm:text-xs opacity-80">{match.opponent.toUpperCase()}</div>
                      <div className="text-2xl sm:text-3xl font-bold">{match.away_score}</div>
                    </div>
                  </div>
                )}
                
                <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} text-xs sm:text-sm md:text-base`}>
                   {formatDate(match.date)} | 🕐 {match.time} | 🏟️ {match.venue}
                </p>
              </div>
              
              {isAdmin && (
                <div className="flex gap-1 sm:gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => handleEdit(match)} className="bg-blue-500 text-white p-1.5 sm:p-2 rounded-lg hover:bg-blue-600 text-xs sm:text-sm shadow-md">✏️</button>
                  <button onClick={() => handleDelete(match.id)} className="bg-red-500 text-white p-1.5 sm:p-2 rounded-lg hover:bg-red-600 text-xs sm:text-sm shadow-md">🗑️</button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Empty State - Responsive */}
      {(!schedules || schedules.length === 0) && (
        <div className={`text-center py-8 sm:py-12 ${isDarkMode ? 'text-gray-400 bg-gray-800' : 'text-gray-500 bg-white'} rounded-xl sm:rounded-2xl shadow-lg`}>
          <p className="text-base sm:text-lg">Belum ada jadwal</p>
          {isAdmin && <p className="text-xs sm:text-sm mt-2">Klik "Tambah Jadwal" untuk menambahkan</p>}
        </div>
      )}
    </div>
  );
}