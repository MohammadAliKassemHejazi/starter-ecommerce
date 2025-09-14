export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: any) => string | null;
}

export interface ValidationRules {
  [key: string]: ValidationRule;
}

export const validateField = (value: any, rules: ValidationRule): string | null => {
  // Required validation
  if (rules.required && (!value || value.toString().trim() === '')) {
    return 'This field is required';
  }

  // Skip other validations if value is empty and not required
  if (!value || value.toString().trim() === '') {
    return null;
  }

  // Min length validation
  if (rules.minLength && value.toString().length < rules.minLength) {
    return `Minimum length is ${rules.minLength} characters`;
  }

  // Max length validation
  if (rules.maxLength && value.toString().length > rules.maxLength) {
    return `Maximum length is ${rules.maxLength} characters`;
  }

  // Pattern validation
  if (rules.pattern && !rules.pattern.test(value.toString())) {
    return 'Invalid format';
  }

  // Custom validation
  if (rules.custom) {
    return rules.custom(value);
  }

  return null;
};

export const validateForm = (data: any, rules: ValidationRules): { [key: string]: string } => {
  const errors: { [key: string]: string } = {};

  Object.keys(rules).forEach(field => {
    const error = validateField(data[field], rules[field]);
    if (error) {
      errors[field] = error;
    }
  });

  return errors;
};

// Common validation patterns
export const patterns = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  phone: /^[\+]?[1-9][\d]{0,15}$/,
  url: /^https?:\/\/.+/,
  alphanumeric: /^[a-zA-Z0-9]+$/,
  price: /^\d+(\.\d{1,2})?$/,
  uuid: /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
};

// Common validation rules
export const commonRules = {
  required: { required: true },
  email: { 
    required: true, 
    pattern: patterns.email,
    custom: (value: string) => {
      if (!patterns.email.test(value)) {
        return 'Please enter a valid email address';
      }
      return null;
    }
  },
  password: {
    required: true,
    minLength: 6,
    custom: (value: string) => {
      if (value.length < 6) {
        return 'Password must be at least 6 characters long';
      }
      if (!/(?=.*[a-z])/.test(value)) {
        return 'Password must contain at least one lowercase letter';
      }
      if (!/(?=.*[A-Z])/.test(value)) {
        return 'Password must contain at least one uppercase letter';
      }
      if (!/(?=.*\d)/.test(value)) {
        return 'Password must contain at least one number';
      }
      return null;
    }
  },
  phone: {
    pattern: patterns.phone,
    custom: (value: string) => {
      if (value && !patterns.phone.test(value)) {
        return 'Please enter a valid phone number';
      }
      return null;
    }
  },
  price: {
    required: true,
    pattern: patterns.price,
    custom: (value: string) => {
      const num = parseFloat(value);
      if (isNaN(num) || num < 0) {
        return 'Please enter a valid price';
      }
      return null;
    }
  },
  positiveNumber: {
    required: true,
    custom: (value: string) => {
      const num = parseFloat(value);
      if (isNaN(num) || num <= 0) {
        return 'Please enter a positive number';
      }
      return null;
    }
  },
  url: {
    pattern: patterns.url,
    custom: (value: string) => {
      if (value && !patterns.url.test(value)) {
        return 'Please enter a valid URL';
      }
      return null;
    }
  }
};
