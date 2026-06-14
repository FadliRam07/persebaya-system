import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const CLUB_LOGO = "https://upload.wikimedia.org/wikipedia/id/thumb/a/a1/Persebaya_logo.svg/1280px-Persebaya_logo.svg.png";

export default function Register({ onRegister, isDarkMode }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Password tidak cocok!');
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Password minimal 6 karakter!');
      setIsLoading(false);
      return;
    }

    try {
      const result = await onRegister({
        name: formData.name,
        email: formData.email,
        password: formData.password
      });

      if (result.success) {
        alert('✅ Akun berhasil dibuat! Silakan login.');
        navigate('/login');
      } else {
        setError(result.error || 'Gagal membuat akun');
      }
    } catch (err) {
      setError('Terjadi kesalahan: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-gray-900">
      
      {/* LEFT SIDE - HERO CARD (Hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-persebaya-green to-emerald-900 relative items-center justify-center p-8">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] mix-blend-overlay"></div>
        
        <div className="relative z-10 bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-12 text-white shadow-2xl max-w-lg w-full">
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-4 tracking-tight">
            Bonek <span className="text-white/80">Community</span>
          </h1>
          <p className="text-lg sm:text-xl text-white/90 mb-8 leading-relaxed">
            Bergabunglah dengan ribuan suporter lain. Pantau jadwal, berita eksklusif, dan sejarah klub kebanggaan kita.
          </p>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/10 hover:bg-white/20 transition">
              <p className="text-3xl font-bold mb-1">100+</p>
              <p className="text-sm text-white/70 font-medium">Berita Harian</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/10 hover:bg-white/20 transition">
              <p className="text-3xl font-bold mb-1">Live</p>
              <p className="text-sm text-white/70 font-medium">Skor Match</p>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE - FORM */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-6 md:p-12 bg-gray-900">
        <div className="w-full max-w-md">
          
          {/* Logo */}
          <div className="flex justify-center mb-6 sm:mb-8">
            <div className="bg-gray-800 rounded-full p-3 shadow-xl border border-gray-700">
               <img src={CLUB_LOGO} alt="Persebaya Logo" className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 object-contain" />
            </div>
          </div>

          {/* Form Card */}
          <div className="bg-gray-800 rounded-2xl sm:rounded-3xl shadow-2xl p-6 sm:p-8 md:p-10 border border-gray-700">
            <div className="text-center mb-6 sm:mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">Buat Akun Baru</h2>
              <p className="text-gray-400 text-sm sm:text-base">
                Sudah punya akun? <Link to="/login" className="text-persebaya-green font-bold hover:underline transition">Login di sini</Link>
              </p>
            </div>

            {error && (
              <div className="mb-4 sm:mb-6 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm text-center">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
              {/* Nama */}
              <div>
                <label className="block text-sm font-bold text-gray-300 mb-2 ml-1">NAMA LENGKAP</label>
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="Contoh: Fadli Ram"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 sm:px-5 py-3 sm:py-3.5 rounded-xl bg-gray-700/50 border border-gray-600 text-white placeholder-gray-500 focus:outline-none focus:border-persebaya-green focus:ring-2 focus:ring-persebaya-green/20 transition text-sm sm:text-base"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-bold text-gray-300 mb-2 ml-1">EMAIL</label>
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="email@contoh.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 sm:px-5 py-3 sm:py-3.5 rounded-xl bg-gray-700/50 border border-gray-600 text-white placeholder-gray-500 focus:outline-none focus:border-persebaya-green focus:ring-2 focus:ring-persebaya-green/20 transition text-sm sm:text-base"
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-bold text-gray-300 mb-2 ml-1">PASSWORD</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    required
                    placeholder="Minimal 6 karakter"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full px-4 sm:px-5 py-3 sm:py-3.5 rounded-xl bg-gray-700/50 border border-gray-600 text-white placeholder-gray-500 focus:outline-none focus:border-persebaya-green focus:ring-2 focus:ring-persebaya-green/20 transition text-sm sm:text-base"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition"
                  >
                    {showPassword ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-bold text-gray-300 mb-2 ml-1">KONFIRMASI PASSWORD</label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  required
                  placeholder="Ulangi password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full px-4 sm:px-5 py-3 sm:py-3.5 rounded-xl bg-gray-700/50 border border-gray-600 text-white placeholder-gray-500 focus:outline-none focus:border-persebaya-green focus:ring-2 focus:ring-persebaya-green/20 transition text-sm sm:text-base"
                />
              </div>

              <button
                disabled={isLoading}
                className="w-full bg-persebaya-green text-white py-3 sm:py-4 rounded-xl font-bold text-base sm:text-lg hover:bg-emerald-600 transition-all shadow-lg hover:shadow-green-500/25 disabled:opacity-50 flex justify-center items-center gap-2 mt-4 sm:mt-6"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                    <span>Mendaftar...</span>
                  </>
                ) : (
                  'Daftar Sekarang'
                )}
              </button>
            </form>
          </div>
          
          <p className="text-center text-gray-500 text-xs mt-6">
            © 2026 Persebaya Surabaya. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}