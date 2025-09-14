import React, { useState, useEffect } from 'react';
import { ValidationRule } from '@/utils/validation';

interface FormInputProps {
  label: string;
  name: string;
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'textarea' | 'select' | 'date' | 'datetime-local';
  value: any;
  onChange: (value: any) => void;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  validation?: ValidationRule;
  error?: string;
  options?: { value: string; label: string }[];
  rows?: number;
  min?: number;
  max?: number;
  step?: number;
}

const FormInput: React.FC<FormInputProps> = ({
  label,
  name,
  type = 'text',
  value,
  onChange,
  placeholder,
  required = false,
  disabled = false,
  className = '',
  validation,
  error,
  options = [],
  rows = 3,
  min,
  max,
  step
}) => {
  const [localError, setLocalError] = useState<string | null>(null);
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    if (validation && touched) {
      const { validateField } = require('@/utils/validation');
      const fieldError = validateField(value, validation);
      setLocalError(fieldError);
    }
  }, [value, validation, touched]);

  const handleBlur = () => {
    setTouched(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const newValue = type === 'number' ? parseFloat(e.target.value) || 0 : e.target.value;
    onChange(newValue);
  };

  const displayError = error || localError;
  const hasError = touched && displayError;

  const inputClasses = `form-control ${hasError ? 'is-invalid' : ''} ${className}`;

  const renderInput = () => {
    switch (type) {
      case 'textarea':
        return (
          <textarea
            id={name}
            name={name}
            value={value || ''}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder={placeholder}
            required={required}
            disabled={disabled}
            className={inputClasses}
            rows={rows}
          />
        );

      case 'select':
        return (
          <select
            id={name}
            name={name}
            value={value || ''}
            onChange={handleChange}
            onBlur={handleBlur}
            required={required}
            disabled={disabled}
            className={inputClasses}
          >
            <option value="">Select {label}</option>
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );

      default:
        return (
          <input
            type={type}
            id={name}
            name={name}
            value={value || ''}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder={placeholder}
            required={required}
            disabled={disabled}
            className={inputClasses}
            min={min}
            max={max}
            step={step}
          />
        );
    }
  };

  return (
    <div className="mb-3">
      <label htmlFor={name} className="form-label">
        {label}
        {required && <span className="text-danger ms-1">*</span>}
      </label>
      {renderInput()}
      {hasError && (
        <div className="invalid-feedback">
          {displayError}
        </div>
      )}
    </div>
  );
};

export default FormInput;
