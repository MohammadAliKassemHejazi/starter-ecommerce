import React from 'react';
import { PageLayout } from './PageLayout';
import { ActionGroup, createActionButtons } from './ActionButtons';

interface FormField {
  type: 'text' | 'email' | 'password' | 'number' | 'textarea' | 'select' | 'datetime-local' | 'checkbox';
  name: string;
  label: string;
  value: any;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  placeholder?: string;
  required?: boolean;
  maxLength?: number;
  minLength?: number;
  min?: number;
  max?: number;
  step?: string;
  rows?: number;
  helpText?: string;
  error?: string;
  options?: Array<{ value: string; label: string; disabled?: boolean }>;
}

interface FormAction {
  type: 'button' | 'submit';
  variant: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark' | 'outline-primary' | 'outline-secondary';
  label: string;
  href?: string;
  onClick?: (e?: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
}

interface FormPageProps {
  title: string;
  subtitle?: string;
  breadcrumbs?: Array<{
    label: string;
    href?: string;
  }>;
  formFields?: FormField[];
  formActions?: FormAction[];
  onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void;
  onCancel?: () => void;
  onSave?: () => void;
  onDelete?: () => void;
  loading?: boolean;
  submitLabel?: string;
  cancelLabel?: string;
  saveLabel?: string;
  deleteLabel?: string;
  showDelete?: boolean;
  showSave?: boolean;
  showCancel?: boolean;
  showSubmit?: boolean;
  protected?: boolean;
  className?: string;
  children?: React.ReactNode;
}

const renderFormField = (field: FormField) => {
  const commonProps = {
    id: field.name,
    name: field.name,
    value: field.value,
    onChange: field.onChange,
    placeholder: field.placeholder,
    required: field.required,
    maxLength: field.maxLength,
    minLength: field.minLength,
    className: `form-control ${field.error ? 'is-invalid' : ''}`,
  };

  let inputElement;

  switch (field.type) {
    case 'textarea':
      inputElement = (
        <textarea
          {...commonProps}
          rows={field.rows || 4}
        />
      );
      break;
    case 'select':
      inputElement = (
        <select {...commonProps}>
          {field.options?.map((option) => (
            <option
              key={option.value}
              value={option.value}
              disabled={option.disabled}
            >
              {option.label}
            </option>
          ))}
        </select>
      );
      break;
    case 'checkbox':
      inputElement = (
        <div className="form-check">
          <input
            type="checkbox"
            id={field.name}
            name={field.name}
            checked={field.value}
            onChange={field.onChange}
            className={`form-check-input ${field.error ? 'is-invalid' : ''}`}
          />
          <label className="form-check-label" htmlFor={field.name}>
            {field.label}
          </label>
        </div>
      );
      break;
    default:
      inputElement = (
        <input
          type={field.type}
          {...commonProps}
          min={field.min}
          max={field.max}
          step={field.step}
        />
      );
  }

  if (field.type === 'checkbox') {
    return (
      <div className="mb-3">
        {inputElement}
        {field.helpText && (
          <div className="form-text">{field.helpText}</div>
        )}
        {field.error && (
          <div className="invalid-feedback">{field.error}</div>
        )}
      </div>
    );
  }

  return (
    <div className="mb-3">
      <label htmlFor={field.name} className="form-label">
        {field.label}
        {field.required && <span className="text-danger">*</span>}
      </label>
      {inputElement}
      {field.helpText && (
        <div className="form-text">{field.helpText}</div>
      )}
      {field.error && (
        <div className="invalid-feedback">{field.error}</div>
      )}
    </div>
  );
};

export const FormPage: React.FC<FormPageProps> = ({
  title,
  subtitle,
  breadcrumbs,
  formFields = [],
  formActions = [],
  onSubmit,
  onCancel,
  onSave,
  onDelete,
  loading = false,
  submitLabel = 'Submit',
  cancelLabel = 'Cancel',
  saveLabel = 'Save',
  deleteLabel = 'Delete',
  showDelete = false,
  showSave = false,
  showCancel = true,
  showSubmit = true,
  protected: isProtected = true,
  className = '',
  children
}) => {
  const actions = [];

  if (showSubmit && onSubmit) {
    actions.push({
      type: 'submit' as const,
      variant: 'primary' as const,
      label: submitLabel,
      onClick: onSubmit
    });
  }
  
  if (showSave && onSave) {
    actions.push({
      type: 'button' as const,
      variant: 'success' as const,
      label: saveLabel,
      onClick: onSave
    });
  }
  
  if (showDelete && onDelete) {
    actions.push({
      type: 'button' as const,
      variant: 'danger' as const,
      label: deleteLabel,
      onClick: onDelete
    });
  }
  
  if (showCancel && onCancel) {
    actions.push({
      type: 'button' as const,
      variant: 'secondary' as const,
      label: cancelLabel,
      onClick: onCancel
    });
  }

  const allActions = [...actions, ...formActions];

  return (
    <PageLayout
      title={title}
      subtitle={subtitle}
      breadcrumbs={breadcrumbs}
      protected={isProtected}
      className={className}
    >
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="card">
            <div className="card-body">
              {loading ? (
                <div className="text-center py-5">
                  <div className="spinner-border" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              ) : (
                <form onSubmit={onSubmit}>
                  {formFields.map((field) => (
                    <div key={field.name}>
                      {renderFormField(field)}
                    </div>
                  ))}
                  
                  {children}
                  
                  {allActions.length > 0 && (
                    <div className="d-flex gap-3 mt-4 pt-3 border-top">
                      {allActions.map((action, index) => {
                        if (action.type === 'submit') {
                          return (
                            <button
                              key={index}
                              type="submit"
                              className={`btn btn-${action.variant}`}
                              disabled={('disabled' in action ? action.disabled : false) || loading}
                            >
                              {loading ? (
                                <>
                                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                  Processing...
                                </>
                              ) : (
                                action.label
                              )}
                            </button>
                          );
                        } else {
                          return (
                            <button
                              key={index}
                              type="button"
                              className={`btn btn-${action.variant}`}
                              onClick={action.onClick}
                              disabled={action.disabled || loading}
                            >
                              {action.label}
                            </button>
                          );
                        }
                      })}
                    </div>
                  )}
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default FormPage;