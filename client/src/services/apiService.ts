import api from './api';
import {
    Page,
    Section,
    HeroSlide,
    BusinessCard,
    NavigationMenu,
    GlobalSettings,
    FooterSection,
    SocialLink,
    ContactInfo,
    SDGCard,
    Leader,
    Award,
    NewsroomItem,
    GalleryImage,
    GalleryAlbum,
    GalleryEvent,
    GalleryDocument,
    CoreValue,
    Testimonial,
    Job,
    Media,
    TabGroup,
    CardCollection
} from '../types/cms';


// Pages Service
export const pagesService = {
    getAll: async (): Promise<Page[]> => {
        const response = await api.get('/pages');
        return response.data.data;
    },
    getBySlug: async (slug: string): Promise<Page> => {
        const response = await api.get(`/pages/${slug}`);
        return response.data.data;
    },
    getById: async (id: number): Promise<Page> => {
        const response = await api.get(`/pages/id/${id}`);
        return response.data.data;
    },
    create: async (pageData: Partial<Page>): Promise<Page> => {
        const response = await api.post('/pages', pageData);
        return response.data.data;
    },
    update: async (id: number, pageData: Partial<Page>): Promise<Page> => {
        const response = await api.put(`/pages/${id}`, pageData);
        return response.data.data;
    },
    delete: async (id: number): Promise<void> => {
        await api.delete(`/pages/${id}`);
    }
};

// Sections Service
export const sectionsService = {
    getByPageId: async (pageId: number): Promise<Section[]> => {
        const response = await api.get(`/sections/page/${pageId}`);
        return response.data.data;
    },
    getById: async (id: number): Promise<Section> => {
        const response = await api.get(`/sections/${id}`);
        return response.data.data;
    },
    create: async (sectionData: Partial<Section>): Promise<Section> => {
        const response = await api.post('/sections', sectionData);
        return response.data.data;
    },
    createSection: async (sectionData: Partial<Section>): Promise<Section> => {
        const response = await api.post('/sections', sectionData);
        return response.data.data;
    },
    update: async (id: number, sectionData: Partial<Section>): Promise<Section> => {
        const response = await api.put(`/sections/${id}`, sectionData);
        return response.data.data;
    },
    delete: async (id: number): Promise<void> => {
        await api.delete(`/sections/${id}`);
    },
    reorder: async (sections: { id: number; orderIndex: number }[]): Promise<void> => {
        await api.put('/sections/reorder', { sections });
    }
};

// Section Content Service
export const sectionContentService = {
    update: async (id: number, contentData: Partial<SectionContent>): Promise<SectionContent> => {
        const response = await api.put(`/section-content/${id}`, contentData);
        return response.data.data;
    },
    bulkUpdate: async (content: Partial<SectionContent>[]): Promise<SectionContent[]> => {
        const response = await api.post('/section-content/bulk', { content });
        return response.data.data;
    },
    delete: async (id: number): Promise<void> => {
        await api.delete(`/section-content/${id}`);
    }
};

// Hero Slides Service
export const heroSlidesService = {
    getByPageId: async (pageId: number): Promise<HeroSlide[]> => {
        const response = await api.get(`/hero-slides/page/${pageId}`);
        return response.data.data;
    },
    create: async (slideData: Partial<HeroSlide>): Promise<HeroSlide> => {
        const response = await api.post('/hero-slides', slideData);
        return response.data.data;
    },
    update: async (id: number, slideData: Partial<HeroSlide>): Promise<HeroSlide> => {
        const response = await api.put(`/hero-slides/${id}`, slideData);
        return response.data.data;
    },
    delete: async (id: number): Promise<void> => {
        await api.delete(`/hero-slides/${id}`);
    },
    reorder: async (slides: { id: number; orderIndex: number }[]): Promise<void> => {
        await api.put('/hero-slides/reorder', { slides });
    }
};

// Business Cards Service
export const businessCardsService = {
    getAll: async (): Promise<BusinessCard[]> => {
        const response = await api.get('/business-cards');
        return response.data.data;
    },
    create: async (cardData: Partial<BusinessCard>): Promise<BusinessCard> => {
        const response = await api.post('/business-cards', cardData);
        return response.data.data;
    },
    update: async (id: number, cardData: Partial<BusinessCard>): Promise<BusinessCard> => {
        const response = await api.put(`/business-cards/${id}`, cardData);
        return response.data.data;
    },
    delete: async (id: number): Promise<void> => {
        await api.delete(`/business-cards/${id}`);
    },
    reorder: async (cards: { id: number; orderIndex: number }[]): Promise<void> => {
        await api.put('/business-cards/reorder', { cards });
    }
};

// Navigation Service
export const navigationService = {
    getByLocation: async (location: string): Promise<NavigationMenu[]> => {
        const response = await api.get(`/navigation/${location}`);
        return response.data.data;
    },
    getAll: async (): Promise<NavigationMenu[]> => {
        const response = await api.get('/navigation');
        return response.data.data;
    },
    create: async (menuData: Partial<NavigationMenu>): Promise<NavigationMenu> => {
        const response = await api.post('/navigation', menuData);
        return response.data.data;
    },
    update: async (id: number, menuData: Partial<NavigationMenu>): Promise<NavigationMenu> => {
        const response = await api.put(`/navigation/${id}`, menuData);
        return response.data.data;
    },
    delete: async (id: number): Promise<void> => {
        await api.delete(`/navigation/${id}`);
    }
};

// Contact Form Service
export const contactFormService = {
    submit: async (formData: {
        name: string;
        email: string;
        phone?: string;
        enquiringFor?: string;
        message: string;
    }): Promise<any> => {
        const response = await api.post('/contact-form/submit', formData);
        return response.data.data;
    },
    testEmail: async (): Promise<any> => {
        const response = await api.post('/contact-form/test-email');
        return response.data.data;
    },
    getEmailConfig: async (): Promise<any> => {
        const response = await api.get('/contact-form/email-config');
        return response.data.data;
    }
};

// Global Settings Service
export const globalSettingsService = {
    getAll: async (): Promise<GlobalSettings> => {
        const response = await api.get('/global-settings');
        return response.data.data;
    },
    getByKey: async (key: string): Promise<any> => {
        const response = await api.get(`/global-settings/${key}`);
        return response.data.data;
    },
    create: async (settingData: { key: string; value: any; valueType?: string }): Promise<any> => {
        const response = await api.post('/global-settings', settingData);
        return response.data.data;
    },
    update: async (key: string, settingData: { value: any; valueType?: string }): Promise<any> => {
        const response = await api.put(`/global-settings/${key}`, settingData);
        return response.data.data;
    },
    delete: async (key: string): Promise<void> => {
        await api.delete(`/global-settings/${key}`);
    }
};

// Footer Service
export const footerService = {
    getAll: async (): Promise<FooterSection[]> => {
        const response = await api.get('/footer');
        return response.data.data;
    },
    createSection: async (sectionData: Partial<FooterSection>): Promise<FooterSection> => {
        const response = await api.post('/footer', sectionData);
        return response.data.data;
    },
    updateSection: async (id: number, sectionData: Partial<FooterSection>): Promise<FooterSection> => {
        const response = await api.put(`/footer/${id}`, sectionData);
        return response.data.data;
    },
    deleteSection: async (id: number): Promise<void> => {
        await api.delete(`/footer/${id}`);
    }
};

// Social Links Service
export const socialLinksService = {
    getAll: async (): Promise<SocialLink[]> => {
        const response = await api.get('/social-links');
        return response.data.data;
    },
    create: async (linkData: Partial<SocialLink>): Promise<SocialLink> => {
        const response = await api.post('/social-links', linkData);
        return response.data.data;
    },
    update: async (id: number, linkData: Partial<SocialLink>): Promise<SocialLink> => {
        const response = await api.put(`/social-links/${id}`, linkData);
        return response.data.data;
    },
    delete: async (id: number): Promise<void> => {
        await api.delete(`/social-links/${id}`);
    }
};

// Contact Info Service
export const contactInfoService = {
    getAll: async (): Promise<ContactInfo[]> => {
        const response = await api.get('/contact-info');
        return response.data.data;
    },
    create: async (infoData: Partial<ContactInfo>): Promise<ContactInfo> => {
        const response = await api.post('/contact-info', infoData);
        return response.data.data;
    },
    update: async (id: number, infoData: Partial<ContactInfo>): Promise<ContactInfo> => {
        const response = await api.put(`/contact-info/${id}`, infoData);
        return response.data.data;
    },
    delete: async (id: number): Promise<void> => {
        await api.delete(`/contact-info/${id}`);
    }
};

// SDG Cards Service
export const sdgCardsService = {
    getAll: async (): Promise<SDGCard[]> => {
        const response = await api.get('/sdg-cards');
        return response.data.data;
    },
    create: async (cardData: Partial<SDGCard>): Promise<SDGCard> => {
        const response = await api.post('/sdg-cards', cardData);
        return response.data.data;
    },
    update: async (id: number, cardData: Partial<SDGCard>): Promise<SDGCard> => {
        const response = await api.put(`/sdg-cards/${id}`, cardData);
        return response.data.data;
    },
    delete: async (id: number): Promise<void> => {
        await api.delete(`/sdg-cards/${id}`);
    }
};

// Leaders Service
export const leadersService = {
    getAll: async (includeInactive: boolean = false): Promise<Leader[]> => {
        const response = await api.get(`/leaders${includeInactive ? '?includeInactive=true' : ''}`);
        return response.data.data;
    },
    create: async (leaderData: Partial<Leader>): Promise<Leader> => {
        const response = await api.post('/leaders', leaderData);
        return response.data.data;
    },
    update: async (id: number, leaderData: Partial<Leader>): Promise<Leader> => {
        const response = await api.put(`/leaders/${id}`, leaderData);
        return response.data.data;
    },
    delete: async (id: number): Promise<void> => {
        await api.delete(`/leaders/${id}`);
    }
};

// Awards Service
export const awardsService = {
    getAll: async (): Promise<Award[]> => {
        const response = await api.get('/awards');
        return response.data.data;
    },
    create: async (awardData: Partial<Award>): Promise<Award> => {
        const response = await api.post('/awards', awardData);
        return response.data.data;
    },
    update: async (id: number, awardData: Partial<Award>): Promise<Award> => {
        const response = await api.put(`/awards/${id}`, awardData);
        return response.data.data;
    },
    delete: async (id: number): Promise<void> => {
        await api.delete(`/awards/${id}`);
    }
};

// Newsroom Service
export const newsroomService = {
    getAll: async (): Promise<NewsroomItem[]> => {
        const response = await api.get('/newsroom');
        return response.data.data;
    },
    getById: async (id: number): Promise<NewsroomItem> => {
        const response = await api.get(`/newsroom/${id}`);
        return response.data.data;
    },
    create: async (itemData: Partial<NewsroomItem>): Promise<NewsroomItem> => {
        const response = await api.post('/newsroom', itemData);
        return response.data.data;
    },
    update: async (id: number, itemData: Partial<NewsroomItem>): Promise<NewsroomItem> => {
        const response = await api.put(`/newsroom/${id}`, itemData);
        return response.data.data;
    },
    delete: async (id: number): Promise<void> => {
        await api.delete(`/newsroom/${id}`);
    }
};

// Gallery Albums Service
export const galleryAlbumsService = {
    getAll: async (albumType?: string, includeInactive: boolean = false): Promise<GalleryAlbum[]> => {
        const params = new URLSearchParams();
        if (albumType) params.append('albumType', albumType);
        // Only add isActive filter if we want to exclude inactive albums
        if (!includeInactive) params.append('isActive', 'true');
        console.log('🔍 galleryAlbumsService.getAll called with:', { albumType, includeInactive, params: params.toString() });
        const response = await api.get(`/gallery/albums?${params.toString()}`);
        console.log('📦 galleryAlbumsService.getAll response:', response.data);
        // Handle both response.data.data and response.data formats
        const albums = response.data?.data || response.data || [];
        console.log('📦 Parsed albums:', albums);
        return Array.isArray(albums) ? albums : [];
    },
    getBySlug: async (slug: string): Promise<GalleryAlbum> => {
        const response = await api.get(`/gallery/albums/${slug}`);
        return response.data.data;
    },
    getById: async (id: number): Promise<GalleryAlbum> => {
        const response = await api.get(`/gallery/albums/id/${id}`);
        return response.data.data;
    },
    create: async (albumData: Partial<GalleryAlbum>): Promise<GalleryAlbum> => {
        const response = await api.post('/gallery/albums', albumData);
        return response.data.data;
    },
    update: async (id: number, albumData: Partial<GalleryAlbum>): Promise<GalleryAlbum> => {
        const response = await api.put(`/gallery/albums/${id}`, albumData);
        return response.data.data;
    },
    delete: async (id: number): Promise<void> => {
        await api.delete(`/gallery/albums/${id}`);
    },
    reorder: async (albums: { id: number; orderIndex: number }[]): Promise<void> => {
        await api.put('/gallery/albums/reorder', { albums });
    }
};

// Gallery Events Service
export const galleryEventsService = {
    getByAlbumId: async (albumId: number, includeInactive: boolean = false): Promise<GalleryEvent[]> => {
        const params = includeInactive ? '' : '?isActive=true';
        const response = await api.get(`/gallery/albums/${albumId}/events${params}`);
        return response.data.data;
    },
    getBySlug: async (albumSlug: string, eventSlug: string): Promise<GalleryEvent> => {
        const response = await api.get(`/gallery/albums/${albumSlug}/events/${eventSlug}`);
        return response.data.data;
    },
    getById: async (id: number): Promise<GalleryEvent> => {
        const response = await api.get(`/gallery/events/${id}`);
        return response.data.data;
    },
    create: async (albumId: number, eventData: Partial<GalleryEvent>): Promise<GalleryEvent> => {
        const response = await api.post(`/gallery/albums/${albumId}/events`, eventData);
        return response.data.data;
    },
    update: async (id: number, eventData: Partial<GalleryEvent>): Promise<GalleryEvent> => {
        const response = await api.put(`/gallery/events/${id}`, eventData);
        return response.data.data;
    },
    delete: async (id: number): Promise<void> => {
        await api.delete(`/gallery/events/${id}`);
    },
    reorder: async (albumId: number, events: { id: number; orderIndex: number }[]): Promise<void> => {
        await api.put(`/gallery/albums/${albumId}/events/reorder`, { events });
    }
};

// Gallery Documents Service
export const galleryDocumentsService = {
    getByEventId: async (eventId: number): Promise<GalleryDocument[]> => {
        const response = await api.get(`/gallery/events/${eventId}/documents?isActive=true`);
        return response.data.data;
    },
    getById: async (id: number): Promise<GalleryDocument> => {
        const response = await api.get(`/gallery/documents/${id}`);
        return response.data.data;
    },
    create: async (eventId: number, documentData: Partial<GalleryDocument>): Promise<GalleryDocument> => {
        const response = await api.post(`/gallery/events/${eventId}/documents`, documentData);
        return response.data.data;
    },
    update: async (id: number, documentData: Partial<GalleryDocument>): Promise<GalleryDocument> => {
        const response = await api.put(`/gallery/documents/${id}`, documentData);
        return response.data.data;
    },
    delete: async (id: number): Promise<void> => {
        await api.delete(`/gallery/documents/${id}`);
    },
    reorder: async (eventId: number, documents: { id: number; orderIndex: number }[]): Promise<void> => {
        await api.put(`/gallery/events/${eventId}/documents/reorder`, { documents });
    }
};

// Gallery Images Service (Legacy support)
export const galleryService = {
    getAll: async (year?: string, category?: string, eventId?: number): Promise<GalleryImage[]> => {
        const params = new URLSearchParams();
        if (year) params.append('year', year);
        if (category) params.append('category', category);
        if (eventId) params.append('eventId', eventId.toString());
        const response = await api.get(`/gallery?${params.toString()}`);
        return response.data.data;
    },
    getById: async (id: number): Promise<GalleryImage> => {
        const response = await api.get(`/gallery/${id}`);
        return response.data.data;
    },
    create: async (imageData: Partial<GalleryImage>): Promise<GalleryImage> => {
        const response = await api.post('/gallery', imageData);
        return response.data.data;
    },
    update: async (id: number, imageData: Partial<GalleryImage>): Promise<GalleryImage> => {
        const response = await api.put(`/gallery/${id}`, imageData);
        return response.data.data;
    },
    delete: async (id: number): Promise<void> => {
        await api.delete(`/gallery/${id}`);
    },
    reorder: async (images: { id: number; orderIndex: number }[]): Promise<void> => {
        await api.put('/gallery/reorder', { images });
    }
};

// Gallery Images Service (for CMS - uses legacy gallery endpoint)
export const galleryImagesService = {
    getByEventId: async (eventId: number, includeInactive: boolean = false): Promise<GalleryImage[]> => {
        const params = new URLSearchParams();
        params.append('eventId', eventId.toString());
        if (!includeInactive) params.append('isActive', 'true');
        const response = await api.get(`/gallery?${params.toString()}`);
        return response.data.data;
    },
    getById: async (id: number): Promise<GalleryImage> => {
        const response = await api.get(`/gallery/images/${id}`);
        return response.data.data;
    },
    create: async (imageData: Partial<GalleryImage>): Promise<GalleryImage> => {
        const response = await api.post('/gallery/images', imageData);
        return response.data.data;
    },
    update: async (id: number, imageData: Partial<GalleryImage>): Promise<GalleryImage> => {
        const response = await api.put(`/gallery/images/${id}`, imageData);
        return response.data.data;
    },
    delete: async (id: number): Promise<void> => {
        await api.delete(`/gallery/images/${id}`);
    },
    reorder: async (eventId: number, images: { id: number; orderIndex: number }[]): Promise<void> => {
        await api.put(`/gallery/events/${eventId}/images/reorder`, { images });
    },
    bulkCreate: async (eventId: number, images: Partial<GalleryImage>[]): Promise<GalleryImage[]> => {
        const promises = images.map(img => api.post('/gallery/images', { ...img, eventId }));
        const responses = await Promise.all(promises);
        return responses.map(r => r.data.data);
    }
};

// Core Values Service
export const coreValuesService = {
    getAll: async (): Promise<CoreValue[]> => {
        const response = await api.get('/core-values');
        return response.data.data;
    },
    getById: async (id: number): Promise<CoreValue> => {
        const response = await api.get(`/core-values/${id}`);
        return response.data.data;
    },
    create: async (valueData: Partial<CoreValue>): Promise<CoreValue> => {
        const response = await api.post('/core-values', valueData);
        return response.data.data;
    },
    update: async (id: number, valueData: Partial<CoreValue>): Promise<CoreValue> => {
        const response = await api.put(`/core-values/${id}`, valueData);
        return response.data.data;
    },
    delete: async (id: number): Promise<void> => {
        await api.delete(`/core-values/${id}`);
    },
    reorder: async (values: { id: number; orderIndex: number }[]): Promise<void> => {
        await api.put('/core-values/reorder', { values });
    }
};

// Testimonials Service
export const testimonialsService = {
    getAll: async (): Promise<Testimonial[]> => {
        const response = await api.get('/testimonials');
        return response.data.data;
    },
    getById: async (id: number): Promise<Testimonial> => {
        const response = await api.get(`/testimonials/${id}`);
        return response.data.data;
    },
    create: async (testimonialData: Partial<Testimonial>): Promise<Testimonial> => {
        const response = await api.post('/testimonials', testimonialData);
        return response.data.data;
    },
    update: async (id: number, testimonialData: Partial<Testimonial>): Promise<Testimonial> => {
        const response = await api.put(`/testimonials/${id}`, testimonialData);
        return response.data.data;
    },
    delete: async (id: number): Promise<void> => {
        await api.delete(`/testimonials/${id}`);
    },
    reorder: async (testimonials: { id: number; orderIndex: number }[]): Promise<void> => {
        await api.put('/testimonials/reorder', { testimonials });
    }
};

// Jobs Service
export const jobsService = {
    getAll: async (): Promise<Job[]> => {
        const response = await api.get('/jobs');
        return response.data.data;
    },
    getById: async (id: number): Promise<Job> => {
        const response = await api.get(`/jobs/${id}`);
        return response.data.data;
    },
    create: async (jobData: Partial<Job>): Promise<Job> => {
        const response = await api.post('/jobs', jobData);
        return response.data.data;
    },
    update: async (id: number, jobData: Partial<Job>): Promise<Job> => {
        const response = await api.put(`/jobs/${id}`, jobData);
        return response.data.data;
    },
    delete: async (id: number): Promise<void> => {
        await api.delete(`/jobs/${id}`);
    }
};

// Media Service
export const mediaService = {
    getAll: async (fileType?: string, page?: number, limit?: number, search?: string): Promise<{ media: Media[], pagination: { total: number, page: number, limit: number, totalPages: number } }> => {
        const params = new URLSearchParams();
        if (fileType) params.append('fileType', fileType);
        if (page) params.append('page', page.toString());
        if (limit) params.append('limit', limit.toString());
        if (search) params.append('search', search);
        const queryString = params.toString();
        const response = await api.get(`/media${queryString ? `?${queryString}` : ''}`);
        return response.data.data;
    },
    getById: async (id: number): Promise<Media> => {
        const response = await api.get(`/media/${id}`);
        return response.data.data;
    },
    downloadFromUrl: async (url: string, pageName?: string, sectionName?: string, fileName?: string, fileType?: string): Promise<Media> => {
        const response = await api.post('/media/download-url', {
            url,
            pageName,
            sectionName,
            fileName,
            fileType
        });
        return response.data.data;
    },
    upload: async (file: File, altText?: string): Promise<Media> => {
        const formData = new FormData();
        formData.append('file', file);
        if (altText) formData.append('altText', altText);
        const response = await api.post('/media/upload', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data.data;
    },
    delete: async (id: number): Promise<void> => {
        await api.delete(`/media/${id}`);
    }
};

// Tabs Service
export const tabsService = {
    getBySectionId: async (sectionId: number): Promise<TabGroup> => {
        const response = await api.get(`/tabs/section/${sectionId}`);
        return response.data.data;
    },
    createGroup: async (groupData: Partial<TabGroup>): Promise<TabGroup> => {
        const response = await api.post('/tabs/groups', groupData);
        return response.data.data;
    },
    updateGroup: async (id: number, groupData: Partial<TabGroup>): Promise<TabGroup> => {
        const response = await api.put(`/tabs/groups/${id}`, groupData);
        return response.data.data;
    },
    deleteGroup: async (id: number): Promise<void> => {
        await api.delete(`/tabs/groups/${id}`);
    }
};

// Cards Service
export const cardsService = {
    getBySectionId: async (sectionId: number): Promise<CardCollection> => {
        const response = await api.get(`/cards/section/${sectionId}`);
        return response.data.data;
    },
    createCollection: async (collectionData: Partial<CardCollection>): Promise<CardCollection> => {
        const response = await api.post('/cards/collections', collectionData);
        return response.data.data;
    },
    updateCollection: async (id: number, collectionData: Partial<CardCollection>): Promise<CardCollection> => {
        const response = await api.put(`/cards/collections/${id}`, collectionData);
        return response.data.data;
    },
    deleteCollection: async (id: number): Promise<void> => {
        await api.delete(`/cards/collections/${id}`);
    }
};



// Home Video Section Service
export const homeVideoSectionService = {
    get: async (): Promise<any> => {
        const response = await api.get('/home-video-section');
        return response.data.data;
    },
    update: async (data: any): Promise<any> => {
        const response = await api.put('/home-video-section', data);
        return response.data.data;
    }
};

// Home About Section Service
export const homeAboutSectionService = {
    get: async (): Promise<any> => {
        const response = await api.get('/home-about-section');
        return response.data.data;
    },
    update: async (data: any): Promise<any> => {
        const response = await api.put('/home-about-section', data);
        return response.data.data;
    }
};

// Home Careers Section Service
export const homeCareersSectionService = {
    get: async (): Promise<any> => {
        const response = await api.get('/home-careers-section');
        return response.data.data;
    },
    update: async (data: any): Promise<any> => {
        const response = await api.put('/home-careers-section', data);
        return response.data.data;
    }
};

// Home CTA Section Service
export const homeCTASectionService = {
    getAll: async (): Promise<any[]> => {
        const response = await api.get('/home-cta-section');
        return response.data.data;
    },
    create: async (data: any): Promise<any> => {
        const response = await api.post('/home-cta-section', data);
        return response.data.data;
    },
    update: async (id: number, data: any): Promise<any> => {
        const response = await api.put(`/home-cta-section/${id}`, data);
        return response.data.data;
    },
    delete: async (id: number): Promise<void> => {
        await api.delete(`/home-cta-section/${id}`);
    }
};

// Users Service
export interface User {
    id: number;
    username: string;
    email: string;
    role: 'Super Admin' | 'Admin' | 'Editor' | 'Viewer';
    isActive: boolean;
    lastLogin?: string;
    createdAt?: string;
    updatedAt?: string;
}

export const usersService = {
    getAll: async (): Promise<User[]> => {
        const response = await api.get('/users');
        return response.data.data;
    },
    getById: async (id: number): Promise<User> => {
        const response = await api.get(`/users/${id}`);
        return response.data.data;
    },
    create: async (userData: {
        username: string;
        email: string;
        password: string;
        role?: string;
        isActive?: boolean;
    }): Promise<User> => {
        const response = await api.post('/users', userData);
        return response.data.data;
    },
    update: async (id: number, userData: {
        username?: string;
        email?: string;
        password?: string;
        role?: string;
        isActive?: boolean;
    }): Promise<User> => {
        const response = await api.put(`/users/${id}`, userData);
        return response.data.data;
    },
    delete: async (id: number): Promise<void> => {
        await api.delete(`/users/${id}`);
    },
    activate: async (id: number): Promise<void> => {
        await api.put(`/users/${id}/activate`);
    },
    deactivate: async (id: number): Promise<void> => {
        await api.put(`/users/${id}/deactivate`);
    }
};

// Permissions Service
export interface Permission {
    create: boolean;
    edit: boolean;
    delete: boolean;
    view: boolean;
}

export type PermissionsState = Record<string, Record<string, Permission>>; // role -> pageKey -> permissions

export const permissionsService = {
    getAll: async (): Promise<PermissionsState> => {
        const response = await api.get('/permissions');
        return response.data.data;
    },
    getByRole: async (role: string): Promise<Record<string, Permission>> => {
        const response = await api.get(`/permissions/${role}`);
        return response.data.data;
    },
    update: async (role: string, pageKey: string, permissions: Partial<Permission>): Promise<any> => {
        const response = await api.put(`/permissions/${role}/${pageKey}`, {
            canCreate: permissions.create,
            canEdit: permissions.edit,
            canDelete: permissions.delete,
            canView: permissions.view,
        });
        return response.data.data;
    },
    bulkUpdate: async (permissions: PermissionsState): Promise<any> => {
        const response = await api.post('/permissions/bulk', { permissions });
        return response.data.data;
    },
    checkPermission: async (pageKey: string, action: 'create' | 'edit' | 'delete' | 'view'): Promise<{ hasPermission: boolean }> => {
        const response = await api.get(`/permissions/check/${pageKey}/${action}`);
        return response.data.data;
    }
};

// Version Service
export const versionsService = {
    getVersions: async (entityType: string, entityId: number): Promise<any[]> => {
        const response = await api.get(`/versions/${entityType}/${entityId}`);
        return response.data.data;
    },
    getVersion: async (id: number): Promise<any> => {
        const response = await api.get(`/versions/${id}`);
        return response.data.data;
    },
    revertToVersion: async (id: number): Promise<any> => {
        const response = await api.post(`/versions/${id}/revert`);
        return response.data.data;
    },
    compareVersions: async (versionId1: number, versionId2: number): Promise<any> => {
        const response = await api.get(`/versions/compare/${versionId1}/${versionId2}`);
        return response.data.data;
    }
};

// Audit Log Service
export const auditLogsService = {
    getAll: async (params?: {
        userId?: number;
        entityType?: string;
        entityId?: number;
        action?: string;
        startDate?: string;
        endDate?: string;
        page?: number;
        limit?: number;
    }): Promise<any> => {
        const response = await api.get('/audit-logs', { params });
        return response.data.data;
    },
    getById: async (id: number): Promise<any> => {
        const response = await api.get(`/audit-logs/${id}`);
        return response.data.data;
    },
    getEntityLogs: async (entityType: string, entityId: number): Promise<any[]> => {
        const response = await api.get(`/audit-logs/entity/${entityType}/${entityId}`);
        return response.data.data;
    }
};

// Activity Log Service
export const activityLogsService = {
    getAll: async (params?: {
        userId?: number;
        activityType?: string;
        entityType?: string;
        entityId?: number;
        isRead?: boolean;
        page?: number;
        limit?: number;
    }): Promise<any> => {
        const response = await api.get('/activity-logs', { params });
        return response.data.data;
    },
    markAsRead: async (id: number): Promise<void> => {
        await api.put(`/activity-logs/${id}/read`);
    },
    markAllAsRead: async (): Promise<void> => {
        await api.put('/activity-logs/read-all');
    },
    getUnreadCount: async (): Promise<{ count: number }> => {
        const response = await api.get('/activity-logs/unread-count');
        return response.data.data;
    }
};

// Login History Service
export const loginHistoryService = {
    getAll: async (params?: {
        userId?: number;
        loginStatus?: string;
        startDate?: string;
        endDate?: string;
        page?: number;
        limit?: number;
    }): Promise<any> => {
        const response = await api.get('/login-history', { params });
        return response.data.data;
    },
    getMyHistory: async (): Promise<any[]> => {
        const response = await api.get('/login-history/me');
        return response.data.data;
    }
};

// Publish Service
export const publishService = {
    publish: async (entityType: string, entityId: number, scheduledPublishAt?: string): Promise<any> => {
        const response = await api.post(`/publish/${entityType}/${entityId}`, { scheduledPublishAt });
        return response.data.data;
    },
    unpublish: async (entityType: string, entityId: number): Promise<any> => {
        const response = await api.post(`/publish/${entityType}/${entityId}/unpublish`);
        return response.data.data;
    },
    bulkPublish: async (entityType: string, entityIds: number[], scheduledPublishAt?: string): Promise<any> => {
        const response = await api.post('/publish/bulk', { entityType, entityIds, scheduledPublishAt });
        return response.data.data;
    }
};

// Email Settings Service
export const emailSettingsService = {
    get: async (): Promise<any> => {
        const response = await api.get('/email-settings');
        return response.data;
    },
    update: async (settings: any): Promise<any> => {
        const response = await api.put('/email-settings', settings);
        return response.data;
    },
    test: async (testEmail: string): Promise<any> => {
        const response = await api.post('/email-settings/test', { testEmail });
        return response.data;
    }
};

// Form Submissions Service
export const formSubmissionsService = {
    submitCareerApplication: async (formData: FormData): Promise<any> => {
        const response = await api.post('/form-submissions/career-application', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    },
    submitContactForm: async (formData: any): Promise<any> => {
        const response = await api.post('/form-submissions/contact-form', formData);
        return response.data;
    },
    getAll: async (params?: {
        formType?: string;
        status?: string;
        limit?: number;
        offset?: number;
    }): Promise<any> => {
        const response = await api.get('/form-submissions', { params });
        return response.data;
    },
    updateStatus: async (id: number, status: string): Promise<any> => {
        const response = await api.put(`/form-submissions/${id}/status`, { status });
        return response.data;
    }
};
// Stock Price Service
export const stockService = {
    getCurrentPrice: async (stockName: string): Promise<any> => {
        try {
            const response = await fetch('https://refex-finance.lab2.sharajman.com/stock_current_price', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ stock_name: stockName })
            });
            if (!response.ok) {
                throw new Error('Failed to fetch stock price');
            }
            return await response.json();
        } catch (error) {
            console.error('Error fetching stock price:', error);
            return null;
        }
    }
};
