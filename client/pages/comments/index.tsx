import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { PageLayout } from '@/components/UI/PageComponents';
import { usePageData } from '@/hooks/usePageData';
import { showToast } from '@/components/UI/PageComponents/ToastConfig';
import ProtectedRoute from '@/components/protectedRoute';
import { getImageUrl } from '@/utils/imageUrl';
import { getComments, addComment, Comment } from '@/services/commentService';
import { requestProductById } from '@/services/shopService';

interface Product {
  id: string;
  name: string;
  price: number;
  productImages?: Array<{ imageUrl: string }>;
}

const CommentsPage = () => {
  const router = useRouter();
  const { productId } = router.query;
  const { isAuthenticated } = usePageData();
  const [comments, setComments] = useState<Comment[]>([]);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState({
    text: '',
    rating: 5
  });

  const fetchComments = useCallback(async () => {
    try {
      const response = await getComments(productId as string);
      setComments(response.data?.items || []);
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setLoading(false);
    }
  }, [productId]);

  const fetchProduct = useCallback(async () => {
    try {
      const response = await requestProductById(productId as string);
      setProduct(response.data as unknown as Product);
    } catch (error) {
      console.error('Error fetching product:', error);
    }
  }, [productId]);

  useEffect(() => {
    // No ?productId= in the URL (e.g. direct navigation to /comments) --
    // there is nothing to load, so stop the spinner instead of hanging
    // forever waiting for effects that never fire.
    if (!router.isReady) {
      return;
    }
    if (!productId) {
      setLoading(false);
      return;
    }
    fetchComments();
    fetchProduct();
  }, [router.isReady, productId, fetchComments, fetchProduct]);

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newComment.text.trim()) {
      showToast.error('Please enter a comment');
      return;
    }

    try {
      const data = await addComment(productId as string, newComment.text, newComment.rating);
      setComments([data.data, ...comments]);
      setNewComment({ text: '', rating: 5 });
      showToast.success('Comment added successfully');
    } catch (error) {
      console.error('Error adding comment:', error);
      showToast.error('Failed to add comment');
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span
        key={i}
        className={`bi bi-star${i < rating ? '-fill text-warning' : ''}`}
      ></span>
    ));
  };

  const ProductInfo = () => (
    product && (
      <div className="card mb-4">
        <div className="card-body">
          <div className="row">
            <div className="col-md-3">
              {product.productImages && product.productImages.length > 0 && (
                <Image
                  src={getImageUrl(product.productImages[0].imageUrl)}
                  alt={product.name}
                  width={200}
                  height={200}
                  className="img-fluid rounded"
                />
              )}
            </div>
            <div className="col-md-9">
              <h3>{product.name}</h3>
              <p className="text-muted">${product.price}</p>
            </div>
          </div>
        </div>
      </div>
    )
  );

  const CommentForm = () => (
    <div className="card mb-4">
      <div className="card-header">
        <h5>Add a Review</h5>
      </div>
      <div className="card-body">
        <form onSubmit={handleSubmitComment}>
          <div className="mb-3">
            <label className="form-label">Rating</label>
            <div className="rating">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className={`btn btn-link p-0 me-1 ${
                    star <= newComment.rating ? 'text-warning' : 'text-muted'
                  }`}
                  onClick={() => setNewComment({ ...newComment, rating: star })}
                >
                  <i className="bi bi-star-fill"></i>
                </button>
              ))}
            </div>
          </div>
          <div className="mb-3">
            <label htmlFor="commentText" className="form-label">Comment</label>
            <textarea
              id="commentText"
              className="form-control"
              rows={4}
              value={newComment.text}
              onChange={(e) => setNewComment({ ...newComment, text: e.target.value })}
              placeholder="Write your review here..."
              required
            />
          </div>
          <button type="submit" className="btn btn-primary">
            Submit Review
          </button>
        </form>
      </div>
    </div>
  );

  const CommentsList = () => (
    <div className="card">
      <div className="card-header">
        <h5>Reviews ({comments.length})</h5>
      </div>
      <div className="card-body">
        {comments.length === 0 ? (
          <p className="text-muted">No reviews yet. Be the first to review this product!</p>
        ) : (
          <div className="row">
            {comments.map((comment) => (
              <div key={comment.id} className="col-12 mb-3">
                <div className="border-bottom pb-3">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <div>
                      <h6 className="mb-1">{comment.user?.name || 'Anonymous'}</h6>
                      <div className="text-warning">
                        {renderStars(comment.rating)}
                      </div>
                    </div>
                    <small className="text-muted">
                      {new Date(comment.createdAt).toLocaleDateString()}
                    </small>
                  </div>
                  <p className="mb-0">{comment.text}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  if (loading) {
    return (
      <PageLayout title="Product Reviews" protected={true}>
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </PageLayout>
    );
  }

  if (!productId) {
    return (
      <PageLayout title="Product Reviews" protected={true}>
        <div className="text-center text-muted py-5">
          <p className="mb-0">No product selected. Open reviews from a product page to see and add reviews.</p>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout title="Product Reviews" protected={true}>
      <ProductInfo />
      <CommentForm />
      <CommentsList />
    </PageLayout>
  );
};

export default function ProtectedCommentsPage() {
  return (
    <ProtectedRoute>
      <CommentsPage />
    </ProtectedRoute>
  );
}