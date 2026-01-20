import { useState, useEffect } from 'react';
import { mediaService } from '../../../services/apiService';
import { getAssetPath } from './utils';
import { LoadingSkeleton } from './LoadingSkeleton';

interface Media {
  id: number;
  fileName: string;
  filePath: string;
  fileType: string;
  altText?: string;
  pageName?: string;
  sectionName?: string;
}

interface MediaLibraryProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (media: Media) => void;
  fileType?: 'image' | 'video' | 'icon' | 'logo' | 'document';
  title?: string;
}

export const MediaLibrary = ({
  isOpen,
  onClose,
  onSelect,
  fileType = 'image',
  title = 'Media Library'
}: MediaLibraryProps) => {
  const [media, setMedia] = useState<Media[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedPage, setSelectedPage] = useState<string>('all');
  const [copiedPath, setCopiedPath] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const ITEMS_PER_PAGE = 50;

  useEffect(() => {
    if (isOpen) {
      // Reset state when modal opens
      setMedia([]);
      setCurrentPage(1);
      setSearchTerm('');
      setSelectedCategory('all');
      setSelectedPage('all');
      loadMedia(1, true);
    }
  }, [isOpen, fileType]);

  // Debounced search effect
  useEffect(() => {
    if (!isOpen) return;
    
    const timeoutId = setTimeout(() => {
      setMedia([]);
      setCurrentPage(1);
      loadMedia(1, true);
    }, 500); // 500ms debounce

    return () => clearTimeout(timeoutId);
  }, [searchTerm, fileType]);

  const loadMedia = async (page: number = 1, reset: boolean = false) => {
    if (reset) {
    setLoading(true);
    } else {
      setLoadingMore(true);
    }
    setError('');
    try {
      const result = await mediaService.getAll(fileType, page, ITEMS_PER_PAGE, searchTerm || undefined);
      
      // Handle both old format (array) and new format (object with media and pagination)
      let mediaArray: Media[] = [];
      let paginationData: any = { totalPages: 1, total: 0 };
      
      if (Array.isArray(result)) {
        // Old format - backward compatibility
        mediaArray = result.filter((item: Media) => 
          item.filePath && (item.filePath.startsWith('/uploads/') || item.filePath.startsWith('/assets/'))
        );
        paginationData = { totalPages: 1, total: mediaArray.length };
      } else if (result && result.media) {
        // New format with pagination
        mediaArray = (result.media || []).filter((item: Media) => 
          item.filePath && (item.filePath.startsWith('/uploads/') || item.filePath.startsWith('/assets/'))
        );
        paginationData = result.pagination || { totalPages: 1, total: 0 };
      }

      if (reset) {
        setMedia(mediaArray);
      } else {
        setMedia(prev => [...prev, ...mediaArray]);
      }
      
      setCurrentPage(page);
      setTotalPages(paginationData.totalPages || 1);
      setTotalItems(paginationData.total || 0);
      setHasMore(page < (paginationData.totalPages || 1));
    } catch (err: any) {
      setError(err.message || 'Failed to load media');
      console.error('Error loading media:', err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const loadMore = () => {
    if (!loadingMore && hasMore) {
      loadMedia(currentPage + 1, false);
    }
  };

  // Filter media by category and page (search is now done server-side)
  const filteredMedia = media.filter(item => {
    const matchesCategory = selectedCategory === 'all' || 
      item.filePath.includes(`/${selectedCategory}/`);
    
    const matchesPage = selectedPage === 'all' || 
      (item.pageName && item.pageName === selectedPage) ||
      (!item.pageName && selectedPage === 'unorganized');
    
    return matchesCategory && matchesPage;
  });

  // Get categories from file paths
  const categories = ['all', ...new Set(
    media.map(item => {
      const match = item.filePath.match(/\/uploads\/images\/([^/]+)\//);
      return match ? match[1] : (item.filePath.match(/\/assets\/([^/]+)\//)?.[1] || 'other');
    })
  )];

  // Get unique pages
  const pages = ['all', 'unorganized', ...new Set(
    media
      .map(item => item.pageName)
      .filter((page): page is string => !!page)
      .sort()
  )];

  const copyToClipboard = async (text: string, itemId: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedPath(itemId.toString());
      setTimeout(() => setCopiedPath(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleSelect = (item: Media) => {
    onSelect(item);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <i className="ri-close-line text-2xl"></i>
          </button>
        </div>

        {/* Search and Filters */}
        <div className="p-4 border-b border-gray-200 space-y-3">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
              <input
                type="text"
                placeholder="Search media..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <i className="ri-close-line"></i>
                </button>
              )}
            </div>
            <select
              value={selectedPage}
              onChange={(e) => setSelectedPage(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
            >
              {pages.map(page => (
                <option key={page} value={page}>
                  {page === 'all' ? 'All Pages' : page === 'unorganized' ? 'Unorganized' : page.charAt(0).toUpperCase() + page.slice(1)}
                </option>
              ))}
            </select>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {[...Array(8)].map((_, i) => (
                <LoadingSkeleton key={i} className="h-32" />
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <i className="ri-error-warning-line text-4xl text-red-500 mb-3"></i>
              <p className="text-red-600">{error}</p>
              <button
                onClick={loadMedia}
                className="mt-4 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800"
              >
                Retry
              </button>
            </div>
          ) : filteredMedia.length === 0 ? (
            <div className="text-center py-12">
              <i className="ri-image-line text-4xl text-gray-400 mb-3"></i>
              <p className="text-gray-600">No media found</p>
            </div>
          ) : (
            <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredMedia.map((item) => (
                <div
                  key={item.id}
                  className="group relative bg-white rounded-lg border border-gray-200 hover:border-gray-900 transition-all overflow-hidden"
                >
                  {/* Image */}
                  <div
                    onClick={() => handleSelect(item)}
                    className="relative aspect-square bg-gray-100 cursor-pointer"
                  >
                    {(() => {
                      const isSVG = item.filePath.toLowerCase().endsWith('.svg') || item.fileType === 'svg' || item.fileType === 'icon';
                      return (
                        <div className={`w-full h-full ${isSVG ? 'bg-white p-2' : ''}`}>
                          <img
                            src={getAssetPath(item.filePath)}
                            alt={item.altText || item.fileName}
                            className={`w-full h-full ${isSVG ? 'object-contain' : 'object-cover'} group-hover:scale-105 transition-transform duration-200`}
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Crect fill="%23ddd" width="200" height="200"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%23999"%3ENo Image%3C/text%3E%3C/svg%3E';
                            }}
                          />
                        </div>
                      );
                    })()}
                    {/* Badges */}
                    {(() => {
                      const isSVG = item.filePath.toLowerCase().endsWith('.svg') || item.fileType === 'svg' || item.fileType === 'icon';
                      if (isSVG) {
                        return (
                          <div className="absolute top-2 right-2 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                            SVG
                          </div>
                        );
                      }
                      if (item.fileType !== 'image') {
                        return (
                          <div className="absolute top-2 right-2 bg-gray-900 text-white text-xs px-2 py-1 rounded">
                            {item.fileType}
                          </div>
                        );
                      }
                      return null;
                    })()}
                  </div>
                  
                  {/* Info Section */}
                  <div className="p-3 space-y-2">
                    <p className="text-xs font-medium text-gray-900 truncate" title={item.fileName}>
                      {item.fileName}
                    </p>
                    
                    {/* Page/Section Info */}
                    {(item.pageName || item.sectionName) && (
                      <div className="flex gap-1 flex-wrap">
                        {item.pageName && (
                          <span className="text-xs px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded">
                            {item.pageName}
                          </span>
                        )}
                        {item.sectionName && (
                          <span className="text-xs px-1.5 py-0.5 bg-green-100 text-green-700 rounded">
                            {item.sectionName}
                          </span>
                        )}
                      </div>
                    )}
                    
                    {/* File Path with Copy Button */}
                    <div className="flex items-center gap-1">
                      <input
                        type="text"
                        value={item.filePath}
                        readOnly
                        className="flex-1 text-xs px-2 py-1 bg-gray-50 border border-gray-200 rounded text-gray-600 truncate"
                        onClick={(e) => e.stopPropagation()}
                      />
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          copyToClipboard(item.filePath, item.id);
                        }}
                        className="px-2 py-1 bg-gray-200 hover:bg-gray-300 rounded text-xs transition-colors"
                        title="Copy path"
                      >
                        {copiedPath === item.id.toString() ? (
                          <i className="ri-check-line text-green-600"></i>
                        ) : (
                          <i className="ri-file-copy-line"></i>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
              
              {/* Load More Button */}
              {hasMore && (
                <div className="mt-6 text-center">
                  <button
                    onClick={loadMore}
                    disabled={loadingMore}
                    className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {loadingMore ? (
                      <>
                        <i className="ri-loader-4-line animate-spin mr-2"></i>
                        Loading...
                      </>
                    ) : (
                      <>
                        Load More ({totalItems - media.length} remaining)
                      </>
                    )}
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 flex justify-between items-center">
          <p className="text-sm text-gray-600">
            Showing {media.length} of {totalItems} {totalItems === 1 ? 'item' : 'items'}
            {totalPages > 1 && ` (Page ${currentPage} of ${totalPages})`}
          </p>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

