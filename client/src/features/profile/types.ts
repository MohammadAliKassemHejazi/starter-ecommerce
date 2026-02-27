export interface ProfileViewModel {
  id: string;
  displayName: string;
  email: string;
  phoneNumber: string;
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
