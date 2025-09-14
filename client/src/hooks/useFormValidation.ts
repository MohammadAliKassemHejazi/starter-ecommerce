import { useState, useCallback } from 'react';
import { validateForm, ValidationRules } from '@/utils/validation';

interface UseFormValidationProps {
  initialData: any;
  validationRules: ValidationRules;
  onSubmit: (data: any) => Promise<void> | void;
}

export const useFormValidation = ({ initialData, validationRules, onSubmit }: UseFormValidationProps) => {
  const [formData, setFormData] = useState(initialData);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});

  const handleInputChange = useCallback((field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  }, [errors]);

  const handleBlur = useCallback((field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    
    // Validate single field
    const fieldRules = validationRules[field];
    if (fieldRules) {
      const { validateField } = require('@/utils/validation');
      const fieldError = validateField(formData[field], fieldRules);
      setErrors(prev => ({ ...prev, [field]: fieldError || '' }));
    }
  }, [formData, validationRules]);

  const validateFormData = useCallback(() => {
    const validationErrors = validateForm(formData, validationRules);
    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  }, [formData, validationRules]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Mark all fields as touched
    const allTouched = Object.keys(validationRules).reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {} as { [key: string]: boolean });
    setTouched(allTouched);

    // Validate form
    if (!validateFormData()) {
      return;
    }

    setLoading(true);
    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setLoading(false);
    }
  }, [formData, validateFormData, onSubmit]);

  const resetForm = useCallback(() => {
    setFormData(initialData);
    setErrors({});
    setTouched({});
    setLoading(false);
  }, [initialData]);

  const setFieldError = useCallback((field: string, error: string) => {
    setErrors(prev => ({ ...prev, [field]: error }));
  }, []);

  const clearErrors = useCallback(() => {
    setErrors({});
  }, []);

  const getFieldError = useCallback((field: string) => {
    return touched[field] ? errors[field] : '';
  }, [touched, errors]);

  const hasErrors = Object.keys(errors).some(key => errors[key]);

  return {
    formData,
    errors,
    loading,
    touched,
    handleInputChange,
    handleBlur,
    handleSubmit,
    resetForm,
    setFieldError,
    clearErrors,
    getFieldError,
    hasErrors,
    isValid: !hasErrors && Object.keys(touched).length > 0
  };
};
