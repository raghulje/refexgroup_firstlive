interface LoadingSkeletonProps {
  type?: 'table' | 'card' | 'text' | 'image' | 'button';
  rows?: number;
  className?: string;
}

export const LoadingSkeleton = ({ 
  type = 'text', 
  rows = 3,
  className = '' 
}: LoadingSkeletonProps) => {
  if (type === 'table') {
    return (
      <div className={`animate-pulse ${className}`}>
        <div className="space-y-3">
          {Array.from({ length: rows }).map((_, i) => (
            <div key={i} className="flex space-x-4">
              <div className="h-4 bg-gray-200 rounded w-12"></div>
              <div className="h-4 bg-gray-200 rounded flex-1"></div>
              <div className="h-4 bg-gray-200 rounded w-24"></div>
              <div className="h-4 bg-gray-200 rounded w-16"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (type === 'card') {
    return (
      <div className={`animate-pulse ${className}`}>
        <div className="bg-gray-200 rounded-lg h-48"></div>
        <div className="mt-4 space-y-2">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  if (type === 'image') {
    return (
      <div className={`animate-pulse bg-gray-200 rounded ${className}`} style={{ aspectRatio: '1/1' }}></div>
    );
  }

  if (type === 'button') {
    return (
      <div className={`animate-pulse h-10 bg-gray-200 rounded ${className}`}></div>
    );
  }

  // Default: text
  return (
    <div className={`animate-pulse space-y-2 ${className}`}>
      {Array.from({ length: rows }).map((_, i) => (
        <div 
          key={i} 
          className="h-4 bg-gray-200 rounded"
          style={{ width: i === rows - 1 ? '60%' : '100%' }}
        ></div>
      ))}
    </div>
  );
};

