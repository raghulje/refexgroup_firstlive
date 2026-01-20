import api from './api';
import {
    Page,
    GlobalSettings,
    NavigationMenu,
    HeroSlide,
    BusinessCard,
    FooterSection,
    SocialLink,
    ContactInfo,
    SDGCard,
    Leader,
    Award,
    NewsroomItem,
    GalleryImage,
    Job
} from '../types/cms';

export const cmsService = {
    // Pages
    getPageBySlug: async (slug: string): Promise<Page> => {
        const response = await api.get(`/pages/${slug}`);
        return response.data.data;
    },

    // Global Settings
    getGlobalSettings: async (): Promise<GlobalSettings> => {
        const response = await api.get('/global-settings');
        return response.data.data;
    },

    // Navigation
    getNavigation: async (location: string): Promise<NavigationMenu[]> => {
        const response = await api.get(`/navigation/${location}`);
        return response.data.data;
    },

    // Hero Slides
    getHeroSlides: async (pageId: number): Promise<HeroSlide[]> => {
        const response = await api.get(`/hero-slides/page/${pageId}`);
        return response.data.data;
    },

    // Business Cards
    getBusinessCards: async (): Promise<BusinessCard[]> => {
        const response = await api.get('/business-cards');
        return response.data.data;
    },

    // Footer
    getFooter: async (): Promise<FooterSection[]> => {
        const response = await api.get('/footer');
        return response.data.data;
    },

    getSocialLinks: async (): Promise<SocialLink[]> => {
        const response = await api.get('/social-links');
        return response.data.data;
    },

    getContactInfo: async (): Promise<ContactInfo[]> => {
        const response = await api.get('/contact-info');
        return response.data.data;
    },

    // Page Specific Features
    getSDGCards: async (): Promise<SDGCard[]> => {
        const response = await api.get('/sdg-cards');
        return response.data.data;
    },

    getLeaders: async (): Promise<Leader[]> => {
        const response = await api.get('/leaders');
        return response.data.data;
    },

    getAwards: async (): Promise<Award[]> => {
        const response = await api.get('/awards');
        return response.data.data;
    },

    getNewsItems: async (): Promise<NewsroomItem[]> => {
        const response = await api.get('/newsroom');
        return response.data.data;
    },

    getGallery: async (year?: string, category?: string): Promise<GalleryImage[]> => {
        const params = new URLSearchParams();
        if (year) params.append('year', year);
        if (category) params.append('category', category);

        const response = await api.get(`/gallery?${params.toString()}`);
        return response.data.data;
    },

    getJobs: async (): Promise<Job[]> => {
        const response = await api.get('/jobs');
        return response.data.data;
    }
};
