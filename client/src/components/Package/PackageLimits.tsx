import React, { useState, useEffect } from 'react';
import { getUserPackageLimits, IPackageLimits } from '@/services/packageService';
import { ProgressBar,Card } from 'react-bootstrap';
import { date } from 'yup';


export const PackageLimits: React.FC = () => {
  const [limits, setLimits] = useState<IPackageLimits | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLimits();
  }, []);

  const loadLimits = async () => {
    try {
      const data = await getUserPackageLimits();
      const cleanData = data.data
      setLimits(cleanData as any);
    } catch (error) {
      console.error('Error loading package limits:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card className="p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            <div className="h-3 bg-gray-200 rounded"></div>
            <div className="h-3 bg-gray-200 rounded w-5/6"></div>
          </div>
        </div>
      </Card>
    );
  }

  if (!limits) {
    return (
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Package Limits</h3>
        <p className="text-gray-600">Unable to load package limits.</p>
      </Card>
    );
  }

  const getProgressPercentage = (current: number, limit: number) => {
    if (limit === -1) {return 0;} // Unlimited
    if (limit === 0) {return 100;} // No limit (0 means no access)
    return Math.min((current / limit) * 100, 100);
  };

  const getStatusColor = (current: number, limit: number) => {
    if (limit === -1) {return 'text-green-600';} // Unlimited
    if (limit === 0) {return 'text-red-600';} // No access
    const percentage = (current / limit) * 100;
    if (percentage >= 90) {return 'text-red-600';}
    if (percentage >= 70) {return 'text-yellow-600';}
    return 'text-green-600';
  };

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Package Limits</h3>
      
      <div className="space-y-6">
        {/* Store Limits */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="font-medium">Stores</span>
            <span className={`text-sm ${getStatusColor(limits.currentStoreCount, limits.storeLimit)}`}>
              {limits.currentStoreCount} / {limits.storeLimit === -1 ? '∞' : limits.storeLimit}
            </span>
          </div>
          {limits.storeLimit !== -1 && limits.storeLimit !== 0 && (
            <ProgressBar 
              now={getProgressPercentage(limits.currentStoreCount, limits.storeLimit)} 
              className="h-2"
            />
          )}
          {limits.storeLimit === 0 && (
            <p className="text-sm text-red-600">No store creation allowed</p>
          )}
          {limits.storeLimit === -1 && (
            <p className="text-sm text-green-600">Unlimited stores</p>
          )}
        </div>

        {/* Product Limits */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="font-medium">Products</span>
            <span className={`text-sm ${getStatusColor(limits.currentProductCount, limits.productLimit)}`}>
              {limits.currentProductCount} / {limits.productLimit === -1 ? '∞' : limits.productLimit}
            </span>
          </div>
          {limits.productLimit !== -1 && limits.productLimit !== 0 && (
            <ProgressBar 
              now={getProgressPercentage(limits.currentProductCount, limits.productLimit)} 
              className="h-2"
            />
          )}
          {limits.productLimit === 0 && (
            <p className="text-sm text-red-600">No product creation allowed</p>
          )}
          {limits.productLimit === -1 && (
            <p className="text-sm text-green-600">Unlimited products</p>
          )}
        </div>

        {/* User Limits (for super admins) */}
        {limits.isSuperAdmin && (
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium">Users</span>
              <span className={`text-sm ${getStatusColor(limits.currentUserCount, limits.userLimit)}`}>
                {limits.currentUserCount} / {limits.userLimit === -1 ? '∞' : limits.userLimit}
              </span>
            </div>
            {limits.userLimit !== -1 && limits.userLimit !== 0 && (
              <ProgressBar 
                now={getProgressPercentage(limits.currentUserCount, limits.userLimit)}
                className="h-2"
              />
            )}
            {limits.userLimit === 0 && (
              <p className="text-sm text-red-600">No user creation allowed</p>
            )}
            {limits.userLimit === -1 && (
              <p className="text-sm text-green-600">Unlimited users</p>
            )}
          </div>
        )}

        {/* Status Indicators */}
        <div className="pt-4 border-t">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <div className={`w-3 h-3 rounded-full mr-2 ${limits.canCreateStore ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span className="text-sm">Can Create Stores</span>
            </div>
            <div className="flex items-center">
              <div className={`w-3 h-3 rounded-full mr-2 ${limits.canCreateProduct ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span className="text-sm">Can Create Products</span>
            </div>
            {limits.isSuperAdmin && (
              <div className="flex items-center">
                <div className={`w-3 h-3 rounded-full mr-2 ${limits.canCreateUser ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span className="text-sm">Can Create Users</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};





