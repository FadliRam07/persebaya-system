// frontend/src/components/Forms/PlayerForm.jsx
import React, { useState } from 'react';

const COUNTRIES = [
  'Indonesia', 'Argentina', 'Brazil', 'Portugal', 'Spain', 'Timor Leste', 
  'Montenegro', 'Makedonia Utara', 'England', 'Italy', 'Japan', 'South Korea',
  'Australia', 'Malaysia', 'Thailand', 'Singapore', 'Vietnam', 'Philippines'
];

export default function PlayerForm({ editing, onSubmit, onClose, isDarkMode }) {
  const [form, setForm] = useState({
    name: editing?.name || '',
    position: editing?.position || '',
    jersey_number: editing?.jersey_number || '',
    nationality: editing?.nationality || 'Indonesia',
    description: editing?.description || '',
    image: null,
    preview: editing?.image ? `http://localhost:5000${editing.image}` : null
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        setErrors(prev => ({ ...prev, image: 'Format gambar tidak didukung. Gunakan JPG, PNG, GIF, atau WebP.' }));
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, image: 'Ukuran gambar terlalu besar. Maksimal 5MB.' }));
        return;
      }
      setForm(prev => ({ ...prev, image: file, preview: URL.createObjectURL(file) }));
      setErrors(prev => ({ ...prev, image: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = 'Nama pemain wajib diisi';
    if (!form.position.trim()) newErrors.position = 'Posisi wajib diisi';
    if (!form.jersey_number) newErrors.jersey_number = 'Nomor punggung wajib diisi';
    if (!form.nationality.trim()) newErrors.nationality = 'Nasionalitas wajib diisi';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validate()) {
      const firstError = document.querySelector('.error-message');
      if (firstError) firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    
    const formData = new FormData();
    formData.append('name', form.name.trim());
    formData.append('position', form.position.trim());
    formData.append('jersey_number', parseInt(form.jersey_number));
    formData.append('nationality', form.nationality.trim());
    formData.append('description', form.description.trim());
    if (form.image) {
      formData.append('image', form.image);
    }
    
    onSubmit(formData, editing?.id);
  };

  const InputField = ({ name, label, placeholder, type = 'text', value, onChange, error, required = false }) => (
    <div>
      <label className={`block text-xs sm:text-sm font-bold mb-1.5 sm:mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input 
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl text-xs sm:text-sm transition-colors ${
          error 
            ? 'border-red-500 focus:ring-red-500' 
            : `${isDarkMode ? 'border-gray-600 focus:ring-green-500' : 'border-gray-300 focus:border-persebaya-green focus:ring-4 focus:ring-persebaya-green/10'}`
        } focus:outline-none border-2 ${isDarkMode ? 'bg-gray-700 text-white placeholder-gray-400' : 'bg-white'}`}
      />
      {error && <p className="error-message text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );

  const SelectField = ({ name, label, value, onChange, options, error, required = false }) => (
    <div>
      <label className={`block text-xs sm:text-sm font-bold mb-1.5 sm:mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <select 
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl text-xs sm:text-sm transition-colors ${
          error 
            ? 'border-red-500 focus:ring-red-500' 
            : `${isDarkMode ? 'border-gray-600 focus:ring-green-500' : 'border-gray-300 focus:border-persebaya-green focus:ring-4 focus:ring-persebaya-green/10'}`
        } focus:outline-none border-2 ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-white'}`}
      >
        {options.map(opt => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
      {error && <p className="error-message text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );

  const TextAreaField = ({ name, label, placeholder, value, onChange, rows = 4 }) => (
    <div>
      <label className={`block text-xs sm:text-sm font-bold mb-1.5 sm:mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{label}</label>
      <textarea 
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        rows={rows}
        className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl text-xs sm:text-sm focus:outline-none transition-colors resize-none border-2 ${
          isDarkMode 
            ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-400 focus:border-green-500 focus:ring-4 focus:ring-green-500/10' 
            : 'border-gray-300 bg-white focus:border-persebaya-green focus:ring-4 focus:ring-persebaya-green/10'
        }`}
      />
    </div>
  );

  return (
    <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-6 md:p-8 border-l-4 border-persebaya-green`}>
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <h3 className={`text-lg sm:text-xl md:text-2xl font-bold ${isDarkMode ? 'text-green-400' : 'text-persebaya-green'}`}>
          {editing ? '✏️ Edit Pemain' : '➕ Tambah Pemain Baru'}
        </h3>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
        {/* Baris 1: Nama dan Nomor Punggung */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <InputField 
            name="name"
            label="Nama Lengkap"
            placeholder="Contoh: Risto Mitrevski"
            value={form.name}
            onChange={handleChange}
            error={errors.name}
            required
          />
          <InputField 
            name="jersey_number"
            label="Nomor Punggung"
            placeholder="Contoh: 33"
            type="number"
            value={form.jersey_number}
            onChange={handleChange}
            error={errors.jersey_number}
            required
          />
        </div>

        {/* Baris 2: Posisi dan Nasionalitas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <InputField 
            name="position"
            label="Posisi"
            placeholder="Contoh: Bek Tengah, Gelandang, Penyerang"
            value={form.position}
            onChange={handleChange}
            error={errors.position}
            required
          />
          <SelectField 
            name="nationality"
            label="Nasionalitas"
            value={form.nationality}
            onChange={handleChange}
            options={COUNTRIES}
            error={errors.nationality}
            required
          />
        </div>

        {/* Baris 3: Deskripsi */}
        <TextAreaField 
          name="description"
          label="Deskripsi Pemain"
          placeholder="Ceritakan tentang profil, prestasi, atau statistik pemain..."
          value={form.description}
          onChange={handleChange}
          rows={4}
        />

        {/* Baris 4: Upload Foto */}
        <div>
          <label className={`block text-xs sm:text-sm font-bold mb-1.5 sm:mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            Foto Pemain {editing && <span className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'} font-normal`}>(Kosongkan jika tidak ingin mengganti)</span>}
          </label>
          <input 
            type="file" 
            accept="image/*"
            onChange={handleImageChange} 
            required={!editing && !form.preview}
            className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl text-xs sm:text-sm focus:outline-none transition-colors cursor-pointer border-2 ${
              isDarkMode 
                ? 'border-gray-600 bg-gray-700 text-white focus:border-green-500 focus:ring-4 focus:ring-green-500/10' 
                : 'border-gray-300 bg-white focus:border-persebaya-green focus:ring-4 focus:ring-persebaya-green/10'
            }`}
          />
          {errors.image && <p className="error-message text-red-500 text-xs mt-1">{errors.image}</p>}
          <p className={`text-[10px] sm:text-xs mt-1.5 sm:mt-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            📷 Format: JPG, PNG, GIF, WebP • Maksimal: 5MB • Ukuran ideal: 800x1000px
          </p>
          
          {/* Preview Foto - Responsive */}
          {form.preview && (
            <div className="mt-3 sm:mt-4 relative inline-block">
              <img 
                src={form.preview} 
                alt="Preview" 
                className="w-32 h-32 sm:w-40 sm:h-40 object-cover rounded-xl shadow-lg border-2 border-gray-200"
                onError={() => setErrors(prev => ({ ...prev, image: 'Gagal memuat preview gambar' }))}
              />
              {!editing && (
                <button
                  type="button"
                  onClick={() => setForm(prev => ({ ...prev, image: null, preview: null }))}
                  className="absolute -top-1.5 -right-1.5 sm:-top-2 sm:-right-2 bg-red-500 text-white rounded-full w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center text-xs hover:bg-red-600 transition shadow-lg"
                  title="Hapus foto"
                >
                  ✕
                </button>
              )}
            </div>
          )}
        </div>

        {/* Tombol Aksi - Responsive */}
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-3 sm:pt-4 border-t-2 border-gray-100 dark:border-gray-700">
          <button 
            type="submit" 
            className="bg-gradient-to-r from-persebaya-green to-persebaya-dark text-white px-4 sm:px-6 py-2.5 sm:py-3 md:py-4 rounded-xl font-bold hover:shadow-xl flex-1 text-xs sm:text-sm md:text-base transition-all hover:scale-[1.02] flex items-center justify-center gap-1.5 sm:gap-2"
          >
            <span>💾</span> {editing ? 'Update Pemain' : 'Simpan Pemain'}
          </button>
          <button 
            type="button" 
            onClick={onClose} 
            className={`${isDarkMode ? 'bg-gray-700 text-gray-200 hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'} px-4 sm:px-6 py-2.5 sm:py-3 md:py-4 rounded-xl font-bold flex-1 text-xs sm:text-sm md:text-base transition-all`}
          >
            Batal
          </button>
        </div>
      </form>
    </div>
  );
}