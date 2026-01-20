import { useState, useEffect } from 'react';
import { DataTable } from '../../shared/DataTable';
import { getAssetPath } from '../../shared/utils';
import type { CMSComponentProps } from '../../shared/types';
import { pagesService, sectionsService, businessCardsService } from '../../../../services/apiService';

interface BusinessPageProps extends Partial<CMSComponentProps> {
  token: string;
  showModal: boolean;
  setShowModal: (show: boolean) => void;
  modalType: 'add' | 'edit';
  setModalType: (type: 'add' | 'edit') => void;
  editingItem: any;
  setEditingItem: (item: any) => void;
  formData: any;
  setFormData: (data: any) => void;
  handleInputChange: (key: string, value: any) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  handleDelete: (item: any, entityType?: string) => void;
  uploadImageUtil: (file: File) => Promise<number | null>;
  uploadingImage: boolean;
  setUploadingImage: (uploading: boolean) => void;
  setCurrentEntityType: (type: string) => void;
}

export default function BusinessPage_cms({
  token,
  showModal,
  setShowModal,
  modalType,
  setModalType,
  editingItem,
  setEditingItem,
  formData,
  setFormData,
  handleInputChange,
  handleSubmit,
  handleDelete,
  uploadImageUtil,
  uploadingImage,
  setUploadingImage,
  setCurrentEntityType
}: BusinessPageProps) {
  const [businessPage, setBusinessPage] = useState<any>(null);
  const [sections, setSections] = useState<any[]>([]);
  const [businessCards, setBusinessCards] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('hero-section');
  const [draggedCard, setDraggedCard] = useState<number | null>(null);
  const [savingOrder, setSavingOrder] = useState(false);

  useEffect(() => {
    fetchBusinessData();
  }, []);

  useEffect(() => {
    const handleRefresh = () => {
      fetchBusinessData();
    };
    window.addEventListener('cms-refresh', handleRefresh);
    return () => window.removeEventListener('cms-refresh', handleRefresh);
  }, []);

  const fetchBusinessData = async () => {
    try {
      setLoading(true);
      const page = await pagesService.getBySlug('business');
      setBusinessPage(page);

      if (page?.id) {
        const pageSections = await sectionsService.getByPageId(page.id);
        setSections(pageSections);
      }

      const cards = await businessCardsService.getAll();
      const sortedCards = cards.sort((a: any, b: any) => (a.orderIndex || 0) - (b.orderIndex || 0));
      setBusinessCards(sortedCards);
    } catch (error) {
      console.error('Error fetching business data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to get section by key
  const getSectionByKey = (sectionKey: string) => {
    return sections.find(s => s.sectionKey === sectionKey);
  };

  // Helper function to edit section content
  const handleEditFixedSection = async (sectionKey: string) => {
    if (!businessPage?.id) return;

    try {
      let section = getSectionByKey(sectionKey);

      if (!section) {
        section = await sectionsService.create({
          pageId: businessPage.id,
          sectionKey: sectionKey,
          sectionType: 'content',
          isActive: true,
          orderIndex: 0
        });

        const updatedSections = await sectionsService.getByPageId(businessPage.id);
        setSections(updatedSections);
        section = updatedSections.find((s: any) => s.sectionKey === sectionKey);
      }

      if (!section) return;

      const formDataToSet: any = {
        sectionId: section.id,
        _section: section
      };

      if (section.content && section.content.length > 0) {
        section.content.forEach((item: any) => {
          if (item.contentType === 'json') {
            try {
              formDataToSet[item.contentKey] = JSON.parse(item.contentValue);
            } catch {
              formDataToSet[item.contentKey] = item.contentValue;
            }
          } else {
            const imageFields = ['backgroundImage', 'image'];
            if (imageFields.includes(item.contentKey) && item.mediaId) {
              formDataToSet[item.contentKey] = item.mediaId;
            } else {
              formDataToSet[item.contentKey] = item.contentValue;
            }
          }
        });
      }

      setEditingItem(section);
      setFormData(formDataToSet);
      setModalType('edit');
      setCurrentEntityType(`section-content-${sectionKey}`);
      setShowModal(true);
    } catch (error) {
      console.error('Error handling fixed section:', error);
    }
  };

  // Business Cards Handlers
  const handleAddBusinessCard = () => {
    setEditingItem(null);
    setFormData({
      title: '',
      description: '',
      image: '',
      linkUrl: '',
      orderIndex: businessCards.length,
      isActive: true
    });
    setModalType('add');
    setCurrentEntityType('business-card');
    setShowModal(true);
  };

  const handleEditBusinessCard = (card: any) => {
    setEditingItem(card);
    setFormData({
      ...card,
      image: card.imageId || card.image?.id || card.image?.url || card.image || ''
    });
    setModalType('edit');
    setCurrentEntityType('business-card');
    setShowModal(true);
  };

  const handleDragDrop = (draggedId: number, targetId: number) => {
    const draggedIndex = businessCards.findIndex(c => c.id === draggedId);
    const targetIndex = businessCards.findIndex(c => c.id === targetId);

    if (draggedIndex === -1 || targetIndex === -1) return;

    const newCards = [...businessCards];
    const [draggedCard] = newCards.splice(draggedIndex, 1);
    newCards.splice(targetIndex, 0, draggedCard);

    newCards.forEach((card, index) => {
      card.orderIndex = index;
    });

    setBusinessCards(newCards);
  };

  const handleSaveBusinessCardOrder = async () => {
    try {
      setSavingOrder(true);
      const updates = businessCards.map((card, index) => ({
        id: card.id,
        orderIndex: index
      }));

      await businessCardsService.reorder(updates);
      await fetchBusinessData();
    } catch (error) {
      console.error('Error saving order:', error);
    } finally {
      setSavingOrder(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Navigation Tabs */}
      <div className="bg-white rounded-xl shadow-lg px-4 py-3">
        <div
          className="flex space-x-2 overflow-x-auto items-center"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          <button
            onClick={() => setActiveSection('hero-section')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap text-sm ${activeSection === 'hero-section'
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
          >
            <i className="ri-image-2-line text-base"></i>
            <span className="font-medium">Hero Section</span>
            <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${activeSection === 'hero-section'
                ? 'bg-blue-200 text-blue-800'
                : 'bg-gray-200 text-gray-600'
              }`}>
              1
            </span>
          </button>

          <button
            onClick={() => setActiveSection('business-cards')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap text-sm ${activeSection === 'business-cards'
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
          >
            <i className="ri-grid-line text-base"></i>
            <span className="font-medium">Business Cards</span>
            <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${activeSection === 'business-cards'
                ? 'bg-blue-200 text-blue-800'
                : 'bg-gray-200 text-gray-600'
              }`}>
              {businessCards.length}
            </span>
          </button>

          <button
            onClick={() => setActiveSection('cta-section')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap text-sm ${activeSection === 'cta-section'
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
          >
            <i className="ri-customer-service-line text-base"></i>
            <span className="font-medium">CTA Section</span>
            <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${activeSection === 'cta-section'
                ? 'bg-blue-200 text-blue-800'
                : 'bg-gray-200 text-gray-600'
              }`}>
              1
            </span>
          </button>
        </div>
      </div>

      {/* Hero Section */}
      {activeSection === 'hero-section' && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-xl font-semibold text-gray-800">Hero Section</h3>
                <p className="text-gray-500 mt-1">Manage hero section content</p>
              </div>
              <button
                onClick={() => handleEditFixedSection('hero')}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <i className="ri-edit-line"></i>
                Edit Content
              </button>
            </div>

            {(() => {
              const section = getSectionByKey('hero');
              if (!section) {
                return (
                  <div className="text-center py-8">
                    <i className="ri-image-2-line text-4xl text-gray-400 mb-2"></i>
                    <p className="text-gray-500 italic">No hero section found. Click edit to create one.</p>
                  </div>
                );
              }

              const title = section.content?.find((c: any) => c.contentKey === 'title')?.contentValue;
              const description = section.content?.find((c: any) => c.contentKey === 'description')?.contentValue;
              const backgroundImage = section.content?.find((c: any) => c.contentKey === 'backgroundImage');
              const backgroundImagePath = backgroundImage?.media?.url || backgroundImage?.media?.filePath || '';

              return (
                <div className="prose max-w-none">
                  {backgroundImagePath && (
                    <div className="mb-4">
                      <img
                        src={getAssetPath(backgroundImagePath)}
                        alt="Hero Background"
                        className="w-full max-w-md h-48 object-cover rounded border border-gray-200"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="192"%3E%3Crect fill="%23ddd" width="400" height="192"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%23999" font-size="14"%3ENo Image%3C/text%3E%3C/svg%3E';
                        }}
                      />
                    </div>
                  )}
                  {title && <h3 className="text-lg font-bold mb-2">{title}</h3>}
                  {description ? (
                    <p className="text-gray-600 whitespace-pre-wrap">{description}</p>
                  ) : (
                    <p className="text-gray-400 italic">No content yet. Click edit to add content.</p>
                  )}
                </div>
              );
            })()}
          </div>
        </div>
      )}

      {/* Business Cards Section */}
      {activeSection === 'business-cards' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold text-gray-800">Business Cards</h3>
            <div className="flex gap-2">
              <button
                onClick={handleAddBusinessCard}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <i className="ri-add-line"></i>
                Add Business Card
              </button>
              {businessCards.length > 1 && (
                <button
                  onClick={handleSaveBusinessCardOrder}
                  disabled={savingOrder}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <i className={savingOrder ? 'ri-loader-4-line animate-spin' : 'ri-save-line'}></i>
                  {savingOrder ? 'Saving...' : 'Save Order'}
                </button>
              )}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg border-2 border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b-2 border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-12"></th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">IMAGE</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">TITLE</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">DESCRIPTION</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">LINK</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">ORDER</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">STATUS</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">ACTIONS</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {businessCards.map((card) => {
                    const imagePath = card.image?.url || card.image?.filePath || card.image || '';

                    return (
                      <tr
                        key={card.id}
                        draggable
                        onDragStart={(e) => {
                          setDraggedCard(card.id);
                          e.dataTransfer.effectAllowed = 'move';
                        }}
                        onDragOver={(e) => {
                          e.preventDefault();
                          e.dataTransfer.dropEffect = 'move';
                          const target = e.currentTarget;
                          if (draggedCard !== card.id) {
                            target.classList.add('opacity-50');
                          }
                        }}
                        onDragLeave={(e) => {
                          e.currentTarget.classList.remove('opacity-50');
                        }}
                        onDrop={(e) => {
                          e.preventDefault();
                          e.currentTarget.classList.remove('opacity-50');
                          if (draggedCard !== null && draggedCard !== card.id) {
                            handleDragDrop(draggedCard, card.id);
                          }
                          setDraggedCard(null);
                        }}
                        onDragEnd={() => {
                          setDraggedCard(null);
                          document.querySelectorAll('tr').forEach(row => {
                            row.classList.remove('opacity-50');
                          });
                        }}
                        className={`cursor-move hover:bg-gray-50 transition-colors ${draggedCard === card.id ? 'opacity-50' : ''}`}
                      >
                        <td className="px-4 py-4 whitespace-nowrap">
                          <i className="ri-drag-move-2-line text-gray-400 text-xl"></i>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <img
                            src={getAssetPath(imagePath)}
                            alt={card.title || 'Business Card'}
                            className="w-20 h-20 object-cover rounded border-2 border-gray-200"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="80" height="80"%3E%3Crect fill="%23ddd" width="80" height="80"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%23999" font-size="12"%3ENo Image%3C/text%3E%3C/svg%3E';
                            }}
                          />
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <span className="font-medium text-gray-900">{card.title || 'N/A'}</span>
                        </td>
                        <td className="px-4 py-4">
                          <span className="text-gray-600 text-sm max-w-xs truncate block">
                            {card.description || 'N/A'}
                          </span>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <span className="text-gray-600 text-sm">{card.linkUrl || 'N/A'}</span>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <span className="text-gray-600">{card.orderIndex || 0}</span>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${card.isActive
                              ? 'bg-green-100 text-green-700'
                              : 'bg-gray-100 text-gray-600'
                            }`}>
                            {card.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEditBusinessCard(card)}
                              className="text-blue-600 hover:text-blue-900"
                              title="Edit"
                            >
                              <i className="ri-edit-line"></i>
                            </button>
                            <button
                              onClick={() => handleDelete(card, 'business-card')}
                              className="text-red-600 hover:text-red-900"
                              title="Delete"
                            >
                              <i className="ri-delete-bin-line"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* CTA Section */}
      {activeSection === 'cta-section' && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-xl font-semibold text-gray-800">CTA Section</h3>
                <p className="text-gray-500 mt-1">Manage call-to-action section content</p>
              </div>
              <button
                onClick={() => handleEditFixedSection('cta')}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <i className="ri-edit-line"></i>
                Edit Content
              </button>
            </div>

            {(() => {
              const section = getSectionByKey('cta');
              if (!section) {
                return (
                  <div className="text-center py-8">
                    <i className="ri-customer-service-line text-4xl text-gray-400 mb-2"></i>
                    <p className="text-gray-500 italic">No CTA section found. Click edit to create one.</p>
                  </div>
                );
              }

              const title = section.content?.find((c: any) => c.contentKey === 'title')?.contentValue;
              const description = section.content?.find((c: any) => c.contentKey === 'description')?.contentValue;
              const buttonText = section.content?.find((c: any) => c.contentKey === 'buttonText')?.contentValue;
              const buttonLink = section.content?.find((c: any) => c.contentKey === 'buttonLink')?.contentValue;

              return (
                <div className="prose max-w-none">
                  {title && <h3 className="text-lg font-bold mb-2">{title}</h3>}
                  {description ? (
                    <p className="text-gray-600 whitespace-pre-wrap mb-4">{description}</p>
                  ) : (
                    <p className="text-gray-400 italic mb-4">No description yet.</p>
                  )}
                  {buttonText && (
                    <div className="mt-4">
                      <span className="inline-block px-4 py-2 bg-blue-600 text-white rounded-md">
                        {buttonText} {buttonLink && <span className="text-xs">→ {buttonLink}</span>}
                      </span>
                    </div>
                  )}
                </div>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
}

