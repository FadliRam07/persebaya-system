import React, { useState } from 'react';

const VIDEO_CATEGORIES = ['all', 'Highlights', 'Dokumenter', 'Goals', 'Behind The Scenes'];

const VIDEOS_DATA = [
  {
    id: 1,
    title: "Persebaya vs Arema - All Goals & Highlights",
    category: "Highlights",
    thumbnail: "https://cdn0-production-images-kly.akamaized.net/xec9ncDb1BwuZ6QR8boXXGkbCUM=/0x22:1079x630/1200x675/filters:quality(75):strip_icc():format(jpeg)/kly-media-production/medias/4582194/original/022691400_1695196047-Cover_prediksi_Liga1__Persebaya_vs_Arema__Bola.com_-_Salsa_Dwi_Novita.jpg",
    duration: "02:25",
    views: "125K",
    date: "2026-01-15",
    description: "Tonton seluruh gol dan momen terbaik pertandingan derby",
    youtubeId: "Ol2Wt8pXzo8" // ✅ Video ID dari link kamu
  },
  {
    id: 2,
    title: "Dokumenter: Perjalanan Persebaya 2025/2026",
    category: "Dokumenter",
    thumbnail: "https://assets.poskota.co.id/crop/original/medias/2025/Sep/09/persebaya.jpeg",
    duration: "08.52",
    views: "89K",
    date: "2026-01-10",
    description: "Dokumenter eksklusif perjalanan tim di musim ini",
    youtubeId: "Ou3X_eR4LUk"
  },
  {
    id: 3,
    title: "Top 10 Goals Persebaya 2025",
    category: "Goals",
    thumbnail: "https://i.ytimg.com/vi/sDwKiq0x5Qo/maxresdefault.jpg",
    duration: "16.05",
    views: "210K",
    date: "2026-01-05",
    description: "Gol-gol terbaik sepanjang musim",
    youtubeId: "6xO8LaqRMT0"
  },
  {
    id: 4,
    title: "Behind The Scenes: Latihan Tim",
    category: "Behind The Scenes",
    thumbnail: "https://asset.tribunnews.com/tL54hNidnVeMwM4r6jogET05HCo=/1200x675/filters:upscale():quality(30):format(webp):focal(0.5x0.5:0.5x0.5)/wow/foto/bank/originals/Persebaya-Surabaya-melakukan-latihan.jpg",
    duration: "09.15",
    views: "67K",
    date: "2026-01-01",
    description: "Intip keseruan latihan tim Persebaya",
    youtubeId: "_N7aDCTmLx0"
  },
  {
    id: 5,
    title: "Persebaya vs Persija - Full Match Highlights",
    category: "Highlights",
    thumbnail: "https://tse4.mm.bing.net/th/id/OIP.e-TqYTkXAWW32rYf_ayxFgHaEK?pid=Api&P=0&h=180",
    duration: "07.35",
    views: "156K",
    date: "2025-12-28",
    description: "Highlight pertandingan seru melawan Persija",
    youtubeId: "NAgm1E_lKWA"
  },
  {
    id: 6,
    title: "Profil Pemain: Risto Mitrevski",
    category: "Dokumenter",
    thumbnail: "https://cdn-assets.jawapos.com/images/1/2026/01/27/dd3d3f92-0fc1-4d8e-9244-bff24fcec28e-3299385138.jpg",
    duration: "10.05",
    views: "92K",
    date: "2026-03-20",
    description: "Mengenal lebih dekat sang Bek andalan",
    youtubeId: "HYFmQZbTzeM"
  }
];

export default function Videos({ isDarkMode }) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedVideo, setSelectedVideo] = useState(null);

  const filteredVideos = selectedCategory === 'all' 
    ? VIDEOS_DATA 
    : VIDEOS_DATA.filter(v => v.category === selectedCategory);

  // Jika ada video yang dipilih, tampilkan full page player
  if (selectedVideo) {
    return (
      <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-100'} py-6 sm:py-8 px-3 sm:px-4`}>
        <div className="max-w-6xl mx-auto">
          
          {/* Back Button */}
          <button
            onClick={() => setSelectedVideo(null)}
            className={`flex items-center gap-2 font-bold mb-6 hover:underline text-base sm:text-lg ${isDarkMode ? 'text-green-400' : 'text-persebaya-green'}`}
          >
            <span>←</span> Kembali ke Daftar Video
          </button>

          {/* Video Player Container */}
          <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden`}>
            
            {/* ✅ VIDEO PLAYER - YouTube Embed */}
            <div className="aspect-video bg-black">
              {selectedVideo.youtubeId ? (
                <iframe
                  src={`https://www.youtube.com/embed/${selectedVideo.youtubeId}?autoplay=1`}
                  title={selectedVideo.title}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                ></iframe>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white">
                  <p>Video tidak tersedia</p>
                </div>
              )}
            </div>
            
            {/* Video Info */}
            <div className="p-6 sm:p-8">
              <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-4">
                <span className="bg-persebaya-green text-white px-3 py-1 rounded-full text-xs sm:text-sm font-bold">
                  {selectedVideo.category}
                </span>
                <span className={`text-xs sm:text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  👁 {selectedVideo.views} views
                </span>
                <span className={`text-xs sm:text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  📅 {new Date(selectedVideo.date).toLocaleDateString('id-ID')}
                </span>
                <span className={`text-xs sm:text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  ⏱ {selectedVideo.duration}
                </span>
              </div>
              
              <h1 className={`text-2xl sm:text-3xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {selectedVideo.title}
              </h1>
              
              <p className={`text-sm sm:text-base leading-relaxed ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                {selectedVideo.description}
              </p>

              {/* Related Videos */}
              <div className="mt-8 pt-8 border-t border-gray-700">
                <h3 className={`text-lg sm:text-xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Video Lainnya
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {VIDEOS_DATA.filter(v => v.id !== selectedVideo.id).slice(0, 3).map(video => (
                    <div
                      key={video.id}
                      onClick={() => setSelectedVideo(video)}
                      className={`cursor-pointer ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'} rounded-xl overflow-hidden hover:shadow-lg transition`}
                    >
                      <div className="aspect-video relative">
                        <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover" />
                        <div className="absolute bottom-2 right-2 bg-black/80 text-white px-2 py-1 rounded text-xs">
                          {video.duration}
                        </div>
                      </div>
                      <div className="p-3">
                        <h4 className={`font-bold text-sm mb-1 line-clamp-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                          {video.title}
                        </h4>
                        <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          👁 {video.views}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Tampilan daftar video (grid)
  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-100'} py-6 sm:py-8 px-3 sm:px-4`}>
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="mb-8 sm:mb-12">
          <h1 className={`text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Video & <span className="text-persebaya-green">Highlights</span>
          </h1>
          <p className={`text-base sm:text-lg ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Tonton momen terbaik, gol-gol indah, dan dokumenter eksklusif Persebaya
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 sm:gap-3 mb-6 sm:mb-8">
          {VIDEO_CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 sm:px-5 py-2 sm:py-2.5 rounded-xl font-semibold text-xs sm:text-sm transition-all ${
                selectedCategory === cat
                  ? 'bg-persebaya-green text-white shadow-lg'
                  : `${isDarkMode ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'bg-white text-gray-700 hover:bg-gray-100'} shadow`
              }`}
            >
              {cat === 'all' ? 'Semua Video' : cat}
            </button>
          ))}
        </div>

        {/* Video Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {filteredVideos.map(video => (
            <div
              key={video.id}
              onClick={() => setSelectedVideo(video)}
              className={`group cursor-pointer ${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1`}
            >
              {/* Thumbnail */}
              <div className="relative aspect-video overflow-hidden">
                <img 
                  src={video.thumbnail} 
                  alt={video.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                {/* Overlay */}
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/60 transition-colors flex items-center justify-center">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 bg-persebaya-green rounded-full flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                    <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white ml-1" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M6.3 5.84a.75.75 0 011.06-.04l6.5 6a.75.75 0 010 1.08l-6.5 6a.75.75 0 11-1.02-1.08L12.19 10 6.34 5.88a.75.75 0 01-.04-1.04z" />
                    </svg>
                  </div>
                </div>
                {/* Duration Badge */}
                <div className="absolute bottom-2 right-2 bg-black/80 text-white px-2 py-1 rounded text-xs font-medium">
                  {video.duration}
                </div>
                {/* Category Badge */}
                <div className="absolute top-2 left-2 bg-persebaya-green text-white px-2 sm:px-3 py-1 rounded-lg text-xs font-bold">
                  {video.category}
                </div>
              </div>

              {/* Info */}
              <div className="p-4 sm:p-5">
                <h3 className={`font-bold text-base sm:text-lg mb-2 line-clamp-2 ${isDarkMode ? 'text-white' : 'text-gray-900'} group-hover:text-persebaya-green transition-colors`}>
                  {video.title}
                </h3>
                <p className={`text-xs sm:text-sm mb-3 line-clamp-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {video.description}
                </p>
                <div className={`flex items-center justify-between text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                  <span>👁 {video.views} views</span>
                  <span>📅 {new Date(video.date).toLocaleDateString('id-ID')}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredVideos.length === 0 && (
          <div className={`text-center py-16 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            <div className="text-6xl mb-4">🎥</div>
            <p className="text-lg font-semibold">Tidak ada video di kategori ini</p>
          </div>
        )}
      </div>
    </div>
  );
}