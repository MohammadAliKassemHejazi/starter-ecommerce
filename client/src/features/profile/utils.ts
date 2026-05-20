import { ProfileViewModel } from './types';
import { UserState } from '@/interfaces/types/store/slices/userSlices.types';

export const mapUserToProfile = (user: UserState): ProfileViewModel => {
  return {
    id: user.id || '',
    name: user.name || 'User Name',
    email: user.email || 'user@example.com',
    phone: user.phone || '',
    address: user.address || '',
    bio: user.bio || '',
    role: user.roles && user.roles.length > 0 ? user.roles[0].name : 'User',
    status: user.isAuthenticated ? 'Active' : 'Inactive', // simplistic logic for now
    stats: {
      ordersCount: 0,
      favoritesCount: 0,
      reviewsCount: 0,
      rating: 0,
    }
  };
};
