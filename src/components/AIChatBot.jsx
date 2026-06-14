import React, { useState, useRef, useEffect } from 'react';

// ==========================================
// COMPREHENSIVE KNOWLEDGE BASE
// ==========================================
const KNOWLEDGE_BASE = {
  persebaya: {
    sejarah: {
      keywords: ['sejarah', 'didirikan', 'berdiri', 'tahun', 'lahir', 'founding', 'history', 'awal', 'mula'],
      answer: `**Persebaya Surabaya** didirikan pada **18 Juni 1927** dengan nama awal **Soerabhaijasche Indonesische Voetbal Bond (SIVB)**.

📌 **Fakta Menarik:**
• Salah satu klub tertua di Indonesia (hampir 100 tahun!)
• Berdiri di era kolonial Belanda
• Pernah bernama Persibaya sebelum jadi Persebaya
• Warna hijau dipilih sebagai identitas klub

Klub ini adalah kebanggaan arek-arek Suroboyo! 💚🏴‍☠️`
    },

    julukan: {
      keywords: ['julukan', 'nama lain', 'nickname', 'bajol', 'bajak', 'sebutan', 'panggilan'],
      answer: `Persebaya memiliki beberapa julukan ikonik:

🏴‍☠️ **Bajol Ijo** (Bajak Laut Ijo)
- Julukan paling legendaris
- Melambangkan keberanian dan kekuatan

🦈 **Suro Boyo**
- Dari legenda Hiu (Suro) dan Buaya (Boyo)
- Simbol pertarungan abadi

💚 **Arek Suroboyo**
- Identitas kebanggaan Surabaya

Semua julukan ini mencerminkan semangat juang Persebaya! 💪`
    },

    prestasi: {
      keywords: ['trofi', 'gelar', 'juara', 'prestasi', 'champion', 'title', 'liga', 'indonesia', 'piala'],
      answer: `**Prestasi Gemilang Persebaya:**

🏆 **Liga/Perserikatan:**
• Perserikatan: 8x (1952, 1957, 1961, 1963, 1965, 1967, 1978, 1988)
• Liga Indonesia: 2x (1996/97, 2004)

🏆 **Piala:**
• Piala Indonesia: 2x (2006, 2007)
• Piala Presiden: 1x (2021)

🏆 **Total: 13 Gelar Juara**

Persebaya adalah salah satu klub tersukses di Indonesia! 🏆💚`
    },

    stadion: {
      keywords: ['stadion', 'markas', 'venue', 'tempat', 'gbt', 'gelora bung', 'lapangan'],
      answer: `**Stadion Persebaya:**

🏟️ **Gelora Bung Tomo (GBT)**
• Kapasitas: ~45.000 penonton
• Lokasi: Jl. Tambaksari, Surabaya
• Dibuka: 2010
• Salah satu stadion terbaik di Indonesia

📍 **Stadion Lama:**
• Stadion Gelora 10 November (sebelum GBT)

GBT dikenal dengan atmosfernya yang panas dan suporter Bonek yang fanatik! 💚🏟️`
    },

    suporter: {
      keywords: ['suporter', 'fans', 'bonek', 'pendukung', 'supporter', 'bondo', 'nekat'],
      answer: `**BONEK (Bondo Nekat)**

🔥 **Profil:**
• Kepanjangan: **Bondo Nekat** (Modal Nejat)
• Berdiri: Era 1980-an
• Salah satu suporter terbesar & paling fanatik di Indonesia

💚 **Karakteristik:**
• Loyalitas tanpa batas
• Koreografi megah di stadion
• Solidaritas tinggi
• Semangat "nekat" dalam mendukung

🏴‍☠️ **Fakta:**
Bonek dikenal sebagai salah satu basis suporter terkuat di Asia Tenggara! 💪`
    },

    pemain: {
      keywords: ['pemain', 'player', 'skuad', 'squad', 'roster', 'pemain sekarang', 'pemain saat ini'],
      answer: `Untuk info lengkap **Skuad Persebaya 2025/2026**:

👥 **Klik tab TIM** di menu navigasi!

Di sana kamu bisa lihat:
• Daftar pemain lengkap
• Posisi (Kiper, Bek, Gelandang, Penyerang)
• Nomor punggung
• Foto & profil detail
• Statistik pemain

Atau cari pemain favoritmu dengan fitur search! 💚⚽`
    },

    rival: {
      keywords: ['rival', 'musuh', 'derby', 'lawan', 'abadi', 'arema', 'persija'],
      answer: `**Rivalitas Persebaya:**

🔥 **Super Derby: Persebaya vs Arema FC**
• Derby Jawa Timur
• Salah satu derby terpanas di Asia Tenggara
• Pertarungan Arek Suroboyo vs Arek Malang
• Selalu penuh atmosfer & emosi

🔥 **Classic Derby: Persebaya vs Persija**
• Rivalitas sejak era Perserikatan
• Jakarta vs Surabaya
• Pertarungan dua kota terbesar

Pertandingan derby selalu ditunggu! ⚽💚`
    },

    maskot: {
      keywords: ['maskot', 'suro', 'boyo', 'hiu', 'buaya', 'lambang', 'logo', 'emblem'],
      answer: `**Maskot Persebaya: SURO & BOYO**

🦈 **Suro** = Hiu
🐊 **Boyo** = Buaya

📖 **Legenda:**
Menurut cerita rakyat Jawa, Suro dan Boyo adalah dua hewan kuat yang bertarung di laut. Karena tidak ada yang menang, keduanya diangkat sebagai simbol kekuatan dan keberanian.

🎨 **Makna:**
• Keberanian
• Kekuatan
• Semangat juang tinggi
• Identitas khas Surabaya

Maskot ini sudah menjadi ikon Persebaya! 💚🏴‍☠️`
    },

    warna: {
      keywords: ['warna', 'color', 'jersey', 'kaos', 'baju', 'kit', 'seragam'],
      answer: `**Warna Identitas Persebaya:**

💚 **Hijau** - Warna Utama
• Hijau tua (Persebaya Green)
• Identitas utama klub

⚪ **Putih** - Warna Kedua
• Kombinasi dengan hijau

🎨 **Kaos:**
• **Kandang:** Hijau dengan detail putih
• **Tandang:** Putih dengan detail hijau
• **Ketiga:** Variasi warna lain

Hijau sudah menjadi DNA Persebaya sejak 1927! 💚🏴‍☠️`
    },

    liga: {
      keywords: ['liga', 'kompetisi', 'liga 1', 'bri liga', 'divisi', 'kasta'],
      answer: `**Kompetisi Persebaya:**

⚽ **BRI Liga 1**
• Liga tertinggi Indonesia
• Diikuti 18 klub terbaik
• Persebaya selalu jadi kandidat juara

📊 **Prestasi di Liga:**
• 2x Juara Liga Indonesia
• Konsisten di papan atas
• Salah satu klub dengan basis suporter terbesar

Persebaya berkomitmen untuk terus berprestasi! 💚🏆`
    },

    kota_surabaya: {
      keywords: ['surabaya', 'kota surabaya', 'tentang surabaya', 'profil surabaya', 'info surabaya'],
      answer: `**KOTA SURABAYA**

🏙️ **Profil:**
• Ibu kota Provinsi Jawa Timur
• Kota terbesar kedua di Indonesia (setelah Jakarta)
• Luas: ~350 km²
• Populasi: ~3 juta jiwa

🏴‍☠️ **Julukan:**
• **Kota Pahlawan** - Pertempuran 10 November 1945
• **Kota Suroboyo** - Dari legenda Suro & Boyo

📍 **Lokasi:**
Pantai utara Jawa Timur, tepi Selat Madura

Surabaya adalah kota metropolitan dengan sejarah kepahlawanan! 💚`
    },

    sejarah_surabaya: {
      keywords: ['sejarah surabaya', 'asal usul', 'nama surabaya', 'berdiri', 'kota pahlawan'],
      answer: `**Sejarah Kota Surabaya:**

📜 **Asal Nama:**
Dari kata "Suro" (Hiu) dan "Boyo" (Buaya) - dua hewan yang bertarung dalam legenda

🗓️ **Timeline Penting:**
• **1275** - Pertama disebut dalam prasasti
• **1743** - dikuasai VOC Belanda
• **1945** - Pertempuran 10 November (Battle of Surabaya)
• **1950** - Menjadi kota otonom

🔥 **Pertempuran 10 November 1945:**
Pertempuran bersejarah antara arek-arek Suroboyo melawan Sekutu. Peristiwa ini diperingati sebagai **Hari Pahlawan**.

Surabaya adalah simbol keberanian Indonesia! 💚🏴‍☠️`
    },

    wisata_surabaya: {
      keywords: ['wisata', 'tempat wisata', 'tourism', 'jalan-jalan', 'liburan', 'rekreasi', 'monumen'],
      answer: `**Tempat Wisata di Surabaya:**

🏛️ **Sejarah & Budaya:**
• **Monumen Tugu Pahlawan** - Ikon Kota Pahlawan
• **Museum 10 November** - Sejarah pertempuran
• **Gedung Internatio** - Arsitektur kolonial
• **Klenteng Sanggar Agung** - Klenteng unik di atas air

🦁 **Keluarga:**
• **Kebun Binatang Surabaya** - Salah satu yang tertua di Asia
• **Taman Bungkul** - Taman kota favorit
• **Surabaya North Quay** - Wisata tepi laut

🛍️ **Belanja:**
• **Tunjungan Plaza** - Mall terbesar
• **Pasar Atom** - Pusat belanja legendaris

Banyak destinasi menarik di Surabaya! 💚️`
    },

    makanan_surabaya: {
      keywords: ['makanan', 'kuliner', 'makan', 'makanan khas', 'oleh-oleh', 'kuliner'],
      answer: `**Kuliner Khas Surabaya:**

🍜 **Makanan Utama:**
• **Rawon** - Sup daging hitam khas
• **Rujak Cingur** - Rujak dengan cingur (moncong sapi)
• **Lontong Balap** - Lontong dengan taoge & tahu
• **Sate Klopo** - Sate dengan bumbu kelapa
• **Semanggi** - Kudapan dari daun semanggi
• **Tahu Tek** - Tahu dengan lontong & petis

🍰 **Oleh-oleh:**
• **Semprong** - Kue renyah
• **Kue Lapis** - Kue tradisional
• **Tahu Campur** - Oleh-oleh khas

Makanan Surabaya terkenal dengan bumbu petis! Enak-enak semua! 😋💚`
    },

    greeting: {
      keywords: ['halo', 'hai', 'hi', 'hello', 'hey', 'assalamualaikum', 'selamat', 'pagi', 'siang', 'sore', 'malam'],
      answer: `Halo! 👋💚

Selamat datang di **Website Resmi Persebaya Surabaya**!

Aku **AI Asisten Persebaya & Surabaya**. Kamu bisa tanya apa saja tentang:

🏴‍☠️ **Persebaya:**
• Sejarah & prestasi
• Pemain & skuad
• Jadwal pertandingan
• Stadion & tiket
• Suporter Bonek

🏙️ **Kota Surabaya:**
• Sejarah & budaya
• Tempat wisata
• Kuliner khas
• Transportasi
• Dan lainnya!

Mau tanya apa? Aku siap membantu! 😊`
    },

    thanks: {
      keywords: ['terima kasih', 'thanks', 'makasih', 'thank you', 'trims', 'makasi'],
      answer: `Sama-sama! 😊

Senang bisa membantu! Jangan lupa dukung **Bajol Ijo** terus! 🏴‍☠️

**Maju terus Persebaya!**
**Maju terus Surabaya!**

Ada yang mau ditanya lagi? Aku selalu siap membantu! 👍`
    },

    about: {
      keywords: ['siapa kamu', 'siapa anda', 'about', 'tentang kamu', 'bot', 'ai'],
      answer: `Aku adalah **AI Asisten Persebaya & Surabaya**! 🤖

**Tugasku:**
Membantu kamu menemukan informasi tentang:
• Persebaya Surabaya (klub sepak bola)
• Kota Surabaya (sejarah, wisata, kuliner, dll)

**Fitur:**
✅ Jawaban cepat & akurat
✅ Tersedia 24/7
✅ Gratis & mudah digunakan

Aku dibuat untuk membantu fans Persebaya! 😊💚`
    }
  }
};

// ==========================================
// SMART AI RESPONSE GENERATOR
// ==========================================
const generateResponse = (userInput) => {
  const input = userInput.toLowerCase().trim();
  
  const stopWords = ['yang', 'dan', 'di', 'ke', 'dari', 'untuk', 'dengan', 'ini', 'itu', 'apa', 'bagaimana', 'kenapa', 'mengapa', 'kapan', 'dimana', 'berapa', 'apakah', 'tolong', 'bisa', 'bantu', 'info', 'tentang', 'saya', 'aku', 'mau', 'ingin', 'tanya', 'tanyakan', 'kasih', 'tau', 'tahukah', 'apakah'];
  const words = input.split(' ').filter(w => w.length > 2 && !stopWords.includes(w));
  
  let bestMatch = null;
  let bestScore = 0;
  
  // ✅ FIX: Ganti [category, items] jadi [, items] karena category tidak dipakai
  for (const [, items] of Object.entries(KNOWLEDGE_BASE.persebaya)) {
    let score = 0;
    
    for (const keyword of items.keywords) {
      if (input.includes(keyword)) {
        score += 3;
      }
      for (const word of words) {
        if (keyword.includes(word)) {
          score += 2;
        } else if (word.includes(keyword) && keyword.length > 3) {
          score += 1;
        }
      }
    }
    
    if (score > bestScore) {
      bestScore = score;
      bestMatch = items;
    }
  }
  
  if (bestMatch && bestScore > 0) {
    return bestMatch.answer;
  }
  
  const defaultResponses = [
    `Maaf, aku belum paham pertanyaanmu. 😅

Coba tanyakan tentang:

🏴‍☠️ **Persebaya:**
• Sejarah klub (1927)
• Prestasi & gelar juara
• Pemain & skuad
• Jadwal pertandingan
• Stadion GBT
• Suporter Bonek

🏙️ **Surabaya:**
• Sejarah & budaya
• Tempat wisata
• Kuliner khas
• Transportasi

Atau coba gunakan kata kunci yang lebih spesifik! 💚`,

    `Hmm, pertanyaan menarik! 🤔

Aku bisa bantu jawab pertanyaan tentang **Persebaya** dan **Kota Surabaya**.

Coba tanya:
• "Kapan Persebaya berdiri?"
• "Apa julukan Persebaya?"
• "Dimana stadion Persebaya?"
• "Apa makanan khas Surabaya?"
• "Ceritakan sejarah Surabaya"

Mau tanya yang lain? 😊💚`
  ];
  
  return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
};

// ==========================================
// FORMAT MESSAGE
// ==========================================
const formatMessage = (text) => {
  let formatted = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  formatted = formatted.replace(/•/g, '<span class="text-persebaya-green">•</span>');
  formatted = formatted.replace(/\n/g, '<br/>');
  return formatted;
};

// ==========================================
// MAIN COMPONENT
// ==========================================
export default function AIChatBot({ isDarkMode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      text: "Halo! 👋\n\nAku **AI Asisten Persebaya & Surabaya**!\n\nTanya apa saja tentang:\n\n🏴‍☠️ **Persebaya:**\n• Sejarah & prestasi\n• Pemain & jadwal\n• Stadion & Bonek\n\n🏙️ **Surabaya:**\n• Wisata & kuliner\n• Sejarah & budaya\n• Transportasi\n\nKetik pertanyaanmu di bawah! 😊"
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  const handleSend = () => {
    if (!inputValue.trim()) return;
    
    const userMessage = inputValue.trim();
    
    setMessages(prev => [...prev, {
      id: Date.now(),
      type: 'user',
      text: userMessage
    }]);
    
    setInputValue('');
    setIsTyping(true);
    
    setTimeout(() => {
      const response = generateResponse(userMessage);
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        type: 'bot',
        text: response
      }]);
      setIsTyping(false);
    }, 600 + Math.random() * 600);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const quickQuestions = [
    "Sejarah Persebaya",
    "Prestasi Persebaya",
    "Wisata Surabaya",
    "Makanan khas",
    "Siapa Bonek?",
    "Stadion GBT",
  ];

  return (
    <>
      {/* Floating Chat Button - RESPONSIVE & LEBIH KECIL */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 
          w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full shadow-2xl 
          flex items-center justify-center transition-all duration-300
          hover:scale-110 active:scale-95
          ${isOpen 
            ? 'bg-red-500 hover:bg-red-600 rotate-90' 
            : 'bg-gradient-to-r from-persebaya-green to-persebaya-dark hover:shadow-persebaya-green/30'}
        `}
        title={isOpen ? 'Tutup Chat' : 'Chat AI Persebaya'}
        aria-label={isOpen ? 'Tutup Chat' : 'Buka Chat AI'}
      >
        {isOpen ? (
          <svg className="w-5 h-5 sm:w-6 sm:h-6" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        ) : (
          <svg className="w-5 h-5 sm:w-6 sm:h-6" viewBox="0 0 24 24" fill="white">
            <path d="M20 2H4C2.9 2 2 2.9 2 4v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H5.17L4 17.17V4h16v12z"/>
            <path d="M7 9h2v2H7zm4 0h2v2h-2zm4 0h2v2h-2z"/>
          </svg>
        )}
      </button>

      {/* Chat Window - Fully Responsive & Structured */}
      {isOpen && (
        <>
          {/* Overlay untuk mobile */}
          <div 
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Chat Container - FLEX COL LAYOUT */}
          <div className={`
            fixed z-50 
            inset-0 md:inset-auto
            md:bottom-20 md:right-4 lg:bottom-24 lg:right-6
            md:w-80 lg:w-[28rem]
            md:h-[32rem]
            rounded-none md:rounded-2xl
            shadow-2xl overflow-hidden
            transition-all duration-300
            flex flex-col
            ${isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'}
          `}>
            
            {/* Header */}
            <div className="flex-shrink-0 bg-persebaya-green bg-gradient-to-r from-persebaya-green to-persebaya-dark text-white p-3 sm:p-4 shadow-md">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 bg-white/20 rounded-full flex items-center justify-center text-base sm:text-lg md:text-xl flex-shrink-0">
                    🏴‍☠️
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-bold text-sm sm:text-base truncate">AI Asisten Persebaya</h3>
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-400 rounded-full animate-pulse flex-shrink-0"></span>
                      <span className="text-[10px] sm:text-xs opacity-90 truncate hidden sm:inline">Online - Tanya apa saja!</span>
                      <span className="text-[10px] sm:text-xs opacity-90 sm:hidden">Online</span>
                    </div>
                  </div>
                </div>
                
                <button 
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 sm:p-2 hover:bg-white/20 rounded-full transition ml-2"
                  aria-label="Tutup chat"
                  title="Tutup Chat"
                >
                  <svg className="w-5 h-5 sm:w-6 sm:h-6" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
                    <line x1="18" y1="6" x2="6" y2="18"/>
                    <line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                </button>
              </div>
            </div>

            {/* Quick Questions */}
            <div className={`flex-shrink-0 p-2 sm:p-3 border-b ${isDarkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-100 bg-white'}`}>
              <p className={`text-[10px] sm:text-xs mb-1.5 sm:mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>💡 Pertanyaan cepat:</p>
              <div className="flex flex-wrap gap-1 sm:gap-1.5">
                {quickQuestions.map((q, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setMessages(prev => [...prev, {
                        id: Date.now(),
                        type: 'user',
                        text: q
                      }]);
                      setIsTyping(true);
                      setTimeout(() => {
                        const response = generateResponse(q);
                        setMessages(prev => [...prev, {
                          id: Date.now() + 1,
                          type: 'bot',
                          text: response
                        }]);
                        setIsTyping(false);
                      }, 600 + Math.random() * 600);
                    }}
                    className={`
                      text-[10px] sm:text-xs px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-full transition-all whitespace-nowrap
                      ${isDarkMode 
                        ? 'bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white' 
                        : 'bg-gray-100 text-gray-600 hover:bg-persebaya-green hover:text-white'}
                    `}
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>

            {/* Messages */}
            <div 
              className={`flex-1 overflow-y-auto p-3 sm:p-4 space-y-2 sm:space-y-3 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'}`}
            >
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`
                    max-w-[85%] sm:max-w-[80%] px-2.5 sm:px-3 md:px-4 py-2 sm:py-2.5 rounded-2xl text-[10px] sm:text-xs md:text-sm leading-relaxed
                    ${msg.type === 'user'
                      ? 'bg-persebaya-green text-white rounded-br-md'
                      : isDarkMode
                        ? 'bg-gray-700 text-gray-200 rounded-bl-md'
                        : 'bg-white text-gray-800 rounded-bl-md shadow-sm'
                    }
                  `}>
                    {msg.type === 'bot' ? (
                      <div 
                        className="prose prose-[10px] sm:prose-xs max-w-none"
                        dangerouslySetInnerHTML={{ __html: formatMessage(msg.text) }}
                      />
                    ) : (
                      msg.text
                    )}
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start">
                  <div className={`px-2.5 sm:px-3 md:px-4 py-2 sm:py-2.5 md:py-3 rounded-2xl rounded-bl-md ${isDarkMode ? 'bg-gray-700' : 'bg-white shadow-sm'}`}>
                    <div className="flex gap-1.5">
                      <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full animate-bounce bg-gray-400" style={{ animationDelay: '0ms' }}></span>
                      <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full animate-bounce bg-gray-400" style={{ animationDelay: '150ms' }}></span>
                      <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full animate-bounce bg-gray-400" style={{ animationDelay: '300ms' }}></span>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className={`flex-shrink-0 p-2 sm:p-3 border-t ${isDarkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-100 bg-white'}`}>
              <div className="flex gap-1.5 sm:gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Tanya tentang Persebaya atau Surabaya..."
                  className={`
                    flex-1 px-2.5 sm:px-3 md:px-4 py-2 sm:py-2.5 rounded-xl text-[10px] sm:text-xs md:text-sm outline-none transition-all
                    ${isDarkMode 
                      ? 'bg-gray-700 text-white placeholder-gray-400 border border-gray-600 focus:border-green-500' 
                      : 'bg-gray-100 text-gray-800 placeholder-gray-400 border border-gray-200 focus:border-persebaya-green'}
                    focus:ring-2 focus:ring-persebaya-green/20
                  `}
                />
                <button
                  onClick={handleSend}
                  disabled={!inputValue.trim() || isTyping}
                  className={`
                    px-2.5 sm:px-3 md:px-4 py-2 sm:py-2.5 rounded-xl font-bold text-[10px] sm:text-xs md:text-sm transition-all flex-shrink-0
                    ${inputValue.trim() && !isTyping
                      ? 'bg-persebaya-green text-white hover:bg-persebaya-dark active:scale-95'
                      : isDarkMode
                        ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'}
                  `}
                >
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
                  </svg>
                </button>
              </div>
              <p className={`text-[8px] sm:text-[10px] mt-1.5 sm:mt-2 text-center ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                💚 AI Asisten Persebaya & Surabaya
              </p>
            </div>
          </div>
        </>
      )}
    </>
  );
}