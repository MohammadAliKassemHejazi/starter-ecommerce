import React, { useEffect, useState } from 'react';
import { getComments, Comment } from '@/services/commentService';
import { useAppSelector } from '@/store/store';
import Swal from 'sweetalert2';

interface CommentsListProps {
  productId: string;
  refreshTrigger?: number; // Prop to trigger refresh from parent
}

const CommentsList: React.FC<CommentsListProps> = ({ productId, refreshTrigger }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [total, setTotal] = useState(0);

  const fetchComments = async (pageNum: number, reset = false) => {
    if (!productId) {
      return;
    }
    setLoading(true);
    try {
      const response = await getComments(productId, pageNum, 5); // Limit 5 per load
      if (response.success) {
        const newComments = response.data.items;
        setTotal(response.data.total);

        if (reset) {
          setComments(newComments);
        } else {
          setComments(prev => [...prev, ...newComments]);
        }

        // Check if we have loaded all comments
        if ((pageNum * 5) >= response.data.total) {
          setHasMore(false);
        } else {
          setHasMore(true);
        }
      }
    } catch (error) {
      console.error("Failed to load comments", error);
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Failed to load comments!',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Initial load or refresh
    setPage(1);
    fetchComments(1, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId, refreshTrigger]);

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchComments(nextPage, false);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="comments-section mt-5">
      <h3 className="mb-4">Comments ({total})</h3>

      {comments.length === 0 && !loading ? (
        <p className="text-muted">No comments yet. Be the first to review!</p>
      ) : (
        <div className="comments-list">
          {comments.map((comment) => (
            <div key={comment.id} className="card mb-3 border-0 shadow-sm">
              <div className="card-body">
                <div className="d-flex justify-content-between mb-2">
                  <h6 className="card-subtitle mb-2 text-muted">
                    {comment.User?.name || 'Anonymous'}
                  </h6>
                  <small className="text-muted">{formatDate(comment.createdAt)}</small>
                </div>
                <div className="mb-2">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className={i < comment.rating ? "text-warning" : "text-muted"}>
                      ★
                    </span>
                  ))}
                </div>
                <p className="card-text">{comment.text}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {loading && <div className="text-center my-3"><div className="spinner-border text-primary" role="status"></div></div>}

      {hasMore && !loading && comments.length > 0 && (
        <div className="text-center mt-3">
          <button className="btn btn-outline-primary" onClick={handleLoadMore}>
            Load More
          </button>
        </div>
      )}
    </div>
  );
};

export default CommentsList;
