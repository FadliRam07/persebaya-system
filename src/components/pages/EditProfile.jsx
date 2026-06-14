import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../supabaseClient';

export default function EditProfile({ currentUser, isDarkMode }) {
  const navigate = useNavigate();
  
  // State untuk form
  const [formData, setFormData] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    // Validasi Password Baru
    if (formData.newPassword) {
      if (formData.newPassword.length < 6) {
        setError('Password baru minimal 6 karakter!');
        setIsLoading(false);
        return;
      }
      if (formData.newPassword !== formData.confirmPassword) {
        setError('Konfirmasi password tidak cocok!');
        setIsLoading(false);
        return;
      }
      if (!formData.currentPassword) {
        setError('Masukkan password lama untuk mengubah password!');
        setIsLoading(false);
        return;
      }
    }

    try {
      // 1. Jika ingin ganti password, cek dulu password lama benar atau tidak
      if (formData.newPassword) {
        const { data: userCheck, error: checkError } = await supabase
          .from('users')
          .select('id')
          .eq('id', currentUser.id)
          .eq('password', formData.currentPassword)
          .single(); // Ini aman karena kita cuma cek existence

        if (checkError || !userCheck) {
          setError('Password saat ini salah!');
          setIsLoading(false);
          return;
        }
      }

      // 2. Persiapkan data update
      const updateData = {
        name: formData.name,
        email: formData.email
      };

      // Jika ada password baru, tambahkan ke data update
      if (formData.newPassword) {
        updateData.password = formData.newPassword;
      }

      // 3. Update ke Supabase (FIX: Hapus .single() di akhir agar tidak error JSON)
      const { data, error: updateError } = await supabase
        .from('users')
        .update(updateData)
        .eq('id', currentUser.id)
        .select(); // Return data updated

      if (updateError) throw updateError;

      // 4. Jika berhasil, update localStorage & state global
      // Supabase returns array, kita ambil data pertama
      const updatedUser = data && data.length > 0 ? data[0] : currentUser;
      
      localStorage.setItem('persebaya_user', JSON.stringify(updatedUser));
      
      // Refresh halaman atau update state parent (disini kita reload biar aman)
      setSuccess('✅ Profil berhasil diperbarui! Mengalihkan...');
      setTimeout(() => navigate('/'), 1500);

    } catch (err) {
      console.error('Update error:', err);
      setError('Gagal memperbarui profil: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'} py-8 px-4 sm:px-6 lg:px-8`}>
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <button 
          onClick={() => navigate('/')} 
          className={`flex items-center gap-2 font-bold mb-6 hover:underline text-base sm:text-lg ${isDarkMode ? 'text-green-400' : 'text-persebaya-green'}`}
        >
          <span>←</span> Kembali ke Home
        </button>

        {/* Card Form */}
        <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-2xl shadow-xl overflow-hidden`}>
          
          {/* Header Card */}
          <div className="bg-persebaya-green p-6 sm:p-8 text-center text-white">
            <div className="h-20 w-20 sm:h-24 sm:w-24 rounded-full bg-white flex items-center justify-center text-persebaya-green font-bold text-3xl sm:text-4xl mx-auto mb-4 shadow-lg">
              {currentUser?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold mb-2">Edit Profil</h1>
            <p className="opacity-90 text-sm sm:text-base">{currentUser?.email}</p>
          </div>

          {/* Form Body */}
          <div className="p-6 sm:p-8">
            {error && (
              <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg">
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}
            
            {success && (
              <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 rounded-lg">
                <p className="text-green-700 text-sm">{success}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Nama */}
              <div>
                <label className={`block text-sm font-bold mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  NAMA LENGKAP
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className={`w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:border-persebaya-green transition ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-200'}`}
                />
              </div>

              {/* Email */}
              <div>
                <label className={`block text-sm font-bold mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  EMAIL
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className={`w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:border-persebaya-green transition ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-200'}`}
                />
              </div>

              <hr className={`my-6 ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`} />

              {/* Change Password Section */}
              <div>
                <h3 className={`text-lg font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Ubah Password (Opsional)
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <label className={`block text-sm font-bold mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Password Saat Ini
                    </label>
                    <input
                      type="password"
                      name="currentPassword"
                      value={formData.currentPassword}
                      onChange={handleChange}
                      placeholder="Wajib diisi jika ganti password"
                      className={`w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:border-persebaya-green transition ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-gray-50 border-gray-200 placeholder-gray-400'}`}
                    />
                  </div>

                  <div>
                    <label className={`block text-sm font-bold mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Password Baru
                    </label>
                    <input
                      type="password"
                      name="newPassword"
                      value={formData.newPassword}
                      onChange={handleChange}
                      placeholder="Minimal 6 karakter"
                      className={`w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:border-persebaya-green transition ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-gray-50 border-gray-200 placeholder-gray-400'}`}
                    />
                  </div>

                  <div>
                    <label className={`block text-sm font-bold mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Konfirmasi Password Baru
                    </label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Ulangi password baru"
                      className={`w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:border-persebaya-green transition ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-gray-50 border-gray-200 placeholder-gray-400'}`}
                    />
                  </div>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 bg-persebaya-green text-white px-6 py-3 rounded-xl font-bold hover:bg-emerald-700 transition shadow-lg disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                      <span>Menyimpan...</span>
                    </>
                  ) : (
                    <>Simpan Perubahan</>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/')}
                  className={`flex-1 px-6 py-3 rounded-xl font-bold transition ${isDarkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                >
                  Batal
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}