export interface SectionContent {
    contentKey: string;
    contentValue: string;
    contentType: 'text' | 'json' | 'number' | 'boolean';
    mediaId?: number;
}

export interface Section {
    id: number;
    pageId: number;
    sectionType: string;
    sectionKey: string;
    orderIndex: number;
    isActive: boolean;
    content?: SectionContent[];
}

export interface Page {
    id: number;
    slug: string;
    title: string;
    metaTitle?: string;
    metaDescription?: string;
    status: 'draft' | 'published';
    templateType?: string;
}

export interface Media {
    id: number;
    url: string;
    filePath: string;
}

// Placeholder types for the rest
export type HeroSlide = any;
export type BusinessCard = any;
export type NavigationMenu = any;
export type GlobalSettings = any;
export type FooterSection = any;
export type SocialLink = any;
export type ContactInfo = any;
export type SDGCard = any;
export type Leader = any;
export type Award = any;
export type NewsroomItem = any;
export type GalleryImage = any;
export type GalleryAlbum = any;
export type GalleryEvent = any;
export type GalleryDocument = any;
export type CoreValue = any;
export type Testimonial = any;
export type Job = any;
export type TabGroup = any;
export type CardCollection = any;
