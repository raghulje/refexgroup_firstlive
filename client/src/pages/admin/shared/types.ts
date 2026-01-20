export interface CMSComponentProps {
  token: string;
  showModal: boolean;
  setShowModal: (show: boolean) => void;
  modalType: 'add' | 'edit';
  setModalType: (type: 'add' | 'edit') => void;
  editingItem: any;
  setEditingItem: (item: any) => void;
  formData: any;
  setFormData: (data: any) => void;
  imagePreview: string | null;
  setImagePreview: (preview: string | null) => void;
  uploadingImage: boolean;
  setUploadingImage: (uploading: boolean) => void;
  handleInputChange: (key: string, value: any) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  handleDelete: (item: any, entityType?: string) => void;
  uploadImage: (file: File) => Promise<string | null>;
  setCurrentEntityType?: (type: string) => void;
}

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

