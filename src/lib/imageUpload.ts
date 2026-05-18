import { supabase } from './supabase'

async function compressImage(file: File, maxSize = 1200, quality = 0.82): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const url = URL.createObjectURL(file)
    img.onload = () => {
      URL.revokeObjectURL(url)
      let { width, height } = img
      if (width > maxSize || height > maxSize) {
        if (width > height) {
          height = Math.round((height * maxSize) / width)
          width = maxSize
        } else {
          width = Math.round((width * maxSize) / height)
          height = maxSize
        }
      }
      const canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = height
      const ctx = canvas.getContext('2d')
      if (!ctx) return reject(new Error('Canvas error'))
      ctx.drawImage(img, 0, 0, width, height)
      canvas.toBlob(
        (blob) => (blob ? resolve(blob) : reject(new Error('Compression failed'))),
        'image/jpeg',
        quality
      )
    }
    img.onerror = () => reject(new Error('Image load failed'))
    img.src = url
  })
}

export async function uploadImage(file: File): Promise<string> {
  const compressed = await compressImage(file)
  const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.jpg`
  const { error } = await supabase.storage
    .from('lucrari')
    .upload(fileName, compressed, { contentType: 'image/jpeg', upsert: false })
  if (error) throw new Error(error.message)
  const { data } = supabase.storage.from('lucrari').getPublicUrl(fileName)
  return data.publicUrl
}

export async function deleteImage(url: string): Promise<void> {
  const fileName = url.split('/lucrari/')[1]
  if (!fileName) return
  await supabase.storage.from('lucrari').remove([fileName])
}
