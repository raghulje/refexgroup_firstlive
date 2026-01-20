import { FormField } from '../FormField';
import { ImageUpload } from '../ImageUpload';

interface RefrigerantsQualityAssuranceSectionFormProps {
  formData: any;
  handleInputChange: (key: string, value: any) => void;
  uploadImage?: (file: File) => Promise<number | null>;
  uploadingImage?: boolean;
  errors?: Record<string, string>;
}

export const RefrigerantsQualityAssuranceSectionForm = ({
  formData,
  handleInputChange,
  uploadImage,
  uploadingImage,
  errors = {}
}: RefrigerantsQualityAssuranceSectionFormProps) => {
  return (
    <div className="space-y-2.5">
      <FormField
        label="Heading"
        name="heading"
        value={formData.heading || ''}
        onChange={(value) => handleInputChange('heading', value)}
        error={errors.heading}
      />

      <FormField
        label="Description"
        name="description"
        type="textarea"
        rows={6}
        value={formData.description || ''}
        onChange={(value) => handleInputChange('description', value)}
        error={errors.description}
      />

      <FormField
        label="Background Gradient"
        name="backgroundGradient"
        value={formData.backgroundGradient || 'linear-gradient(360deg, rgba(42, 120, 178, 0.14) 68%, rgba(30, 90, 142, 0.05) 100%)'}
        onChange={(value) => handleInputChange('backgroundGradient', value)}
        error={errors.backgroundGradient}
        placeholder="linear-gradient(360deg, rgba(42, 120, 178, 0.14) 68%, rgba(30, 90, 142, 0.05) 100%)"
      />

      <FormField
        label="Tab 1 Label"
        name="tab1Label"
        value={formData.tab1Label || 'Product Quality'}
        onChange={(value) => handleInputChange('tab1Label', value)}
        error={errors.tab1Label}
      />

      <FormField
        label="Tab 2 Label"
        name="tab2Label"
        value={formData.tab2Label || 'Product Safety'}
        onChange={(value) => handleInputChange('tab2Label', value)}
        error={errors.tab2Label}
      />

      <FormField
        label="Tab Button Color"
        name="tabButtonColor"
        value={formData.tabButtonColor || '#1e5a8e'}
        onChange={(value) => handleInputChange('tabButtonColor', value)}
        error={errors.tabButtonColor}
        placeholder="#1e5a8e"
      />

      {uploadImage && (
        <>
          <ImageUpload
            label="Tab 1 Icon (Product Quality) - SVG"
            value={formData.tab1Icon || ''}
            onChange={(mediaId) => handleInputChange('tab1Icon', mediaId)}
            onUpload={uploadImage}
            uploading={uploadingImage || false}
            helpText="Upload SVG icon for Product Quality tab"
          />

          <ImageUpload
            label="Tab 2 Icon (Product Safety) - SVG"
            value={formData.tab2Icon || ''}
            onChange={(mediaId) => handleInputChange('tab2Icon', mediaId)}
            onUpload={uploadImage}
            uploading={uploadingImage || false}
            helpText="Upload SVG icon for Product Safety tab"
          />

          <ImageUpload
            label="Tab 1 Image (Product Quality)"
            value={formData.tab1Image || ''}
            onChange={(mediaId) => handleInputChange('tab1Image', mediaId)}
            onUpload={uploadImage}
            uploading={uploadingImage || false}
          />

          <ImageUpload
            label="Tab 2 Image (Product Safety)"
            value={formData.tab2Image || ''}
            onChange={(mediaId) => handleInputChange('tab2Image', mediaId)}
            onUpload={uploadImage}
            uploading={uploadingImage || false}
          />
        </>
      )}

      {/* Tab 1 Items */}
      <div className="border-t pt-4">
        <div className="flex justify-between items-center mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Tab 1 Items ({formData.tab1Label || 'Product Quality'})
          </label>
          <button
            type="button"
            onClick={() => {
              const current = Array.isArray(formData.tab1Items) ? formData.tab1Items : 
                (typeof formData.tab1Items === 'string' ? (() => { try { return JSON.parse(formData.tab1Items); } catch { return []; } })() : []);
              handleInputChange('tab1Items', [...current, '']);
            }}
            className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors flex items-center gap-1"
          >
            <i className="ri-add-line"></i>
            Add Item
          </button>
        </div>

        {(() => {
          let tab1Items: string[] = [];
          if (formData.tab1Items) {
            if (Array.isArray(formData.tab1Items)) {
              tab1Items = formData.tab1Items;
            } else if (typeof formData.tab1Items === 'string') {
              try {
                tab1Items = JSON.parse(formData.tab1Items);
              } catch {
                tab1Items = [];
              }
            }
          }

          return (
            <div className="space-y-2">
              {tab1Items.length === 0 ? (
                <div className="text-center py-4 border-2 border-dashed border-gray-300 rounded-lg">
                  <p className="text-gray-500 text-sm mb-2">No items added yet</p>
                  <button
                    type="button"
                    onClick={() => handleInputChange('tab1Items', [''])}
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    Click to add your first item
                  </button>
                </div>
              ) : (
                tab1Items.map((item: string, index: number) => (
                  <div key={index} className="relative">
                    <div className="flex justify-end mb-1">
                      <button
                        type="button"
                        onClick={() => {
                          const updated = tab1Items.filter((_, i) => i !== index);
                          handleInputChange('tab1Items', updated);
                        }}
                        className="px-2 py-1 text-red-600 hover:bg-red-50 rounded-md transition-colors text-sm"
                        title="Remove item"
                      >
                        <i className="ri-delete-bin-line"></i>
                      </button>
                    </div>
                    <FormField
                      label=""
                      name={`tab1-item-${index}`}
                      type="textarea"
                      rows={5}
                      value={item || ''}
                      onChange={(value) => {
                        const updated = [...tab1Items];
                        updated[index] = value;
                        handleInputChange('tab1Items', updated);
                      }}
                      error={errors[`tab1-item-${index}`]}
                      placeholder="Enter item text..."
                    />
                  </div>
                ))
              )}
            </div>
          );
        })()}
      </div>

      {/* Tab 2 Items */}
      <div className="border-t pt-4">
        <div className="flex justify-between items-center mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Tab 2 Items ({formData.tab2Label || 'Product Safety'})
          </label>
          <button
            type="button"
            onClick={() => {
              const current = Array.isArray(formData.tab2Items) ? formData.tab2Items : 
                (typeof formData.tab2Items === 'string' ? (() => { try { return JSON.parse(formData.tab2Items); } catch { return []; } })() : []);
              handleInputChange('tab2Items', [...current, '']);
            }}
            className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors flex items-center gap-1"
          >
            <i className="ri-add-line"></i>
            Add Item
          </button>
        </div>

        {(() => {
          let tab2Items: string[] = [];
          if (formData.tab2Items) {
            if (Array.isArray(formData.tab2Items)) {
              tab2Items = formData.tab2Items;
            } else if (typeof formData.tab2Items === 'string') {
              try {
                tab2Items = JSON.parse(formData.tab2Items);
              } catch {
                tab2Items = [];
              }
            }
          }

          return (
            <div className="space-y-2">
              {tab2Items.length === 0 ? (
                <div className="text-center py-4 border-2 border-dashed border-gray-300 rounded-lg">
                  <p className="text-gray-500 text-sm mb-2">No items added yet</p>
                  <button
                    type="button"
                    onClick={() => handleInputChange('tab2Items', [''])}
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    Click to add your first item
                  </button>
                </div>
              ) : (
                tab2Items.map((item: string, index: number) => (
                  <div key={index} className="relative">
                    <div className="flex justify-end mb-1">
                      <button
                        type="button"
                        onClick={() => {
                          const updated = tab2Items.filter((_, i) => i !== index);
                          handleInputChange('tab2Items', updated);
                        }}
                        className="px-2 py-1 text-red-600 hover:bg-red-50 rounded-md transition-colors text-sm"
                        title="Remove item"
                      >
                        <i className="ri-delete-bin-line"></i>
                      </button>
                    </div>
                    <FormField
                      label=""
                      name={`tab2-item-${index}`}
                      type="textarea"
                      rows={5}
                      value={item || ''}
                      onChange={(value) => {
                        const updated = [...tab2Items];
                        updated[index] = value;
                        handleInputChange('tab2Items', updated);
                      }}
                      error={errors[`tab2-item-${index}`]}
                      placeholder="Enter item text..."
                    />
                  </div>
                ))
              )}
            </div>
          );
        })()}
      </div>
    </div>
  );
};

