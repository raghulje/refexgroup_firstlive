import { FormField } from '../FormField';
import { ImageUpload } from '../ImageUpload';

interface RenewablesFeaturedProjectsFormProps {
  formData: any;
  handleInputChange: (key: string, value: any) => void;
  uploadImage?: (file: File) => Promise<number | null>;
  uploadingImage?: boolean;
  errors?: Record<string, string>;
}

export const RenewablesFeaturedProjectsForm = ({
  formData,
  handleInputChange,
  uploadImage,
  uploadingImage,
  errors = {}
}: RenewablesFeaturedProjectsFormProps) => {
  // Parse projects from JSON or use array
  let projects = [];
  if (Array.isArray(formData.projects)) {
    projects = formData.projects;
  } else if (typeof formData.projects === 'string' && formData.projects) {
    try {
      projects = JSON.parse(formData.projects);
    } catch {
      projects = [];
    }
  }

  const updateProject = (index: number, field: string, value: any) => {
    const updated = [...projects];
    updated[index] = { ...updated[index], [field]: value };
    handleInputChange('projects', updated);
  };

  const updateProjectImages = (projectIndex: number, imageIndex: number, value: any) => {
    const updated = [...projects];
    const projectImages = [...(updated[projectIndex].images || [])];
    projectImages[imageIndex] = value;
    updated[projectIndex] = { ...updated[projectIndex], images: projectImages };
    handleInputChange('projects', updated);
  };

  const addProjectImage = (projectIndex: number) => {
    const updated = [...projects];
    const projectImages = [...(updated[projectIndex].images || [])];
    projectImages.push('');
    updated[projectIndex] = { ...updated[projectIndex], images: projectImages };
    handleInputChange('projects', updated);
  };

  const removeProjectImage = (projectIndex: number, imageIndex: number) => {
    const updated = [...projects];
    const projectImages = (updated[projectIndex].images || []).filter((_: any, i: number) => i !== imageIndex);
    updated[projectIndex] = { ...updated[projectIndex], images: projectImages };
    handleInputChange('projects', updated);
  };

  const addProject = () => {
    handleInputChange('projects', [...projects, {
      id: `project-${projects.length + 1}`,
      name: '',
      location: '',
      capacity: '',
      description: '',
      details: '',
      extraDetails: '',
      images: []
    }]);
  };

  const removeProject = (index: number) => {
    const updated = projects.filter((_: any, i: number) => i !== index);
    handleInputChange('projects', updated);
  };

  return (
    <div className="space-y-6">
      <FormField
        label="Title"
        name="title"
        value={formData.title || ''}
        onChange={(value) => handleInputChange('title', value)}
        required
        error={errors.title}
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

      {uploadImage && (
        <>
        <ImageUpload
          label="Background Image"
          value={formData.backgroundImage || ''}
          onChange={(mediaId) => handleInputChange('backgroundImage', mediaId)}
          onUpload={uploadImage}
          uploading={uploadingImage || false}
            pageName="general"
            sectionName="general"
            allowUrl={true}
          />
          <ImageUpload
            label="Sun Background Icon (Bottom Right)"
            value={formData.sunIcon || ''}
            onChange={(mediaId) => handleInputChange('sunIcon', mediaId)}
            onUpload={uploadImage}
            uploading={uploadingImage || false}
            pageName="general"
            sectionName="general"
            allowUrl={true}
            fileType="icon"
          />
        </>
      )}

      <div>
        <div className="flex justify-between items-center mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Projects
          </label>
          <button
            type="button"
            onClick={addProject}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors flex items-center gap-2"
          >
            <i className="ri-add-line"></i>
            Add Project
          </button>
        </div>
        <div className="space-y-6">
          {projects.map((project: any, projectIndex: number) => (
            <div key={projectIndex} className="border-2 border-blue-200 rounded-lg p-4 bg-blue-50">
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-semibold text-gray-900">Project {projectIndex + 1}</h4>
                <button
                  type="button"
                  onClick={() => removeProject(projectIndex)}
                  className="text-red-600 hover:bg-red-50 px-2 py-1 rounded transition-colors"
                  title="Remove project"
                >
                  <i className="ri-delete-bin-line"></i>
                </button>
              </div>
              <div className="space-y-3">
                <FormField
                  label="Project ID"
                  name={`project-${projectIndex}-id`}
                  value={project.id || ''}
                  onChange={(value) => updateProject(projectIndex, 'id', value)}
                  error={errors[`project${projectIndex}Id`]}
                  helpText="Unique identifier (e.g., bhilai, indian-army, diwana)"
                />
                <FormField
                  label="Project Name"
                  name={`project-${projectIndex}-name`}
                  value={project.name || ''}
                  onChange={(value) => updateProject(projectIndex, 'name', value)}
                  required
                />
                <FormField
                  label="Location"
                  name={`project-${projectIndex}-location`}
                  value={project.location || ''}
                  onChange={(value) => updateProject(projectIndex, 'location', value)}
                  required
                />
                <FormField
                  label="Capacity"
                  name={`project-${projectIndex}-capacity`}
                  value={project.capacity || ''}
                  onChange={(value) => updateProject(projectIndex, 'capacity', value)}
                  required
                />
                <FormField
                  label="Description"
                  name={`project-${projectIndex}-description`}
                  type="textarea"
                  rows={2}
                  value={project.description || ''}
                  onChange={(value) => updateProject(projectIndex, 'description', value)}
                  required
                />
                <FormField
                  label="Details"
                  name={`project-${projectIndex}-details`}
                  type="textarea"
                  rows={2}
                  value={project.details || ''}
                  onChange={(value) => updateProject(projectIndex, 'details', value)}
                  required
                />
                <FormField
                  label="Extra Details (Optional)"
                  name={`project-${projectIndex}-extraDetails`}
                  type="textarea"
                  rows={2}
                  value={project.extraDetails || ''}
                  onChange={(value) => updateProject(projectIndex, 'extraDetails', value)}
                />
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Project Images
                  </label>
                  <div className="space-y-3">
                    {(project.images || []).map((img: string, imageIndex: number) => (
                      <div key={imageIndex} className="border border-gray-200 rounded-lg p-3 bg-gray-50">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium text-gray-700">Image {imageIndex + 1}</span>
                          <button
                            type="button"
                            onClick={() => removeProjectImage(projectIndex, imageIndex)}
                            className="text-red-600 hover:bg-red-50 px-2 py-1 rounded transition-colors text-sm"
                            title="Remove image"
                          >
                            <i className="ri-delete-bin-line"></i> Remove
                          </button>
                        </div>
                        {uploadImage ? (
                          <ImageUpload
                            label=""
                            value={img || ''}
                            onChange={(mediaId) => updateProjectImages(projectIndex, imageIndex, mediaId)}
                            onUpload={uploadImage}
                            uploading={uploadingImage || false}
                            allowUrl={true}
                          />
                        ) : (
                          <input
                            type="text"
                            value={img}
                            onChange={(e) => updateProjectImages(projectIndex, imageIndex, e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Image URL"
                          />
                        )}
                      </div>
                    ))}
                    {projects.length > 0 && (
                      <button
                        type="button"
                        onClick={() => addProjectImage(projectIndex)}
                        className="w-full px-4 py-2 border-2 border-dashed border-gray-300 rounded-md text-gray-600 hover:border-gray-400 hover:text-gray-700 transition-colors flex items-center justify-center gap-2"
                      >
                        <i className="ri-add-line"></i>
                        Add Image
                      </button>
                    )}
                  </div>
                  {(!project.images || project.images.length === 0) && (
                    <div className="text-center py-4 border-2 border-dashed border-gray-300 rounded-lg">
                      <p className="text-gray-500 text-sm mb-2">No images added yet</p>
                      <button
                        type="button"
                        onClick={() => addProjectImage(projectIndex)}
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                      >
                        Click to add your first image
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
          {projects.length === 0 && (
            <div className="text-center py-8 text-gray-500 border-2 border-dashed border-gray-300 rounded-lg">
              <p>No projects added yet. Click "Add Project" to create one.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

