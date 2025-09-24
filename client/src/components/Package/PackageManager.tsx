import React, { useState, useEffect } from 'react';
import { 
  getAllPackages, 
  createPackage, 
  updatePackage, 
  deletePackage,
  assignPackageToUser,
  IPackage,
  IUserPackage 
} from '@/services/packageService';

interface PackageManagerProps {
  isSuperAdmin: boolean;
}

export const PackageManager: React.FC<PackageManagerProps> = ({ isSuperAdmin }) => {
  const [packages, setPackages] = useState<IPackage[]>([]);
  const [loading, setLoading] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingPackage, setEditingPackage] = useState<IPackage | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    storeLimit: 0,
    categoryLimit: 0,
    productLimit: 0,
    userLimit: 0,
    isSuperAdminPackage: false,
    price: 0,
    isActive: true
  });

  useEffect(() => {
    if (isSuperAdmin) {
      loadPackages();
    }
  }, [isSuperAdmin]);

  const loadPackages = async () => {
    setLoading(true);
    try {
      const data = await getAllPackages();
      setPackages(data);
    } catch (error) {
      console.error('Error loading packages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePackage = async () => {
    try {
      await createPackage(formData);
      setShowCreateModal(false);
      resetForm();
      loadPackages();
    } catch (error) {
      console.error('Error creating package:', error);
    }
  };

  const handleUpdatePackage = async () => {
    if (!editingPackage) return;
    
    try {
      await updatePackage(editingPackage.id, formData);
      setShowEditModal(false);
      setEditingPackage(null);
      resetForm();
      loadPackages();
    } catch (error) {
      console.error('Error updating package:', error);
    }
  };

  const handleDeletePackage = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this package?')) {
      try {
        await deletePackage(id);
        loadPackages();
      } catch (error) {
        console.error('Error deleting package:', error);
      }
    }
  };

  const handleEditPackage = (pkg: IPackage) => {
    setEditingPackage(pkg);
    setFormData({
      name: pkg.name,
      description: pkg.description,
      storeLimit: pkg.storeLimit,
      categoryLimit: pkg.categoryLimit,
      productLimit: pkg.productLimit,
      userLimit: pkg.userLimit,
      isSuperAdminPackage: pkg.isSuperAdminPackage,
      price: pkg.price,
      isActive: pkg.isActive
    });
    setShowEditModal(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      storeLimit: 0,
      categoryLimit: 0,
      productLimit: 0,
      userLimit: 0,
      isSuperAdminPackage: false,
      price: 0,
      isActive: true
    });
  };

  if (!isSuperAdmin) {
    return (
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4">Package Management</h2>
        <p className="text-gray-600">You don't have permission to manage packages.</p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="h3 mb-0">Package Management</h2>
        <button 
          className="btn btn-primary"
          onClick={() => setShowCreateModal(true)}
        >
          Create New Package
        </button>
      </div>

      <div className="table-responsive">
        <table className="table table-hover table-bordered">
          <thead className="table-dark">
            <tr>
              <th>Name</th>
              <th>Description</th>
              <th>Store Limit</th>
              <th>Product Limit</th>
              <th>User Limit</th>
              <th>Price</th>
              <th>Super Admin</th>
              <th>Active</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={9} className="text-center">
                  <div className="spinner-border" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </td>
              </tr>
            ) : packages.length === 0 ? (
              <tr>
                <td colSpan={9} className="text-center text-muted">
                  No packages found
                </td>
              </tr>
            ) : (
              packages.map(pkg => (
                <tr key={pkg.id}>
                  <td>{pkg.name}</td>
                  <td>{pkg.description}</td>
                  <td>{pkg.storeLimit === -1 ? 'Unlimited' : pkg.storeLimit}</td>
                  <td>{pkg.productLimit === -1 ? 'Unlimited' : pkg.productLimit}</td>
                  <td>{pkg.userLimit === -1 ? 'Unlimited' : pkg.userLimit}</td>
                  <td>${pkg.price}</td>
                  <td>
                    <span className={`badge ${pkg.isSuperAdminPackage ? 'bg-warning' : 'bg-secondary'}`}>
                      {pkg.isSuperAdminPackage ? 'Yes' : 'No'}
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${pkg.isActive ? 'bg-success' : 'bg-secondary'}`}>
                      {pkg.isActive ? 'Yes' : 'No'}
                    </span>
                  </td>
                  <td>
                    <div className="btn-group" role="group">
                      <button 
                        className="btn btn-primary btn-sm"
                        onClick={() => handleEditPackage(pkg)}
                      >
                        Edit
                      </button>
                      <button 
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDeletePackage(pkg.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Create Package Modal */}
      {showCreateModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Create New Package</h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => setShowCreateModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Package Name</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Enter package name"
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Description</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Enter package description"
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-3 mb-3">
                    <label className="form-label">Store Limit</label>
                    <input
                      type="number"
                      className="form-control"
                      value={formData.storeLimit}
                      onChange={(e) => setFormData({ ...formData, storeLimit: parseInt(e.target.value) || 0 })}
                      placeholder="0 for unlimited"
                    />
                  </div>
                  <div className="col-md-3 mb-3">
                    <label className="form-label">Product Limit</label>
                    <input
                      type="number"
                      className="form-control"
                      value={formData.productLimit}
                      onChange={(e) => setFormData({ ...formData, productLimit: parseInt(e.target.value) || 0 })}
                      placeholder="0 for unlimited"
                    />
                  </div>
                  <div className="col-md-3 mb-3">
                    <label className="form-label">User Limit</label>
                    <input
                      type="number"
                      className="form-control"
                      value={formData.userLimit}
                      onChange={(e) => setFormData({ ...formData, userLimit: parseInt(e.target.value) || 0 })}
                      placeholder="0 for unlimited"
                    />
                  </div>
                  <div className="col-md-3 mb-3">
                    <label className="form-label">Price</label>
                    <input
                      type="number"
                      step="0.01"
                      className="form-control"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                      placeholder="0.00"
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-check">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        checked={formData.isSuperAdminPackage}
                        onChange={(e) => setFormData({ ...formData, isSuperAdminPackage: e.target.checked })}
                      />
                      <label className="form-check-label">Super Admin Package</label>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-check">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        checked={formData.isActive}
                        onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                      />
                      <label className="form-check-label">Active</label>
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={() => setShowCreateModal(false)}
                >
                  Cancel
                </button>
                <button 
                  type="button" 
                  className="btn btn-primary"
                  onClick={handleCreatePackage}
                >
                  Create Package
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Package Modal */}
      {showEditModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit Package</h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => setShowEditModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Package Name</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Enter package name"
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Description</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Enter package description"
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-3 mb-3">
                    <label className="form-label">Store Limit</label>
                    <input
                      type="number"
                      className="form-control"
                      value={formData.storeLimit}
                      onChange={(e) => setFormData({ ...formData, storeLimit: parseInt(e.target.value) || 0 })}
                      placeholder="0 for unlimited"
                    />
                  </div>
                  <div className="col-md-3 mb-3">
                    <label className="form-label">Product Limit</label>
                    <input
                      type="number"
                      className="form-control"
                      value={formData.productLimit}
                      onChange={(e) => setFormData({ ...formData, productLimit: parseInt(e.target.value) || 0 })}
                      placeholder="0 for unlimited"
                    />
                  </div>
                  <div className="col-md-3 mb-3">
                    <label className="form-label">User Limit</label>
                    <input
                      type="number"
                      className="form-control"
                      value={formData.userLimit}
                      onChange={(e) => setFormData({ ...formData, userLimit: parseInt(e.target.value) || 0 })}
                      placeholder="0 for unlimited"
                    />
                  </div>
                  <div className="col-md-3 mb-3">
                    <label className="form-label">Price</label>
                    <input
                      type="number"
                      step="0.01"
                      className="form-control"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                      placeholder="0.00"
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-check">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        checked={formData.isSuperAdminPackage}
                        onChange={(e) => setFormData({ ...formData, isSuperAdminPackage: e.target.checked })}
                      />
                      <label className="form-check-label">Super Admin Package</label>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-check">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        checked={formData.isActive}
                        onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                      />
                      <label className="form-check-label">Active</label>
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={() => setShowEditModal(false)}
                >
                  Cancel
                </button>
                <button 
                  type="button" 
                  className="btn btn-primary"
                  onClick={handleUpdatePackage}
                >
                  Update Package
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
