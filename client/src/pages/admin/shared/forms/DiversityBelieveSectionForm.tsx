import { FormField } from '../FormField';
import { ImageUpload } from '../ImageUpload';

interface DiversityBelieveSectionFormProps {
  formData: any;
  handleInputChange: (key: string, value: any) => void;
  uploadImage?: (file: File) => Promise<any>;
  uploadingImage?: boolean;
  errors?: Record<string, string>;
}

export const DiversityBelieveSectionForm = ({
  formData,
  handleInputChange,
  uploadImage,
  uploadingImage,
  errors = {}
}: DiversityBelieveSectionFormProps) => {
  // Parse beliefs from JSON or use array
  let beliefs: any[] = [];
  if (Array.isArray(formData.beliefs)) {
    beliefs = formData.beliefs;
  } else if (typeof formData.beliefs === 'string' && formData.beliefs) {
    try {
      beliefs = JSON.parse(formData.beliefs);
    } catch {
      beliefs = [];
    }
  }

  const updateBeliefs = (updated: any[]) => {
    handleInputChange('beliefs', JSON.stringify(updated));
  };

  const updateBelief = (index: number, field: string, value: string) => {
    const updated = [...beliefs];
    if (!updated[index]) {
      updated[index] = { title: '', description: '', iconPath: '', orderIndex: index };
    }
    updated[index][field] = value;
    updateBeliefs(updated);
  };

  const addBelief = () => {
    const newBelief = {
      title: '',
      description: '',
      iconPath: '',
      orderIndex: beliefs.length
    };
    updateBeliefs([...beliefs, newBelief]);
  };

  const removeBelief = (index: number) => {
    const updated = beliefs.filter((_: any, i: number) => i !== index);
    // Reorder remaining beliefs
    updated.forEach((belief, i) => {
      belief.orderIndex = i;
    });
    updateBeliefs(updated);
  };

  const moveBelief = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === beliefs.length - 1) return;

    const updated = [...beliefs];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    [updated[index], updated[newIndex]] = [updated[newIndex], updated[index]];
    // Update orderIndex
    updated.forEach((belief, i) => {
      belief.orderIndex = i;
    });
    updateBeliefs(updated);
  };

  // Sort by orderIndex
  beliefs.sort((a, b) => (a.orderIndex || 0) - (b.orderIndex || 0));

  return (
    <div className="space-y-4">
      <FormField
        label="Title"
        name="title"
        value={formData.title || ''}
        onChange={(value) => handleInputChange('title', value)}
        required
        error={errors.title}
      />

      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="block text-sm font-medium text-gray-700">
            Beliefs
          </label>
          <button
            type="button"
            onClick={addBelief}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2 text-sm"
          >
            <i className="ri-add-line"></i>
            Add Belief
          </button>
        </div>

        <div className="space-y-4">
          {beliefs.length === 0 ? (
            <p className="text-center text-gray-500 py-8">No beliefs yet. Click "Add Belief" to create one.</p>
          ) : (
            beliefs.map((belief: any, index: number) => (
              <div key={index} className="border-2 border-gray-200 rounded-lg p-4 bg-gray-50">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="font-semibold text-gray-900">
                    Belief {index + 1}
                  </h4>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => moveBelief(index, 'up')}
                      disabled={index === 0}
                      className="text-blue-600 hover:bg-blue-50 px-2 py-1 rounded transition-colors disabled:opacity-50"
                      title="Move up"
                    >
                      <i className="ri-arrow-up-line"></i>
                    </button>
                    <button
                      type="button"
                      onClick={() => moveBelief(index, 'down')}
                      disabled={index === beliefs.length - 1}
                      className="text-blue-600 hover:bg-blue-50 px-2 py-1 rounded transition-colors disabled:opacity-50"
                      title="Move down"
                    >
                      <i className="ri-arrow-down-line"></i>
                    </button>
                    <button
                      type="button"
                      onClick={() => removeBelief(index)}
                      className="text-red-600 hover:bg-red-50 px-2 py-1 rounded transition-colors"
                      title="Remove belief"
                    >
                      <i className="ri-delete-bin-line"></i>
                    </button>
                  </div>
                </div>
                <div className="space-y-3">
                  {uploadImage && (
                    <div>
                      <ImageUpload
                        key={`belief-icon-${index}-${belief.iconPath || 'empty'}`}
                        label="Icon SVG"
                        value={belief.iconPath !== undefined && belief.iconPath !== null ? belief.iconPath : ''}
                        onChange={(mediaId: number | string) => {
                          // Preserve the type - if it's a number, keep it as number; if string, keep as string
                          // The save logic will handle converting to /uploads/media/{id} format
                          updateBelief(index, 'iconPath', mediaId);
                        }}
                        onUpload={uploadImage}
                        uploading={uploadingImage || false}
                        fileType="icon"
                        allowUrl={true}
                        pageName="general"
                        sectionName="general"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Upload an SVG file or enter a URL. SVG format is recommended for icons.
                      </p>
                    </div>
                  )}
                  <FormField
                    label="Title"
                    name={`belief-${index}-title`}
                    value={belief.title || ''}
                    onChange={(value) => updateBelief(index, 'title', value)}
                    required
                  />
                  <FormField
                    label="Description"
                    name={`belief-${index}-description`}
                    type="textarea"
                    rows={2}
                    value={belief.description || ''}
                    onChange={(value) => updateBelief(index, 'description', value)}
                    required
                  />
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
