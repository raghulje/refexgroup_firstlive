import { FormField } from '../FormField';
import { ImageUpload } from '../ImageUpload';

interface PharmaPlantCapabilitySectionFormProps {
  formData: any;
  handleInputChange: (key: string, value: any) => void;
  uploadImage?: (file: File) => Promise<number | null>;
  uploadingImage?: boolean;
  errors?: Record<string, string>;
}

export const PharmaPlantCapabilitySectionForm = ({
  formData,
  handleInputChange,
  uploadImage,
  uploadingImage,
  errors = {}
}: PharmaPlantCapabilitySectionFormProps) => {
  const formulationsFacilities = Array.isArray(formData.formulationsFacilities)
    ? formData.formulationsFacilities
    : (formData.formulationsFacilities
      ? (() => {
        try {
          return JSON.parse(formData.formulationsFacilities);
        } catch {
          return [];
        }
      })()
      : []);

  const rlfcCapabilities = Array.isArray(formData.rlfcCapabilities)
    ? formData.rlfcCapabilities
    : (formData.rlfcCapabilities
      ? (() => {
        try {
          return JSON.parse(formData.rlfcCapabilities);
        } catch {
          return [];
        }
      })()
      : []);

  const oncologyFacilities = Array.isArray(formData.oncologyFacilities)
    ? formData.oncologyFacilities
    : (formData.oncologyFacilities
      ? (() => {
        try {
          return JSON.parse(formData.oncologyFacilities);
        } catch {
          return [];
        }
      })()
      : []);

  const approvals = Array.isArray(formData.approvals)
    ? formData.approvals
    : (formData.approvals
      ? (() => {
        try {
          return JSON.parse(formData.approvals);
        } catch {
          return [];
        }
      })()
      : []);

  const updateFacility = (arrayName: string, index: number, field: string, value: string) => {
    const array = arrayName === 'formulationsFacilities' ? formulationsFacilities :
      arrayName === 'rlfcCapabilities' ? rlfcCapabilities : oncologyFacilities;
    const updated = [...array];
    updated[index] = { ...updated[index], [field]: value };
    handleInputChange(arrayName, updated);
  };

  const addFacility = (arrayName: string) => {
    const array = arrayName === 'formulationsFacilities' ? formulationsFacilities :
      arrayName === 'rlfcCapabilities' ? rlfcCapabilities : oncologyFacilities;
    handleInputChange(arrayName, [...array, { title: '', location: '', image: '' }]);
  };

  const removeFacility = (arrayName: string, index: number) => {
    const array = arrayName === 'formulationsFacilities' ? formulationsFacilities :
      arrayName === 'rlfcCapabilities' ? rlfcCapabilities : oncologyFacilities;
    const updated = array.filter((_: any, i: number) => i !== index);
    handleInputChange(arrayName, updated);
  };

  const updateApproval = (index: number, field: string, value: string) => {
    const updated = [...approvals];
    updated[index] = { ...updated[index], [field]: value };
    handleInputChange('approvals', updated);
  };

  const addApproval = () => {
    handleInputChange('approvals', [...approvals, { name: '', icon: 'ri-shield-check-line', color: '#7DC244' }]);
  };

  const removeApproval = (index: number) => {
    const updated = approvals.filter((_: any, i: number) => i !== index);
    handleInputChange('approvals', updated);
  };

  return (
    <div className="space-y-6">
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
        rows={3}
        value={formData.description || ''}
        onChange={(value) => handleInputChange('description', value)}
        error={errors.description}
      />

      {/* Formulations Facilities */}
      <div className="border-2 border-gray-200 rounded-lg p-4 bg-gray-50">
        <div className="flex justify-between items-center mb-4">
          <h4 className="font-semibold text-gray-900">Formulations & Complex Generics</h4>
          <button
            type="button"
            onClick={() => addFacility('formulationsFacilities')}
            className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
          >
            <i className="ri-add-line"></i> Add Facility
          </button>
        </div>
        <div className="space-y-3">
          {formulationsFacilities.length > 0 ? (
            formulationsFacilities.map((facility: any, index: number) => (
              <div key={index} className="space-y-3 p-4 border border-gray-200 rounded-lg bg-white">
                <div className="flex justify-between items-center">
                  <p className="text-sm font-semibold text-gray-700">Facility {index + 1}</p>
                  <button
                    type="button"
                    onClick={() => removeFacility('formulationsFacilities', index)}
                    className="px-2 py-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                  >
                    <i className="ri-delete-bin-line"></i>
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <FormField
                    label="Title"
                    name={`formulation-${index}-title`}
                    value={facility.title || ''}
                    onChange={(value) => updateFacility('formulationsFacilities', index, 'title', value)}
                    required
                  />
                  <FormField
                    label="Location"
                    name={`formulation-${index}-location`}
                    value={facility.location || ''}
                    onChange={(value) => updateFacility('formulationsFacilities', index, 'location', value)}
                    required
                  />
                </div>
                {uploadImage && (
                  <ImageUpload
                    label="Image"
                    value={facility.image || ''}
                    onChange={(mediaId) => {
                      const updated = [...formulationsFacilities];
                      updated[index] = { ...updated[index], image: mediaId };
                      handleInputChange('formulationsFacilities', updated);
                    }}
                    onUpload={uploadImage}
                    uploading={uploadingImage || false}
                  />
                )}
              </div>
            ))
          ) : (
            <p className="text-gray-400 text-sm italic">No facilities added yet.</p>
          )}
        </div>
      </div>

      {/* RLFC Capabilities */}
      <div className="border-2 border-gray-200 rounded-lg p-4 bg-gray-50">
        <div className="flex justify-between items-center mb-4">
          <h4 className="font-semibold text-gray-900">Refex Life Sciences Capabilities</h4>
          <button
            type="button"
            onClick={() => addFacility('rlfcCapabilities')}
            className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
          >
            <i className="ri-add-line"></i> Add Capability
          </button>
        </div>
        <div className="space-y-3">
          {rlfcCapabilities.length > 0 ? (
            rlfcCapabilities.map((facility: any, index: number) => (
              <div key={index} className="space-y-3 p-4 border border-gray-200 rounded-lg bg-white">
                <div className="flex justify-between items-center">
                  <p className="text-sm font-semibold text-gray-700">Capability {index + 1}</p>
                  <button
                    type="button"
                    onClick={() => removeFacility('rlfcCapabilities', index)}
                    className="px-2 py-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                  >
                    <i className="ri-delete-bin-line"></i>
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <FormField
                    label="Title"
                    name={`rlfc-${index}-title`}
                    value={facility.title || ''}
                    onChange={(value) => updateFacility('rlfcCapabilities', index, 'title', value)}
                    required
                  />
                  <FormField
                    label="Location"
                    name={`rlfc-${index}-location`}
                    value={facility.location || ''}
                    onChange={(value) => updateFacility('rlfcCapabilities', index, 'location', value)}
                    required
                  />
                </div>
                {uploadImage && (
                  <ImageUpload
                    label="Image"
                    value={facility.image || ''}
                    onChange={(mediaId) => {
                      const updated = [...rlfcCapabilities];
                      updated[index] = { ...updated[index], image: mediaId };
                      handleInputChange('rlfcCapabilities', updated);
                    }}
                    onUpload={uploadImage}
                    uploading={uploadingImage || false}
                  />
                )}
              </div>
            ))
          ) : (
            <p className="text-gray-400 text-sm italic">No capabilities added yet.</p>
          )}
        </div>
      </div>

      <FormField
        label="Expansion Note"
        name="expansionNote"
        type="textarea"
        rows={2}
        value={formData.expansionNote || ''}
        onChange={(value) => handleInputChange('expansionNote', value)}
        error={errors.expansionNote}
        helpText="Note about expansion (optional)"
      />

      {/* Oncology Facilities */}
      <div className="border-2 border-gray-200 rounded-lg p-4 bg-gray-50">
        <div className="flex justify-between items-center mb-4">
          <h4 className="font-semibold text-gray-900">Oncology & Speciality Intermediates</h4>
          <button
            type="button"
            onClick={() => addFacility('oncologyFacilities')}
            className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
          >
            <i className="ri-add-line"></i> Add Facility
          </button>
        </div>
        <div className="space-y-3">
          {oncologyFacilities.length > 0 ? (
            oncologyFacilities.map((facility: any, index: number) => (
              <div key={index} className="space-y-3 p-4 border border-gray-200 rounded-lg bg-white">
                <div className="flex justify-between items-center">
                  <p className="text-sm font-semibold text-gray-700">Facility {index + 1}</p>
                  <button
                    type="button"
                    onClick={() => removeFacility('oncologyFacilities', index)}
                    className="px-2 py-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                  >
                    <i className="ri-delete-bin-line"></i>
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <FormField
                    label="Title"
                    name={`oncology-${index}-title`}
                    value={facility.title || ''}
                    onChange={(value) => updateFacility('oncologyFacilities', index, 'title', value)}
                    required
                  />
                  <FormField
                    label="Location"
                    name={`oncology-${index}-location`}
                    value={facility.location || ''}
                    onChange={(value) => updateFacility('oncologyFacilities', index, 'location', value)}
                    required
                  />
                </div>
                {uploadImage && (
                  <ImageUpload
                    label="Image"
                    value={facility.image || ''}
                    onChange={(mediaId) => {
                      const updated = [...oncologyFacilities];
                      updated[index] = { ...updated[index], image: mediaId };
                      handleInputChange('oncologyFacilities', updated);
                    }}
                    onUpload={uploadImage}
                    uploading={uploadingImage || false}
                  />
                )}
              </div>
            ))
          ) : (
            <p className="text-gray-400 text-sm italic">No facilities added yet.</p>
          )}
        </div>
      </div>

      {/* Approvals */}
      <div className="border-2 border-gray-200 rounded-lg p-4 bg-gray-50">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="font-semibold text-gray-900">Regulatory Approvals</h4>
            <button
              type="button"
              onClick={addApproval}
              className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
            >
              <i className="ri-add-line"></i> Add Approval
            </button>
          </div>
          <FormField
            label="Approvals Heading"
            name="approvalsHeading"
            value={formData.approvalsHeading || ''}
            onChange={(value) => handleInputChange('approvalsHeading', value)}
            error={errors.approvalsHeading}
          />
          <FormField
            label="Approvals Description"
            name="approvalsDescription"
            type="textarea"
            rows={2}
            value={formData.approvalsDescription || ''}
            onChange={(value) => handleInputChange('approvalsDescription', value)}
            error={errors.approvalsDescription}
          />
          <div className="space-y-3">
            {approvals.length > 0 ? (
              approvals.map((approval: any, index: number) => (
                <div key={index} className="space-y-3 p-4 border border-gray-200 rounded-lg bg-white">
                  <div className="flex justify-between items-center">
                    <p className="text-sm font-semibold text-gray-700">Approval {index + 1}</p>
                    <button
                      type="button"
                      onClick={() => removeApproval(index)}
                      className="px-2 py-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                    >
                      <i className="ri-delete-bin-line"></i>
                    </button>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <FormField
                      label="Name"
                      name={`approval-${index}-name`}
                      value={approval.name || ''}
                      onChange={(value) => updateApproval(index, 'name', value)}
                      required
                    />
                    <FormField
                      label="Icon Class"
                      name={`approval-${index}-icon`}
                      value={approval.icon || 'ri-shield-check-line'}
                      onChange={(value) => updateApproval(index, 'icon', value)}
                    />
                    <FormField
                      label="Color"
                      name={`approval-${index}-color`}
                      type="color"
                      value={approval.color || '#7DC244'}
                      onChange={(value) => updateApproval(index, 'color', value)}
                    />
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-400 text-sm italic">No approvals added yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

