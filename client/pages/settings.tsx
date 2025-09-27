import React, { useState } from 'react';
import { NextPage } from 'next';
import { useSelector } from 'react-redux';
import { PageLayout } from '@/components/UI/PageComponents';
import ProtectedRoute from '@/components/protectedRoute';

const SettingsPage: NextPage = () => {
  const user = useSelector((state: any) => state.user);
  const [activeTab, setActiveTab] = useState('general');
  const [settings, setSettings] = useState({
    // General Settings
    language: 'en',
    timezone: 'UTC',
    dateFormat: 'MM/DD/YYYY',
    
    // Notification Settings
    emailNotifications: true,
    pushNotifications: true,
    orderUpdates: true,
    promotions: false,
    securityAlerts: true,
    
    // Privacy Settings
    profileVisibility: 'public',
    showEmail: false,
    showPhone: false,
    allowMessages: true,
    
    // Security Settings
    twoFactorAuth: false,
    loginAlerts: true,
    sessionTimeout: 30,
  });

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSaveSettings = () => {
    // TODO: Implement save functionality
    console.log('Saving settings:', settings);
  };

  const tabs = [
    { id: 'general', label: 'General', icon: 'bi-gear' },
    { id: 'notifications', label: 'Notifications', icon: 'bi-bell' },
    { id: 'privacy', label: 'Privacy', icon: 'bi-shield' },
    { id: 'security', label: 'Security', icon: 'bi-lock' },
  ];

  const renderGeneralSettings = () => (
    <div className="modern-settings-content">
      <div className="modern-settings-section">
        <h3 className="modern-settings-section-title">Language & Region</h3>
        <div className="modern-settings-list">
          <div className="modern-setting-item">
            <div className="modern-setting-info">
              <h4 className="modern-setting-title">Language</h4>
              <p className="modern-setting-description">Choose your preferred language for the interface</p>
            </div>
            <div className="modern-setting-control">
              <select 
                className="modern-form-select"
                value={settings.language}
                onChange={(e) => handleSettingChange('language', e.target.value)}
              >
                <option value="en">English</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
                <option value="de">German</option>
              </select>
            </div>
          </div>
          
          <div className="modern-setting-item">
            <div className="modern-setting-info">
              <h4 className="modern-setting-title">Timezone</h4>
              <p className="modern-setting-description">Set your local timezone for accurate timestamps</p>
            </div>
            <div className="modern-setting-control">
              <select 
                className="modern-form-select"
                value={settings.timezone}
                onChange={(e) => handleSettingChange('timezone', e.target.value)}
              >
                <option value="UTC">UTC</option>
                <option value="EST">Eastern Time</option>
                <option value="PST">Pacific Time</option>
                <option value="GMT">Greenwich Mean Time</option>
              </select>
            </div>
          </div>
          
          <div className="modern-setting-item">
            <div className="modern-setting-info">
              <h4 className="modern-setting-title">Date Format</h4>
              <p className="modern-setting-description">Choose how dates are displayed</p>
            </div>
            <div className="modern-setting-control">
              <select 
                className="modern-form-select"
                value={settings.dateFormat}
                onChange={(e) => handleSettingChange('dateFormat', e.target.value)}
              >
                <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                <option value="YYYY-MM-DD">YYYY-MM-DD</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="modern-settings-content">
      <div className="modern-settings-section">
        <h3 className="modern-settings-section-title">Email Notifications</h3>
        <div className="modern-settings-list">
          <div className="modern-setting-item">
            <div className="modern-setting-info">
              <h4 className="modern-setting-title">Email Notifications</h4>
              <p className="modern-setting-description">Receive notifications via email</p>
            </div>
            <div className="modern-setting-control">
              <label className="modern-switch">
                <input
                  type="checkbox"
                  checked={settings.emailNotifications}
                  onChange={(e) => handleSettingChange('emailNotifications', e.target.checked)}
                />
                <span className="modern-switch-slider"></span>
              </label>
            </div>
          </div>
          
          <div className="modern-setting-item">
            <div className="modern-setting-info">
              <h4 className="modern-setting-title">Order Updates</h4>
              <p className="modern-setting-description">Get notified about order status changes</p>
            </div>
            <div className="modern-setting-control">
              <label className="modern-switch">
                <input
                  type="checkbox"
                  checked={settings.orderUpdates}
                  onChange={(e) => handleSettingChange('orderUpdates', e.target.checked)}
                />
                <span className="modern-switch-slider"></span>
              </label>
            </div>
          </div>
          
          <div className="modern-setting-item">
            <div className="modern-setting-info">
              <h4 className="modern-setting-title">Promotions</h4>
              <p className="modern-setting-description">Receive promotional offers and discounts</p>
            </div>
            <div className="modern-setting-control">
              <label className="modern-switch">
                <input
                  type="checkbox"
                  checked={settings.promotions}
                  onChange={(e) => handleSettingChange('promotions', e.target.checked)}
                />
                <span className="modern-switch-slider"></span>
              </label>
            </div>
          </div>
        </div>
      </div>
      
      <div className="modern-settings-section">
        <h3 className="modern-settings-section-title">Push Notifications</h3>
        <div className="modern-settings-list">
          <div className="modern-setting-item">
            <div className="modern-setting-info">
              <h4 className="modern-setting-title">Push Notifications</h4>
              <p className="modern-setting-description">Receive push notifications in your browser</p>
            </div>
            <div className="modern-setting-control">
              <label className="modern-switch">
                <input
                  type="checkbox"
                  checked={settings.pushNotifications}
                  onChange={(e) => handleSettingChange('pushNotifications', e.target.checked)}
                />
                <span className="modern-switch-slider"></span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPrivacySettings = () => (
    <div className="modern-settings-content">
      <div className="modern-settings-section">
        <h3 className="modern-settings-section-title">Profile Visibility</h3>
        <div className="modern-settings-list">
          <div className="modern-setting-item">
            <div className="modern-setting-info">
              <h4 className="modern-setting-title">Profile Visibility</h4>
              <p className="modern-setting-description">Control who can see your profile</p>
            </div>
            <div className="modern-setting-control">
              <select 
                className="modern-form-select"
                value={settings.profileVisibility}
                onChange={(e) => handleSettingChange('profileVisibility', e.target.value)}
              >
                <option value="public">Public</option>
                <option value="friends">Friends Only</option>
                <option value="private">Private</option>
              </select>
            </div>
          </div>
          
          <div className="modern-setting-item">
            <div className="modern-setting-info">
              <h4 className="modern-setting-title">Show Email</h4>
              <p className="modern-setting-description">Display your email address on your profile</p>
            </div>
            <div className="modern-setting-control">
              <label className="modern-switch">
                <input
                  type="checkbox"
                  checked={settings.showEmail}
                  onChange={(e) => handleSettingChange('showEmail', e.target.checked)}
                />
                <span className="modern-switch-slider"></span>
              </label>
            </div>
          </div>
          
          <div className="modern-setting-item">
            <div className="modern-setting-info">
              <h4 className="modern-setting-title">Show Phone</h4>
              <p className="modern-setting-description">Display your phone number on your profile</p>
            </div>
            <div className="modern-setting-control">
              <label className="modern-switch">
                <input
                  type="checkbox"
                  checked={settings.showPhone}
                  onChange={(e) => handleSettingChange('showPhone', e.target.checked)}
                />
                <span className="modern-switch-slider"></span>
              </label>
            </div>
          </div>
          
          <div className="modern-setting-item">
            <div className="modern-setting-info">
              <h4 className="modern-setting-title">Allow Messages</h4>
              <p className="modern-setting-description">Let other users send you messages</p>
            </div>
            <div className="modern-setting-control">
              <label className="modern-switch">
                <input
                  type="checkbox"
                  checked={settings.allowMessages}
                  onChange={(e) => handleSettingChange('allowMessages', e.target.checked)}
                />
                <span className="modern-switch-slider"></span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSecuritySettings = () => (
    <div className="modern-settings-content">
      <div className="modern-settings-section">
        <h3 className="modern-settings-section-title">Authentication</h3>
        <div className="modern-settings-list">
          <div className="modern-setting-item">
            <div className="modern-setting-info">
              <h4 className="modern-setting-title">Two-Factor Authentication</h4>
              <p className="modern-setting-description">Add an extra layer of security to your account</p>
            </div>
            <div className="modern-setting-control">
              <label className="modern-switch">
                <input
                  type="checkbox"
                  checked={settings.twoFactorAuth}
                  onChange={(e) => handleSettingChange('twoFactorAuth', e.target.checked)}
                />
                <span className="modern-switch-slider"></span>
              </label>
            </div>
          </div>
          
          <div className="modern-setting-item">
            <div className="modern-setting-info">
              <h4 className="modern-setting-title">Login Alerts</h4>
              <p className="modern-setting-description">Get notified when someone logs into your account</p>
            </div>
            <div className="modern-setting-control">
              <label className="modern-switch">
                <input
                  type="checkbox"
                  checked={settings.loginAlerts}
                  onChange={(e) => handleSettingChange('loginAlerts', e.target.checked)}
                />
                <span className="modern-switch-slider"></span>
              </label>
            </div>
          </div>
          
          <div className="modern-setting-item">
            <div className="modern-setting-info">
              <h4 className="modern-setting-title">Session Timeout</h4>
              <p className="modern-setting-description">Automatically log out after inactivity (minutes)</p>
            </div>
            <div className="modern-setting-control">
              <select 
                className="modern-form-select"
                value={settings.sessionTimeout}
                onChange={(e) => handleSettingChange('sessionTimeout', parseInt(e.target.value))}
              >
                <option value={15}>15 minutes</option>
                <option value={30}>30 minutes</option>
                <option value={60}>1 hour</option>
                <option value={120}>2 hours</option>
              </select>
            </div>
          </div>
        </div>
      </div>
      
      <div className="modern-settings-section">
        <h3 className="modern-settings-section-title">Account Actions</h3>
        <div className="modern-account-actions">
          <button className="modern-btn modern-btn-outline">
            <i className="bi bi-key"></i>
            Change Password
          </button>
          <button className="modern-btn modern-btn-outline">
            <i className="bi bi-download"></i>
            Export Data
          </button>
          <button className="modern-btn modern-btn-danger">
            <i className="bi bi-trash"></i>
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'general':
        return renderGeneralSettings();
      case 'notifications':
        return renderNotificationSettings();
      case 'privacy':
        return renderPrivacySettings();
      case 'security':
        return renderSecuritySettings();
      default:
        return renderGeneralSettings();
    }
  };

  return (
    <PageLayout title="User Settings" subtitle="Configure your preferences" protected={true}>
      <div className="modern-settings-container">
        {/* Settings Tabs */}
        <div className="modern-settings-tabs">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`modern-settings-tab ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <i className={tab.icon}></i>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Settings Content */}
        <div className="modern-settings-main">
          {renderTabContent()}
          
          {/* Save Button */}
          <div className="modern-form-actions">
            <button 
              className="modern-btn modern-btn-primary"
              onClick={handleSaveSettings}
            >
              <i className="bi bi-check"></i>
              Save Settings
            </button>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default function ProtectedSettingsPage() {
  return (
    <ProtectedRoute>
      <SettingsPage />
    </ProtectedRoute>
  );
}
