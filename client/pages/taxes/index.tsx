import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { TablePage } from '@/components/UI/PageComponents';
import { usePageData } from '@/hooks/usePageData';
import { useTranslation } from 'react-i18next';
import { showToast, showConfirm } from '@/components/UI/PageComponents/ToastConfig';
import ProtectedRoute from '@/components/protectedRoute';

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
  const { isAuthenticated } = usePageData();
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
      showToast.error('Failed to load tax rules');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTaxRule = async (id: string) => {
    const result = await showConfirm({
      title: 'Delete Tax Rule',
      text: 'Are you sure you want to delete this tax rule?',
      confirmText: 'Yes, delete it!',
      cancelText: 'Cancel'
    });

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
          showToast.success('Tax rule deleted successfully');
        } else {
          throw new Error('Failed to delete tax rule');
        }
      } catch (error) {
        console.error('Error deleting tax rule:', error);
        showToast.error('Failed to delete tax rule');
      }
    }
  };

  const handleCalculateTax = async () => {
    if (!calculationData.region || calculationData.amount <= 0) {
      showToast.error('Please enter valid region and amount');
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
      showToast.error('Failed to calculate tax');
    }
  };

  const handleEditTaxRule = (rule: TaxRule) => {
    router.push({
      pathname: '/taxes/edit',
      query: { rule: JSON.stringify(rule) }
    });
  };

  // Tax calculation component
  const TaxCalculator = () => (
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
  );

  // Table columns for tax rules
  const taxColumns = [
    {
      key: 'region',
      label: 'Region',
      sortable: true,
      render: (value: string) => <span className="fw-semibold">{value}</span>
    },
    {
      key: 'taxType',
      label: 'Tax Type',
      render: (value: string) => (
        <span className={`badge ${
          value === 'VAT' ? 'bg-primary' :
          value === 'GST' ? 'bg-success' : 'bg-warning'
        }`}>
          {value}
        </span>
      )
    },
    {
      key: 'rate',
      label: 'Rate (%)',
      render: (value: number) => `${value}%`
    },
    {
      key: 'createdAt',
      label: 'Created At',
      sortable: true,
      render: (value: string) => new Date(value).toLocaleDateString()
    }
  ];

  return (
    <>
      <TaxCalculator />
      
      <TablePage
        title="Tax Management"
        subtitle="Manage tax rules and calculate taxes"
        data={taxRules}
        columns={taxColumns}
        loading={loading}
        searchPlaceholder="Search tax rules..."
        emptyMessage="No tax rules found. Create your first tax rule to get started!"
        addButton={{ href: '/taxes/create', label: 'New Tax Rule' }}
        editPath="/taxes/edit"
        deleteAction={handleDeleteTaxRule}
        exportButton={{ onClick: () => console.log('Export tax rules') }}
        filterButton={{ onClick: () => console.log('Filter tax rules') }}
        customActions={[
          {
            key: 'edit',
            label: 'Edit',
            icon: 'bi bi-pencil',
            variant: 'primary',
            onClick: handleEditTaxRule
          },
          {
            key: 'delete',
            label: 'Delete',
            icon: 'bi bi-trash',
            variant: 'danger',
            onClick: (rule) => handleDeleteTaxRule(rule.id)
          }
        ]}
        headerActions={
          <div className="d-flex align-items-center gap-3">
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
        }
      />
    </>
  );
};

export default function ProtectedTaxesPage() {
  return (
    <ProtectedRoute>
      <TaxesPage />
    </ProtectedRoute>
  );
}