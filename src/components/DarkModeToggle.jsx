// frontend/src/components/DarkModeToggle.jsx
import React from 'react';

export default function DarkModeToggle({ isDarkMode, toggleDarkMode }) {
  return (
    <div className="relative inline-flex items-center">
      <style>{`
        @keyframes swimLeft {
          0%, 100% { transform: translateX(0) translateY(0) rotate(0deg); }
          25% { transform: translateX(-2px) translateY(-2px) rotate(-3deg); }
          50% { transform: translateX(0) translateY(-4px) rotate(0deg); }
          75% { transform: translateX(2px) translateY(-2px) rotate(3deg); }
        }
        @keyframes swimRight {
          0%, 100% { transform: translateX(0) translateY(0) rotate(0deg); }
          25% { transform: translateX(2px) translateY(-2px) rotate(3deg); }
          50% { transform: translateX(0) translateY(-4px) rotate(0deg); }
          75% { transform: translateX(-2px) translateY(-2px) rotate(-3deg); }
        }
        @keyframes bubble {
          0% { opacity: 1; transform: translateY(0) scale(1); }
          100% { opacity: 0; transform: translateY(-20px) scale(0.3); }
        }
        @keyframes twinkle {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }
        @keyframes wave {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(-3px); }
        }
        .animate-swim-left { animation: swimLeft 2s ease-in-out infinite; }
        .animate-swim-right { animation: swimRight 2s ease-in-out infinite; }
        .animate-bubble { animation: bubble 1.5s ease-in-out infinite; }
        .animate-bubble-delay { animation: bubble 1.5s ease-in-out infinite 0.5s; }
        .animate-twinkle { animation: twinkle 2s ease-in-out infinite; }
        .animate-twinkle-delay { animation: twinkle 2s ease-in-out infinite 0.7s; }
        .animate-wave { animation: wave 3s ease-in-out infinite; }
      `}</style>

      <input
        type="checkbox"
        id="darkModeToggle"
        checked={isDarkMode}
        onChange={toggleDarkMode}
        className="hidden"
      />
      
      <label
        htmlFor="darkModeToggle"
        className={`
          block h-7 sm:h-8 md:h-9 rounded-full cursor-pointer relative w-14 sm:w-16 shadow-lg 
          transition-all duration-500 ease-in-out overflow-hidden
          ${isDarkMode 
            ? 'bg-gradient-to-r from-indigo-900 via-purple-900 to-indigo-800' 
            : 'bg-gradient-to-r from-sky-400 via-cyan-300 to-sky-500'}
        `}
      >
        {/* ===== LIGHT MODE - SHARK (HIU) ===== */}
        <div 
          className={`absolute inset-0 transition-all duration-500 ${isDarkMode ? 'opacity-0 -translate-x-full' : 'opacity-100 translate-x-0'}`}
        >
          {/* Clouds */}
          <div className="absolute top-0.5 sm:top-1 right-1.5 sm:right-2 w-2 sm:w-3 h-1.5 sm:h-2 bg-white/40 rounded-full"></div>
          <div className="absolute top-1 sm:top-2 right-3 sm:right-5 w-1.5 sm:w-2 h-1 sm:h-1.5 bg-white/30 rounded-full"></div>
          
          {/* Sun */}
          <div className="absolute top-0.5 right-1.5 sm:right-3 w-3 sm:w-4 h-3 sm:h-4 bg-yellow-300 rounded-full shadow-md"></div>
          
          {/* Wave decoration */}
          <div className="absolute bottom-0 left-0 right-0 h-1.5 sm:h-2 animate-wave">
            <svg viewBox="0 0 64 8" className="w-full h-full">
              <path d="M0 4 Q8 0 16 4 Q24 8 32 4 Q40 0 48 4 Q56 8 64 4" stroke="white" strokeWidth="1.5" fill="none" opacity="0.5"/>
            </svg>
          </div>
          
          {/* Shark - centered in the left area */}
          <div className="absolute inset-0 flex items-center pl-0.5 sm:pl-1">
            <div className="animate-swim-left">
              <svg className="w-6 h-6 sm:w-7.5 sm:h-7.5" viewBox="0 0 120 120" fill="none">
                {/* Body */}
                <ellipse cx="60" cy="60" rx="40" ry="25" fill="#60A5FA" opacity="0.9"/>
                <ellipse cx="60" cy="60" rx="38" ry="23" fill="#93C5FD" opacity="0.7"/>
                
                {/* Tail */}
                <path d="M15 60 L0 45 L5 60 L0 75 Z" fill="#60A5FA"/>
                <path d="M15 60 L3 48 L7 60 L3 72 Z" fill="#93C5FD"/>
                
                {/* Top fin */}
                <path d="M55 38 L65 15 L72 37 Z" fill="#60A5FA"/>
                <path d="M57 38 L64 20 L69 37 Z" fill="#93C5FD"/>
                
                {/* Side fin */}
                <path d="M50 70 L35 85 L55 72 Z" fill="#60A5FA" opacity="0.8"/>
                
                {/* Eye */}
                <circle cx="42" cy="55" r="8" fill="white"/>
                <circle cx="40" cy="55" r="5" fill="#1E3A8A"/>
                <circle cx="38" cy="53" r="2" fill="white"/>
                
                {/* Gills */}
                <line x1="55" y1="52" x2="60" y2="50" stroke="#3B82F6" strokeWidth="1.5" opacity="0.6"/>
                <line x1="56" y1="57" x2="61" y2="55" stroke="#3B82F6" strokeWidth="1.5" opacity="0.6"/>
                <line x1="55" y1="62" x2="60" y2="60" stroke="#3B82F6" strokeWidth="1.5" opacity="0.6"/>
                
                {/* Mouth */}
                <path d="M25 65 Q35 70 45 65" stroke="#1E3A8A" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
                
                {/* Teeth */}
                <path d="M28 66 L30 62 L32 66" stroke="#1E3A8A" strokeWidth="1" fill="none"/>
                <path d="M34 67 L36 63 L38 67" stroke="#1E3A8A" strokeWidth="1" fill="none"/>
                <path d="M40 66 L42 62 L44 66" stroke="#1E3A8A" strokeWidth="1" fill="none"/>
                
                {/* Belly highlight */}
                <ellipse cx="65" cy="68" rx="20" ry="10" fill="white" opacity="0.3"/>
              </svg>
            </div>
          </div>
          
          {/* Bubbles */}
          <div className="absolute bottom-1 sm:bottom-2 right-2 sm:right-4">
            <div className="w-1.5 sm:w-2 h-1.5 sm:h-2 bg-white/50 rounded-full animate-bubble"></div>
          </div>
          <div className="absolute bottom-2 sm:bottom-4 right-3 sm:right-6">
            <div className="w-1 sm:w-1.5 h-1 sm:h-1.5 bg-white/40 rounded-full animate-bubble-delay"></div>
          </div>
        </div>

        {/* ===== DARK MODE - CROCODILE (BUAYA) ===== */}
        <div 
          className={`absolute inset-0 transition-all duration-500 ${isDarkMode ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full'}`}
        >
          {/* Stars */}
          <div className="absolute top-0.5 sm:top-1 left-1.5 sm:left-3 w-0.5 sm:w-1 h-0.5 sm:h-1 bg-yellow-200 rounded-full animate-twinkle"></div>
          <div className="absolute top-1 sm:top-2 left-3 sm:left-7 w-0.3 sm:w-0.5 h-0.3 sm:h-0.5 bg-yellow-100 rounded-full animate-twinkle-delay"></div>
          <div className="absolute top-0.5 right-1.5 sm:right-2 w-0.5 sm:w-1 h-0.5 sm:h-1 bg-yellow-200 rounded-full animate-twinkle"></div>
          <div className="absolute top-1.5 sm:top-3 left-4 sm:left-10 w-0.3 sm:w-0.5 h-0.3 sm:h-0.5 bg-yellow-100 rounded-full animate-twinkle-delay"></div>
          <div className="absolute top-0.5 sm:top-1 right-3 sm:right-6 w-0.3 sm:w-0.5 h-0.3 sm:h-0.5 bg-yellow-200 rounded-full animate-twinkle"></div>
          
          {/* Moon */}
          <div className="absolute top-0.5 right-1.5 sm:right-3">
            <svg className="w-3 h-3 sm:w-4 sm:h-4" viewBox="0 0 24 24">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" fill="#FDE68A" opacity="0.9"/>
              <circle cx="18" cy="8" r="1" fill="#FDE68A" opacity="0.5"/>
              <circle cx="15" cy="14" r="0.5" fill="#FDE68A" opacity="0.4"/>
            </svg>
          </div>
          
          {/* Water reflection */}
          <div className="absolute bottom-0 left-0 right-0 h-1.5 sm:h-2">
            <svg viewBox="0 0 64 8" className="w-full h-full">
              <path d="M0 4 Q8 2 16 4 Q24 6 32 4 Q40 2 48 4 Q56 6 64 4" stroke="#10B981" strokeWidth="1.5" fill="none" opacity="0.5"/>
            </svg>
          </div>
          
          {/* Crocodile - centered in the right area */}
          <div className="absolute inset-0 flex items-center justify-end pr-0.5 sm:pr-1">
            <div className="animate-swim-right">
              <svg className="w-6 h-6 sm:w-7.5 sm:h-7.5" viewBox="0 0 120 120" fill="none">
                {/* Body - elongated */}
                <ellipse cx="65" cy="62" rx="45" ry="20" fill="#10B981" opacity="0.9"/>
                <ellipse cx="65" cy="62" rx="43" ry="18" fill="#34D399" opacity="0.6"/>
                
                {/* Belly */}
                <ellipse cx="65" cy="72" rx="35" ry="8" fill="#6EE7B7" opacity="0.5"/>
                
                {/* Tail */}
                <path d="M100 62 L115 50 L110 62 L118 74 Z" fill="#10B981"/>
                <path d="M100 62 L112 54 L108 62 L114 70 Z" fill="#34D399"/>
                
                {/* Legs */}
                <rect x="40" y="78" width="6" height="10" rx="3" fill="#10B981"/>
                <rect x="70" y="78" width="6" height="10" rx="3" fill="#10B981"/>
                <rect x="85" y="78" width="6" height="8" rx="3" fill="#10B981"/>
                
                {/* Eyes - on top of head */}
                <circle cx="30" cy="48" r="7" fill="#10B981"/>
                <circle cx="30" cy="48" r="5" fill="white"/>
                <circle cx="31" cy="48" r="3" fill="#064E3B"/>
                <circle cx="32" cy="47" r="1" fill="white"/>
                
                {/* Eye bumps */}
                <circle cx="30" cy="44" r="4" fill="#10B981"/>
                <circle cx="30" cy="44" r="2" fill="white"/>
                <circle cx="30" cy="44" r="1" fill="#064E3B"/>
                
                {/* Snout */}
                <ellipse cx="22" cy="60" rx="15" ry="10" fill="#10B981"/>
                <ellipse cx="22" cy="60" rx="13" ry="8" fill="#34D399" opacity="0.7"/>
                
                {/* Nostrils */}
                <circle cx="14" cy="57" r="1.5" fill="#064E3B"/>
                <circle cx="18" cy="56" r="1.5" fill="#064E3B"/>
                
                {/* Mouth line */}
                <path d="M8 62 Q18 65 28 62" stroke="#064E3B" strokeWidth="1.5" fill="none"/>
                
                {/* Teeth */}
                <path d="M12 62 L13 58 L14 62" stroke="#064E3B" strokeWidth="1" fill="white"/>
                <path d="M16 62 L17 58 L18 62" stroke="#064E3B" strokeWidth="1" fill="white"/>
                <path d="M20 62 L21 58 L22 62" stroke="#064E3B" strokeWidth="1" fill="white"/>
                <path d="M24 62 L25 58 L26 62" stroke="#064E3B" strokeWidth="1" fill="white"/>
                
                {/* Scales on back */}
                <circle cx="50" cy="48" r="3" fill="#059669" opacity="0.4"/>
                <circle cx="60" cy="46" r="3" fill="#059669" opacity="0.4"/>
                <circle cx="70" cy="47" r="3" fill="#059669" opacity="0.4"/>
                <circle cx="80" cy="48" r="3" fill="#059669" opacity="0.4"/>
                <circle cx="90" cy="50" r="2.5" fill="#059669" opacity="0.4"/>
                
                {/* Spines on back */}
                <path d="M50 48 L48 40 L52 47 Z" fill="#059669" opacity="0.6"/>
                <path d="M60 46 L58 38 L62 45 Z" fill="#059669" opacity="0.6"/>
                <path d="M70 47 L68 39 L72 46 Z" fill="#059669" opacity="0.6"/>
                <path d="M80 48 L78 40 L82 47 Z" fill="#059669" opacity="0.6"/>
              </svg>
            </div>
          </div>
        </div>
      </label>
    </div>
  );
}