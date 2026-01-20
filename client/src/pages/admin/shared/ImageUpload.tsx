import { useState, useEffect } from 'react';
import { getAssetPath } from './utils';
import { MediaLibrary } from './MediaLibrary';

interface Media {
  id: number;
  fileName: string;
  filePath: string;
  fileType: string;
  altText?: string;
}

interface ImageUploadProps {
  label: string;
  value: string | number;
  onChange: (mediaId: number | string) => void;
  onUpload?: (file: File, pageName?: string, sectionName?: string) => Promise<number | null>;
  uploading?: boolean;
  required?: boolean;
  error?: string;
  fieldName?: string; // e.g., 'backgroundImageId', 'imageId', 'authorImageId'
  fileType?: 'image' | 'video' | 'icon' | 'logo' | 'document';
  allowUrl?: boolean; // Allow URL input option (default: true)
  pageName?: string; // Page name for organizing uploads (e.g., 'home', 'about')
  sectionName?: string; // Section name for organizing uploads (e.g., 'hero', 'about')
  helpText?: string;
}

export const ImageUpload = ({
  label,
  value,
  onChange,
  onUpload,
  uploading = false,
  required = false,
  error,

  fileType = 'image',
  allowUrl = true,
  pageName,
  sectionName,
  helpText
}: ImageUploadProps) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [localError, setLocalError] = useState<string>('');

  const [showMediaLibrary, setShowMediaLibrary] = useState(false);
  const [inputMode, setInputMode] = useState<'upload' | 'gallery' | 'url'>('upload');
  const [urlValue, setUrlValue] = useState<string>('');

  // Determine initial input mode based on value
  useEffect(() => {
    if (typeof value === 'number' && value > 0) {
      setInputMode('gallery');
      setInputMode('gallery');
    } else if (typeof value === 'string' && value) {
      // Check if it's a URL (starts with http:// or https://) or a path
      if (value.startsWith('http://') || value.startsWith('https://') || value.startsWith('/')) {
        setInputMode('url');
        setUrlValue(value);
      } else {
        // Might be a media ID as string, try to parse
        const parsed = parseInt(value);
        if (!isNaN(parsed) && parsed > 0) {
          setInputMode('gallery');
          setInputMode('gallery');
        } else {
          setInputMode('url');
          setUrlValue(value);
        }
      }
    }
  }, []);

  // Load image preview and file path if we have a media ID
  useEffect(() => {
    const loadImagePreview = async () => {
      if (typeof value === 'number' && value > 0) {
        try {
          const { mediaService } = await import('../../../services/apiService');
          const media = await mediaService.getById(value);
          if (media?.filePath) {
            setPreview(null); // Use the actual image URL - let the imageUrl useEffect handle it
            // If in URL mode, show the filePath
            if (inputMode === 'url') {
              setUrlValue(media.filePath);
            }
          }
        } catch (err) {
          console.error('[ImageUpload] Error loading media:', err);
        }
      } else if (typeof value === 'string' && value.trim()) {
        setPreview(null); // Clear preview so imageUrl useEffect handles it
        // If it's a path or URL, set it in URL mode
        if (inputMode === 'url') {
          setUrlValue(value);
        }
      } else if (!value) {
        // Clear everything if no value
        setPreview(null);
        setUrlValue('');
      }
    };
    loadImagePreview();
  }, [value, inputMode]);

  // ... inside ImageUpload component ...

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (fileType === 'document') {
      const validTypes = ['.pdf', '.doc', '.docx', '.xls', '.xlsx', '.txt', '.csv'];
      const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
      if (!validTypes.includes(fileExtension) && !file.type.includes('pdf') && !file.type.includes('document') && !file.type.includes('text/')) {
        setLocalError('Please select a valid document (PDF, Word, Excel, Text)');
        return;
      }
    } else {
      // Validate file type - allow images and SVG files
      const isValidImage = file.type.startsWith('image/');
      const isSVG = file.name.toLowerCase().endsWith('.svg') || file.type === 'image/svg+xml';

      if (!isValidImage && !isSVG) {
        setLocalError('Please select an image or SVG file');
        return;
      }
    }

    // Validate file size (max 200MB for all files)
    const maxSize = 200 * 1024 * 1024; // 200MB
    if (file.size > maxSize) {
      setLocalError(`File size must be less than 200MB`);
      return;
    }

    setLocalError('');

    // Create preview
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPreview('DOCUMENT_PREVIEW');
    }

    // Upload file and get media ID
    if (onUpload) {
      try {
        const mediaId = await onUpload(file, pageName, sectionName);
        if (mediaId) {
          onChange(mediaId);

          // Fetch the media record to get the filePath
          try {
            const { mediaService } = await import('../../../services/apiService');
            const media = await mediaService.getById(mediaId);
            if (media?.filePath) {
              // Set the filePath in URL field so user can see it if they switch to URL mode
              setUrlValue(media.filePath);
              // Don't force switch to URL mode - let user stay in upload mode or switch freely
              // The image preview will be handled by the useEffect that watches the value
            }
          } catch (mediaErr) {
            console.warn('Could not fetch media path:', mediaErr);
          }

          setPreview(null);
          setLocalError(''); // Clear any previous errors
        } else {
          setLocalError('Failed to upload file. Please try again.');
        }
      } catch (err: any) {
        // Show specific error message if available
        const errorMessage = err?.message || err?.error || 'Error uploading file. Please check the file format and size.';
        setLocalError(errorMessage);
        console.error('Upload error details:', err);
      }
    } else {
      setLocalError('Upload function not provided');
    }
  };

  const handleUrlChange = (url: string) => {
    setUrlValue(url);
    onChange(url);

    // Set preview if it looks like an image URL or path
    if (url && url.trim()) {
      const lowerUrl = url.toLowerCase();
      // Check if it's an image (including SVG, PNG, WebP, etc.)
      const isImage = url.match(/\.(jpeg|jpg|gif|png|webp|svg|bmp|tiff|heic|heif|avif|ico)/i) ||
        url.startsWith('data:image/') ||
        url.startsWith('http://') ||
        url.startsWith('https://') ||
        url.startsWith('/uploads/') ||
        url.startsWith('/assets/') ||
        url.startsWith('/wp-content/');

      if (isImage) {
        // Don't set preview here - let the useEffect handle it via imageUrl
        setPreview(null); // Clear preview so useEffect handles it
      } else if (!url) {
        setPreview(null);
      }
    } else {
      setPreview(null);
    }
  };


  // Get image URL for preview (supports both images and SVGs)
  const [imageUrl, setImageUrl] = useState<string>('');
  const [isSVG, setIsSVG] = useState<boolean>(false);
  const [isDocument, setIsDocument] = useState<boolean>(false);

  useEffect(() => {
    const loadImage = async () => {
      if (preview === 'DOCUMENT_PREVIEW') {
        setIsDocument(true);
        setImageUrl('');
        setIsSVG(false);
        return;
      }
      if (preview) {
        setImageUrl(preview);
        setIsSVG(preview.startsWith('data:image/svg+xml') || preview.includes('<svg'));
        setIsDocument(false);
        return;
      }

      if (typeof value === 'number' && value > 0) {
        try {
          const { mediaService } = await import('../../../services/apiService');
          const media = await mediaService.getById(value);

          if (!media) {
            setImageUrl('');
            setIsSVG(false);
            setIsDocument(false);
            return;
          }

          const path = media?.filePath || media?.url || '';

          if (!path || !path.trim()) {
            setImageUrl('');
            setIsSVG(false);
            setIsDocument(false);
            return;
          }

          if (media?.fileType === 'document' || path.endsWith('.pdf') || path.endsWith('.doc') || path.endsWith('.docx')) {
            setIsDocument(true);
            setImageUrl(getAssetPath(path));
            setIsSVG(false);
          } else {
            const resolvedPath = getAssetPath(path);
            setImageUrl(resolvedPath);
            setIsSVG(path.toLowerCase().endsWith('.svg') || media?.fileType === 'svg');
            setIsDocument(false);
          }
        } catch (err) {
          console.error('[ImageUpload] Error loading media preview:', err);
          setImageUrl('');
          setIsSVG(false);
          setIsDocument(false);
        }
      } else if (typeof value === 'string' && value.trim()) {
        const resolvedPath = getAssetPath(value);

        // Check if it's a document
        const lowerValue = value.toLowerCase();
        const lowerPath = resolvedPath.toLowerCase();
        if (lowerValue.endsWith('.pdf') || lowerValue.endsWith('.doc') || lowerValue.endsWith('.docx') ||
          lowerPath.endsWith('.pdf') || lowerPath.endsWith('.doc') || lowerPath.endsWith('.docx')) {
          setIsDocument(true);
          setImageUrl(resolvedPath);
          setIsSVG(false);
        } else {
          // It's an image - set the URL and check if it's SVG
          setImageUrl(resolvedPath);
          setIsSVG(
            lowerValue.endsWith('.svg') ||
            lowerValue.includes('.svg') ||
            lowerPath.endsWith('.svg') ||
            lowerPath.includes('.svg')
          );
          setIsDocument(false);
        }
      } else {
        setImageUrl('');
        setIsSVG(false);
        setIsDocument(false);
      }
    };
    loadImage();
  }, [preview, value]);

  return (
    <div className="mb-2.5 flex flex-col">
      <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-1.5 h-5 flex items-center">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {helpText && (
        <p className="text-xs text-gray-400 mb-1.5">{helpText}</p>
      )}

      <div className="flex items-start gap-2.5">
        {((imageUrl && imageUrl.trim() !== '') || isDocument || (inputMode === 'url' && urlValue && urlValue.trim() !== '') || (typeof value === 'number' && value > 0)) && (
          <div className="relative flex-shrink-0">
            {isDocument ? (
              <div className="w-16 h-16 rounded border border-gray-300 bg-gray-50 flex flex-col items-center justify-center p-1.5 text-gray-500">
                <i className="ri-file-text-line text-lg mb-0.5"></i>
                <span className="text-[10px] text-center break-all line-clamp-2">
                  {imageUrl ? imageUrl.split('/').pop() : urlValue ? urlValue.split('/').pop() : 'Doc'}
                </span>
              </div>
            ) : (isSVG || (imageUrl && imageUrl.toLowerCase().endsWith('.svg')) || (urlValue && urlValue.toLowerCase().endsWith('.svg'))) ? (
              <div className="w-16 h-16 rounded border border-gray-300 bg-white flex items-center justify-center p-1.5">
                <img
                  src={imageUrl || getAssetPath(urlValue)}
                  alt="SVG Preview"
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="128" height="128"%3E%3Crect fill="%23ddd" width="128" height="128"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%23999" font-size="12"%3ENo SVG%3C/text%3E%3C/svg%3E';
                  }}
                />
              </div>
            ) : (
              (() => {
                const imgSrc = imageUrl || (urlValue ? getAssetPath(urlValue) : '');
                return imgSrc && imgSrc.trim() !== '' ? (
                  <img
                    src={imgSrc}
                    alt="Preview"
                    className="w-16 h-16 object-cover rounded border border-gray-300 shadow-sm"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="128" height="128"%3E%3Crect fill="%23ddd" width="128" height="128"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%23999" font-size="12"%3ENo Image%3C/text%3E%3C/svg%3E';
                    }}
                  />
                ) : (
                  <div className="w-16 h-16 rounded border border-gray-300 bg-gray-100 flex items-center justify-center">
                    <div className="text-center text-gray-400">
                      <i className="ri-image-line text-base mb-0.5"></i>
                      <p className="text-[10px]">No image</p>
                    </div>
                  </div>
                );
              })()
            )}
            {value && (
              <button
                type="button"
                onClick={() => {
                  onChange('');
                  setPreview(null);
                  setUrlValue('');
                }}
                className="absolute -top-0.5 -right-0.5 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center hover:bg-red-600 shadow-sm"
                title="Remove file"
              >
                <i className="ri-close-line text-[10px]"></i>
              </button>
            )}
            {isSVG && (
              <div className="absolute bottom-0 left-0 bg-blue-500 text-white text-[9px] px-1 py-0.5 rounded">
                SVG
              </div>
            )}
            {isDocument && (
              <div className="absolute bottom-0 left-0 bg-orange-500 text-white text-[9px] px-1 py-0.5 rounded">
                DOC
              </div>
            )}
          </div>
        )}

        <div className="flex-1 space-y-1.5 min-w-0">
          {/* ... rest of the component ... */}
          <div className="flex gap-1 border-b border-gray-200 pb-1">
            {/* Tabs ... */}
            {/* Same tabs ... update label if document */}
            {onUpload && (
              <button
                type="button"
                onClick={() => {
                  setInputMode('upload');
                  // Clear any errors when switching modes
                  setLocalError('');
                }}
                className={`px-2 py-1.5 text-xs font-medium transition-colors ${inputMode === 'upload'
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
                  }`}
              >
                <i className="ri-upload-cloud-line mr-1 text-xs"></i>
                Upload
              </button>
            )}
            <button
              type="button"
              onClick={() => {
                setInputMode('gallery');
                // Clear any errors when switching modes
                setLocalError('');
              }}
              className={`px-2 py-1.5 text-xs font-medium transition-colors ${inputMode === 'gallery'
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-600 hover:text-gray-900'
                }`}
            >
              <i className="ri-image-line mr-1 text-xs"></i>
              Gallery
            </button>
            {allowUrl && (
              <button
                type="button"
                onClick={async () => {
                  setInputMode('url');
                  // Clear any errors when switching modes
                  setLocalError('');
                  // If we have a media ID, fetch and show the filePath
                  if (typeof value === 'number' && value > 0) {
                    try {
                      const { mediaService } = await import('../../../services/apiService');
                      const media = await mediaService.getById(value);
                      if (media?.filePath) {
                        setUrlValue(media.filePath);
                      } else if (urlValue && !urlValue.trim()) {
                        // If no filePath but we have a urlValue, keep it
                        // Otherwise clear it
                        setUrlValue('');
                      }
                    } catch (err) {
                      console.error('Error loading media path:', err);
                    }
                  } else if (typeof value === 'string' && value && value.trim()) {
                    // If value is a string path, use it
                    if (value.startsWith('/') || value.startsWith('http://') || value.startsWith('https://')) {
                      setUrlValue(value);
                    }
                  } else if (!urlValue || !urlValue.trim()) {
                    // If no value and no urlValue, clear it
                    setUrlValue('');
                  }
                }}
                className={`px-2 py-1.5 text-xs font-medium transition-colors ${inputMode === 'url'
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
                  }`}
              >
                <i className="ri-link mr-1 text-xs"></i>
                URL
              </button>
            )}
          </div>

          {/* Upload Mode */}
          {inputMode === 'upload' && onUpload && (
            <div className="space-y-1.5">
              <input
                type="file"
                accept={fileType === 'document' ? ".pdf,.doc,.docx,.xls,.xlsx,.txt,.csv" : "image/*,.svg,image/svg+xml"}
                onChange={handleFileChange}
                disabled={uploading}
                className={`w-full px-2.5 py-1.5 text-xs border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${error || localError ? 'border-red-500' : 'border-gray-300'
                  } ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
              />
              <p className="text-[10px] text-gray-400">
                {fileType === 'document'
                  ? 'PDF, DOC, DOCX, XLS, CSV (max 200MB)'
                  : 'JPG, PNG, GIF, WebP, SVG (max 200MB)'}
              </p>
            </div>
          )}

          {/* Gallery Mode */}
          {inputMode === 'gallery' && (
            <div className="space-y-1.5">
              <button
                type="button"
                onClick={() => setShowMediaLibrary(true)}
                disabled={uploading}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <i className="ri-image-line text-xs"></i>
                <span>Browse Media Library</span>
              </button>
            </div>
          )}

          {/* URL Mode */}
          {inputMode === 'url' && allowUrl && (
            <div className="space-y-1.5">
              <input
                type="text"
                placeholder="Enter image/SVG URL or path"
                value={urlValue}
                onChange={(e) => handleUrlChange(e.target.value)}
                className={`w-full px-2.5 py-1.5 text-xs border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${error || localError ? 'border-red-500' : 'border-gray-300'
                  }`}
              />
              <p className="text-[10px] text-gray-400">
                Full URL (http:// or https://) or relative path (/assets/icon.svg)
              </p>
            </div>
          )}

          {uploading && (
            <p className="text-xs text-blue-600">
              <i className="ri-loader-4-line animate-spin mr-1 text-xs"></i>
              Uploading...
            </p>
          )}
          {(error || localError) && (
            <p className="text-xs text-red-600">{error || localError}</p>
          )}
          {value && !preview && inputMode !== 'url' && (
            <p className="text-[10px] text-gray-400">
              {typeof value === 'number' ? 'Media ID selected' : 'Current image'}
            </p>
          )}
        </div>
      </div>

      {/* Media Library Modal */}
      <MediaLibrary
        isOpen={showMediaLibrary}
        onClose={() => setShowMediaLibrary(false)}
        onSelect={(media: Media) => {
          onChange(media.id);

          setInputMode('gallery');
        }}
        fileType={fileType}
        title="Select Image from Media Library"
      />
    </div >
  );
};

