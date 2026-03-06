// Auto-generated View Model for Comments Page
export interface Comment {
  id: string;
  text: string;
  rating: number;
  user: {
    id: string;
    name: string;
  };
  createdAt: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  images: Array<{ imageUrl: string }>;
}

export interface ICommentsPageViewModel {
    // Add properties for Comments view model
}
