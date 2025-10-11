import db from "../models";
import { CustomError } from '../utils/customError';

export interface IPackageLimits {
  storeLimit: number;
  productLimit: number;
  userLimit: number;
  isSuperAdmin: boolean;
}

export interface IUserPackageInfo {
  packageId: string;
  packageName: string;
  limits: IPackageLimits;
  isActive: boolean;
  endDate: Date | null;
}

// Get all packages
export const getAllPackages = async () => {
  try {
    const packages = await db.Package.findAll({
      where: { isActive: true },
      order: [['price', 'ASC']]
    });
    return packages;
  } catch (error) {
    console.error('Error in getAllPackages service:', error);
    throw new CustomError('Failed to fetch packages', 'NOT_FOUND', 500);
  }
};

// Get package by ID
export const getPackageById = async (id: string) => {
  try {
    const packageData = await db.Package.findByPk(id);
    if (!packageData) {
      throw new CustomError('Package not found', 'NOT_FOUND', 404);
    }
    return packageData;
  } catch (error) {
    console.error('Error in getPackageById service:', error);
    if (error instanceof CustomError) {
      throw error;
    }
    throw new CustomError('Failed to fetch package', 'NOT_FOUND', 500);
  }
};

// Create new package
export const createPackage = async (packageData: any) => {
  try {
    const newPackage = await db.Package.create(packageData);
    return newPackage;
  } catch (error) {
    console.error('Error in createPackage service:', error);
    throw new CustomError('Failed to create package', 'NOT_FOUND', 500);
  }
};

// Update package
export const updatePackage = async (id: string, packageData: any) => {
  try {
    const packageToUpdate = await db.Package.findByPk(id);
    if (!packageToUpdate) {
      throw new CustomError('Package not found', 'NOT_FOUND', 404);
    }

    await packageToUpdate.update(packageData);
    return packageToUpdate;
  } catch (error) {
    console.error('Error in updatePackage service:', error);
    if (error instanceof CustomError) {
      throw error;
    }
    throw new CustomError('Failed to update package', 'NOT_FOUND', 500);
  }
};

// Delete package
export const deletePackage = async (id: string) => {
  try {
    const packageToDelete = await db.Package.findByPk(id);
    if (!packageToDelete) {
      throw new CustomError('Package not found', 'NOT_FOUND', 404);
    }

    // Check if package is in use by any users
    const userPackages = await db.UserPackage.findAll({
      where: { packageId: id }
    });

    if (userPackages.length > 0) {
      throw new CustomError('Cannot delete package as it is currently in use', 'NOT_FOUND', 400);
    }

    await packageToDelete.destroy();
    return true;
  } catch (error) {
    console.error('Error in deletePackage service:', error);
    if (error instanceof CustomError) {
      throw error;
    }
    throw new CustomError('Failed to delete package', 'NOT_FOUND', 500);
  }
};

// Activate package for user
export const activatePackage = async (userId: string, packageId: string) => {
  try {
    // Start transaction
    const transaction = await db.sequelize.transaction();

    try {
      // Get package
      const packageData = await db.Package.findByPk(packageId, { transaction });
      if (!packageData) {
        throw new CustomError('Package not found', 'NOT_FOUND', 404);
      }

      // Check if user exists
      const user = await db.User.findByPk(userId, { transaction });
      if (!user) {
        throw new CustomError('User not found', 'NOT_FOUND', 404);
      }

      // Check if user already has an active package
      const existingUserPackage = await db.UserPackage.findOne({
        where: { 
          userId,
          isActive: true
        },
        transaction
      });

      // If user has an active package, deactivate it
      if (existingUserPackage) {
        await existingUserPackage.update({ isActive: false }, { transaction });
      }

      // Create new user package
      await db.UserPackage.create({
        userId,
        packageId,
        isActive: true,
        startDate: new Date(),
        // Set end date if needed (e.g., for subscription-based packages)
        // endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      }, { transaction });

      // Commit transaction
      await transaction.commit();
      return true;
    } catch (error) {
      // Rollback transaction on error
      await transaction.rollback();
      throw error;
    }
  } catch (error) {
    console.error('Error in activatePackage service:', error);
    if (error instanceof CustomError) {
      throw error;
    }
    throw new CustomError('Failed to activate package', 'NOT_FOUND', 500);
  }
};

// Get user's current active package
export const getUserActivePackage = async (userId: string): Promise<IUserPackageInfo | null> => {
  try {
    const userPackage = await db.UserPackage.findOne({
      where: {
        userId,
        isActive: true
      },
      include: [{
        model: db.Package,
        where: { isActive: true }
      }]
    });

    if (!userPackage) {
      return null;
    }

 const plainUserPackage = userPackage.get({ plain: true });
    const packageData = plainUserPackage.Package; // now a clean object
    
    return {
      packageId: packageData.id,
      packageName: packageData.name,
      limits: {
        storeLimit: packageData.storeLimit,
        productLimit: packageData.productLimit,
        userLimit: packageData.userLimit,
        isSuperAdmin: packageData.isSuperAdminPackage
      },
      isActive: userPackage.isActive,
      endDate: userPackage.endDate
    };
  } catch (error) {
    console.error('Error getting user active package:', error);
    return null;
  }
};

// Check if user can create more stores
export const canCreateStore = async (userId: string): Promise<boolean> => {
  try {
    const packageInfo = await getUserActivePackage(userId);
    
    if (!packageInfo) {
      return false; // No package = no store creation
    }

    if (packageInfo.limits.storeLimit === -1) {
      return true; // Unlimited stores
    }

    const currentStoreCount = await db.Store.count({
      where: { userId }
    });

    return currentStoreCount < packageInfo.limits.storeLimit;
  } catch (error) {
    console.error('Error checking store creation limit:', error);
    return false;
  }
};

// Check if user can create more products
export const canCreateProduct = async (userId: string): Promise<boolean> => {
  try {
    const packageInfo = await getUserActivePackage(userId);
    
    if (!packageInfo) {
      return false; // No package = no product creation
    }

    if (packageInfo.limits.productLimit === -1) {
      return true; // Unlimited products
    }

    const currentProductCount = await db.Shop.count({
      where: { ownerId: userId }
    });

    return currentProductCount < packageInfo.limits.productLimit;
  } catch (error) {
    console.error('Error checking product creation limit:', error);
    return false;
  }
};

// Check if user can create more users (super admin only)
export const canCreateUser = async (userId: string): Promise<boolean> => {
  try {
    const packageInfo = await getUserActivePackage(userId);
    
    if (!packageInfo || !packageInfo.limits.isSuperAdmin) {
      return false; // Not a super admin
    }

    if (packageInfo.limits.userLimit === -1) {
      return true; // Unlimited users
    }

    const currentUserCount = await db.User.count({
      where: { createdById: userId }
    });

    return currentUserCount < packageInfo.limits.userLimit;
  } catch (error) {
    console.error('Error checking user creation limit:', error);
    return false;
  }
};

// Check if user is super admin
export const isSuperAdmin = async (userId: string): Promise<boolean> => {
  try {
    const packageInfo = await getUserActivePackage(userId);
    return packageInfo?.limits.isSuperAdmin || false;
  } catch (error) {
    console.error('Error checking super admin status:', error);
    return false;
  }
};

// Assign package to user
export const assignPackageToUser = async (
  userId: string, 
  packageId: string, 
  assignedById: string,
  endDate?: Date
): Promise<any> => {
  try {
    // Deactivate current package if exists
    await db.UserPackage.update(
      { isActive: false },
      { where: { userId, isActive: true } }
    );

    // Create new package assignment
    const userPackage = await db.UserPackage.create({
      userId,
      packageId,
      startDate: new Date(),
      createdById: assignedById,
      endDate
    });

    return userPackage;
  } catch (error) {
    console.error('Error assigning package to user:', error);
    throw error;
  }
};

// Get all available packages
// export const getAllPackages = async (): Promise<any[]> => {
//   try {
//     const packages = await db.Package.findAll({
//       where: { isActive: true },
//       order: [['price', 'ASC']]
//     });

//     return packages;
//   } catch (error) {
//     console.error('Error getting packages:', error);
//     throw error;
//   }
// };

// Create default packages (free, basic, premium)
export const createDefaultPackages = async (): Promise<void> => {
  try {
    const defaultPackages = [
      {
        name: 'Free',
        description: 'Basic package for shopping only',
        storeLimit: 0,
        categoryLimit: 0,
        productLimit: 0,
        userLimit: 0,
        isSuperAdminPackage: false,
        price: 0.00
      },
      {
        name: 'Basic',
        description: 'Basic package for small businesses',
        storeLimit: 1,
        categoryLimit: 5,
        productLimit: 50,
        userLimit: 0,
        isSuperAdminPackage: false,
        price: 9.99
      },
      {
        name: 'Premium',
        description: 'Premium package with user management',
        storeLimit: 5,
        categoryLimit: 20,
        productLimit: 500,
        userLimit: 10,
        isSuperAdminPackage: true,
        price: 29.99
      },
      {
        name: 'Enterprise',
        description: 'Enterprise package with unlimited features',
        storeLimit: -1, // Unlimited
        categoryLimit: -1,
        productLimit: -1,
        userLimit: -1,
        isSuperAdminPackage: true,
        price: 99.99
      }
    ];

    for (const packageData of defaultPackages) {
      await db.Package.findOrCreate({
        where: { name: packageData.name },
        defaults: packageData
      });
    }
  } catch (error) {
    console.error('Error creating default packages:', error);
    throw error;
  }
};

// Get full package limits and usage info for the authenticated user
export const getUserPackageLimits = async (userId: string) => {
  try {
    // Get active package info
    const packageInfo = await getUserActivePackage(userId);

    if (!packageInfo) {
      // Return default "no package" limits
      return {
        canCreateStore: false,
        canCreateProduct: false,
        canCreateUser: false,
        isSuperAdmin: false,
        currentStoreCount: 0,
        currentProductCount: 0,
        currentUserCount: 0,
        storeLimit: 0,
        productLimit: 0,
        userLimit: 0,
        packageName: 'None',
        packageId: '',
        isActive: false,
        endDate: null
      };
    }


// Get current usage counts
const [currentStoreCount, currentProductCount, currentUserCount] = await Promise.all([
  db.Store.count({ where: {  userId } }),      
  db.Product.count({ where: {  ownerId : userId } }),   
  db.User.count({ where: { createdById: userId } })   // sub-users
]);

    // Compute permissions
    const canCreateStore = packageInfo.limits.storeLimit === -1 
      ? true 
      : currentStoreCount < packageInfo.limits.storeLimit;

    const canCreateProduct = packageInfo.limits.productLimit === -1 
      ? true 
      : currentProductCount < packageInfo.limits.productLimit;

    const canCreateUser = packageInfo.limits.isSuperAdmin 
      ? (packageInfo.limits.userLimit === -1 
          ? true 
          : currentUserCount < packageInfo.limits.userLimit)
      : false;

    return {
      canCreateStore,
      canCreateProduct,
      canCreateUser,
      isSuperAdmin: packageInfo.limits.isSuperAdmin,
      currentStoreCount,
      currentProductCount,
      currentUserCount,
      storeLimit: packageInfo.limits.storeLimit,
      productLimit: packageInfo.limits.productLimit,
      userLimit: packageInfo.limits.userLimit,
      packageName: packageInfo.packageName,
      packageId: packageInfo.packageId,
      isActive: packageInfo.isActive,
      endDate: packageInfo.endDate ? packageInfo.endDate.toISOString() : null
    };
  } catch (error) {
    console.error('Error in getUserPackageLimits service:', error);
    throw new CustomError('Failed to fetch package limits', 'INTERNAL_ERROR', 500);
  }
};
