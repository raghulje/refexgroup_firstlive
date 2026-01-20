import { useState, useEffect } from 'react';
import { FormField } from '../FormField';
import { ImageUpload } from '../ImageUpload';

interface TabsSectionFormProps {
  formData: any;
  handleInputChange: (key: string, value: any) => void;
  uploadImage?: (file: File, pageName?: string, sectionName?: string) => Promise<number | null>;
  uploadingImage?: boolean;
  errors?: Record<string, string>;
}

export const TabsSectionForm = ({
  formData,
  handleInputChange,
  uploadImage,
  uploadingImage,
  errors = {}
}: TabsSectionFormProps) => {
  // Parse tabs from JSON or use empty array
  const [tabs, setTabs] = useState<any[]>(() => {
    try {
      if (Array.isArray(formData.tabs)) {
        return formData.tabs;
      }
      if (typeof formData.tabs === 'string' && formData.tabs.trim()) {
        return JSON.parse(formData.tabs);
      }
      return [];
    } catch {
      return [];
    }
  });

  // Update tabs when formData changes
  useEffect(() => {
    try {
      if (Array.isArray(formData.tabs)) {
        setTabs(formData.tabs);
      } else if (typeof formData.tabs === 'string' && formData.tabs.trim()) {
        setTabs(JSON.parse(formData.tabs));
      } else if (!formData.tabs) {
        setTabs([]);
      }
    } catch {
      setTabs([]);
    }
  }, [formData.tabs]);

  const updateTab = (index: number, field: string, value: any) => {
    const updated = [...tabs];
    if (!updated[index]) {
      updated[index] = { tabId: '', title: '', description: '', image: '', items: [] };
    }
    updated[index][field] = value;
    setTabs(updated);
    handleInputChange('tabs', updated);
  };

  const updateTabItem = (tabIndex: number, itemIndex: number, field: string, value: string) => {
    const updated = [...tabs];
    if (!updated[tabIndex]) {
      updated[tabIndex] = { tabId: '', title: '', description: '', image: '', items: [] };
    }
    if (!updated[tabIndex].items) {
      updated[tabIndex].items = [];
    }
    if (!updated[tabIndex].items[itemIndex]) {
      updated[tabIndex].items[itemIndex] = { title: '', description: '' };
    }
    updated[tabIndex].items[itemIndex][field] = value;
    setTabs(updated);
    handleInputChange('tabs', updated);
  };

  const addTabItem = (tabIndex: number) => {
    const updated = [...tabs];
    if (!updated[tabIndex].items) {
      updated[tabIndex].items = [];
    }
    updated[tabIndex].items.push({ title: '', description: '' });
    setTabs(updated);
    handleInputChange('tabs', updated);
  };

  const removeTabItem = (tabIndex: number, itemIndex: number) => {
    const updated = [...tabs];
    updated[tabIndex].items = updated[tabIndex].items.filter((_: any, i: number) => i !== itemIndex);
    setTabs(updated);
    handleInputChange('tabs', updated);
  };

  const addTab = () => {
    const newTab = { tabId: '', title: '', description: '', image: '', items: [] };
    const updated = [...tabs, newTab];
    setTabs(updated);
    handleInputChange('tabs', updated);
  };

  const removeTab = (index: number) => {
    const updated = tabs.filter((_: any, i: number) => i !== index);
    setTabs(updated);
    handleInputChange('tabs', updated);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-800">ESG Tabs</h3>
        <button
          type="button"
          onClick={addTab}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
        >
          <i className="ri-add-line mr-1"></i>
          Add Tab
        </button>
      </div>

      <div className="space-y-4">
        {tabs.map((tab: any, tabIndex: number) => (
          <div key={tabIndex} className="border-2 border-gray-300 rounded-lg p-4 bg-white">
            <div className="flex justify-between items-center mb-4">
              <h4 className="font-semibold text-gray-800">Tab {tabIndex + 1}</h4>
              <button
                type="button"
                onClick={() => removeTab(tabIndex)}
                className="text-red-600 hover:text-red-800"
              >
                <i className="ri-delete-bin-line"></i>
              </button>
            </div>

            <div className="space-y-4">
              <FormField
                label="Tab ID"
                name={`tab${tabIndex}Id`}
                value={tab.tabId || ''}
                onChange={(val) => updateTab(tabIndex, 'tabId', val)}
                error={errors[`tab${tabIndex}Id`]}
                helpText="e.g., 'environment', 'health', 'csr'"
              />
              <FormField
                label="Title"
                name={`tab${tabIndex}Title`}
                value={tab.title || ''}
                onChange={(val) => updateTab(tabIndex, 'title', val)}
                error={errors[`tab${tabIndex}Title`]}
              />
              <FormField
                label="Description"
                name={`tab${tabIndex}Description`}
                type="textarea"
                value={tab.description || ''}
                onChange={(val) => updateTab(tabIndex, 'description', val)}
                error={errors[`tab${tabIndex}Description`]}
              />
              
              {uploadImage && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tab Image
                  </label>
                  <ImageUpload
                    key={`tab-image-${tabIndex}-${tab.image || 'empty'}`}
                    label=""
                    value={tab.image || ''}
                    onChange={(mediaId: number | string) => {
                      console.log(`TabsSectionForm: Tab ${tabIndex} image changed to:`, mediaId);
                      updateTab(tabIndex, 'image', mediaId);
                    }}
                    onUpload={uploadImage}
                    uploading={uploadingImage || false}
                    pageName="general"
                    sectionName="general"
                    allowUrl={true}
                  />
                </div>
              )}

              {/* Tab Items */}
              <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                <div className="flex justify-between items-center mb-3">
                  <h5 className="font-medium text-gray-700">Tab Items</h5>
                  <button
                    type="button"
                    onClick={() => addTabItem(tabIndex)}
                    className="px-2 py-1 bg-gray-600 text-white rounded text-xs hover:bg-gray-700"
                  >
                    <i className="ri-add-line mr-1"></i>
                    Add Item
                  </button>
                </div>
                <div className="space-y-3">
                  {tab.items?.map((item: any, itemIndex: number) => (
                    <div key={itemIndex} className="border border-gray-300 rounded p-3 bg-white">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-600">Item {itemIndex + 1}</span>
                        <button
                          type="button"
                          onClick={() => removeTabItem(tabIndex, itemIndex)}
                          className="text-red-600 hover:text-red-800 text-sm"
                        >
                          <i className="ri-delete-bin-line"></i>
                        </button>
                      </div>
                      <FormField
                        label="Item Title"
                        name={`tab${tabIndex}Item${itemIndex}Title`}
                        value={item.title || ''}
                        onChange={(val) => updateTabItem(tabIndex, itemIndex, 'title', val)}
                        error={errors[`tab${tabIndex}Item${itemIndex}Title`]}
                      />
                      <FormField
                        label="Item Description"
                        name={`tab${tabIndex}Item${itemIndex}Description`}
                        type="textarea"
                        value={item.description || ''}
                        onChange={(val) => updateTabItem(tabIndex, itemIndex, 'description', val)}
                        error={errors[`tab${tabIndex}Item${itemIndex}Description`]}
                      />
                    </div>
                  ))}
                  {(!tab.items || tab.items.length === 0) && (
                    <p className="text-gray-500 text-sm text-center py-2">No items added yet. Click "Add Item" to add one.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
        {tabs.length === 0 && (
          <p className="text-gray-500 text-sm text-center py-4">No tabs added yet. Click "Add Tab" to add one.</p>
        )}
      </div>
    </div>
  );
};
