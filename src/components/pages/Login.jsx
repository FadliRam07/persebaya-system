import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../../supabaseClient';

const CLUB_LOGO = "https://upload.wikimedia.org/wikipedia/id/thumb/a/a1/Persebaya_logo.svg/1280px-Persebaya_logo.svg.png";

const HERO_SLIDES = [
  {
    id: 1,
    title: "Persebaya Surabaya",
    subtitle: "Bajol Ijo Kebanggaan Arek-arek Suroboyo",
    description: "Tim kebanggaan kita siap bertarung di BRI Liga 1 2025/2026",
    color: "from-green-600 to-emerald-800"
  },
  {
    id: 2,
    title: "Bonek Fanatik",
    subtitle: "Supporter Terbaik Indonesia",
    description: "Ribuan suporter setia selalu mendukung di setiap laga",
    color: "from-emerald-700 to-green-900"
  },
  {
    id: 3,
    title: "Prestasi Gemilang",
    subtitle: "Juara Liga Indonesia",
    description: "Sejarah panjang prestasi membanggakan klub kebanggaan",
    color: "from-green-500 to-emerald-700"
  }
];

export default function Login({ onLogin, isDarkMode }) {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Auto-slide setiap 4 detik
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 4000);

    return () => clearInterval(timer);
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const { data: user, error: signInError } = await supabase
        .from('users')
        .select('*')
        .eq('email', formData.email)
        .eq('password', formData.password)
        .single();

      if (signInError || !user) {
        setError('Email atau password salah!');
        setIsLoading(false);
        return;
      }

      onLogin(user);
      navigate('/');
    } catch (err) {
      console.error('Login error:', err);
      setError('Terjadi kesalahan. Silakan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-gray-900">
      
      {/* LEFT SIDE - SLIDESHOW (Hidden on mobile) */}
      <div className="hidden lg:block lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-green-600 to-emerald-900">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] mix-blend-overlay"></div>
        
        <div className="relative h-full flex items-center justify-center p-8">
          {HERO_SLIDES.map((slide, index) => (
            <div
              key={slide.id}
              className={`absolute inset-0 flex items-center justify-center p-8 transition-all duration-1000 ease-in-out ${
                index === currentSlide 
                  ? 'opacity-100 translate-x-0' 
                  : index < currentSlide 
                    ? 'opacity-0 -translate-x-full' 
                    : 'opacity-0 translate-x-full'
              }`}
            >
              <div className={`relative bg-gradient-to-br ${slide.color} bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-12 text-white shadow-2xl max-w-lg w-full`}>
                <div className="flex justify-center mb-6">
                  <div className="bg-white rounded-2xl p-4 shadow-xl">
                    <img src={CLUB_LOGO} alt="Persebaya" className="w-20 h-20 object-contain" />
                  </div>
                </div>
                
                <div className="text-center">
                  <h1 className="text-3xl font-extrabold mb-2">{slide.title}</h1>
                  <p className="text-lg text-white/90 font-semibold mb-4">{slide.subtitle}</p>
                  <p className="text-white/70 leading-relaxed">{slide.description}</p>
                </div>

                <div className="grid grid-cols-3 gap-3 mt-8">
                  <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 text-center border border-white/10">
                    <p className="text-2xl font-bold">26</p>
                    <p className="text-xs text-white/70">Pemain</p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 text-center border border-white/10">
                    <p className="text-2xl font-bold">1927</p>
                    <p className="text-xs text-white/70">Berdiri</p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 text-center border border-white/10">
                    <p className="text-2xl font-bold">100K+</p>
                    <p className="text-xs text-white/70">Fans</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-2">
          {HERO_SLIDES.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentSlide ? 'bg-white w-8' : 'bg-white/40 hover:bg-white/60'
              }`}
            />
          ))}
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
          <div className="h-full bg-white transition-all duration-300 ease-linear" style={{ width: `${((currentSlide + 1) / HERO_SLIDES.length) * 100}%` }} />
        </div>
      </div>

      {/* RIGHT SIDE - LOGIN FORM */}
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
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">Selamat Datang di Rumah Green Force</h2>
              <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
                Ikuti perjalanan Bajol Ijo, kenali para pemain, baca berita terbaru.
              </p>
              <p className="text-gray-400 text-sm sm:text-base mt-2">
                Masukkan Email dan Password Anda!
              </p>
            </div>

            {error && (
              <div className="mb-4 sm:mb-6 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm text-center">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
              {/* Email */}
              <div>
                <label className="block text-sm font-bold text-gray-300 mb-2 ml-1">EMAIL</label>
                <div className="relative">
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="contoh@email.com"
                    required
                    className="w-full px-5 py-3.5 rounded-xl bg-gray-700/50 border border-gray-600 text-white placeholder-gray-500 focus:outline-none focus:border-persebaya-green focus:ring-2 focus:ring-persebaya-green/20 transition pl-14 text-sm sm:text-base"
                  />
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-bold text-gray-300 mb-2 ml-1">KATA SANDI</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Masukkan kata sandi"
                    required
                    className="w-full px-5 py-3.5 rounded-xl bg-gray-700/50 border border-gray-600 text-white placeholder-gray-500 focus:outline-none focus:border-persebaya-green focus:ring-2 focus:ring-persebaya-green/20 transition pl-14 pr-12 text-sm sm:text-base"
                  />
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition"
                  >
                    {showPassword ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-persebaya-green text-white py-3 sm:py-4 rounded-xl font-bold text-base sm:text-lg hover:bg-emerald-600 transition-all shadow-lg hover:shadow-green-500/25 disabled:opacity-50 flex items-center justify-center gap-2 mt-4 sm:mt-6"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                    <span>Memproses...</span>
                  </>
                ) : (
                  'Masuk ke Home'
                )}
              </button>
            </form>

            {/* Footer */}
            <div className="mt-6 text-center">
              <p className="text-gray-400 text-sm sm:text-base">
                Belum punya akun?{' '}
                <Link to="/register" className="text-persebaya-green font-bold hover:underline transition">
                  Buat Akun Baru
                </Link>
              </p>
            </div>

            {/* Demo Credentials */}
            <div className="mt-6 p-3 sm:p-4 rounded-xl bg-gray-700/30 border border-gray-700">
              <p className="text-xs text-center text-gray-400">
                <strong className="text-gray-300">Demo Login:</strong><br />
                Email: admin@persebaya.com<br />
                Password: admin123
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}