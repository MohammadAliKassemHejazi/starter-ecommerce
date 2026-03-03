export interface SettingsViewModel {
  language: string;
  timezone: string;
  dateFormat: string;
  emailNotifications: boolean;
  pushNotifications: boolean;
  orderUpdates: boolean;
  promotions: boolean;
  securityAlerts: boolean;
  profileVisibility: string;
  showEmail: boolean;
  showPhone: boolean;
  allowMessages: boolean;
  twoFactorAuth: boolean;
  loginAlerts: boolean;
  sessionTimeout: number;
}

export const defaultSettingsData: SettingsViewModel = {
  language: 'en',
  timezone: 'UTC',
  dateFormat: 'MM/DD/YYYY',
  emailNotifications: true,
  pushNotifications: true,
  orderUpdates: true,
  promotions: false,
  securityAlerts: true,
  profileVisibility: 'public',
  showEmail: false,
  showPhone: false,
  allowMessages: true,
  twoFactorAuth: false,
  loginAlerts: true,
  sessionTimeout: 30,
};
