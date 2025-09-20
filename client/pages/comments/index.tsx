import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import Layout from '@/components/Layouts/Layout';
import protectedRoute from '@/components/protectedRoute';
import Swal from 'sweetalert2';

const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 2000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.addEventListener('mouseenter', Swal.stopTimer);
    toast.addEventListener('mouseleave', Swal.resumeTimer);
  },
});

interface Comment {
  id: string;
  text: string;
  rating: number;
  user: {
    id: string;
    name: string;
  };
  createdAt: string;
}

interface Product {
  id: string;
  name: string;
  price: number;
  images: Array<{ imageUrl: string }>;
}

const CommentsPage = () => {
  const router = useRouter();
  const { productId } = router.query;
  const [comments, setComments] = useState<Comment[]>([]);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState({
    text: '',
    rating: 5
  });

    const fetchComments = useCallback(async () => {
    try {
      const response = await fetch(`/api/comments?productId=${productId}`);
      if (response.ok) {
        const data = await response.json();
        setComments(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setLoading(false);
    }
  }, [productId]);

  const fetchProduct = useCallback(async () => {
    try {
      const response = await fetch(`/api/shop/${productId}`);
      if (response.ok) {
        const data = await response.json();
        setProduct(data.data);
      }
    } catch (error) {
      console.error('Error fetching product:', error);
    }
  }, [productId]);

  useEffect(() => {
    if (productId) {
      fetchComments();
      fetchProduct();
    }
  }, [productId, fetchComments, fetchProduct]);



  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newComment.text.trim()) {
      Toast.fire({
        icon: 'error',
        title: 'Please enter a comment',
      });
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId,
          text: newComment.text,
          rating: newComment.rating
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setComments([data.data, ...comments]);
        setNewComment({ text: '', rating: 5 });
        Toast.fire({
          icon: 'success',
          title: 'Comment added successfully',
        });
      } else {
        throw new Error('Failed to add comment');
      }
    } catch (error) {
      console.error('Error adding comment:', error);
      Toast.fire({
        icon: 'error',
        title: 'Failed to add comment',
      });
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

  if (loading) {
    return (
      <Layout>
        <div className="container mt-5">
          <div className="text-center">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mt-5">
        <div className="row">
          <div className="col-12">
            <h1 className="mb-4">Product Reviews</h1>
            
            {product && (
              <div className="card mb-4">
                <div className="card-body">
                  <div className="row">
                    <div className="col-md-3">
                      {product.images && product.images.length > 0 && (
                        <Image
                          src={`${process.env.NEXT_PUBLIC_BASE_URL_Images}${product.images[0].imageUrl}`}
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
            )}

            {/* Add Comment Form */}
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

            {/* Comments List */}
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
                              <h6 className="mb-1">{comment.user.name}</h6>
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
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default protectedRoute(CommentsPage);
