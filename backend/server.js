// backend/server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
const path = require('path');
const fs = require('fs');
const multer = require('multer');

const app = express();

// ==========================================
// 📋 MIDDLEWARE CONFIGURATION
// ==========================================
app.use((req, res, next) => {
  console.log(`[📥 ${new Date().toLocaleTimeString('id-ID')}] ${req.method} ${req.originalUrl}`);
  next();
});

app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000', '*'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ==========================================
// 📁 UPLOAD CONFIGURATION (Multer)
// ==========================================
const UPLOADS_DIR = path.join(__dirname, 'uploads');
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
  console.log('📁 Uploads directory created:', UPLOADS_DIR);
}
app.use('/uploads', express.static(UPLOADS_DIR));

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOADS_DIR),
  filename: (req, file, cb) => {
    const uid = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `upload-${uid}${path.extname(file.originalname)}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|gif|webp/;
    const extOk = allowed.test(path.extname(file.originalname).toLowerCase());
    const mimeOk = allowed.test(file.mimetype);
    if (extOk && mimeOk) cb(null, true);
    else cb(new Error('Format gambar tidak didukung. Gunakan JPG, PNG, GIF, atau WebP.'), false);
  }
});

const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') return res.status(400).json({ error: 'Ukuran file terlalu besar. Maksimal 5MB.' });
    return res.status(400).json({ error: `Upload error: ${err.message}` });
  } else if (err) return res.status(400).json({ error: err.message });
  next();
};
app.use(handleMulterError);

// ==========================================
// 🗄️ DATABASE CONFIGURATION - TiDB Cloud
// ==========================================
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT) || 4000,  // ⚠️ TiDB pakai port 4000
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'persebaya_db',
  ssl: {
    minVersion: 'TLSv1.2',
    rejectUnauthorized: true
  },
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

let pool = null;
let dbConnected = false;

// ==========================================
// 🔌 DATABASE CONNECTION (Simplified for TiDB)
// ==========================================
async function initDB() {
  try {
    console.log('🔌 Connecting to TiDB Cloud...');
    
    // Langsung connect ke database (karena sudah dibuat manual di TiDB)
    pool = mysql.createPool(dbConfig);
    
    // Test koneksi
    await pool.query('SELECT 1');
    dbConnected = true;
    
    console.log('✅ Connected to TiDB Cloud successfully!');
    console.log('📊 Database:', dbConfig.database);
    console.log('🔐 SSL: Enabled');
    
  } catch (err) {
    console.error('❌ Database connection failed:', err.message);
    console.error('🔍 Error code:', err.code);
    dbConnected = false;
    
    // Debug info
    console.log('\n🔍 Debug Info:');
    console.log('   Host:', dbConfig.host);
    console.log('   Port:', dbConfig.port);
    console.log('   User:', dbConfig.user);
    console.log('   Database:', dbConfig.database);
    console.log('   SSL:', dbConfig.ssl ? 'Enabled' : 'Disabled');
  }
}

const query = (sql, params = []) => dbConnected ? pool.query(sql, params).then(([r]) => r) : Promise.resolve([]);
const execute = (sql, params = []) => dbConnected ? pool.query(sql, params).then(([r]) => r) : Promise.resolve({ affectedRows: 0, insertId: null });

// ==========================================
// 🌐 API ROUTES
// ==========================================

app.get('/', (req, res) => res.json({ status: '✅ Persebaya Backend Ready', version: '1.0.0', timestamp: new Date().toISOString() }));
app.get('/api/health', (req, res) => res.json({ status: 'OK', database: dbConnected ? 'connected' : 'disconnected', timestamp: new Date().toISOString() }));

// ==========================================
// 👥 PLAYERS ROUTES
// ==========================================
app.get('/api/players', async (req, res) => {
  try {
    const data = await query('SELECT * FROM players ORDER BY jersey_number ASC');
    res.json(data);
  } catch (error) { console.error('❌ Error fetching players:', error); res.status(500).json({ error: error.message }); }
});

app.post('/api/players', upload.single('image'), async (req, res) => {
  console.log('📥 POST /api/players - Body:', req.body, 'File:', req.file?.filename);
  if (!dbConnected) return res.status(503).json({ error: 'Database disconnected' });
  try {
    const { name, position, jersey_number, nationality, description } = req.body;
    if (!name || !position || !jersey_number) return res.status(400).json({ error: 'Nama, posisi, dan nomor punggung wajib diisi' });
    const imagePath = req.file ? `/uploads/${req.file.filename}` : null;
    const result = await execute(
      `INSERT INTO players (name, position, jersey_number, nationality, description, image) VALUES (?, ?, ?, ?, ?, ?)`,
      [name, position, parseInt(jersey_number), nationality || 'Indonesia', description || '', imagePath]
    );
    res.status(201).json({ id: result.insertId, name, position, jersey_number: parseInt(jersey_number), nationality: nationality || 'Indonesia', description: description || '', image: imagePath });
  } catch (error) { console.error('❌ Error creating player:', error); res.status(500).json({ error: error.message }); }
});

app.put('/api/players/:id', upload.single('image'), async (req, res) => {
  console.log('📥 PUT /api/players/:id - ID:', req.params.id, 'Body:', req.body);
  if (!dbConnected) return res.status(503).json({ error: 'Database disconnected' });
  try {
    const playerId = parseInt(req.params.id);
    const { name, position, jersey_number, nationality, description } = req.body;
    const existing = await query('SELECT * FROM players WHERE id = ?', [playerId]);
    if (!existing.length) return res.status(404).json({ error: 'Pemain tidak ditemukan' });
    let imagePath = existing[0].image;
    if (req.file) {
      imagePath = `/uploads/${req.file.filename}`;
      if (existing[0].image) { const oldPath = path.join(__dirname, existing[0].image); if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath); }
    }
    await execute(
      `UPDATE players SET name = ?, position = ?, jersey_number = ?, nationality = ?, description = ?, image = ? WHERE id = ?`,
      [name, position, parseInt(jersey_number), nationality || 'Indonesia', description || '', imagePath, playerId]
    );
    res.json({ success: true, message: 'Pemain berhasil diupdate', image: imagePath });
  } catch (error) { console.error('❌ Error updating player:', error); res.status(500).json({ error: error.message }); }
});

app.delete('/api/players/:id', async (req, res) => {
  console.log('📥 DELETE /api/players/:id - ID:', req.params.id);
  if (!dbConnected) return res.status(503).json({ error: 'Database disconnected' });
  try {
    const playerId = parseInt(req.params.id);
    const existing = await query('SELECT image FROM players WHERE id = ?', [playerId]);
    if (!existing.length) return res.status(404).json({ error: 'Pemain tidak ditemukan' });
    if (existing[0].image) { const imagePath = path.join(__dirname, existing[0].image); if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath); }
    await execute('DELETE FROM players WHERE id = ?', [playerId]);
    res.json({ success: true, message: 'Pemain berhasil dihapus' });
  } catch (error) { console.error('❌ Error deleting player:', error); res.status(500).json({ error: error.message }); }
});

// ==========================================
// 📅 SCHEDULES ROUTES
// ==========================================
app.get('/api/schedule', async (req, res) => {
  try {
    const data = await query('SELECT * FROM schedules ORDER BY date ASC, time ASC');
    res.json(data);
  } catch (error) { console.error('❌ Error fetching schedules:', error); res.status(500).json({ error: error.message }); }
});

app.post('/api/schedule', async (req, res) => {
  console.log('📥 POST /api/schedule - Body:', req.body);
  if (!dbConnected) return res.status(503).json({ error: 'Database disconnected' });
  try {
    const { opponent, date, time, venue, status, home_score, away_score } = req.body;
    if (!opponent || !date || !time) return res.status(400).json({ error: 'Lawan, tanggal, dan waktu wajib diisi' });
    
    if (status === 'completed' && (home_score === '' || home_score === undefined || away_score === '' || away_score === undefined)) {
      return res.status(400).json({ error: 'Skor wajib diisi untuk pertandingan yang sudah selesai' });
    }
    
    const result = await execute(
      'INSERT INTO schedules (opponent, date, time, venue, status, home_score, away_score) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [opponent, date, time, venue || 'TBD', status || 'upcoming', 
       status === 'completed' ? parseInt(home_score) : null, 
       status === 'completed' ? parseInt(away_score) : null]
    );
    
    res.status(201).json({
      id: result.insertId, opponent, date, time, venue: venue || 'TBD', status: status || 'upcoming',
      home_score: status === 'completed' ? parseInt(home_score) : null,
      away_score: status === 'completed' ? parseInt(away_score) : null
    });
  } catch (error) { console.error('❌ Error creating schedule:', error); res.status(500).json({ error: error.message }); }
});

app.put('/api/schedule/:id', async (req, res) => {
  console.log('📥 PUT /api/schedule/:id - ID:', req.params.id, 'Body:', req.body);
  if (!dbConnected) return res.status(503).json({ error: 'Database disconnected' });
  try {
    const scheduleId = parseInt(req.params.id);
    const { opponent, date, time, venue, status, home_score, away_score } = req.body;
    
    if (status === 'completed' && (home_score === '' || home_score === undefined || away_score === '' || away_score === undefined)) {
      return res.status(400).json({ error: 'Skor wajib diisi untuk pertandingan yang sudah selesai' });
    }
    
    await execute(
      'UPDATE schedules SET opponent = ?, date = ?, time = ?, venue = ?, status = ?, home_score = ?, away_score = ? WHERE id = ?',
      [opponent, date, time, venue, status, 
       status === 'completed' ? parseInt(home_score) : null, 
       status === 'completed' ? parseInt(away_score) : null, scheduleId]
    );
    
    res.json({ success: true, message: 'Jadwal berhasil diupdate' });
  } catch (error) { console.error('❌ Error updating schedule:', error); res.status(500).json({ error: error.message }); }
});

app.delete('/api/schedule/:id', async (req, res) => {
  console.log('📥 DELETE /api/schedule/:id - ID:', req.params.id);
  if (!dbConnected) return res.status(503).json({ error: 'Database disconnected' });
  try { await execute('DELETE FROM schedules WHERE id = ?', [parseInt(req.params.id)]); res.json({ success: true, message: 'Jadwal berhasil dihapus' }); } catch (error) { console.error('❌ Error deleting schedule:', error); res.status(500).json({ error: error.message }); }
});

// ==========================================
// 📰 NEWS ROUTES
// ==========================================
app.get('/api/news', async (req, res) => { try { res.json(await query('SELECT * FROM news ORDER BY created_at DESC')); } catch (error) { console.error('❌ Error fetching news:', error); res.status(500).json({ error: error.message }); } });

app.post('/api/news', upload.single('image'), async (req, res) => {
  console.log('📥 POST /api/news - Body:', req.body, 'File:', req.file?.filename);
  if (!dbConnected) return res.status(503).json({ error: 'Database disconnected' });
  try {
    const { title, category, excerpt, content, author, date } = req.body;
    if (!title || !content) return res.status(400).json({ error: 'Judul dan konten wajib diisi' });
    const imagePath = req.file ? `/uploads/${req.file.filename}` : null;
    const result = await execute('INSERT INTO news (title, category, excerpt, content, author, image, date) VALUES (?, ?, ?, ?, ?, ?, ?)', [title, category || 'Persebaya', excerpt, content, author, imagePath, date]);
    res.status(201).json({ id: result.insertId, title, category: category || 'Persebaya', excerpt, content, author, image: imagePath, date });
  } catch (error) { console.error('❌ Error creating news:', error); res.status(500).json({ error: error.message }); }
});

app.put('/api/news/:id', upload.single('image'), async (req, res) => {
  console.log('📥 PUT /api/news/:id - ID:', req.params.id, 'Body:', req.body);
  if (!dbConnected) return res.status(503).json({ error: 'Database disconnected' });
  try {
    const newsId = parseInt(req.params.id);
    const { title, category, excerpt, content, author, date } = req.body;
    const existing = await query('SELECT image FROM news WHERE id = ?', [newsId]);
    if (!existing.length) return res.status(404).json({ error: 'Berita tidak ditemukan' });
    let imagePath = existing[0].image;
    if (req.file) { imagePath = `/uploads/${req.file.filename}`; if (existing[0].image) { const oldPath = path.join(__dirname, existing[0].image); if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath); } }
    await execute('UPDATE news SET title = ?, category = ?, excerpt = ?, content = ?, author = ?, image = ?, date = ? WHERE id = ?', [title, category, excerpt, content, author, imagePath, date, newsId]);
    res.json({ success: true, message: 'Berita berhasil diupdate', image: imagePath });
  } catch (error) { console.error('❌ Error updating news:', error); res.status(500).json({ error: error.message }); }
});

app.delete('/api/news/:id', async (req, res) => {
  console.log('📥 DELETE /api/news/:id - ID:', req.params.id);
  if (!dbConnected) return res.status(503).json({ error: 'Database disconnected' });
  try {
    const newsId = parseInt(req.params.id);
    const existing = await query('SELECT image FROM news WHERE id = ?', [newsId]);
    if (!existing.length) return res.status(404).json({ error: 'Berita tidak ditemukan' });
    if (existing[0].image) { const imagePath = path.join(__dirname, existing[0].image); if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath); }
    await execute('DELETE FROM news WHERE id = ?', [newsId]);
    res.json({ success: true, message: 'Berita berhasil dihapus' });
  } catch (error) { console.error('❌ Error deleting news:', error); res.status(500).json({ error: error.message }); }
});

// ==========================================
// 🎉 EVENTS ROUTES
// ==========================================
app.get('/api/events', async (req, res) => { try { res.json(await query('SELECT * FROM events ORDER BY date ASC, time ASC')); } catch (error) { console.error('❌ Error fetching events:', error); res.status(500).json({ error: error.message }); } });

app.post('/api/events', upload.single('image'), async (req, res) => {
  console.log('📥 POST /api/events - Body:', req.body, 'File:', req.file?.filename);
  if (!dbConnected) return res.status(503).json({ error: 'Database disconnected' });
  try {
    const { title, date, time, location, description, price, status } = req.body;
    if (!title || !date) return res.status(400).json({ error: 'Judul dan tanggal wajib diisi' });
    const imagePath = req.file ? `/uploads/${req.file.filename}` : null;
    const result = await execute('INSERT INTO events (title, date, time, location, description, price, status, image) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', [title, date, time, location, description, price, status || 'upcoming', imagePath]);
    res.status(201).json({ id: result.insertId, title, date, time, location, description, price, status: status || 'upcoming', image: imagePath });
  } catch (error) { console.error('❌ Error creating event:', error); res.status(500).json({ error: error.message }); }
});

app.put('/api/events/:id', upload.single('image'), async (req, res) => {
  console.log('📥 PUT /api/events/:id - ID:', req.params.id, 'Body:', req.body);
  if (!dbConnected) return res.status(503).json({ error: 'Database disconnected' });
  try {
    const eventId = parseInt(req.params.id);
    const { title, date, time, location, description, price, status } = req.body;
    const existing = await query('SELECT image FROM events WHERE id = ?', [eventId]);
    if (!existing.length) return res.status(404).json({ error: 'Event tidak ditemukan' });
    let imagePath = existing[0].image;
    if (req.file) { imagePath = `/uploads/${req.file.filename}`; if (existing[0].image) { const oldPath = path.join(__dirname, existing[0].image); if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath); } }
    await execute('UPDATE events SET title = ?, date = ?, time = ?, location = ?, description = ?, price = ?, status = ?, image = ? WHERE id = ?', [title, date, time, location, description, price, status, imagePath, eventId]);
    res.json({ success: true, message: 'Event berhasil diupdate', image: imagePath });
  } catch (error) { console.error('❌ Error updating event:', error); res.status(500).json({ error: error.message }); }
});

app.delete('/api/events/:id', async (req, res) => {
  console.log('📥 DELETE /api/events/:id - ID:', req.params.id);
  if (!dbConnected) return res.status(503).json({ error: 'Database disconnected' });
  try {
    const eventId = parseInt(req.params.id);
    const existing = await query('SELECT image FROM events WHERE id = ?', [eventId]);
    if (!existing.length) return res.status(404).json({ error: 'Event tidak ditemukan' });
    if (existing[0].image) { const imagePath = path.join(__dirname, existing[0].image); if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath); }
    await execute('DELETE FROM events WHERE id = ?', [eventId]);
    res.json({ success: true, message: 'Event berhasil dihapus' });
  } catch (error) { console.error('❌ Error deleting event:', error); res.status(500).json({ error: error.message }); }
});

// ==========================================
// 📜 HISTORY ROUTES
// ==========================================
app.get('/api/history', async (req, res) => { try { res.json(await query('SELECT * FROM history ORDER BY year DESC')); } catch (error) { console.error('❌ Error fetching history:', error); res.status(500).json({ error: error.message }); } });

app.post('/api/history', upload.single('image'), async (req, res) => {
  console.log('📥 POST /api/history - Body:', req.body, 'File:', req.file?.filename);
  if (!dbConnected) return res.status(503).json({ error: 'Database disconnected' });
  try {
    const { title, content, year } = req.body;
    if (!title || !content) return res.status(400).json({ error: 'Judul dan konten wajib diisi' });
    const imagePath = req.file ? `/uploads/${req.file.filename}` : null;
    const result = await execute('INSERT INTO history (title, content, year, image) VALUES (?, ?, ?, ?)', [title, content, year || new Date().getFullYear(), imagePath]);
    res.status(201).json({ id: result.insertId, title, content, year: year || new Date().getFullYear(), image: imagePath });
  } catch (error) { console.error('❌ Error creating history:', error); res.status(500).json({ error: error.message }); }
});

app.put('/api/history/:id', upload.single('image'), async (req, res) => {
  console.log('📥 PUT /api/history/:id - ID:', req.params.id, 'Body:', req.body);
  if (!dbConnected) return res.status(503).json({ error: 'Database disconnected' });
  try {
    const historyId = parseInt(req.params.id);
    const { title, content, year } = req.body;
    const existing = await query('SELECT image FROM history WHERE id = ?', [historyId]);
    if (!existing.length) return res.status(404).json({ error: 'Sejarah tidak ditemukan' });
    let imagePath = existing[0].image;
    if (req.file) { imagePath = `/uploads/${req.file.filename}`; if (existing[0].image) { const oldPath = path.join(__dirname, existing[0].image); if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath); } }
    await execute('UPDATE history SET title = ?, content = ?, year = ?, image = ? WHERE id = ?', [title, content, year, imagePath, historyId]);
    res.json({ success: true, message: 'Sejarah berhasil diupdate', image: imagePath });
  } catch (error) { console.error('❌ Error updating history:', error); res.status(500).json({ error: error.message }); }
});

app.delete('/api/history/:id', async (req, res) => {
  console.log('📥 DELETE /api/history/:id - ID:', req.params.id);
  if (!dbConnected) return res.status(503).json({ error: 'Database disconnected' });
  try {
    const historyId = parseInt(req.params.id);
    const existing = await query('SELECT image FROM history WHERE id = ?', [historyId]);
    if (!existing.length) return res.status(404).json({ error: 'Sejarah tidak ditemukan' });
    if (existing[0].image) { const imagePath = path.join(__dirname, existing[0].image); if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath); }
    await execute('DELETE FROM history WHERE id = ?', [historyId]);
    res.json({ success: true, message: 'Sejarah berhasil dihapus' });
  } catch (error) { console.error('❌ Error deleting history:', error); res.status(500).json({ error: error.message }); }
});

// ==========================================
// 👥 FANS ROUTES
// ==========================================

// 📊 FANS STATS
app.get('/api/fans/stats', async (req, res) => { try { console.log('📥 GET /api/fans/stats'); const data = await query('SELECT * FROM fans_stats ORDER BY sort_order ASC, id ASC'); res.json(data); } catch (error) { console.error('❌ Error fetching fans stats:', error); res.status(500).json({ error: error.message }); } });

app.post('/api/fans/stats', async (req, res) => {
  console.log('📥 POST /api/fans/stats - Body:', req.body, 'Headers:', req.headers['content-type']);
  if (!dbConnected) return res.status(503).json({ error: 'Database disconnected' });
  try {
    const { label, value, sort_order } = req.body;
    console.log('📝 Data received:', { label, value, sort_order });
    if (!label?.trim() || !value?.trim()) return res.status(400).json({ error: 'Label dan value wajib diisi' });
    const result = await execute('INSERT INTO fans_stats (label, value, sort_order) VALUES (?, ?, ?)', [label.trim(), value.trim(), parseInt(sort_order) || 0]);
    res.status(201).json({ id: result.insertId, label: label.trim(), value: value.trim(), sort_order: parseInt(sort_order) || 0 });
  } catch (error) { console.error('❌ Error creating fan stat:', error); res.status(500).json({ error: error.message }); }
});

app.put('/api/fans/stats/:id', async (req, res) => {
  console.log('📥 PUT /api/fans/stats/:id - ID:', req.params.id, 'Body:', req.body);
  if (!dbConnected) return res.status(503).json({ error: 'Database disconnected' });
  try {
    const statId = parseInt(req.params.id);
    const { label, value, sort_order } = req.body;
    if (!label?.trim() || !value?.trim()) return res.status(400).json({ error: 'Label dan value wajib diisi' });
    await execute('UPDATE fans_stats SET label = ?, value = ?, sort_order = ? WHERE id = ?', [label.trim(), value.trim(), parseInt(sort_order) || 0, statId]);
    res.json({ success: true, message: 'Statistik berhasil diupdate' });
  } catch (error) { console.error('❌ Error updating fan stat:', error); res.status(500).json({ error: error.message }); }
});

app.delete('/api/fans/stats/:id', async (req, res) => {
  console.log('📥 DELETE /api/fans/stats/:id - ID:', req.params.id);
  if (!dbConnected) return res.status(503).json({ error: 'Database disconnected' });
  try { const statId = parseInt(req.params.id); await execute('DELETE FROM fans_stats WHERE id = ?', [statId]); res.json({ success: true, message: 'Statistik berhasil dihapus' }); } catch (error) { console.error('❌ Error deleting fan stat:', error); res.status(500).json({ error: error.message }); }
});

// 🎉 FANS ACTIVITIES
app.get('/api/fans/activities', async (req, res) => { try { console.log('📥 GET /api/fans/activities'); const data = await query('SELECT * FROM fans_activities ORDER BY sort_order ASC, id ASC'); res.json(data); } catch (error) { console.error('❌ Error fetching fans activities:', error); res.status(500).json({ error: error.message }); } });

app.post('/api/fans/activities', async (req, res) => {
  console.log('📥 POST /api/fans/activities - Body:', req.body, 'Headers:', req.headers['content-type']);
  if (!dbConnected) return res.status(503).json({ error: 'Database disconnected' });
  try {
    const { title, description, sort_order } = req.body;
    console.log('📝 Data received:', { title, description, sort_order });
    if (!title?.trim()) return res.status(400).json({ error: 'Judul wajib diisi' });
    const result = await execute('INSERT INTO fans_activities (title, description, sort_order) VALUES (?, ?, ?)', [title.trim(), description?.trim() || '', parseInt(sort_order) || 0]);
    res.status(201).json({ id: result.insertId, title: title.trim(), description: description?.trim() || '', sort_order: parseInt(sort_order) || 0 });
  } catch (error) { console.error('❌ Error creating fan activity:', error); res.status(500).json({ error: error.message }); }
});

app.put('/api/fans/activities/:id', async (req, res) => {
  console.log('📥 PUT /api/fans/activities/:id - ID:', req.params.id, 'Body:', req.body);
  if (!dbConnected) return res.status(503).json({ error: 'Database disconnected' });
  try {
    const activityId = parseInt(req.params.id);
    const { title, description, sort_order } = req.body;
    if (!title?.trim()) return res.status(400).json({ error: 'Judul wajib diisi' });
    await execute('UPDATE fans_activities SET title = ?, description = ?, sort_order = ? WHERE id = ?', [title.trim(), description?.trim() || '', parseInt(sort_order) || 0, activityId]);
    res.json({ success: true, message: 'Kegiatan berhasil diupdate' });
  } catch (error) { console.error('❌ Error updating fan activity:', error); res.status(500).json({ error: error.message }); }
});

app.delete('/api/fans/activities/:id', async (req, res) => {
  console.log('📥 DELETE /api/fans/activities/:id - ID:', req.params.id);
  if (!dbConnected) return res.status(503).json({ error: 'Database disconnected' });
  try { const activityId = parseInt(req.params.id); await execute('DELETE FROM fans_activities WHERE id = ?', [activityId]); res.json({ success: true, message: 'Kegiatan berhasil dihapus' }); } catch (error) { console.error('❌ Error deleting fan activity:', error); res.status(500).json({ error: error.message }); }
});

// 🖼️ FANS GALLERY
app.get('/api/fans/gallery', async (req, res) => { try { console.log('📥 GET /api/fans/gallery'); const data = await query('SELECT * FROM fans_gallery ORDER BY sort_order ASC, id ASC'); res.json(data); } catch (error) { console.error('❌ Error fetching fans gallery:', error); res.status(500).json({ error: error.message }); } });

app.post('/api/fans/gallery', upload.single('image'), async (req, res) => {
  console.log('📥 POST /api/fans/gallery - Body:', req.body, 'File:', req.file);
  if (!dbConnected) return res.status(503).json({ error: 'Database disconnected' });
  try {
    if (!req.file) return res.status(400).json({ error: 'Gambar wajib diupload' });
    const { caption, sort_order } = req.body;
    const imagePath = `/uploads/${req.file.filename}`;
    console.log('📝 Data received:', { caption, imagePath, sort_order });
    const result = await execute('INSERT INTO fans_gallery (image, caption, sort_order) VALUES (?, ?, ?)', [imagePath, caption?.trim() || '', parseInt(sort_order) || 0]);
    res.status(201).json({ id: result.insertId, image: imagePath, caption: caption?.trim() || '', sort_order: parseInt(sort_order) || 0 });
  } catch (error) { console.error('❌ Error creating gallery item:', error); res.status(500).json({ error: error.message }); }
});

app.put('/api/fans/gallery/:id', upload.single('image'), async (req, res) => {
  console.log('📥 PUT /api/fans/gallery/:id - ID:', req.params.id, 'Body:', req.body, 'File:', req.file);
  if (!dbConnected) return res.status(503).json({ error: 'Database disconnected' });
  try {
    const galleryId = parseInt(req.params.id);
    const { caption, sort_order } = req.body;
    const existing = await query('SELECT image FROM fans_gallery WHERE id = ?', [galleryId]);
    if (!existing.length) return res.status(404).json({ error: 'Foto galeri tidak ditemukan' });
    let imagePath = existing[0].image;
    if (req.file) { imagePath = `/uploads/${req.file.filename}`; if (existing[0].image) { const oldPath = path.join(__dirname, existing[0].image); if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath); } }
    await execute('UPDATE fans_gallery SET image = ?, caption = ?, sort_order = ? WHERE id = ?', [imagePath, caption?.trim() || '', parseInt(sort_order) || 0, galleryId]);
    res.json({ success: true, message: 'Galeri berhasil diupdate', image: imagePath });
  } catch (error) { console.error('❌ Error updating gallery item:', error); res.status(500).json({ error: error.message }); }
});

app.delete('/api/fans/gallery/:id', async (req, res) => {
  console.log('📥 DELETE /api/fans/gallery/:id - ID:', req.params.id);
  if (!dbConnected) return res.status(503).json({ error: 'Database disconnected' });
  try {
    const galleryId = parseInt(req.params.id);
    const existing = await query('SELECT image FROM fans_gallery WHERE id = ?', [galleryId]);
    if (!existing.length) return res.status(404).json({ error: 'Foto galeri tidak ditemukan' });
    if (existing[0].image) { const imagePath = path.join(__dirname, existing[0].image); if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath); }
    await execute('DELETE FROM fans_gallery WHERE id = ?', [galleryId]);
    res.json({ success: true, message: 'Galeri berhasil dihapus' });
  } catch (error) { console.error('❌ Error deleting gallery item:', error); res.status(500).json({ error: error.message }); }
});

// ==========================================
// 🚫 404 & ERROR HANDLERS
// ==========================================
app.use((req, res) => { console.warn(`[⚠️ 404] ${req.method} ${req.originalUrl}`); res.status(404).json({ error: `Endpoint ${req.method} ${req.originalUrl} tidak ditemukan`, hint: 'Pastikan URL benar dan server sudah direstart' }); });
app.use((err, req, res, next) => { console.error('❌ Server error:', err); res.status(500).json({ error: 'Internal server error', message: process.env.NODE_ENV === 'development' ? err.message : 'Terjadi kesalahan server' }); });

// ==========================================
// 🚀 START SERVER
// ==========================================
const PORT = process.env.PORT || 5000;
async function startServer() {
  await initDB();
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`
╔════════════════════════════════════════════╗
║  🟢 PERSEBAYA BACKEND SERVER RUNNING      ║
╠════════════════════════════════════════════╣
║  📍 Local:    http://localhost:${PORT}            ║
║  🗄️  Database: ${dbConnected ? '✅ Connected' : '⚠️ Disconnected'.padEnd(11)}      ║
║  📁 Uploads:  http://localhost:${PORT}/uploads     ║
║  🔧 Environment: ${(process.env.NODE_ENV || 'development').padEnd(13)}  ║
╚════════════════════════════════════════════╝
    `);
  });
}
startServer().catch(err => { console.error('❌ Failed to start server:', err.message); process.exit(1); });