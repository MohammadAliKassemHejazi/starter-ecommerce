import React, { useState, useEffect } from 'react';
import { assignPackageToUser, getUserPackageLimits, IPackageLimits } from '@/services/packageService';
import { getAllPackages, IPackage } from '@/services/packageService';

interface UserManagerProps {
  isSuperAdmin: boolean;
}

interface User {
  id: string;
  name: string;
  email: string;
  packages?: Array<{
    id: string;
    name: string;
    UserPackage: {
      startDate: string;
      endDate: string | null;
      isActive: boolean;
    };
  }>;
}

export const UserManager: React.FC<UserManagerProps> = ({ isSuperAdmin }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [packages, setPackages] = useState<IPackage[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedPackageId, setSelectedPackageId] = useState('');
  const [packageLimits, setPackageLimits] = useState<IPackageLimits | null>(null);

  useEffect(() => {
    if (isSuperAdmin) {
      loadData();
    }
  }, [isSuperAdmin]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [packagesData, limits] = await Promise.all([
        getAllPackages(),
        getUserPackageLimits()
      ]);
      setPackages(packagesData);
      setPackageLimits(limits);
      // TODO: Load users from API
      // const usersData = await getUsers();
      // setUsers(usersData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAssignPackage = async () => {
    if (!selectedUser || !selectedPackageId) return;

    try {
      await assignPackageToUser(selectedUser.id, selectedPackageId);
      setShowAssignModal(false);
      setSelectedUser(null);
      setSelectedPackageId('');
      loadData();
    } catch (error) {
      console.error('Error assigning package:', error);
    }
  };

  const handleAssignPackageClick = (user: User) => {
    setSelectedUser(user);
    setShowAssignModal(true);
  };

  if (!isSuperAdmin) {
    return (
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4">User Management</h2>
        <p className="text-gray-600">You don't have permission to manage users.</p>
      </div>
    );
  }

  if (!packageLimits?.canCreateUser) {
    return (
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4">User Management</h2>
        <div className="alert alert-warning">
          <h4>User Creation Limit Reached</h4>
          <p>You have reached your user creation limit ({packageLimits?.currentUserCount}/{packageLimits?.userLimit}).</p>
          <p>Please upgrade your package to create more users.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="h3 mb-0">User Management</h2>
        <div className="text-muted">
          Users: {packageLimits?.currentUserCount}/{packageLimits?.userLimit === -1 ? '∞' : packageLimits?.userLimit}
        </div>
      </div>

      <div className="table-responsive">
        <table className="table table-hover table-bordered">
          <thead className="table-dark">
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Current Package</th>
              <th>Package Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="text-center">
                  <div className="spinner-border" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center text-muted">
                  No users found
                </td>
              </tr>
            ) : (
              users.map(user => (
                <tr key={user.id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.packages?.[0]?.name || 'No Package'}</td>
                  <td>
                    <span className={`badge ${user.packages?.[0]?.UserPackage?.isActive ? 'bg-success' : 'bg-secondary'}`}>
                      {user.packages?.[0]?.UserPackage?.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td>
                    <button 
                      className="btn btn-primary btn-sm"
                      onClick={() => handleAssignPackageClick(user)}
                    >
                      Assign Package
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Assign Package Modal */}
      {showAssignModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Assign Package to {selectedUser?.name}</h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => setShowAssignModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Select Package</label>
                  <select
                    value={selectedPackageId}
                    onChange={(e) => setSelectedPackageId(e.target.value)}
                    className="form-select"
                  >
                    <option value="">Select a package</option>
                    {packages.map(pkg => (
                      <option key={pkg.id} value={pkg.id}>
                        {pkg.name} - ${pkg.price} 
                        {pkg.isSuperAdminPackage && ' (Super Admin)'}
                      </option>
                    ))}
                  </select>
                </div>
                
                {selectedPackageId && (
                  <div className="card">
                    <div className="card-header">
                      <h6 className="mb-0">Package Details</h6>
                    </div>
                    <div className="card-body">
                      {(() => {
                        const selectedPackage = packages.find(pkg => pkg.id === selectedPackageId);
                        return selectedPackage ? (
                          <div className="row">
                            <div className="col-md-6">
                              <p><strong>Name:</strong> {selectedPackage.name}</p>
                              <p><strong>Description:</strong> {selectedPackage.description}</p>
                              <p><strong>Price:</strong> ${selectedPackage.price}</p>
                            </div>
                            <div className="col-md-6">
                              <p><strong>Store Limit:</strong> {selectedPackage.storeLimit === -1 ? 'Unlimited' : selectedPackage.storeLimit}</p>
                              <p><strong>Product Limit:</strong> {selectedPackage.productLimit === -1 ? 'Unlimited' : selectedPackage.productLimit}</p>
                              <p><strong>User Limit:</strong> {selectedPackage.userLimit === -1 ? 'Unlimited' : selectedPackage.userLimit}</p>
                              <p><strong>Super Admin:</strong> {selectedPackage.isSuperAdminPackage ? 'Yes' : 'No'}</p>
                            </div>
                          </div>
                        ) : null;
                      })()}
                    </div>
                  </div>
                )}
              </div>
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={() => setShowAssignModal(false)}
                >
                  Cancel
                </button>
                <button 
                  type="button" 
                  className="btn btn-primary"
                  onClick={handleAssignPackage}
                  disabled={!selectedPackageId}
                >
                  Assign Package
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
