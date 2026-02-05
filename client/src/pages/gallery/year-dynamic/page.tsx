import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { galleryAlbumsService, galleryEventsService, galleryImagesService, pagesService, sectionsService } from '../../../services/apiService';
import { getApiBaseUrl } from '../../../config/env';
import MainLayout from '../../../components/feature/MainLayout';
import Footer from '../../../components/feature/Footer';

interface GalleryAlbum {
    id: number;
    name: string;
    slug: string;
    description: string;
    albumType: string;
    isActive: boolean;
}

interface GalleryEvent {
    id: number;
    albumId: number;
    name: string;
    slug: string;
    eventDate: string;
    location: string;
    description: string;
    isActive: boolean;
}

interface GalleryImage {
    id: number;
    eventId: number;
    imageId: number;
    title?: string;
    caption?: string;
    orderIndex: number;
    isActive: boolean;
    image?: {
        id: number;
        filePath: string;
        url?: string;
    };
}

const DynamicGalleryYearPage = ({ year: propYear }: { year?: string }) => {
    console.log('🎯 DynamicGalleryYearPage component is mounting!');
    const params = useParams<{ year: string }>();
    const navigate = useNavigate();
    
    // Use prop if available, otherwise fallback to URL param
    const year = propYear || params.year;

    const [album, setAlbum] = useState<GalleryAlbum | null>(null);
    const [events, setEvents] = useState<GalleryEvent[]>([]);
    const [images, setImages] = useState<GalleryImage[]>([]);
    const [selectedEvent, setSelectedEvent] = useState<string>('all');
    const [selectedImage, setSelectedImage] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);
    const [pageSections, setPageSections] = useState<any>(null);
    const [heroSection, setHeroSection] = useState<any>(null);
    const [ctaSection, setCtaSection] = useState<any>(null);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [highlightedEvent, setHighlightedEvent] = useState<string | null>(null);
    const galleryGridRef = useRef<HTMLDivElement>(null);

    // Initialize AOS
    useEffect(() => {
        AOS.init({
            duration: 600,
            once: false, // Allow re-animation for dynamic content
            offset: 50, // Lower offset for better detection
            easing: 'ease-out-cubic',
            startEvent: 'DOMContentLoaded',
            disable: false,
            useClassNames: false,
            disableMutationObserver: false,
            debounceDelay: 50,
            throttleDelay: 99,
        });
        
        // Refresh AOS after initialization to ensure all elements are detected
        setTimeout(() => {
            AOS.refresh();
        }, 200);
    }, []);

    // Calculate filtered images
    const filteredImages = selectedEvent === 'all'
        ? images
        : images.filter(img => {
            const event = events.find(e => e.id === img.eventId);
            return event?.slug === selectedEvent;
        });

    // Refresh AOS when images change - with delay to ensure DOM is updated
    useEffect(() => {
        if (filteredImages.length === 0) return;
        
        // Use multiple timeouts to ensure DOM is fully updated and images are loaded
        const timers: NodeJS.Timeout[] = [];
        
        // Function to check if element is in viewport and make it visible
        const checkAndShowElements = () => {
            const elements = document.querySelectorAll('.gallery-image-container[data-aos]');
            elements.forEach((el) => {
                const rect = el.getBoundingClientRect();
                const isInViewport = rect.top < window.innerHeight && rect.bottom > 0;
                if (isInViewport && !el.classList.contains('aos-animate')) {
                    // Element is in viewport but not animated yet - make it visible
                    (el as HTMLElement).style.opacity = '1';
                    (el as HTMLElement).style.visibility = 'visible';
                    (el as HTMLElement).style.transform = 'none';
                }
            });
        };
        
        // First refresh after DOM update
        timers.push(setTimeout(() => {
            checkAndShowElements();
            AOS.refresh();
        }, 50));
        
        // Second refresh after images might have loaded
        timers.push(setTimeout(() => {
            checkAndShowElements();
            AOS.refresh();
            // Force trigger scroll event to detect elements in viewport
            window.dispatchEvent(new Event('scroll'));
        }, 200));
        
        // Third refresh to catch any late-loading images
        timers.push(setTimeout(() => {
            checkAndShowElements();
            AOS.refresh();
        }, 500));
        
        // Also check on scroll/resize
        const handleScroll = () => {
            checkAndShowElements();
            AOS.refresh();
        };
        
        window.addEventListener('scroll', handleScroll, { passive: true });
        window.addEventListener('resize', handleScroll, { passive: true });
        
        return () => {
            timers.forEach(timer => clearTimeout(timer));
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('resize', handleScroll);
        };
    }, [images, selectedEvent, filteredImages]);

    // Handle event selection with smooth scrolling
    const handleEventSelect = (eventSlug: string) => {
        setSelectedEvent(eventSlug);
        setHighlightedEvent(eventSlug);
        
        // Scroll to gallery grid after a short delay to ensure DOM is updated
        setTimeout(() => {
            if (galleryGridRef.current) {
                const offset = 100; // Offset from top for better visibility
                const elementPosition = galleryGridRef.current.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - offset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        }, 100);

        // Remove highlight after animation completes
        setTimeout(() => {
            setHighlightedEvent(null);
        }, 2000);
    };

    // Keyboard navigation for lightbox
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (selectedImage === null) return;
            
            if (e.key === 'Escape') {
                closeLightbox();
            } else if (e.key === 'ArrowLeft') {
                prevImage();
            } else if (e.key === 'ArrowRight') {
                nextImage();
            } else if (e.key === 'f' || e.key === 'F') {
                toggleFullscreen();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [selectedImage, filteredImages.length]);

    // Helper function to resolve image URL from CMS
    const resolveImageUrl = (image: GalleryImage): string => {
        if (!image) return '';
        
        // Check if image has Media relationship with filePath
        if (image.image?.filePath) {
            const filePath = image.image.filePath;
            // Filter out old /assets/ paths
            if (filePath.startsWith('/assets/') || filePath.startsWith('/wp-content/')) {
                return '';
            }
            // Uploaded images need backend URL
            if (filePath.startsWith('/uploads/')) {
                const apiBase = getApiBaseUrl();
                return `${apiBase}${filePath}`;
            }
            // Already a full URL
            if (filePath.startsWith('http://') || filePath.startsWith('https://')) {
                return filePath;
            }
            return filePath;
        }
        
        // Fallback to image.url if available
        if (image.image?.url) {
            return image.image.url;
        }
        
        return '';
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                console.log('Fetching gallery data for year:', year);

                // Extract slug from year (e.g., "gallery-2027" -> "2027" or "2027")
                const slug = year?.startsWith('gallery-') ? year.replace('gallery-', '') : year;
                console.log('Extracted slug:', slug);

                // Fetch all year albums and find the one matching the slug
                const allAlbums = await galleryAlbumsService.getAll('year', false);
                const albums = allAlbums.filter((a: any) => a.albumType === 'year');
                console.log('Fetched albums:', albums);

                const matchingAlbum = albums.find((a: any) => {
                    const isYearAlbum = a.albumType === 'year';
                    const isActive = a.isActive !== false;
                    const matchesSlug = (
                        a.slug === slug ||
                        a.slug === `gallery-${slug}` ||
                        a.name === slug ||
                        a.name === year ||
                        a.name === `Year ${slug}` ||
                        a.name === `Year ${year}` ||
                        a.slug === year ||
                        a.name?.toString() === year ||
                        a.slug?.toString() === slug
                    );

                    return isYearAlbum && isActive && matchesSlug;
                });

                console.log('Matching album:', matchingAlbum);

                if (!matchingAlbum) {
                    console.error('No matching album found for year:', year, 'slug:', slug);
                    console.error('Available albums:', albums.map((a: any) => ({
                        id: a.id,
                        name: a.name,
                        slug: a.slug,
                        albumType: a.albumType,
                        isActive: a.isActive
                    })));
                    setLoading(false);
                    return; // Don't navigate, let the component show the error state
                }

                setAlbum(matchingAlbum);

                // Fetch events for this album
                const eventsData = await galleryEventsService.getByAlbumId(matchingAlbum.id, false);
                const activeEvents = eventsData.filter((e: any) => e.isActive !== false);
                console.log('Fetched events:', activeEvents);
                setEvents(activeEvents);

                // Fetch all images for these events
                const allImages: GalleryImage[] = [];
                for (const event of activeEvents) {
                    const eventImages = await galleryImagesService.getByEventId(event.id, false);
                    allImages.push(...eventImages);
                }
                console.log('Fetched images:', allImages);
                setImages(allImages);

                // Fetch page sections from the main gallery page to get hero image and CTA
                try {
                    const galleryPage = await pagesService.getBySlug('gallery');
                    setPageSections(galleryPage);
                    
                    // Fetch sections for the gallery page to get hero and CTA sections
                    if (galleryPage?.id) {
                        const sections = await sectionsService.getByPageId(galleryPage.id);
                        const hero = sections.find((s: any) => s.sectionKey === 'hero');
                        const cta = sections.find((s: any) => s.sectionKey === 'cta');
                        setHeroSection(hero);
                        setCtaSection(cta);
                    }
                } catch (error) {
                    console.error('Error fetching gallery page sections:', error);
                }

                setLoading(false);
            } catch (error) {
                console.error('Error fetching gallery data:', error);
                setLoading(false);
            }
        };

        if (year) {
            fetchData();
        }
    }, [year, navigate]);

    const openLightbox = (index: number) => {
        setSelectedImage(index);
        setIsFullscreen(false);
        // Prevent body scroll when lightbox is open
        document.body.style.overflow = 'hidden';
    };

    const closeLightbox = () => {
        setSelectedImage(null);
        setIsFullscreen(false);
        // Restore body scroll
        document.body.style.overflow = 'unset';
    };

    const nextImage = () => {
        if (selectedImage !== null && selectedImage < filteredImages.length - 1) {
            setSelectedImage(selectedImage + 1);
        } else if (selectedImage !== null && selectedImage === filteredImages.length - 1) {
            // Loop to first image
            setSelectedImage(0);
        }
    };

    const prevImage = () => {
        if (selectedImage !== null && selectedImage > 0) {
            setSelectedImage(selectedImage - 1);
        } else if (selectedImage !== null && selectedImage === 0) {
            // Loop to last image
            setSelectedImage(filteredImages.length - 1);
        }
    };

    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(err => {
                console.error('Error attempting to enable fullscreen:', err);
            });
            setIsFullscreen(true);
        } else {
            document.exitFullscreen();
            setIsFullscreen(false);
        }
    };

    // Keyboard navigation for lightbox
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (selectedImage === null) return;
            
            if (e.key === 'Escape') {
                closeLightbox();
            } else if (e.key === 'ArrowLeft') {
                prevImage();
            } else if (e.key === 'ArrowRight') {
                nextImage();
            } else if (e.key === 'f' || e.key === 'F') {
                toggleFullscreen();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [selectedImage, filteredImages.length]);

    const shareImage = async () => {
        if (selectedImage === null) return;
        
        const currentImage = filteredImages[selectedImage];
        const imageUrl = resolveImageUrl(currentImage);
        const pageUrl = window.location.href;
        const title = currentImage.caption || currentImage.title || `Gallery ${album?.name} - Image ${selectedImage + 1}`;

        if (navigator.share) {
            try {
                await navigator.share({
                    title: title,
                    text: `Check out this image from ${album?.name} gallery`,
                    url: pageUrl
                });
            } catch (err) {
                // User cancelled or error occurred
                console.log('Share cancelled or failed');
            }
        } else {
            // Fallback: copy to clipboard
            try {
                await navigator.clipboard.writeText(pageUrl);
                alert('Link copied to clipboard!');
            } catch (err) {
                // Fallback: show URL
                prompt('Copy this link:', pageUrl);
            }
        }
    };

    // Keyboard navigation for lightbox
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (selectedImage === null) return;
            
            if (e.key === 'Escape') {
                closeLightbox();
            } else if (e.key === 'ArrowLeft') {
                prevImage();
            } else if (e.key === 'ArrowRight') {
                nextImage();
            } else if (e.key === 'f' || e.key === 'F') {
                toggleFullscreen();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [selectedImage, filteredImages.length]);


    if (loading) {
        return (
            <MainLayout>
                <div className="min-h-screen flex items-center justify-center">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                        <p className="text-gray-600">Loading gallery...</p>
                    </div>
                </div>
            </MainLayout>
        );
    }

    if (!album) {
        return (
            <MainLayout>
                <div className="min-h-screen flex items-center justify-center">
                    <div className="text-center">
                        <h1 className="text-5xl font-semibold text-gray-100 mb-4">404</h1>
                        <h2 className="text-3xl font-semibold mb-4">Gallery Not Found</h2>
                        <p className="text-gray-600 mb-8">
                            The gallery for year {year} could not be found.
                        </p>
                        <button
                            onClick={() => navigate('/gallery')}
                            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                        >
                            Back to Gallery
                        </button>
                    </div>
                </div>
            </MainLayout>
        );
    }

    // Helper function to get content value from section
    const getSectionContent = (section: any, key: string): any => {
        if (!section?.content) return null;
        const contentItem = section.content.find((c: any) => c.contentKey === key);
        if (!contentItem) return null;
        
        if (contentItem.contentType === 'json') {
            try {
                return JSON.parse(contentItem.contentValue || '{}');
            } catch {
                return contentItem.contentValue;
            }
        }
        
        return contentItem.contentValue || null;
    };

    // Helper function to get image path
    const getImagePath = (media: any) => {
        if (!media) return '';
        if (typeof media === 'string') {
            if (media.startsWith('/uploads/')) {
                const apiBase = getApiBaseUrl();
                return `${apiBase}${media}`;
            }
            return media;
        }
        if (media?.filePath) {
            const filePath = media.filePath;
            if (filePath.startsWith('/uploads/')) {
                const apiBase = getApiBaseUrl();
                return `${apiBase}${filePath}`;
            }
            return filePath;
        }
        if (media?.url) {
            return media.url;
        }
        return '';
    };

    // Get hero image from gallery page hero section
    const heroBgImage = heroSection ? (() => {
        const bgImage = getSectionContent(heroSection, 'backgroundImage');
        if (bgImage) {
            // Check if it's a media ID or path
            if (typeof bgImage === 'number' || /^\d+$/.test(String(bgImage))) {
                // It's a media ID, we'd need to fetch it, but for now use the contentValue
                return getImagePath({ filePath: getSectionContent(heroSection, 'backgroundImage') });
            }
            // Check if content item has media relationship
            const contentItem = heroSection.content?.find((c: any) => c.contentKey === 'backgroundImage');
            if (contentItem?.media?.filePath) {
                return getImagePath(contentItem.media);
            }
            // Use contentValue as filePath
            return getImagePath({ filePath: bgImage });
        }
        return '';
    })() : '';

    // Format hero title as "Gallery – {year}" (using en dash)
    const heroTitle = `Gallery – ${year || album.name}`;
    const heroDescription = heroSection ? getSectionContent(heroSection, 'description') : (album.description || '');

    // Get surrounding images for lightbox thumbnails
    const getSurroundingImages = () => {
        if (selectedImage === null) return [];
        const current = selectedImage;
        const total = filteredImages.length;
        const range = 3; // Show 3 images on each side
        
        const surrounding: number[] = [];
        for (let i = -range; i <= range; i++) {
            if (i === 0) continue; // Skip current image
            let idx = current + i;
            if (idx < 0) idx = total + idx;
            if (idx >= total) idx = idx - total;
            surrounding.push(idx);
        }
        return surrounding;
    };

    return (
        <MainLayout>
            {/* Hero Section */}
            <section className="relative h-[400px] flex items-center justify-center overflow-hidden">
                {heroBgImage ? (
                    <>
                        <div className="absolute inset-0">
                            <img
                                src={heroBgImage}
                                alt={`Gallery ${album.name}`}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                    // Fallback to gradient if image fails to load
                                    (e.target as HTMLImageElement).style.display = 'none';
                                }}
                            />
                            <div className="absolute inset-0 bg-black/40"></div>
                        </div>
                    </>
                ) : (
                <div className="absolute inset-0 bg-gradient-to-r from-blue-900 to-blue-700"></div>
                )}
                <div className="relative z-10 text-center text-white px-4">
                    <h1 className="text-5xl md:text-6xl font-bold mb-4">
                        {heroTitle}
                    </h1>
                    {heroDescription && (
                        <p className="text-xl md:text-2xl max-w-3xl mx-auto">
                            {heroDescription}
                        </p>
                    )}
                </div>
            </section>

            {/* Event Filters */}
            {events.length > 0 && (
                <section className="py-8 bg-gray-50">
                    <div className="container mx-auto px-4">
                        <div className="flex flex-wrap gap-4 justify-center">
                            <button
                                onClick={() => handleEventSelect('all')}
                                className={`px-6 py-2 rounded-full transition-all duration-300 ${selectedEvent === 'all'
                                    ? 'bg-black text-white shadow-lg scale-105'
                                    : 'bg-white text-gray-700 hover:bg-gray-100 hover:scale-105'
                                    }`}
                                data-aos="fade-up"
                            >
                                All Events
                            </button>
                            {events.map((event, index) => {
                                return (
                                    <button
                                        key={event.id}
                                        onClick={() => handleEventSelect(event.slug)}
                                        className={`px-6 py-2 rounded-full transition-all duration-300 ${selectedEvent === event.slug
                                            ? 'bg-black text-white shadow-lg scale-105'
                                            : 'bg-white text-gray-700 hover:bg-gray-100 hover:scale-105'
                                            }`}
                                        data-aos="fade-up"
                                        data-aos-delay={index * 50}
                                    >
                                        {event.name}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </section>
            )}

            {/* Gallery Grid */}
            <section className="py-16" ref={galleryGridRef}>
                <div className="container mx-auto px-4">
                    {filteredImages.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-gray-600 text-xl">No images found for this selection.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {filteredImages.map((image, index) => {
                                const imageUrl = resolveImageUrl(image);
                                if (!imageUrl) return null; // Don't render if no valid image URL
                                
                                const event = events.find(e => e.id === image.eventId);
                                const isHighlighted = highlightedEvent && event?.slug === highlightedEvent;
                                
                                return (
                                    <div
                                        key={`${image.id}-${selectedEvent}`}
                                        className={`gallery-image-container group relative cursor-pointer overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-all duration-500 ${
                                            isHighlighted ? 'ring-4 ring-yellow-400 ring-opacity-75 scale-105 z-10' : ''
                                        }`}
                                        onClick={() => openLightbox(index)}
                                        data-aos="fade-up"
                                        data-aos-delay={index % 10 * 30}
                                        data-aos-duration="400"
                                        data-aos-once="false"
                                    >
                                        <div className="relative w-full h-64 overflow-hidden">
                                        <img
                                            src={imageUrl}
                                            alt={image.caption || image.title || `Gallery image ${index + 1}`}
                                                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-out"
                                            onError={(e) => {
                                                (e.target as HTMLImageElement).style.display = 'none';
                                            }}
                                        />
                                            {/* Overlay on hover */}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-4">
                                                <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                                                    {event && (
                                                        <p className="text-white text-xs font-semibold mb-1 uppercase tracking-wider">
                                                            {event.name}
                                                        </p>
                                                    )}
                                        {(image.caption || image.title) && (
                                                        <p className="text-white text-sm font-medium line-clamp-2">
                                                            {image.caption || image.title}
                                                        </p>
                                                    )}
                                                    <div className="flex items-center gap-2 mt-2">
                                                        <i className="ri-eye-line text-white text-lg"></i>
                                                        <span className="text-white text-xs">Click to view</span>
                                                    </div>
                                                </div>
                                            </div>
                                            {/* Hover icon */}
                                            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                <div className="bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-lg">
                                                    <i className="ri-expand-image-line text-gray-800 text-xl"></i>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </section>

            {/* Enhanced Lightbox */}
            {selectedImage !== null && (
                <div
                    className="fixed inset-0 bg-black/95 z-[9999] flex items-center justify-center p-4 animate-fadeIn"
                    onClick={closeLightbox}
                >
                    {/* Close Button */}
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            closeLightbox();
                        }}
                        className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors z-10 w-12 h-12 flex items-center justify-center bg-black/50 rounded-full hover:bg-black/70 backdrop-blur-sm"
                        aria-label="Close"
                    >
                        <i className="ri-close-line text-2xl"></i>
                    </button>

                    {/* Previous Button */}
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            prevImage();
                        }}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 transition-colors z-10 w-12 h-12 flex items-center justify-center bg-black/50 rounded-full hover:bg-black/70 backdrop-blur-sm"
                        aria-label="Previous"
                    >
                        <i className="ri-arrow-left-s-line text-2xl"></i>
                    </button>

                    {/* Next Button */}
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            nextImage();
                        }}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 transition-colors z-10 w-12 h-12 flex items-center justify-center bg-black/50 rounded-full hover:bg-black/70 backdrop-blur-sm"
                        aria-label="Next"
                    >
                        <i className="ri-arrow-right-s-line text-2xl"></i>
                    </button>

                    {/* Action Buttons Bar */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-3 bg-black/70 backdrop-blur-md rounded-full px-4 py-2 z-10">
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                toggleFullscreen();
                            }}
                            className="text-white hover:text-gray-300 transition-colors p-2 rounded-full hover:bg-white/10"
                            title="Fullscreen (F)"
                        >
                            <i className={`ri-${isFullscreen ? 'fullscreen-exit-line' : 'fullscreen-line'} text-xl`}></i>
                        </button>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                shareImage();
                            }}
                            className="text-white hover:text-gray-300 transition-colors p-2 rounded-full hover:bg-white/10"
                            title="Share"
                        >
                            <i className="ri-share-line text-xl"></i>
                        </button>
                        <div className="text-white text-sm px-3">
                            {selectedImage + 1} / {filteredImages.length}
                        </div>
                    </div>

                    {/* Main Image */}
                    <div 
                        className="max-w-7xl max-h-[85vh] relative" 
                        onClick={(e) => e.stopPropagation()}
                    >
                        <img
                            src={resolveImageUrl(filteredImages[selectedImage])}
                            alt={filteredImages[selectedImage].caption || filteredImages[selectedImage].title || 'Gallery image'}
                            className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
                            onError={(e) => {
                                (e.target as HTMLImageElement).style.display = 'none';
                            }}
                        />
                        {/* Image Info */}
                        {(filteredImages[selectedImage].caption || filteredImages[selectedImage].title) && (
                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 rounded-b-lg">
                                <p className="text-white text-lg font-medium text-center">
                                {filteredImages[selectedImage].caption || filteredImages[selectedImage].title}
                            </p>
                                {(() => {
                                    const event = events.find(e => e.id === filteredImages[selectedImage].eventId);
                                    return event && (
                                        <p className="text-white/80 text-sm text-center mt-1">
                                            {event.name}
                                        </p>
                                    );
                                })()}
                            </div>
                        )}
                    </div>

                    {/* Surrounding Thumbnails */}
                    <div className="absolute left-0 right-0 bottom-20 flex justify-center gap-2 z-10 px-4">
                        {getSurroundingImages().map((idx) => {
                            const thumbImage = filteredImages[idx];
                            const thumbUrl = resolveImageUrl(thumbImage);
                            if (!thumbUrl) return null;
                            
                            const isActive = idx === selectedImage;
                            
                            return (
                                <button
                                    key={idx}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setSelectedImage(idx);
                                    }}
                                    className={`relative w-16 h-16 md:w-20 md:h-20 rounded-lg overflow-hidden border-2 transition-all duration-300 ${
                                        isActive 
                                            ? 'border-white scale-110 shadow-lg' 
                                            : 'border-white/30 hover:border-white/60 hover:scale-105'
                                    }`}
                                >
                                    <img
                                        src={thumbUrl}
                                        alt={`Thumbnail ${idx + 1}`}
                                        className="w-full h-full object-cover"
                                    />
                                    {isActive && (
                                        <div className="absolute inset-0 bg-white/20"></div>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* CTA Section - Same as Gallery Page */}
            {(() => {
                const bgGradientFrom = getSectionContent(ctaSection, 'bgGradientFrom') || '#3b9dd6';
                const bgGradientTo = getSectionContent(ctaSection, 'bgGradientTo') || '#4db3e8';
                const cardsJson = getSectionContent(ctaSection, 'cards');
                
                let cardsArray: any[] = [];
                if (cardsJson) {
                    if (Array.isArray(cardsJson)) {
                        cardsArray = cardsJson;
                    } else if (typeof cardsJson === 'string') {
                        try {
                            cardsArray = JSON.parse(cardsJson);
                        } catch {
                            cardsArray = [];
                        }
                    }
                }

                // Fallback to default CTAs if no cards
                if (cardsArray.length === 0) {
                    cardsArray = [
                        { title: 'Got a question?', buttonText: 'Get in touch', buttonLink: '/contact' },
                        { title: 'See our latest news', buttonText: 'Refex Newsroom', buttonLink: '/newsroom' },
                        { title: 'Work at Refex', buttonText: 'Careers', buttonLink: '/careers' }
                    ];
                }

                return (
                    <section className="py-[27px] md:py-[34px] bg-green-50">
                        <div className="container mx-auto px-4 lg:px-24 max-w-8xl">
                            <div 
                                className="rounded-lg px-6 py-[20px] md:px-8 md:py-[27px]"
                                style={{ 
                                    background: `linear-gradient(135deg, ${bgGradientFrom} 0%, ${bgGradientTo} 100%)`
                                }}
                            >
                                <div className="grid md:grid-cols-3 gap-6 md:gap-8">
                                    {cardsArray.map((card: any, index: number) => (
                                        <div 
                                            key={index} 
                                            className="text-center"
                                            data-aos="fade-up"
                                            data-aos-delay={index * 100}
                                        >
                                            <h3 className="text-sm md:text-base font-bold text-white mb-[13.6px]">{card.title}</h3>
                                            <Link
                                                to={card.buttonLink || '#'}
                                                className="inline-block border-2 border-white bg-transparent text-white px-6 py-[8.5px] rounded-full font-semibold hover:bg-white hover:text-black hover:-translate-y-2 transition-all duration-500 ease-out whitespace-nowrap cursor-pointer text-sm md:text-base"
                                            >
                                                {card.buttonText}
                                            </Link>
                                        </div>
                                    ))}
                                </div>
                            </div>
                </div>
            </section>
                );
            })()}

            {/* Footer */}
            <Footer />

            <style>{`
                @keyframes fadeIn {
                    from {
                        opacity: 0;
                    }
                    to {
                        opacity: 1;
                    }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.3s ease-out;
                }
            `}</style>
        </MainLayout>
    );
};

export default DynamicGalleryYearPage;
