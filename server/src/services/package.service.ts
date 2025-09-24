import db from "../models";

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

    const packageData = userPackage.get('Package') as any;
    
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
export const getAllPackages = async (): Promise<any[]> => {
  try {
    const packages = await db.Package.findAll({
      where: { isActive: true },
      order: [['price', 'ASC']]
    });

    return packages;
  } catch (error) {
    console.error('Error getting packages:', error);
    throw error;
  }
};

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
