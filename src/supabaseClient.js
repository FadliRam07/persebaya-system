// frontend/src/supabaseClient.js
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL
const supabaseKey = process.env.REACT_APP_SUPABASE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase environment variables!')
}

export const supabase = createClient(supabaseUrl, supabaseKey)

// Helper: Format tanggal Indonesia
export const formatDateIndo = (dateStr) => {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

// Helper: Upload gambar ke Supabase Storage
export const uploadImage = async (file, folder) => {
  if (!file) return null
  
  const fileExt = file.name.split('.').pop()
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
  const filePath = `${folder}/${fileName}`
  
  const { data, error } = await supabase
    .storage
    .from('images')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false
    })
  
  if (error) {
    console.error('Upload error:', error)
    return null
  }
  
  // Dapatkan public URL
  const { data: { publicUrl } } = supabase
    .storage
    .from('images')
    .getPublicUrl(filePath)
  
  return publicUrl
}

// Helper: Hapus gambar dari Storage
export const deleteImage = async (imageUrl) => {
  if (!imageUrl) return
  
  // Extract path dari URL: https://.../images/players/xxx.jpg → players/xxx.jpg
  try {
    const url = new URL(imageUrl)
    const path = url.pathname.split('/images/')[1]
    if (path) {
      await supabase.storage.from('images').remove([path])
    }
  } catch (e) {
    console.error('Delete image error:', e)
  }
}