import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/Layouts/Layout';
import protectedRoute from '@/components/protectedRoute';
import { useTranslation } from 'react-i18next';
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

interface TaxRule {
  id: string;
  region: string;
  rate: number;
  taxType: 'VAT' | 'GST' | 'SALES_TAX';
  createdAt: string;
  updatedAt: string;
}

const TaxesPage = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const [taxRules, setTaxRules] = useState<TaxRule[]>([]);
  const [loading, setLoading] = useState(true);
  const [calculationData, setCalculationData] = useState({
    region: '',
    amount: 0
  });
  const [calculationResult, setCalculationResult] = useState<any>(null);

  useEffect(() => {
    fetchTaxRules();
  }, []);

  const fetchTaxRules = async () => {
    try {
      const response = await fetch('/api/taxes');
      if (response.ok) {
        const data = await response.json();
        setTaxRules(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching tax rules:', error);
      Toast.fire({
        icon: 'error',
        title: 'Failed to load tax rules',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTaxRule = async (id: string) => {
    Swal.fire({
      title: 'Delete Tax Rule',
      text: 'Are you sure you want to delete this tax rule?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const token = localStorage.getItem('token');
          const response = await fetch(`/api/taxes/${id}`, {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });

          if (response.ok) {
            setTaxRules(taxRules.filter(rule => rule.id !== id));
            Toast.fire({
              icon: 'success',
              title: 'Tax rule deleted successfully',
            });
          } else {
            throw new Error('Failed to delete tax rule');
          }
        } catch (error) {
          console.error('Error deleting tax rule:', error);
          Toast.fire({
            icon: 'error',
            title: 'Failed to delete tax rule',
          });
        }
      }
    });
  };

  const handleCalculateTax = async () => {
    if (!calculationData.region || calculationData.amount <= 0) {
      Toast.fire({
        icon: 'error',
        title: 'Please enter valid region and amount',
      });
      return;
    }

    try {
      const response = await fetch('/api/taxes/calculate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(calculationData),
      });

      if (response.ok) {
        const data = await response.json();
        setCalculationResult(data.data);
      } else {
        throw new Error('Failed to calculate tax');
      }
    } catch (error) {
      console.error('Error calculating tax:', error);
      Toast.fire({
        icon: 'error',
        title: 'Failed to calculate tax',
      });
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="container mt-5">
          <div className="text-center">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mt-5">
        <div className="row">
          <div className="col-12">
            <h1 className="mb-4 text-center fw-bold">Tax Management</h1>
            
            {/* Tax Calculation */}
            <div className="card mb-4">
              <div className="card-header">
                <h5>Tax Calculator</h5>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-md-4">
                    <label className="form-label">Region</label>
                    <input
                      type="text"
                      className="form-control"
                      value={calculationData.region}
                      onChange={(e) => setCalculationData({ ...calculationData, region: e.target.value })}
                      placeholder="Enter region"
                    />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">Amount</label>
                    <input
                      type="number"
                      className="form-control"
                      value={calculationData.amount}
                      onChange={(e) => setCalculationData({ ...calculationData, amount: parseFloat(e.target.value) || 0 })}
                      placeholder="Enter amount"
                    />
                  </div>
                  <div className="col-md-4 d-flex align-items-end">
                    <button
                      className="btn btn-primary w-100"
                      onClick={handleCalculateTax}
                    >
                      Calculate Tax
                    </button>
                  </div>
                </div>
                
                {calculationResult && (
                  <div className="mt-3">
                    <div className="alert alert-info">
                      <h6>Tax Calculation Result:</h6>
                      <p><strong>Original Amount:</strong> ${calculationResult.originalAmount}</p>
                      <p><strong>Tax Rate:</strong> {calculationResult.taxRate}%</p>
                      <p><strong>Tax Amount:</strong> ${calculationResult.taxAmount.toFixed(2)}</p>
                      <p><strong>Total Amount:</strong> ${calculationResult.totalAmount.toFixed(2)}</p>
                      <p><strong>Tax Type:</strong> {calculationResult.taxType}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Tax Rules Management */}
            <div className="d-flex justify-content-between align-items-center mb-4">
              <span className="text-muted">
                Total Tax Rules: {taxRules.length}
              </span>
              <button 
                className="btn btn-primary"
                onClick={() => router.push('/taxes/create')}
              >
                New Tax Rule
              </button>
            </div>

            <div className="table-responsive shadow-sm bg-white">
              <table className="table table-hover table-bordered border-secondary">
                <thead className="bg-dark text-light text-center">
                  <tr>
                    <th scope="col">#</th>
                    <th scope="col">Region</th>
                    <th scope="col">Tax Type</th>
                    <th scope="col">Rate (%)</th>
                    <th scope="col">Created At</th>
                    <th scope="col">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {taxRules.map((rule, idx) => (
                    <tr key={rule.id} className="align-middle text-center">
                      <td>{idx + 1}</td>
                      <td className="fw-semibold">{rule.region}</td>
                      <td>
                        <span className={`badge ${
                          rule.taxType === 'VAT' ? 'bg-primary' :
                          rule.taxType === 'GST' ? 'bg-success' : 'bg-warning'
                        }`}>
                          {rule.taxType}
                        </span>
                      </td>
                      <td>{rule.rate}%</td>
                      <td>{new Date(rule.createdAt).toLocaleDateString()}</td>
                      <td>
                        <div className="btn-group">
                          <button 
                            className="btn btn-primary btn-sm me-2"
                            onClick={() => router.push({
                              pathname: '/taxes/edit',
                              query: { rule: JSON.stringify(rule) }
                            })}
                          >
                            Edit
                          </button>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => handleDeleteTaxRule(rule.id)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {taxRules.length === 0 && (
              <div className="text-center py-5">
                <h3 className="text-muted">No tax rules found</h3>
                <p className="text-muted">Create your first tax rule to get started!</p>
                <button 
                  className="btn btn-primary"
                  onClick={() => router.push('/taxes/create')}
                >
                  Create Tax Rule
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default protectedRoute(TaxesPage);
