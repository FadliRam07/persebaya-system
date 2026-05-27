// frontend/src/components/Forms/FansForms.jsx
import React, { useState, useEffect } from 'react';

export default function FansForms({ type, editing, onSubmit, onClose, disabled = false, isDarkMode }) {
  const [form, setForm] = useState({
    label: editing?.label || '',
    value: editing?.value || '',
    title: editing?.title || '',
    description: editing?.description || '',
    caption: editing?.caption || '',
    sort_order: editing?.sort_order || 0,
    image: null,
    preview: editing?.image ? `http://localhost:5000${editing.image}` : null
  });

  const [errors, setErrors] = useState({});
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    setErrors({});
    setImageError(false);
  }, [form]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageError(false);
    
    if (file) {
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        setImageError('Format gambar tidak didukung. Gunakan JPG, PNG, GIF, atau WebP.');
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) {
        setImageError('Ukuran gambar terlalu besar. Maksimal 5MB.');
        return;
      }
      
      setForm(prev => ({ 
        ...prev, 
        image: file, 
        preview: URL.createObjectURL(file) 
      }));
    }
  };

  const validate = () => {
    const newErrors = {};
    
    if (type === 'stats') {
      if (!form.label.trim()) newErrors.label = 'Label wajib diisi';
      if (!form.value.trim()) newErrors.value = 'Value wajib diisi';
    } 
    else if (type === 'activities') {
      if (!form.title.trim()) newErrors.title = 'Judul wajib diisi';
      if (!form.description.trim()) newErrors.description = 'Deskripsi wajib diisi';
    } 
    else if (type === 'gallery') {
      if (!editing && !form.image) {
        newErrors.image = 'Gambar wajib diupload untuk galeri baru';
      }
      if (!form.caption.trim() && !editing) {
        newErrors.caption = 'Caption wajib diisi untuk galeri baru';
      }
    }
    
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
    
    if (type === 'stats') {
      onSubmit(type, {
        label: form.label.trim(),
        value: form.value.trim(),
        sort_order: parseInt(form.sort_order) || 0
      }, editing?.id);
    } 
    else if (type === 'activities') {
      onSubmit(type, {
        title: form.title.trim(),
        description: form.description.trim(),
        sort_order: parseInt(form.sort_order) || 0
      }, editing?.id);
    } 
    else if (type === 'gallery') {
      const formData = new FormData();
      formData.append('caption', form.caption.trim());
      formData.append('sort_order', parseInt(form.sort_order) || 0);
      if (form.image) {
        formData.append('image', form.image);
      }
      onSubmit(type, formData, editing?.id);
    }
  };

  const titles = { 
    stats: 'Statistik', 
    activities: 'Kegiatan',
    gallery: 'Galeri' 
  };

  const placeholders = {
    stats: {
      label: 'Label (contoh: Total Member)',
      value: 'Value (contoh: 50,000+)',
      sort_order: 'Urutan tampil (0 = pertama)'
    },
    activities: {
      title: 'Judul Kegiatan',
      description: 'Deskripsi lengkap kegiatan...',
      sort_order: 'Urutan tampil (0 = pertama)'
    },
    gallery: {
      caption: 'Caption/Keterangan Foto',
      sort_order: 'Urutan tampil (0 = pertama)'
    }
  };

  const InputField = ({ name, placeholder, required = false, type = 'text', value, onChange, error }) => (
    <div>
      <input 
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        disabled={disabled}
        className={`px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg text-xs sm:text-sm w-full transition-colors ${
          error 
            ? 'border-red-500 focus:ring-red-500' 
            : `${isDarkMode ? 'border-gray-600 focus:ring-green-500' : 'border-gray-300 focus:ring-persebaya-green'}`
        } focus:outline-none focus:ring-2 ${isDarkMode ? 'bg-gray-700 text-white placeholder-gray-400' : 'bg-white'} disabled:bg-gray-100 disabled:cursor-not-allowed border`}
      />
      {error && <p className="error-message text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );

  const TextAreaField = ({ name, placeholder, required = false, rows = 4, value, onChange, error }) => (
    <div>
      <textarea 
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        disabled={disabled}
        rows={rows}
        className={`px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg text-xs sm:text-sm w-full transition-colors ${
          error 
            ? 'border-red-500 focus:ring-red-500' 
            : `${isDarkMode ? 'border-gray-600 focus:ring-green-500' : 'border-gray-300 focus:ring-persebaya-green'}`
        } focus:outline-none focus:ring-2 ${isDarkMode ? 'bg-gray-700 text-white placeholder-gray-400' : 'bg-white'} disabled:bg-gray-100 disabled:cursor-not-allowed border resize-none`}
      />
      {error && <p className="error-message text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );

  return (
    <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-6 md:p-8 border-l-4 border-persebaya-green`}>
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <h3 className={`text-lg sm:text-xl md:text-2xl font-bold ${isDarkMode ? 'text-green-400' : 'text-persebaya-green'}`}>
          {editing ? `✏️ Edit ${titles[type]}` : `➕ Tambah ${titles[type] || 'Data'}`}
        </h3>
        {disabled && (
          <span className={`text-xs sm:text-sm flex items-center gap-1.5 sm:gap-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            <span className="animate-spin rounded-full h-3 w-3 sm:h-4 sm:w-4 border-2 border-persebaya-green border-t-transparent"></span>
            <span className="hidden sm:inline">Menyimpan...</span>
          </span>
        )}
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
        {type === 'stats' && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            <InputField 
              name="label"
              placeholder={placeholders.stats.label}
              required
              value={form.label}
              onChange={handleChange}
              error={errors.label}
            />
            <InputField 
              name="value"
              placeholder={placeholders.stats.value}
              required
              value={form.value}
              onChange={handleChange}
              error={errors.value}
            />
            <InputField 
              name="sort_order"
              type="number"
              placeholder={placeholders.stats.sort_order}
              value={form.sort_order}
              onChange={handleChange}
            />
          </div>
        )}

        {type === 'activities' && (
          <div className="space-y-3 sm:space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <InputField 
                name="title"
                placeholder={placeholders.activities.title}
                required
                value={form.title}
                onChange={handleChange}
                error={errors.title}
              />
              <InputField 
                name="sort_order"
                type="number"
                placeholder={placeholders.activities.sort_order}
                value={form.sort_order}
                onChange={handleChange}
              />
            </div>
            <TextAreaField 
              name="description"
              placeholder={placeholders.activities.description}
              required
              value={form.description}
              onChange={handleChange}
              error={errors.description}
              rows={4}
            />
          </div>
        )}

        {type === 'gallery' && (
          <div className="space-y-3 sm:space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <InputField 
                name="caption"
                placeholder={placeholders.gallery.caption}
                required={!editing}
                value={form.caption}
                onChange={handleChange}
                error={errors.caption}
              />
              <InputField 
                name="sort_order"
                type="number"
                placeholder={placeholders.gallery.sort_order}
                value={form.sort_order}
                onChange={handleChange}
              />
            </div>
            
            <div>
              <label className={`block text-xs sm:text-sm font-bold mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                {editing ? 'Ganti Foto (opsional)' : 'Upload Foto *'}
              </label>
              <input 
                type="file" 
                accept="image/*"
                onChange={handleImageChange} 
                required={!editing && !form.preview}
                disabled={disabled}
                className={`px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg text-xs sm:text-sm w-full cursor-pointer ${
                  imageError ? 'border-red-500' : isDarkMode ? 'border-gray-600' : 'border-gray-300'
                } ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-white'} disabled:bg-gray-100 disabled:cursor-not-allowed border`}
              />
              {imageError && (
                <p className="text-red-500 text-xs mt-1">{imageError}</p>
              )}
              <p className={`text-[10px] sm:text-xs mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Format: JPG, PNG, GIF, WebP • Maksimal: 5MB
              </p>
              
              {form.preview && (
                <div className="mt-3 sm:mt-4 relative inline-block">
                  <img 
                    src={form.preview} 
                    alt="Preview" 
                    className="w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 object-cover rounded-lg sm:rounded-xl shadow-md border-2 border-gray-200"
                    onError={() => setImageError('Gagal memuat preview gambar')}
                  />
                  {!editing && (
                    <button
                      type="button"
                      onClick={() => setForm(prev => ({ ...prev, image: null, preview: null }))}
                      className="absolute -top-1.5 -right-1.5 sm:-top-2 sm:-right-2 bg-red-500 text-white rounded-full w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center text-xs hover:bg-red-600 transition shadow-lg"
                      disabled={disabled}
                      title="Hapus gambar"
                    >
                      ✕
                    </button>
                  )}
                </div>
              )}
              
              {editing && form.preview && !form.image && (
                <p className={`text-[10px] sm:text-xs mt-2 italic ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  * Biarkan kosong jika tidak ingin mengganti foto
                </p>
              )}
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-3 sm:pt-4 border-t border-gray-100 dark:border-gray-700">
          <button 
            type="submit" 
            disabled={disabled}
            className="bg-persebaya-green text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg font-bold hover:bg-persebaya-dark flex-1 text-xs sm:text-sm shadow-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-persebaya-green flex items-center justify-center gap-1.5 sm:gap-2"
          >
            {disabled ? (
              <>
                <span className="animate-spin rounded-full h-3 w-3 sm:h-4 sm:w-4 border-2 border-white border-t-transparent"></span>
                <span className="hidden sm:inline">Menyimpan...</span>
              </>
            ) : (
              <>💾 {editing ? 'Update' : 'Simpan'}</>
            )}
          </button>
          <button 
            type="button" 
            onClick={onClose} 
            disabled={disabled}
            className="bg-gray-500 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg font-bold hover:bg-gray-600 flex-1 text-xs sm:text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Batal
          </button>
        </div>
      </form>
    </div>
  );
}