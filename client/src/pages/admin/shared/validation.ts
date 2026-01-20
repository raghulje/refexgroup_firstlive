export interface ValidationErrors {
  [key: string]: string;
}

export const validators = {
  required: (value: any, fieldName: string): string | null => {
    if (!value || (typeof value === 'string' && value.trim() === '')) {
      return `${fieldName} is required`;
    }
    return null;
  },

  email: (value: string): string | null => {
    if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      return 'Invalid email format';
    }
    return null;
  },

  url: (value: string): string | null => {
    if (value && !/^https?:\/\/.+\..+/.test(value)) {
      return 'Invalid URL format';
    }
    return null;
  },

  minLength: (value: string, min: number, fieldName: string): string | null => {
    if (value && value.length < min) {
      return `${fieldName} must be at least ${min} characters`;
    }
    return null;
  },

  maxLength: (value: string, max: number, fieldName: string): string | null => {
    if (value && value.length > max) {
      return `${fieldName} must be less than ${max} characters`;
    }
    return null;
  },

  number: (value: any, fieldName: string): string | null => {
    if (value !== '' && value !== null && isNaN(Number(value))) {
      return `${fieldName} must be a number`;
    }
    return null;
  },

  positiveNumber: (value: any, fieldName: string): string | null => {
    if (value !== '' && value !== null) {
      const num = Number(value);
      if (isNaN(num) || num < 0) {
        return `${fieldName} must be a positive number`;
      }
    }
    return null;
  }
};

export const validateForm = (
  formData: any,
  rules: Record<string, Array<(value: any, fieldName: string) => string | null>>
): ValidationErrors => {
  const errors: ValidationErrors = {};

  Object.keys(rules).forEach((field) => {
    const fieldRules = rules[field];
    const value = formData[field];

    for (const rule of fieldRules) {
      const error = rule(value, field);
      if (error) {
        errors[field] = error;
        break; // Stop at first error for this field
      }
    }
  });

  return errors;
};

