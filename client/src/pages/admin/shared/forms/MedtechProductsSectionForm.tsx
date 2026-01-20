import { FormField } from '../FormField';
import { ImageUpload } from '../ImageUpload';

interface MedtechProductsSectionFormProps {
  formData: any;
  handleInputChange: (key: string, value: any) => void;
  uploadImage?: (file: File) => Promise<number | null>;
  uploadingImage?: boolean;
  errors?: Record<string, string>;
}

export const MedtechProductsSectionForm = ({
  formData,
  handleInputChange,
  uploadImage,
  uploadingImage,
  errors = {}
}: MedtechProductsSectionFormProps) => {
  const products = Array.isArray(formData.products)
    ? formData.products
    : (formData.products
      ? (() => {
        try {
          return JSON.parse(formData.products);
        } catch {
          return [];
        }
      })()
      : []);

  const normalizeFeatures = (features: any) => {
    if (Array.isArray(features)) return features.join('\n');
    if (typeof features === 'string') return features;
    return '';
  };

  const parseFeatures = (value: string) =>
    value
      .split('\n')
      .map((v) => v.trim())
      .filter(Boolean);

  const updateProduct = (index: number, field: string, value: any) => {
    const updated = [...products];
    const product = updated[index] || { title: '', subtitle: '', description: '', features: [], image: '' };
    if (field === 'features') {
      product.features = parseFeatures(value);
    } else {
      product[field] = value;
    }
    updated[index] = product;
    handleInputChange('products', updated);
  };

  const visibleProducts =
    products.length > 0
      ? products
      : [];

  const addProduct = () => {
    handleInputChange('products', [...visibleProducts, { title: '', subtitle: '', description: '', features: [], image: '' }]);
  };

  const removeProduct = (index: number) => {
    const updated = visibleProducts.filter((_: any, i: number) => i !== index);
    handleInputChange('products', updated);
  };

  return (
    <div className="space-y-4">
      <FormField
        label="Section Title"
        name="title"
        value={formData.title || ''}
        onChange={(value) => handleInputChange('title', value)}
        required
        error={errors.title}
      />

      <FormField
        label="Section Description"
        name="description"
        type="textarea"
        rows={4}
        value={formData.description || ''}
        onChange={(value) => handleInputChange('description', value)}
        error={errors.description}
      />

      <div className="border-2 border-gray-200 rounded-lg p-4 bg-gray-50">
        <div className="flex justify-between items-center mb-4">
          <h4 className="font-semibold text-gray-900">Products</h4>
          <button
            type="button"
            onClick={addProduct}
            className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
          >
            <i className="ri-add-line"></i> Add Product
          </button>
        </div>
        <div className="space-y-3">
          {visibleProducts.length > 0 ? (
            visibleProducts.map((product: any, index: number) => (
              <div
                key={index}
                className="space-y-3 p-4 border border-gray-200 rounded-lg bg-white"
              >
                <div className="flex justify-between items-center">
                  <p className="text-sm font-semibold text-gray-700">
                    Product {index + 1}
                  </p>
                  <button
                    type="button"
                    onClick={() => removeProduct(index)}
                    className="px-2 py-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                    title="Remove product"
                  >
                    <i className="ri-delete-bin-line"></i>
                  </button>
                </div>

                <ImageUpload
                  label="Product Image"
                  value={product.image || ''}
                  onChange={(value) => updateProduct(index, 'image', value)}
                  onUpload={uploadImage}
                  uploading={uploadingImage || false}
                  error={errors[`products[${index}].image`]}
                  allowUrl={true}
                />

                <FormField
                  label="Title"
                  name={`product-${index}-title`}
                  value={product.title || ''}
                  onChange={(value) => updateProduct(index, 'title', value)}
                  error={errors[`products[${index}].title`]}
                />
                <FormField
                  label="Subtitle"
                  name={`product-${index}-subtitle`}
                  value={product.subtitle || ''}
                  onChange={(value) => updateProduct(index, 'subtitle', value)}
                  error={errors[`products[${index}].subtitle`]}
                />
                <FormField
                  label="Description (for flip card back - appears before points)"
                  name={`product-${index}-description`}
                  type="textarea"
                  rows={3}
                  value={product.description || ''}
                  onChange={(value) => updateProduct(index, 'description', value)}
                  error={errors[`products[${index}].description`]}
                  placeholder="Optional: Description text that appears at the top of the flip card"
                />
                <FormField
                  label="Points/Features (one per line)"
                  name={`product-${index}-features`}
                  type="textarea"
                  rows={6}
                  value={normalizeFeatures(product.features)}
                  onChange={(value) => updateProduct(index, 'features', value)}
                  error={errors[`products[${index}].features`]}
                  placeholder="Enter each point on a new line"
                />
              </div>
            ))
          ) : (
            <p className="text-gray-400 text-sm italic">
              No products added yet. Click "Add Product" to add product information.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};


