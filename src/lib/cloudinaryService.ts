
// Cloudinary unsigned upload service for vendor documents
// Make sure to set your Cloudinary cloud name and unsigned upload preset

const CLOUDINARY_CLOUD_NAME = 'dhas7vy3k'; // Replace with your Cloudinary cloud name
const CLOUDINARY_UPLOAD_PRESET = 'vendors'; // Your unsigned upload preset for vendors

export interface CloudinaryUploadResponse {
  secure_url: string;
  public_id: string;
  original_filename: string;
  format: string;
  bytes: number;
  created_at: string;
}

export const uploadToCloudinary = async (file: File): Promise<CloudinaryUploadResponse> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
  formData.append('folder', 'vendor-documents'); // Optional: organize files in folders

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Cloudinary upload error response:', errorData);
      throw new Error(`Upload failed: ${errorData.error?.message || response.statusText}`);
    }

    const data = await response.json();
    
    console.log('File uploaded to Cloudinary:', {
      url: data.secure_url,
      publicId: data.public_id,
      originalName: data.original_filename
    });

    return data;
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw new Error('Failed to upload file to Cloudinary');
  }
};

export const uploadMultipleFiles = async (files: { [key: string]: File | null }): Promise<{ [key: string]: CloudinaryUploadResponse | null }> => {
  const uploadPromises = Object.entries(files).map(async ([key, file]) => {
    if (!file) return [key, null];
    
    try {
      const result = await uploadToCloudinary(file);
      return [key, result];
    } catch (error) {
      console.error(`Failed to upload ${key}:`, error);
      throw error;
    }
  });

  const results = await Promise.all(uploadPromises);
  return Object.fromEntries(results);
};
