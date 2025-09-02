import { apiService } from './api';

interface TokenData {
  exp: number; // Expiration timestamp
  iat: number; // Issued at timestamp
}

class TokenManager {
  private refreshInterval: NodeJS.Timeout | null = null;
  private activityTimeout: NodeJS.Timeout | null = null;
  private lastActivity: number = Date.now();
  private readonly REFRESH_THRESHOLD = 5 * 60 * 1000; // 5 minutes in milliseconds
  private readonly ACTIVITY_TIMEOUT = 60 * 60 * 1000; // 1 hour in milliseconds
  private readonly ACTIVITY_CHECK_INTERVAL = 5 * 60 * 1000; // Check every 5 minutes

  constructor() {
    this.initializeTokenManagement();
    this.setupActivityTracking();
  }

  private initializeTokenManagement() {
    if (typeof window === 'undefined') return;

    // Start token refresh monitoring
    this.startTokenRefreshMonitoring();
    
    // Check token validity immediately
    this.checkAndRefreshTokenIfNeeded();
  }

  private setupActivityTracking() {
    if (typeof window === 'undefined') return;

    // Track user activity
    const activityEvents = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    
    const updateActivity = () => {
      this.lastActivity = Date.now();
      console.log('TokenManager: User activity detected, updating last activity timestamp');
    };

    // Add event listeners for user activity
    activityEvents.forEach(event => {
      document.addEventListener(event, updateActivity, { passive: true });
    });

    // Check activity periodically
    this.startActivityMonitoring();
  }

  private startTokenRefreshMonitoring() {
    // Check token every minute
    this.refreshInterval = setInterval(() => {
      this.checkAndRefreshTokenIfNeeded();
    }, 60 * 1000); // Check every minute
  }

  private startActivityMonitoring() {
    // Check user activity every 5 minutes
    this.activityTimeout = setInterval(() => {
      this.checkUserActivity();
    }, this.ACTIVITY_CHECK_INTERVAL);
  }

  private checkUserActivity() {
    const now = Date.now();
    const timeSinceLastActivity = now - this.lastActivity;

    console.log(`TokenManager: Time since last activity: ${Math.round(timeSinceLastActivity / 1000)} seconds`);

    if (timeSinceLastActivity > this.ACTIVITY_TIMEOUT) {
      console.log('TokenManager: User inactive for 1 hour, logging out');
      this.forceLogout();
    }
  }

  private async checkAndRefreshTokenIfNeeded() {
    if (!apiService.isAuthenticated()) {
      console.log('TokenManager: User not authenticated, skipping token check');
      return;
    }

    const token = this.getStoredToken();
    if (!token) {
      console.log('TokenManager: No token found, skipping token check');
      return;
    }

    try {
      const tokenData = this.decodeToken(token);
      if (!tokenData) {
        console.log('TokenManager: Invalid token format, logging out');
        this.forceLogout();
        return;
      }

      const now = Math.floor(Date.now() / 1000);
      const timeUntilExpiry = tokenData.exp - now;
      const timeUntilExpiryMs = timeUntilExpiry * 1000;

      console.log(`TokenManager: Token expires in ${Math.round(timeUntilExpiryMs / 1000)} seconds`);

      // Check if token expires in less than 5 minutes
      if (timeUntilExpiryMs <= this.REFRESH_THRESHOLD) {
        // Only refresh if user has been active in the last 5 minutes
        const timeSinceLastActivity = Date.now() - this.lastActivity;
        const hasBeenActiveRecently = timeSinceLastActivity <= this.REFRESH_THRESHOLD;
        
        if (hasBeenActiveRecently) {
          console.log('TokenManager: Token expires soon and user is active, refreshing...');
          await this.refreshToken();
        } else {
          console.log('TokenManager: Token expires soon but user has been inactive, not refreshing');
        }
      } else {
        console.log('TokenManager: Token is still valid, no refresh needed');
      }
    } catch (error) {
      console.error('TokenManager: Error checking token:', error);
      this.forceLogout();
    }
  }

  private async refreshToken() {
    try {
      console.log('TokenManager: Attempting to refresh token...');
      await apiService.refreshToken();
      console.log('TokenManager: Token refreshed successfully');
    } catch (error) {
      console.error('TokenManager: Failed to refresh token:', error);
      this.forceLogout();
    }
  }

  private decodeToken(token: string): TokenData | null {
    try {
      const payload = token.split('.')[1];
      if (!payload) return null;
      
      const decoded = JSON.parse(atob(payload));
      return {
        exp: decoded.exp,
        iat: decoded.iat
      };
    } catch (error) {
      console.error('TokenManager: Error decoding token:', error);
      return null;
    }
  }

  private getStoredToken(): string | null {
    if (typeof window === 'undefined') return null;
    
    // Check direct token storage
    const directToken = localStorage.getItem('auth_token');
    if (directToken) return directToken;
    
    // Check Redux persist storage
    const persistAuth = localStorage.getItem('persist:auth');
    if (persistAuth) {
      try {
        const authData = JSON.parse(persistAuth);
        if (authData.token) {
          let token = authData.token;
          if (typeof token === 'string' && token.startsWith('"') && token.endsWith('"')) {
            token = JSON.parse(token);
          }
          return token;
        }
      } catch (e) {
        console.error('TokenManager: Error parsing persist auth:', e);
      }
    }
    
    return null;
  }

  private forceLogout() {
    console.log('TokenManager: Force logout initiated');
    
    // Clear all intervals
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
      this.refreshInterval = null;
    }
    
    if (this.activityTimeout) {
      clearInterval(this.activityTimeout);
      this.activityTimeout = null;
    }

    // Force logout through API service
    apiService.forceLogout();
    
    // Redirect to home page if we're not already there
    if (typeof window !== 'undefined' && window.location.pathname !== '/') {
      window.location.href = '/';
    }
  }

  // Public method to manually refresh token (can be called from components)
  public async manualRefreshToken() {
    await this.checkAndRefreshTokenIfNeeded();
  }

  // Public method to get token expiry info
  public getTokenExpiryInfo(): { isValid: boolean; expiresIn: number; expiresInMinutes: number } | null {
    const token = this.getStoredToken();
    if (!token) return null;

    try {
      const tokenData = this.decodeToken(token);
      if (!tokenData) return null;

      const now = Math.floor(Date.now() / 1000);
      const timeUntilExpiry = tokenData.exp - now;
      const expiresInMinutes = Math.floor(timeUntilExpiry / 60);

      return {
        isValid: timeUntilExpiry > 0,
        expiresIn: timeUntilExpiry,
        expiresInMinutes
      };
    } catch (error) {
      console.error('TokenManager: Error getting token expiry info:', error);
      return null;
    }
  }

  // Public method to check if token needs refresh
  public shouldRefreshToken(): boolean {
    const token = this.getStoredToken();
    if (!token) return false;

    try {
      const tokenData = this.decodeToken(token);
      if (!tokenData) return false;

      const now = Math.floor(Date.now() / 1000);
      const timeUntilExpiry = tokenData.exp - now;
      const timeUntilExpiryMs = timeUntilExpiry * 1000;

      return timeUntilExpiryMs <= this.REFRESH_THRESHOLD;
    } catch (error) {
      console.error('TokenManager: Error checking if token should refresh:', error);
      return false;
    }
  }

  // Cleanup method
  public cleanup() {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
      this.refreshInterval = null;
    }
    
    if (this.activityTimeout) {
      clearInterval(this.activityTimeout);
      this.activityTimeout = null;
    }
  }
}

// Create singleton instance
export const tokenManager = new TokenManager();

// Export for use in components
export default tokenManager;
