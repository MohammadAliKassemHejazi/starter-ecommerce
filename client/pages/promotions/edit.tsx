import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/Layouts/Layout';
import protectedRoute from '@/components/protectedRoute';
import Swal from 'sweetalert2';

const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 2000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.addEventListener('mouseenter', Swal.stopTimer);
    toast.addEventListener('mouseleave', Swal.resumeTimer);
  },
});

const EditPromotion = () => {
  const router = useRouter();
  const { promotion } = router.query;
  const [formData, setFormData] = useState({
    code: '',
    type: 'PERCENTAGE' as 'PERCENTAGE' | 'FIXED',
    value: 0,
    minCartValue: 0,
    validFrom: '',
    validTo: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (router.isReady && promotion) {
      const promotionData = JSON.parse(promotion as string);
      setFormData({
        code: promotionData.code || '',
        type: promotionData.type || 'PERCENTAGE',
        value: promotionData.value || 0,
        minCartValue: promotionData.minCartValue || 0,
        validFrom: promotionData.validFrom ? new Date(promotionData.validFrom).toISOString().slice(0, 16) : '',
        validTo: promotionData.validTo ? new Date(promotionData.validTo).toISOString().slice(0, 16) : ''
      });
    }
  }, [router.isReady, promotion]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
      const response = await fetch(`/api/promotions/${router.query.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        Toast.fire({
          icon: 'success',
          title: 'Promotion updated successfully',
        });
        router.push('/promotions');
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update promotion');
      }
    } catch (error) {
      console.error('Error updating promotion:', error);
      Toast.fire({
        icon: 'error',
        title: error instanceof Error ? error.message : 'Failed to update promotion',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="container">
        <div className="row justify-content-center py-5">
          <div className="col-lg-8 col-md-10">
            <form onSubmit={handleSubmit} className="mt-5">
              <h1 className="mb-4">Edit Promotion</h1>
              
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label htmlFor="code" className="form-label">
                    Promotion Code *
                  </label>
                  <input
                    type="text"
                    id="code"
                    name="code"
                    value={formData.code}
                    onChange={handleInputChange}
                    className="form-control"
                    placeholder="e.g., SAVE20"
                    required
                  />
                  <div className="form-text">Enter a unique promotion code</div>
                </div>

                <div className="col-md-6 mb-3">
                  <label htmlFor="type" className="form-label">
                    Discount Type *
                  </label>
                  <select
                    id="type"
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    className="form-select"
                    required
                  >
                    <option value="PERCENTAGE">Percentage</option>
                    <option value="FIXED">Fixed Amount</option>
                  </select>
                </div>
              </div>

              <div className="row">
                <div className="col-md-6 mb-3">
                  <label htmlFor="value" className="form-label">
                    Discount Value *
                  </label>
                  <input
                    type="number"
                    id="value"
                    name="value"
                    value={formData.value}
                    onChange={handleInputChange}
                    className="form-control"
                    placeholder={formData.type === 'PERCENTAGE' ? '20' : '10.00'}
                    min="0"
                    step={formData.type === 'PERCENTAGE' ? '1' : '0.01'}
                    required
                  />
                  <div className="form-text">
                    {formData.type === 'PERCENTAGE' 
                      ? 'Enter percentage (e.g., 20 for 20%)' 
                      : 'Enter amount in dollars'
                    }
                  </div>
                </div>

                <div className="col-md-6 mb-3">
                  <label htmlFor="minCartValue" className="form-label">
                    Minimum Cart Value
                  </label>
                  <input
                    type="number"
                    id="minCartValue"
                    name="minCartValue"
                    value={formData.minCartValue}
                    onChange={handleInputChange}
                    className="form-control"
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                  />
                  <div className="form-text">Minimum cart value to use this promotion</div>
                </div>
              </div>

              <div className="row">
                <div className="col-md-6 mb-3">
                  <label htmlFor="validFrom" className="form-label">
                    Valid From
                  </label>
                  <input
                    type="datetime-local"
                    id="validFrom"
                    name="validFrom"
                    value={formData.validFrom}
                    onChange={handleInputChange}
                    className="form-control"
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label htmlFor="validTo" className="form-label">
                    Valid To
                  </label>
                  <input
                    type="datetime-local"
                    id="validTo"
                    name="validTo"
                    value={formData.validTo}
                    onChange={handleInputChange}
                    className="form-control"
                  />
                </div>
              </div>

              <div className="d-flex gap-3 mt-4">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => router.push('/promotions')}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={loading}
                >
                  {loading ? 'Updating...' : 'Update Promotion'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default protectedRoute(EditPromotion);
