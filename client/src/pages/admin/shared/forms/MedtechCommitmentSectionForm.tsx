import { FormField } from '../FormField';
import { ImageUpload } from '../ImageUpload';

interface MedtechCommitmentSectionFormProps {
  formData: any;
  handleInputChange: (key: string, value: any) => void;
  uploadImage?: (file: File) => Promise<number | null>;
  uploadingImage?: boolean;
  errors?: Record<string, string>;
}

export const MedtechCommitmentSectionForm = ({
  formData,
  handleInputChange,
  uploadImage,
  uploadingImage,
  errors = {}
}: MedtechCommitmentSectionFormProps) => {
  const commitments = Array.isArray(formData.commitments)
    ? formData.commitments
    : (formData.commitments
      ? (() => {
        try {
          return JSON.parse(formData.commitments);
        } catch {
          return [
            { title: '', description: '', icon: '' },
            { title: '', description: '', icon: '' },
            { title: '', description: '', icon: '' }
          ];
        }
      })()
      : [
        { title: '', description: '', icon: '' },
        { title: '', description: '', icon: '' },
        { title: '', description: '', icon: '' }
      ]);

  const updateCommitment = (index: number, field: string, value: string | number) => {
    const updated = [...commitments];
    updated[index] = { ...updated[index], [field]: value };
    handleInputChange('commitments', updated);
  };

  const addCommitment = () => {
    handleInputChange('commitments', [...commitments, { title: '', description: '', icon: '' }]);
  };

  const removeCommitment = (index: number) => {
    const updated = commitments.filter((_: any, i: number) => i !== index);
    handleInputChange('commitments', updated);
  };

  const handleIconUpload = async (index: number, file: File) => {
    if (!uploadImage) return null;
    try {
      const mediaId = await uploadImage(file);
      if (mediaId) {
        // Resolve media ID to path immediately
        const { mediaService } = await import('../../../../services/apiService');
        const media = await mediaService.getById(mediaId);
        if (media?.filePath) {
          updateCommitment(index, 'icon', media.filePath);
          return mediaId;
        }
      }
      return null;
    } catch (error) {
      console.error("Error resolving uploaded icon:", error);
      return null;
    }
  };

  return (
    <div className="space-y-4">
      <FormField
        label="Badge"
        name="badge"
        value={formData.badge || ''}
        onChange={(value) => handleInputChange('badge', value)}
        helpText="Small uppercase label above the heading"
        error={errors.badge}
      />

      <FormField
        label="Section Title"
        name="title"
        value={formData.title || ''}
        onChange={(value) => handleInputChange('title', value)}
        required
        error={errors.title}
      />

      <div className="border-2 border-gray-200 rounded-lg p-4 bg-gray-50">
        <div className="flex justify-between items-center mb-4">
          <h4 className="font-semibold text-gray-900">Commitment Cards</h4>
          <button
            type="button"
            onClick={addCommitment}
            className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
          >
            <i className="ri-add-line"></i> Add Card
          </button>
        </div>
        <div className="space-y-3">
          {commitments.length > 0 ? (
            commitments.map((item: any, index: number) => (
              <div
                key={index}
                className="space-y-3 p-4 border border-gray-200 rounded-lg bg-white"
              >
                <div className="flex justify-between items-center">
                  <p className="text-sm font-semibold text-gray-700">
                    Commitment {index + 1}
                  </p>
                  <button
                    type="button"
                    onClick={() => removeCommitment(index)}
                    className="px-2 py-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                    title="Remove commitment"
                  >
                    <i className="ri-delete-bin-line"></i>
                  </button>
                </div>

                <ImageUpload
                  label="Icon"
                  value={item.icon || ''}
                  onChange={(value) => updateCommitment(index, 'icon', value)}
                  onUpload={(file) => handleIconUpload(index, file)}
                  uploading={uploadingImage || false}
                  error={errors[`commitments[${index}].icon`]}
                  allowUrl={true}
                  helpText="Upload an icon or enter a class like 'ri-heart-line'"
                />

                <FormField
                  label="Title"
                  name={`commitment-${index}-title`}
                  value={item.title || ''}
                  onChange={(value) => updateCommitment(index, 'title', value)}
                  required
                  error={errors[`commitments[${index}].title`]}
                />
                <FormField
                  label="Description"
                  name={`commitment-${index}-description`}
                  type="textarea"
                  rows={3}
                  value={item.description || ''}
                  onChange={(value) => updateCommitment(index, 'description', value)}
                  error={errors[`commitments[${index}].description`]}
                />
              </div>
            ))
          ) : (
            <p className="text-gray-400 text-sm italic">
              No commitments added yet. Click "Add Card" to add commitment cards.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};


