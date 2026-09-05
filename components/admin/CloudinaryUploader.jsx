'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import { Loader2, Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

async function uploadToCloudinary(file) {
  const signRes = await fetch('/api/admin/cloudinary/sign', { method: 'POST' });
  if (!signRes.ok) {
    throw new Error('No se pudo firmar la subida (revisa la configuración de Cloudinary)');
  }
  const { cloudName, apiKey, timestamp, folder, signature } = await signRes.json();

  const formData = new FormData();
  formData.append('file', file);
  formData.append('api_key', apiKey);
  formData.append('timestamp', timestamp);
  formData.append('signature', signature);
  formData.append('folder', folder);

  const uploadRes = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
    method: 'POST',
    body: formData,
  });

  if (!uploadRes.ok) {
    throw new Error('Cloudinary rechazó la imagen');
  }

  const data = await uploadRes.json();
  return data.secure_url;
}

// images: array de URLs. multiple=false lo trata como una sola imagen (categorías).
const CloudinaryUploader = ({ images = [], onChange, multiple = true }) => {
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const handleFiles = async (fileList) => {
    const files = Array.from(fileList || []);
    if (files.length === 0) return;

    setUploading(true);
    try {
      const uploaded = [];
      for (const file of files) {
        uploaded.push(await uploadToCloudinary(file));
      }
      onChange(multiple ? [...images, ...uploaded] : [uploaded[0]]);
    } catch (error) {
      toast({ title: 'Error al subir imagen', description: error.message, variant: 'destructive' });
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  const removeImage = (index) => {
    onChange(images.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-3">
        {images.map((url, index) => (
          <div key={url + index} className="relative h-24 w-24 rounded-lg overflow-hidden border border-pink-100">
            <Image src={url} alt={`Imagen ${index + 1}`} fill className="object-cover" />
            <button
              type="button"
              onClick={() => removeImage(index)}
              className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-1 hover:bg-black/80"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        ))}
        {(multiple || images.length === 0) && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="h-24 w-24 rounded-lg border-2 border-dashed border-pink-200 flex flex-col items-center justify-center text-pink-400 hover:bg-pink-50 transition-colors"
          >
            {uploading ? <Loader2 className="h-6 w-6 animate-spin" /> : <Upload className="h-6 w-6" />}
            <span className="text-xs mt-1">{uploading ? 'Subiendo...' : 'Subir'}</span>
          </button>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple={multiple}
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />
    </div>
  );
};

export default CloudinaryUploader;
