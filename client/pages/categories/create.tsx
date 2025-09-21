import React, { useState } from "react";
import Swal from "sweetalert2";
import { createCategory } from "@/store/slices/categorySlice";
import { useAppDispatch } from "@/store/store";
import Layout from "@/components/Layouts/Layout";
import ProtectedRoute from "@/components/protectedRoute";
import router from "next/router";
import Link from "next/link";
import FormInput from "@/components/UI/FormInput";
import LoadingSpinner from "@/components/UI/LoadingSpinner";
import { useTranslation } from 'react-i18next';
import { validateForm, commonRules } from '@/utils/validation';

const Toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 2000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.addEventListener("mouseenter", Swal.stopTimer);
    toast.addEventListener("mouseleave", Swal.resumeTimer);
  },
});

const CreateCategory = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const [formData, setFormData] = useState({
    name: "",
    description: ""
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);

  const validationRules = {
    name: { ...commonRules.required, minLength: 2, maxLength: 100 },
    description: { maxLength: 500 }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleCreateCategory = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Validate form
    const validationErrors = validateForm(formData, validationRules);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    try {
      const response = await dispatch(createCategory(formData)).unwrap();
      Toast.fire({
        icon: "success",
        title: "Category created successfully",
      });
      if (response.id) {
        void router.push(`/categories`);
      }
    } catch (error) {
      Toast.fire({
        icon: "error",
        title: "Failed to create category",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="container mt-5">
          <LoadingSpinner text="Creating category..." />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-lg-8 col-md-10">
            {/* Header */}
            <div className="d-flex align-items-center mb-4">
              <Link href="/categories" className="btn btn-outline-secondary me-3">
                <i className="bi bi-arrow-left"></i>
              </Link>
              <div>
                <h1 className="h2 fw-bold text-dark mb-1">{t('categories.createCategory')}</h1>
                <p className="text-muted mb-0">Add a new category to organize your products</p>
              </div>
            </div>

            {/* Form */}
            <div className="card shadow-sm">
              <div className="card-body p-4">
                <form onSubmit={handleCreateCategory}>
                  <div className="row">
                    <div className="col-12">
                      <FormInput
                        label="Category Name"
                        name="name"
                        type="text"
                        value={formData.name}
                        onChange={(value) => handleInputChange('name', value)}
                        placeholder="Enter category name"
                        required={true}
                        validation={validationRules.name}
                        error={errors.name}
                      />
                    </div>
                    <div className="col-12">
                      <FormInput
                        label="Description"
                        name="description"
                        type="textarea"
                        value={formData.description}
                        onChange={(value) => handleInputChange('description', value)}
                        placeholder="Enter category description (optional)"
                        rows={4}
                        validation={validationRules.description}
                        error={errors.description}
                      />
                    </div>
                  </div>

                  {/* Form Actions */}
                  <div className="d-flex justify-content-end gap-3 mt-4 pt-3 border-top">
                    <Link href="/categories">
                      <button type="button" className="btn btn-outline-secondary">
                        <i className="bi bi-x-circle me-2"></i>
                        Cancel
                      </button>
                    </Link>
                    <button 
                      type="submit" 
                      className="btn btn-primary"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          Creating...
                        </>
                      ) : (
                        <>
                          <i className="bi bi-check-circle me-2"></i>
                          Create Category
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default function ProtectedCreateCategory() {
  return (
    <ProtectedRoute>
      <CreateCategory />
    </ProtectedRoute>
  );
}