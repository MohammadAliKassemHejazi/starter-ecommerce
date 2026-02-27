import React, { useState, useEffect } from 'react';
import { NextPage } from 'next';
import { useSelector } from 'react-redux';
import { PageLayout } from '@/components/UI/PageComponents';
import ProtectedRoute from '@/components/protectedRoute';
import { useAppDispatch } from '@/store/store';
import { updateProfile, userSelector } from '@/store/slices/userSlice';
import { useToast } from '@/contexts/ToastContext';
import { mapUserToProfile } from '@/features/profile/utils';
import { ProfileViewModel } from '@/features/profile/types';

const ProfilePage: NextPage = () => {
  const user = useSelector(userSelector);
  const dispatch = useAppDispatch();
  const { showSuccess, showError } = useToast();

  // Use the mapper to get the view model
  const profileView: ProfileViewModel = mapUserToProfile(user);

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Local state for editing, initialized from the view model
  const [formData, setFormData] = useState({
    name: profileView.displayName,
    email: profileView.email,
    phone: profileView.phoneNumber,
    bio: profileView.bio,
  });

  // Sync form data when user/profileView changes and we're not editing
  useEffect(() => {
    if (!isEditing) {
      setFormData({
        name: profileView.displayName,
        email: profileView.email,
        phone: profileView.phoneNumber,
        bio: profileView.bio,
      });
    }
  }, [profileView.displayName, profileView.email, profileView.phoneNumber, profileView.bio, isEditing]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    if (!profileView.id) {
      showError('Error', 'User ID not found');
      return;
    }

    setIsSaving(true);
    try {
      await dispatch(updateProfile({
        id: profileView.id,
        ...formData
      })).unwrap();

      showSuccess('Success', 'Profile updated successfully');
      setIsEditing(false);
    } catch (error: any) {
      showError('Error', error.message || 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: profileView.displayName,
      email: profileView.email,
      phone: profileView.phoneNumber,
      bio: profileView.bio,
    });
    setIsEditing(false);
  };

  return (
    <PageLayout title="User Profile" subtitle="Manage your personal information" protected={true}>
      <div className="modern-profile-container">
        {/* Profile Header */}
        <div className="modern-profile-header">
          <div className="modern-profile-cover">
            <div className="modern-profile-cover-overlay"></div>
          </div>
          <div className="modern-profile-info">
            <div className="modern-profile-avatar">
              <div className="modern-profile-avatar-image">
                <i className="bi bi-person"></i>
              </div>
              <div className="modern-profile-avatar-badge">
                <i className="bi bi-check"></i>
              </div>
            </div>
            <div className="modern-profile-details">
              <h1 className="modern-profile-name">{profileView.displayName}</h1>
              <p className="modern-profile-email">{profileView.email}</p>
              <div className="modern-profile-badges">
                <span className="modern-profile-badge modern-profile-badge-role">
                  <i className="bi bi-shield-check"></i>
                  {profileView.role}
                </span>
                <span className="modern-profile-badge modern-profile-badge-status">
                  <i className="bi bi-circle-fill"></i>
                  {profileView.status}
                </span>
              </div>
            </div>
            <div className="modern-profile-actions">
              <button 
                className="modern-profile-btn modern-profile-btn-primary"
                onClick={() => setIsEditing(!isEditing)}
              >
                <i className="bi bi-pencil"></i>
                {isEditing ? 'Cancel' : 'Edit Profile'}
              </button>
              <button className="modern-profile-btn modern-profile-btn-secondary">
                <i className="bi bi-share"></i>
                Share Profile
              </button>
            </div>
          </div>
        </div>

        {/* Profile Stats */}
        <div className="modern-profile-stats">
          <div className="modern-profile-stat">
            <div className="modern-profile-stat-number">{profileView.stats.ordersCount}</div>
            <div className="modern-profile-stat-label">Orders</div>
          </div>
          <div className="modern-profile-stat">
            <div className="modern-profile-stat-number">{profileView.stats.favoritesCount}</div>
            <div className="modern-profile-stat-label">Favorites</div>
          </div>
          <div className="modern-profile-stat">
            <div className="modern-profile-stat-number">{profileView.stats.reviewsCount}</div>
            <div className="modern-profile-stat-label">Reviews</div>
          </div>
          <div className="modern-profile-stat">
            <div className="modern-profile-stat-number">{profileView.stats.rating}</div>
            <div className="modern-profile-stat-label">Rating</div>
          </div>
        </div>

        <div className="row">
          <div className="col-lg-8">
            {/* Personal Information */}
            <div className="modern-profile-card">
              <div className="modern-profile-card-header">
                <h2 className="modern-profile-card-title">Personal Information</h2>
                <p className="modern-profile-card-subtitle">Update your personal details and preferences</p>
              </div>
              <div className="modern-profile-card-body">
                <div className="row">
                  <div className="col-md-6">
                    <div className="modern-form-group">
                      <label className="modern-form-label">Full Name</label>
                      <input
                        type="text"
                        name="name"
                        className="modern-form-input"
                        value={formData.name}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="modern-form-group">
                      <label className="modern-form-label">Email Address</label>
                      <input
                        type="email"
                        name="email"
                        className="modern-form-input"
                        value={formData.email}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                      />
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6">
                    <div className="modern-form-group">
                      <label className="modern-form-label">Phone Number</label>
                      <input
                        type="tel"
                        name="phone"
                        className="modern-form-input"
                        value={formData.phone}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="modern-form-group">
                      <label className="modern-form-label">Role</label>
                      <input
                        type="text"
                        className="modern-form-input"
                        value={profileView.role}
                        disabled
                      />
                    </div>
                  </div>
                </div>
                <div className="modern-form-group">
                  <label className="modern-form-label">Bio</label>
                  <textarea
                    name="bio"
                    className="modern-form-textarea"
                    value={formData.bio}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    placeholder="Tell us about yourself..."
                  />
                </div>
                {isEditing && (
                  <div className="modern-form-actions">
                    <button 
                      className="modern-btn modern-btn-secondary"
                      onClick={handleCancel}
                    >
                      <i className="bi bi-x"></i>
                      Cancel
                    </button>
                    <button 
                      className="modern-btn modern-btn-primary"
                      onClick={handleSave}
                      disabled={isSaving}
                    >
                      {isSaving ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          Saving...
                        </>
                      ) : (
                        <>
                          <i className="bi bi-check"></i>
                          Save Changes
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="modern-profile-activity">
              <h3 className="modern-profile-section-title">Recent Activity</h3>
              <div className="modern-activity-list">
                <div className="modern-activity-item">
                  <div className="modern-activity-icon">
                    <i className="bi bi-cart"></i>
                  </div>
                  <div className="modern-activity-content">
                    <h4 className="modern-activity-title">Order #12345 completed</h4>
                    <p className="modern-activity-time">2 hours ago</p>
                  </div>
                </div>
                <div className="modern-activity-item">
                  <div className="modern-activity-icon">
                    <i className="bi bi-heart"></i>
                  </div>
                  <div className="modern-activity-content">
                    <h4 className="modern-activity-title">Added product to favorites</h4>
                    <p className="modern-activity-time">1 day ago</p>
                  </div>
                </div>
                <div className="modern-activity-item">
                  <div className="modern-activity-icon">
                    <i className="bi bi-star"></i>
                  </div>
                  <div className="modern-activity-content">
                    <h4 className="modern-activity-title">Left a review</h4>
                    <p className="modern-activity-time">3 days ago</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-4">
            {/* Quick Actions */}
            <div className="modern-profile-card">
              <div className="modern-profile-card-header">
                <h2 className="modern-profile-card-title">Quick Actions</h2>
              </div>
              <div className="modern-profile-card-body">
                <div className="modern-quick-actions">
                  <button className="modern-quick-action-btn">
                    <i className="bi bi-cart"></i>
                    <span>View Orders</span>
                  </button>
                  <button className="modern-quick-action-btn">
                    <i className="bi bi-heart"></i>
                    <span>My Favorites</span>
                  </button>
                  <button className="modern-quick-action-btn">
                    <i className="bi bi-star"></i>
                    <span>My Reviews</span>
                  </button>
                  <button className="modern-quick-action-btn">
                    <i className="bi bi-gear"></i>
                    <span>Account Settings</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Account Security */}
            <div className="modern-profile-card">
              <div className="modern-profile-card-header">
                <h2 className="modern-profile-card-title">Account Security</h2>
              </div>
              <div className="modern-profile-card-body">
                <div className="modern-quick-actions">
                  <button className="modern-quick-action-btn">
                    <i className="bi bi-key"></i>
                    <span>Change Password</span>
                  </button>
                  <button className="modern-quick-action-btn">
                    <i className="bi bi-shield-check"></i>
                    <span>Two-Factor Auth</span>
                  </button>
                  <button className="modern-quick-action-btn">
                    <i className="bi bi-person-check"></i>
                    <span>Verify Identity</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default function ProtectedProfilePage() {
  return (
    <ProtectedRoute>
      <ProfilePage />
    </ProtectedRoute>
  );
}
