import { getApiBaseUrl } from '../../../config/env';
interface CategoryCardsProps {
  section?: any;
  categories?: any[];
  getImagePath?: (imageData: any) => string;
}

export default function CategoryCards({ section, categories = [], getImagePath }: CategoryCardsProps) {
  // No fallback categories - all must come from CMS
  const defaultCategories: any[] = [];

  const displayCategories = categories.length > 0 ? categories : [];

  // Helper to get image path
  const getImageSrc = (category: any): string => {
    if (category.image) {
      if (typeof category.image === 'string') {
        // Filter out old /assets/ paths
        if (category.image.startsWith('/assets/')) {
          return '';
        }
        if (category.image.startsWith('/uploads/') && getImagePath) {
          const apiBase = getApiBaseUrl();
          return `${apiBase}${category.image}`;
        }
        return category.image;
      }
      if (getImagePath) {
        const path = getImagePath(category.image);
        return path && !path.startsWith('/assets/') ? path : '';
      }
    }
    return '';
  };

  return (
    <div id="explore" className="container mx-auto px-6 lg:px-12 py-16 -mt-20 relative z-20">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {displayCategories.map((category, index) => (
          <div
            key={index}
            className="relative h-64 rounded-lg overflow-hidden group cursor-pointer"
            data-aos="fade-up"
            data-aos-delay={index * 100}
          >
            <img
              src={getImageSrc(category)}
              alt={category.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <h3 className="text-white text-2xl font-bold">{category.title}</h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
