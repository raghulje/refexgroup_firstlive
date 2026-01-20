import { FormField } from '../FormField';
import { ImageUpload } from '../ImageUpload';

interface RefrigerantsProductsSectionFormProps {
  formData: any;
  handleInputChange: (key: string, value: any) => void;
  uploadImage?: (file: File) => Promise<number | null>;
  uploadingImage?: boolean;
  errors?: Record<string, string>;
}

export const RefrigerantsProductsSectionForm = ({
  formData,
  handleInputChange,
  uploadImage,
  uploadingImage,
  errors = {}
}: RefrigerantsProductsSectionFormProps) => {
  // Parse products data
  let productsData: any[] = [];
  if (formData.products) {
    if (Array.isArray(formData.products)) {
      productsData = formData.products;
    } else if (typeof formData.products === 'string') {
      try {
        productsData = JSON.parse(formData.products);
      } catch {
        productsData = [];
      }
    }
  }

  const handleProductChange = (index: number, field: string, value: any) => {
    const updated = [...productsData];
    if (!updated[index]) {
      updated[index] = { name: '', image: null };
    }
    updated[index][field] = value;
    handleInputChange('products', updated);
  };

  const addProduct = () => {
    const updated = [...productsData, { name: '', image: null }];
    handleInputChange('products', updated);
  };

  const removeProduct = (index: number) => {
    const updated = productsData.filter((_, i) => i !== index);
    handleInputChange('products', updated);
  };

  return (
    <div className="space-y-4">
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
        label="Background Color"
        name="backgroundColor"
        value={formData.backgroundColor || '#f5f5f5'}
        onChange={(value) => handleInputChange('backgroundColor', value)}
        error={errors.backgroundColor}
        placeholder="#f5f5f5"
      />

      <FormField
        label="Card Background Color"
        name="cardBackgroundColor"
        value={formData.cardBackgroundColor || '#1e5a8e'}
        onChange={(value) => handleInputChange('cardBackgroundColor', value)}
        error={errors.cardBackgroundColor}
        placeholder="#1e5a8e"
      />

      <div className="border-t pt-4">
        <div className="flex justify-between items-center mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Products
          </label>
          <button
            type="button"
            onClick={addProduct}
            className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors flex items-center gap-1"
          >
            <i className="ri-add-line"></i>
            Add Product
          </button>
        </div>

        {productsData.length === 0 ? (
          <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
            <p className="text-gray-500 text-sm mb-2">No products added yet</p>
            <button
              type="button"
              onClick={addProduct}
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              Click to add your first product
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {productsData.map((product: any, index: number) => (
              <div key={index} className="border rounded-lg p-4 bg-gray-50">
                <div className="flex justify-between items-start mb-3">
                  <h4 className="font-medium text-gray-700">Product {index + 1}</h4>
                  <button
                    type="button"
                    onClick={() => removeProduct(index)}
                    className="text-red-600 hover:text-red-700 text-sm"
                  >
                    <i className="ri-delete-bin-line"></i> Remove
                  </button>
                </div>

                <div className="space-y-3">
                  <FormField
                    label="Product Name"
                    name={`product-${index}-name`}
                    value={product.name || ''}
                    onChange={(value) => handleProductChange(index, 'name', value)}
                    error={errors[`product-${index}-name`]}
                    placeholder="e.g., R-32"
                  />

                  {uploadImage && (
                    <ImageUpload
                      label="Product Image"
                      value={product.image || ''}
                      onChange={(mediaId) => handleProductChange(index, 'image', mediaId)}
                      onUpload={uploadImage}
                      uploading={uploadingImage || false}
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

