export interface ProfileViewModel {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  bio: string;
  role: string;
  status: 'Active' | 'Inactive'; // Assuming status logic
  avatarUrl?: string; // Future proofing
  stats: {
    ordersCount: number;
    favoritesCount: number;
    reviewsCount: number;
    rating: number;
  };
}

export const defaultProfileData: ProfileViewModel = {
  id: '',
  name: 'Unknown User',
  email: 'no-email@example.com',
  phone: 'N/A',
  address: 'N/A',
  bio: 'No biography available.',
  role: 'Guest',
  status: 'Inactive',
  stats: {
    ordersCount: 0,
    favoritesCount: 0,
    reviewsCount: 0,
    rating: 0,
  }
};
