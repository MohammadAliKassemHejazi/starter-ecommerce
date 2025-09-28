import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { FormPage } from '@/components/UI/PageComponents';
import { usePageData } from '@/hooks/usePageData';
import ProtectedRoute from '@/components/protectedRoute';
import { showToast } from '@/components/UI/PageComponents/ToastConfig';

const CreatePromotion = () => {
  const router = useRouter();
  const { isAuthenticated } = usePageData();
  const [formData, setFormData] = useState({
    code: '',
    type: 'PERCENTAGE' as 'PERCENTAGE' | 'FIXED',
    value: 0,
    minCartValue: 0,
    validFrom: '',
    validTo: ''
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'value' || name === 'minCartValue' ? parseFloat(value) || 0 : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/promotions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        showToast.success('Promotion created successfully');
        router.push('/promotions');
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create promotion');
      }
    } catch (error) {
      console.error('Error creating promotion:', error);
      showToast.error(error instanceof Error ? error.message : 'Failed to create promotion');
    } finally {
      setLoading(false);
    }
  };

  const formFields = [
    {
      type: "text" as const,
      name: "code",
      label: "Promotion Code",
      value: formData.code,
      onChange: handleInputChange,
      placeholder: "e.g., SAVE20",
      required: true,
      helpText: "Enter a unique promotion code"
    },
    {
      type: "select" as const,
      name: "type",
      label: "Discount Type",
      value: formData.type,
      onChange: handleInputChange,
      required: true,
      options: [
        { value: "PERCENTAGE", label: "Percentage" },
        { value: "FIXED", label: "Fixed Amount" }
      ]
    },
    {
      type: "number" as const,
      name: "value",
      label: "Discount Value",
      value: formData.value,
      onChange: handleInputChange,
      placeholder: formData.type === 'PERCENTAGE' ? '20' : '10.00',
      required: true,
      min: 0,
      step: formData.type === 'PERCENTAGE' ? '1' : '0.01',
      helpText: formData.type === 'PERCENTAGE' 
        ? 'Enter percentage (e.g., 20 for 20%)' 
        : 'Enter amount in dollars'
    },
    {
      type: "number" as const,
      name: "minCartValue",
      label: "Minimum Cart Value",
      value: formData.minCartValue,
      onChange: handleInputChange,
      placeholder: "0.00",
      min: 0,
      step: "0.01",
      helpText: "Minimum cart value to use this promotion"
    },
    {
      type: "datetime-local" as const,
      name: "validFrom",
      label: "Valid From",
      value: formData.validFrom,
      onChange: handleInputChange
    },
    {
      type: "datetime-local" as const,
      name: "validTo",
      label: "Valid To",
      value: formData.validTo,
      onChange: handleInputChange
    }
  ];

  const formActions = [
    {
      type: "button" as const,
      variant: "secondary" as const,
      label: "Cancel",
      onClick: () => router.push('/promotions')
    },
    {
      type: "submit" as const,
      variant: "primary" as const,
      label: loading ? 'Creating...' : 'Create Promotion',
      disabled: loading
    }
  ];

  return (
    <FormPage
      title="Create Promotion"
      subtitle="Add a new promotion to boost sales"
      formFields={formFields}
      formActions={formActions}
      onSubmit={handleSubmit}
      protected={true}
    />
  );
};

export default function ProtectedCreatePromotion() {
  return (
    <ProtectedRoute>
      <CreatePromotion />
    </ProtectedRoute>
  );
}