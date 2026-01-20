import { FormField } from '../FormField';
import { ImageUpload } from '../ImageUpload';
import { ImagePositionControl } from '../ImagePositionControl';

interface SustainabilityReportSectionFormProps {
  formData: any;
  handleInputChange: (key: string, value: any) => void;
  uploadImage?: (file: File, pageName?: string, sectionName?: string) => Promise<number | null>;
  uploadingImage?: boolean;
  uploadFile?: (file: File, pageName?: string, sectionName?: string) => Promise<number | null>;
  uploading?: boolean;
  errors?: Record<string, string>;
}

export const SustainabilityReportSectionForm = ({
  formData,
  handleInputChange,
  uploadImage,
  uploadingImage,
  uploadFile,
  uploading = false,
  errors = {}
}: SustainabilityReportSectionFormProps) => {
  // Parse reports from JSON or use array, fallback to individual report fields
  let reportsArray: any[] = [];
  
  if (formData.reports) {
    if (Array.isArray(formData.reports)) {
      reportsArray = formData.reports;
    } else if (typeof formData.reports === 'string') {
      try {
        reportsArray = JSON.parse(formData.reports);
      } catch {
        reportsArray = [];
      }
    }
  }
  
  // If no reports array, try to build from individual report fields (for backward compatibility)
  if (reportsArray.length === 0) {
    // Try new field names first
    if (formData.sustainabilityReportTitle || formData.dashboardTitle) {
      if (formData.sustainabilityReportTitle) {
        reportsArray.push({
          title: formData.sustainabilityReportTitle,
          buttonText: formData.sustainabilityReportButtonText || '',
          link: formData.sustainabilityReportUrl || '',
          mediaId: formData.sustainabilityReportMediaId || null
        });
      }
      if (formData.dashboardTitle) {
        reportsArray.push({
          title: formData.dashboardTitle,
          buttonText: formData.dashboardButtonText || '',
          link: formData.dashboardUrl || '',
          mediaId: formData.dashboardMediaId || null
        });
      }
    }
    // Fallback to old field names
    else if (formData.report1Title || formData.report2Title) {
      if (formData.report1Title) {
        reportsArray.push({
          title: formData.report1Title,
          buttonText: formData.report1Text || '',
          link: formData.report1Link || '',
          mediaId: formData.report1MediaId || null
        });
      }
      if (formData.report2Title) {
        reportsArray.push({
          title: formData.report2Title,
          buttonText: formData.report2Text || '',
          link: formData.report2Link || '',
          mediaId: formData.report2MediaId || null
        });
      }
    }
  }

  const updateReport = (index: number, field: string, value: string | number | null) => {
    const updated = [...reportsArray];
    if (!updated[index]) {
      updated[index] = { title: '', buttonText: '', link: '', mediaId: null };
    }
    updated[index][field] = value;
    handleInputChange('reports', JSON.stringify(updated));
  };

  const addReport = () => {
    const updated = [...reportsArray, { title: '', buttonText: '', link: '', mediaId: null }];
    handleInputChange('reports', JSON.stringify(updated));
  };

  const removeReport = (index: number) => {
    const updated = reportsArray.filter((_: any, i: number) => i !== index);
    handleInputChange('reports', JSON.stringify(updated));
  };

  const moveReport = (index: number, direction: 'up' | 'down') => {
    const updated = [...reportsArray];
    if (direction === 'up' && index > 0) {
      [updated[index - 1], updated[index]] = [updated[index], updated[index - 1]];
    } else if (direction === 'down' && index < updated.length - 1) {
      [updated[index], updated[index + 1]] = [updated[index + 1], updated[index]];
    }
    handleInputChange('reports', JSON.stringify(updated));
  };

  return (
    <div className="space-y-6">
      {/* Reports Section */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Sustainability Reports
        </label>
        <div className="space-y-3">
          {reportsArray.map((report: any, index: number) => (
            <div key={index} className="border-2 border-gray-200 rounded-lg p-4 bg-gray-50">
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-gray-900">Report {index + 1}</span>
                  <div className="flex gap-1">
                    <button
                      type="button"
                      onClick={() => moveReport(index, 'up')}
                      disabled={index === 0}
                      className="text-gray-600 hover:bg-gray-100 px-2 py-1 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Move up"
                    >
                      <i className="ri-arrow-up-line"></i>
                    </button>
                    <button
                      type="button"
                      onClick={() => moveReport(index, 'down')}
                      disabled={index === reportsArray.length - 1}
                      className="text-gray-600 hover:bg-gray-100 px-2 py-1 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Move down"
                    >
                      <i className="ri-arrow-down-line"></i>
                    </button>
                  </div>
                </div>
                {reportsArray.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeReport(index)}
                    className="text-red-600 hover:bg-red-50 px-2 py-1 rounded transition-colors"
                    title="Remove report"
                  >
                    <i className="ri-delete-bin-line"></i>
                  </button>
                )}
              </div>
              
              <div className="space-y-3">
                <FormField
                  label="Report Title"
                  name={`report-${index}-title`}
                  value={report.title || ''}
                  onChange={(value) => updateReport(index, 'title', value)}
                  required
                />
                <FormField
                  label="Button Text"
                  name={`report-${index}-buttonText`}
                  value={report.buttonText || ''}
                  onChange={(value) => updateReport(index, 'buttonText', value)}
                  required
                />
                {uploadFile ? (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Report Document (PDF) <span className="text-red-500">*</span>
                    </label>
                    <ImageUpload
                      label=""
                      value={report.link || report.mediaId || ''}
                      onChange={(value) => {
                        if (typeof value === 'number') {
                          updateReport(index, 'mediaId', value);
                          updateReport(index, 'link', ''); // Will be resolved from mediaId
                        } else {
                          updateReport(index, 'link', value);
                          updateReport(index, 'mediaId', null);
                        }
                      }}
                      onUpload={uploadFile}
                      uploading={uploading}
                      fileType="document"
                      pageName="esg"
                      sectionName="sustainability-report"
                      allowUrl={true}
                      error={errors[`report-${index}-link`]}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Upload a PDF file or enter an external URL
                    </p>
                  </div>
                ) : (
                  <FormField
                    label="Report URL"
                    name={`report-${index}-link`}
                    value={report.link || ''}
                    onChange={(value) => updateReport(index, 'link', value)}
                    required
                    helpText="Full URL to the PDF file"
                  />
                )}
              </div>
            </div>
          ))}
          
          {reportsArray.length === 0 && (
            <p className="text-sm text-gray-500 text-center py-4">No reports yet. Click "Add Report" to create one.</p>
          )}
          
          <button
            type="button"
            onClick={addReport}
            className="w-full px-4 py-2 border-2 border-dashed border-gray-300 rounded-md text-gray-600 hover:border-gray-400 hover:text-gray-700 transition-colors flex items-center justify-center gap-2"
          >
            <i className="ri-add-line"></i>
            Add Report
          </button>
        </div>
      </div>

      {/* Background Image */}
      {uploadImage && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Background Image
          </label>
          <ImageUpload
            label=""
            value={formData.backgroundImage || formData.backgroundImageId || ''}
            onChange={(mediaId: number | string) => handleInputChange('backgroundImage', mediaId)}
            onUpload={uploadImage}
            uploading={uploadingImage || false}
            pageName="esg"
            sectionName="sustainability-report"
            allowUrl={true}
            error={errors.backgroundImage}
          />
          {errors.backgroundImage && (
            <p className="mt-1 text-sm text-red-600">{errors.backgroundImage}</p>
          )}
          
          {/* Image Position Control */}
          {(formData.backgroundImage || formData.backgroundImageId) && (
            <div className="mt-4">
              <ImagePositionControl
                label="Background Image Position"
                positionX={formData.backgroundPositionX || formData.backgroundImagePositionX || '50'}
                positionY={formData.backgroundPositionY || formData.backgroundImagePositionY || '50'}
                onChangeX={(value) => {
                  handleInputChange('backgroundPositionX', value);
                  handleInputChange('backgroundImagePositionX', value);
                }}
                onChangeY={(value) => {
                  handleInputChange('backgroundPositionY', value);
                  handleInputChange('backgroundImagePositionY', value);
                }}
                imageMediaId={formData.backgroundImage || formData.backgroundImageId}
                helpText="Adjust X and Y position (0-100%) to control which part of the image is visible"
              />
            </div>
          )}
        </div>
      )}

      {/* Overlay Color */}
      <FormField
        label="Overlay Color"
        name="overlayColor"
        type="color"
        value={formData.overlayColor || formData.backgroundColor || '#2d5234'}
        onChange={(value) => {
          handleInputChange('overlayColor', value);
          handleInputChange('backgroundColor', value);
        }}
        error={errors.overlayColor || errors.backgroundColor}
        helpText="Overlay color for the background image (hex code)"
      />
    </div>
  );
};

