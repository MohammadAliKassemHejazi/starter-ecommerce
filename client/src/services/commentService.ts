import httpClient from "@/utils/httpClient";

export interface Comment {
  id: string;
  userId: string;
  productId: string;
  text: string;
  rating: number;
  createdAt: string;
  User?: {
    id: string;
    name: string;
  };
}

export interface CommentsResponse {
  success: boolean;
  data: {
    items: Comment[];
    total: number;
    page: number;
    pageSize: number;
  };
  message?: string;
}

export const getComments = async (productId: string, page = 1, limit = 5): Promise<CommentsResponse> => {
  const { data } = await httpClient.get<CommentsResponse>(
    `/comments?productId=${productId}&page=${page}&limit=${limit}`
  );
  return data;
};

export const addComment = async (productId: string, text: string, rating: number): Promise<any> => {
  const { data } = await httpClient.post('/comments', {
    productId,
    text,
    rating,
  });
  return data;
};
