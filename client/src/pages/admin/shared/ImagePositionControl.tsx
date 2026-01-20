import { useState, useEffect } from 'react';
import { getAssetPath } from './utils';

interface ImagePositionControlProps {
  label: string;
  positionX: string | number | undefined;
  positionY: string | number | undefined;
  onChangeX: (value: string) => void;
  onChangeY: (value: string) => void;
  imageUrl?: string;
  imageMediaId?: number | string;
  helpText?: string;
  previewWidth?: number; // Preview width in pixels (e.g., 896 for max-w-4xl)
  previewHeight?: number; // Preview height in pixels (e.g., 504 for 16:9 aspect ratio)
  previewAspectRatio?: string; // Aspect ratio like '16:9' or '4:3'
}

export const ImagePositionControl = ({
  label,
  positionX,
  positionY,
  onChangeX,
  onChangeY,
  imageUrl,
  imageMediaId,
  helpText,
  previewWidth = 400,
  previewHeight,
  previewAspectRatio
}: ImagePositionControlProps) => {
  const [x, setX] = useState<string>(String(positionX || '50'));
  const [y, setY] = useState<string>(String(positionY || '50'));
  const [displayImageUrl, setDisplayImageUrl] = useState<string>('');

  useEffect(() => {
    setX(String(positionX || '50'));
    setY(String(positionY || '50'));
  }, [positionX, positionY]);

  // Load image URL from media ID if provided
  useEffect(() => {
    const loadImageUrl = async () => {
      if (imageUrl) {
        setDisplayImageUrl(getAssetPath(imageUrl));
        return;
      }
      
      if (imageMediaId) {
        try {
          const { mediaService } = await import('../../../services/apiService');
          const mediaId = typeof imageMediaId === 'string' ? parseInt(imageMediaId) : imageMediaId;
          if (mediaId > 0) {
            const media = await mediaService.getById(mediaId);
            if (media?.filePath) {
              setDisplayImageUrl(getAssetPath(media.filePath));
            }
          }
        } catch (err) {
          console.error('Error loading media for position control:', err);
        }
      }
    };
    loadImageUrl();
  }, [imageUrl, imageMediaId]);

  const handleXChange = (value: string) => {
    const numValue = Math.max(0, Math.min(100, parseFloat(value) || 50));
    setX(String(numValue));
    onChangeX(String(numValue));
  };

  const handleYChange = (value: string) => {
    const numValue = Math.max(0, Math.min(100, parseFloat(value) || 50));
    setY(String(numValue));
    onChangeY(String(numValue));
  };

  // Calculate preview dimensions
  const getPreviewDimensions = () => {
    if (previewAspectRatio) {
      const [widthRatio, heightRatio] = previewAspectRatio.split(':').map(Number);
      const aspectRatio = heightRatio / widthRatio;
      const calculatedHeight = previewWidth * aspectRatio;
      return { width: previewWidth, height: calculatedHeight };
    }
    if (previewHeight) {
      return { width: previewWidth, height: previewHeight };
    }
    // Default to 16:9 if no dimensions specified
    return { width: previewWidth, height: previewWidth * 0.5625 };
  };

  const { width, height } = getPreviewDimensions();

  return (
    <div className="space-y-2">
      <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
        {label}
      </label>
      
      {displayImageUrl && (
        <div 
          className="relative bg-gray-100 rounded-lg overflow-hidden border border-gray-300 mx-auto"
          style={{
            width: `${Math.min(width, 400)}px`,
            height: `${Math.min(height, 225)}px`,
            maxWidth: '100%'
          }}
        >
          <div
            className="absolute inset-0 bg-cover bg-no-repeat"
            style={{
              backgroundImage: `url(${displayImageUrl})`,
              backgroundPosition: `${x}% ${y}%`,
              backgroundSize: 'cover'
            }}
          />
          {/* Position indicator */}
          <div
            className="absolute w-3 h-3 border-2 border-white rounded-full shadow-lg bg-blue-500"
            style={{
              left: `${x}%`,
              top: `${y}%`,
              transform: 'translate(-50%, -50%)',
              pointerEvents: 'none'
            }}
          />
          {/* Dimension label */}
          <div className="absolute bottom-1 right-1 bg-black/60 text-white text-[10px] px-1.5 py-0.5 rounded">
            {Math.round(width)}×{Math.round(height)}px
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
            X Position (%)
          </label>
          <div className="flex items-center gap-1.5">
            <input
              type="range"
              min="0"
              max="100"
              step="1"
              value={x}
              onChange={(e) => handleXChange(e.target.value)}
              className="flex-1"
            />
            <input
              type="number"
              min="0"
              max="100"
              value={x}
              onChange={(e) => handleXChange(e.target.value)}
              className="w-14 px-1.5 py-1 text-xs border border-gray-300 rounded"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
            Y Position (%)
          </label>
          <div className="flex items-center gap-1.5">
            <input
              type="range"
              min="0"
              max="100"
              step="1"
              value={y}
              onChange={(e) => handleYChange(e.target.value)}
              className="flex-1"
            />
            <input
              type="number"
              min="0"
              max="100"
              value={y}
              onChange={(e) => handleYChange(e.target.value)}
              className="w-14 px-1.5 py-1 text-xs border border-gray-300 rounded"
            />
          </div>
        </div>
      </div>

      {helpText && (
        <p className="text-xs text-gray-400">{helpText}</p>
      )}
    </div>
  );
};

