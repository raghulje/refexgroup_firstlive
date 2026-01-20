import { FormField } from '../FormField';
import { ImageUpload } from '../ImageUpload';

interface PoliciesSectionFormProps {
  formData: any;
  handleInputChange: (key: string, value: any) => void;
  uploadFile?: (file: File, pageName?: string, sectionName?: string) => Promise<number | null>;
  uploading?: boolean;
  errors?: Record<string, string>;
}

export const PoliciesSectionForm = ({
  formData,
  handleInputChange,
  uploadFile,
  uploading = false,
  errors = {}
}: PoliciesSectionFormProps) => {
  return (
    <div className="space-y-6">
      <FormField
        label="Heading"
        name="heading"
        value={formData.heading || ''}
        onChange={(value) => handleInputChange('heading', value)}
        error={errors.heading}
      />

      {/* Quality Policy */}
      <div className="border-2 border-blue-200 rounded-lg p-4 bg-blue-50">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Quality Policy</h3>
        <div className="space-y-4">
          <FormField
            label="Policy Title"
            name="qualityPolicyTitle"
            value={formData.qualityPolicyTitle || ''}
            onChange={(value) => handleInputChange('qualityPolicyTitle', value)}
            error={errors.qualityPolicyTitle}
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Policy Document (PDF) <span className="text-red-500">*</span>
            </label>
            {uploadFile ? (
              <ImageUpload
                label=""
                value={formData.qualityPolicyUrl || formData.qualityPolicyMediaId || ''}
                onChange={(value) => {
                  if (typeof value === 'number') {
                    handleInputChange('qualityPolicyMediaId', value);
                    handleInputChange('qualityPolicyUrl', ''); // Will be resolved from mediaId
                  } else {
                    handleInputChange('qualityPolicyUrl', value);
                    handleInputChange('qualityPolicyMediaId', null);
                  }
                }}
                onUpload={uploadFile}
                uploading={uploading}
                error={errors.qualityPolicyUrl}
                fileType="document"
                pageName="esg"
                sectionName="policies"
              />
            ) : (
              <FormField
                label="Policy URL"
                name="qualityPolicyUrl"
                value={formData.qualityPolicyUrl || ''}
                onChange={(value) => handleInputChange('qualityPolicyUrl', value)}
                error={errors.qualityPolicyUrl}
                helpText="Full URL to the PDF file"
              />
            )}
            <p className="text-xs text-gray-500 mt-1">
              Upload a PDF file or enter an external URL
            </p>
          </div>
        </div>
      </div>

      {/* EHS Policy */}
      <div className="border-2 border-green-200 rounded-lg p-4 bg-green-50">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">EHS Policy</h3>
        <div className="space-y-4">
          <FormField
            label="Policy Title"
            name="ehsPolicyTitle"
            value={formData.ehsPolicyTitle || ''}
            onChange={(value) => handleInputChange('ehsPolicyTitle', value)}
            error={errors.ehsPolicyTitle}
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Policy Document (PDF) <span className="text-red-500">*</span>
            </label>
            {uploadFile ? (
              <ImageUpload
                label=""
                value={formData.ehsPolicyUrl || formData.ehsPolicyMediaId || ''}
                onChange={(value) => {
                  if (typeof value === 'number') {
                    handleInputChange('ehsPolicyMediaId', value);
                    handleInputChange('ehsPolicyUrl', ''); // Will be resolved from mediaId
                  } else {
                    handleInputChange('ehsPolicyUrl', value);
                    handleInputChange('ehsPolicyMediaId', null);
                  }
                }}
                onUpload={uploadFile}
                uploading={uploading}
                error={errors.ehsPolicyUrl}
                fileType="document"
                pageName="esg"
                sectionName="policies"
              />
            ) : (
              <FormField
                label="Policy URL"
                name="ehsPolicyUrl"
                value={formData.ehsPolicyUrl || ''}
                onChange={(value) => handleInputChange('ehsPolicyUrl', value)}
                error={errors.ehsPolicyUrl}
                helpText="Full URL to the PDF file"
              />
            )}
            <p className="text-xs text-gray-500 mt-1">
              Upload a PDF file or enter an external URL
            </p>
          </div>
        </div>
      </div>

      {/* Sustainability Policy */}
      <div className="border-2 border-purple-200 rounded-lg p-4 bg-purple-50">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Sustainability Policy</h3>
        <div className="space-y-4">
          <FormField
            label="Policy Title"
            name="sustainabilityPolicyTitle"
            value={formData.sustainabilityPolicyTitle || ''}
            onChange={(value) => handleInputChange('sustainabilityPolicyTitle', value)}
            error={errors.sustainabilityPolicyTitle}
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Policy Document (PDF) <span className="text-red-500">*</span>
            </label>
            {uploadFile ? (
              <ImageUpload
                label=""
                value={formData.sustainabilityPolicyUrl || formData.sustainabilityPolicyMediaId || ''}
                onChange={(value) => {
                  if (typeof value === 'number') {
                    handleInputChange('sustainabilityPolicyMediaId', value);
                    handleInputChange('sustainabilityPolicyUrl', ''); // Will be resolved from mediaId
                  } else {
                    handleInputChange('sustainabilityPolicyUrl', value);
                    handleInputChange('sustainabilityPolicyMediaId', null);
                  }
                }}
                onUpload={uploadFile}
                uploading={uploading}
                error={errors.sustainabilityPolicyUrl}
                fileType="document"
                pageName="esg"
                sectionName="policies"
              />
            ) : (
              <FormField
                label="Policy URL"
                name="sustainabilityPolicyUrl"
                value={formData.sustainabilityPolicyUrl || ''}
                onChange={(value) => handleInputChange('sustainabilityPolicyUrl', value)}
                error={errors.sustainabilityPolicyUrl}
                helpText="Full URL to the PDF file"
              />
            )}
            <p className="text-xs text-gray-500 mt-1">
              Upload a PDF file or enter an external URL
            </p>
          </div>
        </div>
      </div>

      {/* Other Policies */}
      <div className="border-2 border-orange-200 rounded-lg p-4 bg-orange-50">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Other Policies</h3>
        <div className="space-y-4">
          <FormField
            label="Other Policies Heading"
            name="otherPoliciesHeading"
            value={formData.otherPoliciesHeading || ''}
            onChange={(value) => handleInputChange('otherPoliciesHeading', value)}
            error={errors.otherPoliciesHeading}
          />
          
          <div className="space-y-4">
            <div>
              <FormField
                label="Grievance Policy Title"
                name="grievancePolicyTitle"
                value={formData.grievancePolicyTitle || ''}
                onChange={(value) => handleInputChange('grievancePolicyTitle', value)}
                error={errors.grievancePolicyTitle}
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Grievance Policy Document (PDF) <span className="text-red-500">*</span>
                </label>
                {uploadFile ? (
                  <ImageUpload
                    label=""
                    value={formData.grievancePolicyUrl || formData.grievancePolicyMediaId || ''}
                    onChange={(value) => {
                      if (typeof value === 'number') {
                        handleInputChange('grievancePolicyMediaId', value);
                        handleInputChange('grievancePolicyUrl', ''); // Will be resolved from mediaId
                      } else {
                        handleInputChange('grievancePolicyUrl', value);
                        handleInputChange('grievancePolicyMediaId', null);
                      }
                    }}
                    onUpload={uploadFile}
                    uploading={uploading}
                    error={errors.grievancePolicyUrl}
                    fileType="document"
                    pageName="esg"
                    sectionName="policies"
                  />
                ) : (
                  <FormField
                    label="Grievance Policy URL"
                    name="grievancePolicyUrl"
                    value={formData.grievancePolicyUrl || ''}
                    onChange={(value) => handleInputChange('grievancePolicyUrl', value)}
                    error={errors.grievancePolicyUrl}
                    helpText="Full URL to the PDF file"
                  />
                )}
                <p className="text-xs text-gray-500 mt-1">
                  Upload a PDF file or enter an external URL
                </p>
              </div>
            </div>
            
            <div>
              <FormField
                label="ABAC Policy Title"
                name="abacPolicyTitle"
                value={formData.abacPolicyTitle || ''}
                onChange={(value) => handleInputChange('abacPolicyTitle', value)}
                error={errors.abacPolicyTitle}
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ABAC Policy Document (PDF) <span className="text-red-500">*</span>
                </label>
                {uploadFile ? (
                  <ImageUpload
                    label=""
                    value={formData.abacPolicyUrl || formData.abacPolicyMediaId || ''}
                    onChange={(value) => {
                      if (typeof value === 'number') {
                        handleInputChange('abacPolicyMediaId', value);
                        handleInputChange('abacPolicyUrl', ''); // Will be resolved from mediaId
                      } else {
                        handleInputChange('abacPolicyUrl', value);
                        handleInputChange('abacPolicyMediaId', null);
                      }
                    }}
                    onUpload={uploadFile}
                    uploading={uploading}
                    error={errors.abacPolicyUrl}
                    fileType="document"
                    pageName="esg"
                    sectionName="policies"
                  />
                ) : (
                  <FormField
                    label="ABAC Policy URL"
                    name="abacPolicyUrl"
                    value={formData.abacPolicyUrl || ''}
                    onChange={(value) => handleInputChange('abacPolicyUrl', value)}
                    error={errors.abacPolicyUrl}
                    helpText="Full URL to the PDF file"
                  />
                )}
                <p className="text-xs text-gray-500 mt-1">
                  Upload a PDF file or enter an external URL
                </p>
              </div>
            </div>
            
            <div>
              <FormField
                label="Vendor Code Title"
                name="vendorCodeTitle"
                value={formData.vendorCodeTitle || ''}
                onChange={(value) => handleInputChange('vendorCodeTitle', value)}
                error={errors.vendorCodeTitle}
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Vendor Code Document (PDF) <span className="text-red-500">*</span>
                </label>
                {uploadFile ? (
                  <ImageUpload
                    label=""
                    value={formData.vendorCodeUrl || formData.vendorCodeMediaId || ''}
                    onChange={(value) => {
                      if (typeof value === 'number') {
                        handleInputChange('vendorCodeMediaId', value);
                        handleInputChange('vendorCodeUrl', ''); // Will be resolved from mediaId
                      } else {
                        handleInputChange('vendorCodeUrl', value);
                        handleInputChange('vendorCodeMediaId', null);
                      }
                    }}
                    onUpload={uploadFile}
                    uploading={uploading}
                    error={errors.vendorCodeUrl}
                    fileType="document"
                    pageName="esg"
                    sectionName="policies"
                  />
                ) : (
                  <FormField
                    label="Vendor Code URL"
                    name="vendorCodeUrl"
                    value={formData.vendorCodeUrl || ''}
                    onChange={(value) => handleInputChange('vendorCodeUrl', value)}
                    error={errors.vendorCodeUrl}
                    helpText="Full URL to the PDF file"
                  />
                )}
                <p className="text-xs text-gray-500 mt-1">
                  Upload a PDF file or enter an external URL
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

