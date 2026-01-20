import { FormField } from '../FormField';
import { ImageUpload } from '../ImageUpload';

interface FooterSettingsFormProps {
  formData: any;
  handleInputChange: (key: string, value: any) => void;
  uploadImageUtil: (file: File) => Promise<string | null>;
  uploadingImage: boolean;
  errors?: Record<string, string>;
}

export const FooterSettingsForm = ({
  formData,
  handleInputChange,
  uploadImageUtil,
  uploadingImage,
  errors,
}: FooterSettingsFormProps) => {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Footer Logo
        </label>
        <ImageUpload
          value={formData.logo || formData.logoFooterId || null}
          onChange={(mediaId) => handleInputChange('logoFooterId', mediaId)}
          onUpload={uploadImageUtil}
          uploading={uploadingImage}
          allowUrl={true}
        />
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          Logo displayed in the footer
        </p>
      </div>

      <FormField
        label="Copyright Text"
        name="copyrightText"
        type="text"
        value={formData.copyrightText || ''}
        onChange={(value) => handleInputChange('copyrightText', value)}
        placeholder="e.g., 2024 REFEX. All right reserved."
        required
        error={errors?.copyrightText}
      />

      <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
        <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
          Complaint Contact Information
        </h4>

        <FormField
          label="Phone Number"
          name="complaintPhone"
          type="text"
          value={formData.complaintPhone || ''}
          onChange={(value) => handleInputChange('complaintPhone', value)}
          placeholder="+91 96297 38734"
          error={errors?.complaintPhone}
        />

        <FormField
          label="Email Address"
          name="complaintEmail"
          type="email"
          value={formData.complaintEmail || ''}
          onChange={(value) => handleInputChange('complaintEmail', value)}
          placeholder="refexcares@refex.co.in"
          error={errors?.complaintEmail}
        />
      </div>

      <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
        <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
          Legal Links
        </h4>

        <FormField
          label="Privacy Policy URL"
          name="privacyPolicyUrl"
          type="text"
          value={formData.privacyPolicyUrl || ''}
          onChange={(value) => handleInputChange('privacyPolicyUrl', value)}
          placeholder="/privacy-policy"
          error={errors?.privacyPolicyUrl}
        />

        <FormField
          label="Terms of Use URL"
          name="termsOfUseUrl"
          type="text"
          value={formData.termsOfUseUrl || ''}
          onChange={(value) => handleInputChange('termsOfUseUrl', value)}
          placeholder="/terms-of-use"
          error={errors?.termsOfUseUrl}
        />
      </div>
    </div>
  );
};

