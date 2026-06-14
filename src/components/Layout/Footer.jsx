// frontend/src/components/Layout/Footer.jsx
import React from 'react';

export default function Footer({ isDarkMode }) {
  return (
    <footer className={`${isDarkMode ? 'bg-gray-900' : 'bg-gray-800'} text-white text-center py-4 sm:py-6 mt-8 sm:mt-12`}>
      <div className="max-w-7xl mx-auto px-4">
        <p className="font-semibold text-xs sm:text-sm md:text-base">© 2026 Persebaya Surabaya | Sistem Manajemen Klub Terintegrasi</p>
        <p className="text-gray-400 text-[10px] sm:text-xs md:text-sm mt-1 sm:mt-2">Powered by React + Tailwind CSS + Node.js + MySQL</p>
        <p className="text-gray-400 text-[10px] sm:text-xs md:text-sm mt-1">Created by Fadli Ramadhan 2026 Project-Akhir</p>
      </div>
    </footer>
  );
}