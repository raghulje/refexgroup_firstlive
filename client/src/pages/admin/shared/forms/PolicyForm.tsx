import { useState, useEffect } from 'react';
import { ImageUpload } from '../ImageUpload';

interface PolicyFormProps {
    formData: any;
    handleInputChange: (key: string, value: any) => void;
    uploadFile: (file: File, pageName?: string, sectionName?: string) => Promise<number | null>;
    uploading: boolean;
    errors?: Record<string, string>;
}

export const PolicyForm = ({
    formData,
    handleInputChange,
    uploadFile,
    uploading,
    errors
}: PolicyFormProps) => {
    return (
        <div className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Policy Title <span className="text-red-500">*</span>
                </label>
                <input
                    type="text"
                    value={formData.title || ''}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors?.title ? 'border-red-500' : 'border-gray-300'
                        }`}
                    placeholder="e.g., Quality Policy"
                />
                {errors?.title && <p className="text-xs text-red-500 mt-1">{errors.title}</p>}
            </div>

            <div className="border-2 border-blue-200 rounded-lg p-4 bg-blue-50">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Policy Document (PDF/Word) <span className="text-red-500">*</span>
                </label>
                <ImageUpload
                    label=""
                    value={formData.link || formData.mediaId || (formData.fileId || '')}
                    onChange={(value) => {
                        // If it's a number (ID), store as mediaId and resolve to link
                        // If string (URL), store as link
                        if (typeof value === 'number') {
                            handleInputChange('mediaId', value);
                            // Try to resolve mediaId to filePath for link
                            // The parent component or frontend will resolve this
                            handleInputChange('link', ''); // Will be resolved from mediaId
                        } else {
                            handleInputChange('link', value);
                            handleInputChange('mediaId', null);
                        }
                    }}
                    onUpload={uploadFile}
                    uploading={uploading}
                    error={errors?.link}
                    fileType="document"
                    pageName="esg"
                    sectionName="policies"
                />
                <div className="mt-2 space-y-1">
                    <p className="text-xs text-gray-600 font-medium">
                        <i className="ri-upload-cloud-line mr-1"></i>
                        Upload Options:
                    </p>
                    <ul className="text-xs text-gray-500 ml-4 list-disc space-y-0.5">
                        <li>Upload a PDF or document file (max 200MB)</li>
                        <li>Files are stored in: <code className="bg-gray-200 px-1 rounded">/uploads/documents/esg/policies/</code></li>
                        <li>Or enter an external URL if the document is hosted elsewhere</li>
                    </ul>
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Policy Label (Optional)
                </label>
                <input
                    type="text"
                    value={formData.label || ''}
                    onChange={(e) => handleInputChange('label', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Download Quality Policy"
                />
                <p className="text-xs text-gray-500 mt-1">Label for the download link (defaults to title)</p>
            </div>
        </div>
    );
};
