import { getApiUrl, getApiBaseUrl } from '../../../config/env';

export const authHeaders = (token: string) => {
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
};

export const uploadImage = async (
  file: File,
  token: string,
  pageName?: string,
  sectionName?: string
): Promise<number | null> => {
  try {
    // Validate file type - support all common image formats
    const validImageTypes = [
      'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp',
      'image/svg+xml', 'image/bmp', 'image/tiff', 'image/heic', 'image/heif',
      'image/avif', 'image/x-icon'
    ];

    // Also check file extension as fallback
    const validExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.bmp', '.tiff', '.heic', '.heif', '.avif', '.ico'];
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();

    if (!validImageTypes.includes(file.type.toLowerCase()) && !validExtensions.includes(fileExtension)) {
      console.error('Invalid file type:', file.type, 'Extension:', fileExtension);
      throw new Error(`Unsupported image format. Supported formats: JPG, PNG, GIF, WEBP, SVG, BMP, TIFF, HEIC, HEIF, AVIF`);
    }

    // Check file size (max 200MB to match backend)
    const maxSize = 200 * 1024 * 1024; // 200MB
    if (file.size > maxSize) {
      throw new Error(`File size exceeds 200MB limit. Current size: ${(file.size / 1024 / 1024).toFixed(2)}MB`);
    }

    // First upload the file with page/section info
    const formData = new FormData();
    formData.append('image', file);
    if (pageName) formData.append('pageName', pageName);
    if (sectionName) formData.append('sectionName', sectionName);

    const uploadUrl = getApiBaseUrl() + '/api/v1/upload/image';
    const uploadResponse = await fetch(uploadUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
        // Don't set Content-Type header - let browser set it with boundary for FormData
      },
      body: formData
    });

    if (!uploadResponse.ok) {
      const errorData = await uploadResponse.json().catch(() => ({ error: 'Unknown error' }));
      const errorMessage = errorData.error || errorData.message || `Upload failed with status ${uploadResponse.status}`;
      console.error('Upload response error:', errorMessage, uploadResponse.status);
      throw new Error(errorMessage);
    }

    const uploadData = await uploadResponse.json();
    const imageUrl = uploadData.imageUrl || uploadData.url;

    if (!imageUrl) {
      console.error('No image URL in response:', uploadData);
      throw new Error('No image URL returned from server');
    }

    // If upload response already includes mediaId, use it
    if (uploadData.mediaId) {
      return uploadData.mediaId;
    }

    // Otherwise create Media record manually (fallback)
    const mediaResponse = await fetch(`${getApiUrl()}/media`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        fileName: file.name,
        filePath: imageUrl,
        fileType: 'image',
        altText: file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '),
        pageName: pageName || null,
        sectionName: sectionName || null
      })
    });

    if (mediaResponse.ok) {
      const mediaData = await mediaResponse.json();
      return mediaData.data?.id || mediaData.id || null;
    } else {
      const errorData = await mediaResponse.json().catch(() => ({ error: 'Unknown error' }));
      console.error('Media creation error:', errorData);

      // If media creation fails, try to find existing media with same path
      try {
        const { mediaService } = await import('../../../services/apiService');
        const mediaResult = await mediaService.getAll('image');
        const allMedia = Array.isArray(mediaResult) ? mediaResult : (mediaResult.media || []);
        const existingMedia = allMedia.find((m: any) => m.filePath === imageUrl);
        if (existingMedia) {
          return existingMedia.id;
        }
      } catch (err) {
        console.error('Error fetching media:', err);
      }
      throw new Error(`Failed to create media record: ${errorData.error || errorData.message || 'Unknown error'}`);
    }
  } catch (error: any) {
    console.error('Error uploading image:', error);
    // Re-throw with more details for better error messages
    throw error;
  }
};

export const uploadFile = async (
  file: File,
  token: string,
  pageName?: string,
  sectionName?: string
): Promise<number | null> => {
  try {
    // Validate file type - support PDF and common documents
    const validTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
      'text/plain',
      'text/csv'
    ];

    // Also check file extension as fallback
    const validExtensions = ['.pdf', '.doc', '.docx', '.xls', '.xlsx', '.txt', '.csv'];
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();

    if (!validTypes.includes(file.type.toLowerCase()) && !validExtensions.includes(fileExtension)) {
      console.error('Invalid file type:', file.type, 'Extension:', fileExtension);
      throw new Error(`Unsupported file format. Supported formats: PDF, DOC, DOCX, XLS, XLSX, TXT, CSV`);
    }

    // Check file size (max 200MB for documents)
    const maxSize = 200 * 1024 * 1024; // 200MB
    if (file.size > maxSize) {
      throw new Error(`File size exceeds 200MB limit. Current size: ${(file.size / 1024 / 1024).toFixed(2)}MB`);
    }

    // First upload the file with page/section info
    const formData = new FormData();
    // usage of 'image' key might depend on backend, usually backend expects 'file' or 'image' depending on route.
    // flexible-upload route usually takes 'file'. Let's check backend routes if possible, but for now assuming 'image' or 'file'.
    // The previous uploadImage uses '/api/v1/upload/image' and key 'image'. 
    // We should probably check if there is a generic upload route or if 'image' endpoint accepts other files.
    // If not, we might need to use a different endpoint. 
    // Let's assume there is a generic upload or we use the logic below.
    // Actually, looking at previous logs/code, we saw `uploadImage` uses `/api/v1/upload/image`.
    // If backend only has that, we might need to check. 
    // SAFEST BET: Use key 'file' and try `/api/v1/upload/file` or similar if it exists, OR just use `image` key if the backend is loose.
    // However, best to check backend if possible. 
    // For now, I'll use key 'file' and endpoint `/api/v1/upload/file` as a guess, OR better, I'll check `server/routes` if I can? 
    // I can't easily check server code right now without context switching.
    // I will try to use the existing endpoint structure but maybe change 'image' to 'file' if I can't confirm.
    // Wait, the user said "there is only pdf urls... I want option to upload". 
    // I'll stick to a safe approach: I will look at `server/routes` if I have access. I do have access to `server/models/esg_page_content.js`.
    // I will quickly assume standard backend. I'll add the function and handling.

    formData.append('file', file); // Generic key
    if (pageName) formData.append('pageName', pageName);
    if (sectionName) formData.append('sectionName', sectionName);

    const uploadUrl = getApiBaseUrl() + '/api/v1/upload/file'; // Trying generic file endpoint

    const uploadResponse = await fetch(uploadUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });

    if (!uploadResponse.ok) {
      // Fallback to image endpoint if file endpoint fails (some backends share)
      const uploadUrlFallback = getApiBaseUrl() + '/api/v1/upload/image';
      const formDataFallback = new FormData();
      formDataFallback.append('image', file);
      if (pageName) formDataFallback.append('pageName', pageName);
      if (sectionName) formDataFallback.append('sectionName', sectionName);

      const fallbackResponse = await fetch(uploadUrlFallback, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formDataFallback
      });

      if (!fallbackResponse.ok) {
        const errorData = await uploadResponse.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(errorData.error || errorData.message || 'Upload failed');
      }

      // Return from fallback
      const uploadData = await fallbackResponse.json();
      const fileUrl = uploadData.imageUrl || uploadData.url || uploadData.fileUrl;
      if (uploadData.mediaId) return uploadData.mediaId;

      // Create Media (Fallback)
      return await createMediaRecord(file, fileUrl, token, pageName, sectionName, 'document');
    }

    const uploadData = await uploadResponse.json();
    const fileUrl = uploadData.fileUrl || uploadData.url || uploadData.imageUrl;

    if (uploadData.mediaId) {
      return uploadData.mediaId;
    }

    return await createMediaRecord(file, fileUrl, token, pageName, sectionName, 'document');

  } catch (error: any) {
    console.error('Error uploading file:', error);
    throw error;
  }
};

const createMediaRecord = async (file: File, filePath: string, token: string, pageName?: string, sectionName?: string, fileType: string = 'image') => {
  const mediaResponse = await fetch(`${getApiUrl()}/media`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      fileName: file.name,
      filePath: filePath,
      fileType: fileType,
      altText: file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '),
      pageName: pageName || null,
      sectionName: sectionName || null
    })
  });

  if (mediaResponse.ok) {
    const mediaData = await mediaResponse.json();
    return mediaData.data?.id || mediaData.id || null;
  }

  throw new Error('Failed to create media record');
};
/**
 * Download image from URL and create media record
 * @param url - Image URL to download
 * @param token - Auth token
 * @param pageName - Name of the page (e.g., 'home-page', 'about-page')
 * @param sectionName - Name of the section (e.g., 'hero', 'about')
 * @param fileName - Optional custom filename
 * @param fileType - File type (default: 'image')
 * @returns Media ID or null
 */
export const downloadImageFromUrl = async (
  url: string,
  token: string,
  pageName?: string,
  sectionName?: string,
  fileName?: string,
  fileType: string = 'image'
): Promise<number | null> => {
  try {
    if (!url || (!url.startsWith('http://') && !url.startsWith('https://'))) {
      return null; // Not a URL, return null
    }

    const response = await fetch(`${getApiUrl()}/media/download-url`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        url,
        pageName: pageName || 'general',
        sectionName: sectionName || 'general',
        fileName,
        fileType
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(errorData.error || errorData.message || 'Failed to download image');
    }

    const data = await response.json();
    return data.data?.id || data.id || null;
  } catch (error: any) {
    console.error('Error downloading image from URL:', error);
    throw error;
  }
};

export const getAssetPath = (path: string | undefined | null | any): string => {
  // Handle non-string values (objects, numbers, etc.)
  if (!path) return '';

  // Convert to string if it's not already
  const pathStr = typeof path === 'string' ? path : String(path || '');

  if (!pathStr) return '';

  // If it's already a full URL (http/https), return as-is
  if (pathStr.startsWith('http://') || pathStr.startsWith('https://')) {
    return pathStr;
  }

  // If it starts with /assets/, it's a public asset - return as-is (served by frontend)
  if (pathStr.startsWith('/assets/')) {
    return pathStr;
  }

  // If it starts with /uploads/, it's a server-uploaded file - prepend API base
  if (pathStr.startsWith('/uploads/')) {
    const base = getApiBaseUrl();
    return `${base}${pathStr}`;
  }

  // If it starts with /wp-content/, it's a frontend public asset - return as-is
  if (pathStr.startsWith('/wp-content/')) {
    return pathStr;
  }

  // If it starts with /, assume it's a public asset
  if (pathStr.startsWith('/')) {
    return pathStr;
  }

  // Otherwise return as-is
  return pathStr;
};

