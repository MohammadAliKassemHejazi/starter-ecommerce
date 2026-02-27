import { ProfileViewModel } from './types';
import { UserState } from '@/interfaces/types/store/slices/userSlices.types';

export const mapUserToProfile = (user: UserState): ProfileViewModel => {
  return {
    id: user.id || '',
    displayName: user.name || 'User Name',
    email: user.email || 'user@example.com',
    phoneNumber: user.phone || '',
    bio: user.bio || '',
    role: user.roles && user.roles.length > 0 ? user.roles[0].name : 'User',
    status: user.isAuthenticated ? 'Active' : 'Inactive', // simplistic logic for now
    stats: {
      ordersCount: 24, // Hardcoded in original component
      favoritesCount: 156, // Hardcoded in original component
      reviewsCount: 8, // Hardcoded in original component
      rating: 4.8, // Hardcoded in original component
    }
  };
};
