import { supabase } from '../supabaseClient'

const api = {
  // ✅ READ
  get: async (endpoint, options = {}) => {
    console.log('📥 api.get called:', { endpoint, options });
    
    const cleanPath = endpoint.replace('/api/', '').replace(/^\//, '')
    const table = cleanPath
    
    if (!table) {
      console.error('❌ Table name is empty! Endpoint:', endpoint);
      throw new Error(`Invalid endpoint: ${endpoint}. Table name cannot be empty.`);
    }
    
    let query = supabase.from(table).select('*')
    
    if (options.params?.order) {
      const [field, direction] = options.params.order.split(':')
      query = query.order(field, { ascending: direction === 'asc' })
    }
    
    if (options.params?.limit) {
      query = query.limit(parseInt(options.params.limit))
    }
    
    if (options.params?.where) {
      for (const [key, value] of Object.entries(options.params.where)) {
        query = query.eq(key, value)
      }
    }
    
    const { data, error } = await query
    
    if (error) {
      console.error('❌ Supabase query error:', error);
      throw error
    }
    
    console.log('✅ api.get success:', { table, count: data?.length });
    return { data: data || [] }
  },
  
  // ✅ CREATE
  post: async (endpoint, payload, options = {}) => {
    console.log('📥 api.post called with endpoint:', endpoint);
    
    const cleanPath = endpoint.replace('/api/', '').replace(/^\//, '')
    const table = cleanPath
    
    if (!table) {
      console.error('❌ Table name is empty! Endpoint:', endpoint);
      throw new Error(`Invalid endpoint: ${endpoint}. Table name cannot be empty.`);
    }
    
    console.log('📊 Table name:', table);
    
    let finalPayload = payload
    if (payload instanceof FormData) {
      finalPayload = {}
      for (let [key, value] of payload.entries()) {
        finalPayload[key] = value
      }
      
      const file = payload.get('image')
      if (file && file instanceof File) {
        console.log('📤 Uploading file to Supabase Storage:', file.name);
        const folder = table
        const imageUrl = await uploadImageToStorage(file, folder)
        if (imageUrl) {
          console.log('✅ File uploaded, URL:', imageUrl);
          finalPayload.image = imageUrl
        } else {
          console.warn('⚠️ File upload failed, continuing without image');
        }
      }
    }
    
    const { data, error } = await supabase
      .from(table)
      .insert([finalPayload])
      .select()
    
    if (error) {
      console.error('❌ Supabase insert error:', error);
      throw error
    }
    
    console.log('✅ api.post success:', { table, id: data?.[0]?.id });
    return { data: data[0] }
  },
  
  // ✅ UPDATE
  put: async (endpoint, payload, options = {}) => {
    console.log('📥 api.put called with endpoint:', endpoint);
    
    const cleanPath = endpoint.replace('/api/', '').replace(/^\//, '')
    const parts = cleanPath.split('/')
    const table = parts[0]
    const id = parts[1]
    
    if (!table || !id) {
      console.error('❌ Table name or ID is empty! Endpoint:', endpoint, 'Parts:', parts);
      throw new Error(`Invalid endpoint: ${endpoint}. Table name and ID required.`);
    }
    
    console.log('📊 Table name:', table, 'ID:', id);
    
    const tablesWithUpdatedAt = ['players', 'schedules', 'news', 'events', 'history'];
    
    let finalPayload = { ...payload };
    
    if (tablesWithUpdatedAt.includes(table)) {
      finalPayload.updated_at = new Date().toISOString();
    }
    
    if (payload instanceof FormData) {
      finalPayload = { ...finalPayload };
      for (let [key, value] of payload.entries()) {
        if (key !== 'image') finalPayload[key] = value;
      }
      
      const file = payload.get('image');
      if (file && file instanceof File) {
        console.log('📤 Uploading new file to Supabase Storage:', file.name);
        const folder = table;
        const imageUrl = await uploadImageToStorage(file, folder);
        if (imageUrl) {
          console.log('✅ New file uploaded, URL:', imageUrl);
          finalPayload.image = imageUrl;
        } else {
          console.warn('⚠️ File upload failed, keeping old image');
        }
      }
    }
    
    const { data, error } = await supabase
      .from(table)
      .update(finalPayload)
      .eq('id', id)
      .select();
    
    if (error) {
      console.error('❌ Supabase update error:', error);
      throw error;
    }
    
    console.log('✅ api.put success:', { table, id });
    return { data: data[0] };
  },
  
  // ✅ DELETE
  delete: async (endpoint, options = {}) => {
    console.log('📥 api.delete called with endpoint:', endpoint, 'options:', options);
    
    const cleanPath = endpoint.replace('/api/', '').replace(/^\//, '')
    const parts = cleanPath.split('/')
    const table = parts[0]
    const id = parts[1]
    
    if (!table || !id) {
      console.error('❌ Table name or ID is empty! Endpoint:', endpoint, 'Parts:', parts);
      throw new Error(`Invalid endpoint: ${endpoint}. Table name and ID required.`);
    }
    
    console.log('📊 Table name:', table, 'ID:', id);
    
    if (options.imageUrl) {
      console.log('🗑️ Deleting image from Storage:', options.imageUrl);
      await deleteImageFromStorage(options.imageUrl)
    }
    
    const { error } = await supabase
      .from(table)
      .delete()
      .eq('id', id)
    
    if (error) {
      console.error('❌ Supabase delete error:', error);
      throw error
    }
    
    console.log('✅ api.delete success:', { table, id });
    return { data: { success: true } }
  }
}

// ✅ Helper: Upload gambar ke Supabase Storage
export const uploadImageToStorage = async (file, folder) => {
  if (!file) {
    console.warn('⚠️ uploadImageToStorage called with no file');
    return null
  }
  
  console.log('📤 Starting upload:', { fileName: file.name, fileSize: file.size, folder });
  
  const fileExt = file.name.split('.').pop()
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
  const filePath = `${folder}/${fileName}`
  
  console.log('📁 Uploading to path:', filePath);
  
  // ✅ FIX: Hapus 'data' karena tidak dipakai
  const { error } = await supabase
    .storage
    .from('images')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false
    })
  
  if (error) {
    console.error('❌ Upload error:', error);
    return null
  }
  
  const { data: { publicUrl } } = supabase
    .storage
    .from('images')
    .getPublicUrl(filePath)
  
  console.log('✅ Upload success, public URL:', publicUrl);
  return publicUrl
}

// ✅ Helper: Hapus gambar dari Supabase Storage
export const deleteImageFromStorage = async (imageUrl) => {
  if (!imageUrl) {
    console.warn('⚠️ deleteImageFromStorage called with no imageUrl');
    return
  }
  
  console.log('🗑️ Deleting image from Storage:', imageUrl);
  
  try {
    const url = new URL(imageUrl)
    const path = url.pathname.split('/images/')[1]
    
    if (path) {
      console.log('📁 Deleting path from Storage:', path);
      const { error } = await supabase.storage.from('images').remove([path])
      
      if (error) {
        console.error('❌ Delete image error:', error);
      } else {
        console.log('✅ Image deleted from Storage');
      }
    } else {
      console.warn('⚠️ Could not extract path from URL:', imageUrl);
    }
  } catch (e) {
    console.error('❌ Delete image error (exception):', e);
  }
}

// ✅ Legacy uploadFile function
export const uploadFile = async (endpoint, formData, id = null, method = 'post') => {
  console.log('📤 uploadFile called:', { endpoint, id, method });
  
  if (method === 'post') {
    return await api.post(endpoint, formData)
  } else if (method === 'put') {
    return await api.put(`${endpoint}/${id}`, formData)
  } else {
    throw new Error(`Unsupported method: ${method}`)
  }
}

export default api