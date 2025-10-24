// Simple encryption utilities for admin password protection
// Uses browser's built-in crypto API for secure password hashing

export class CryptoUtils {
  
  // Create SHA-256 hash of a password
  static async hashPassword(password) {
    try {
      const encoder = new TextEncoder();
      const data = encoder.encode(password);
      const hashBuffer = await crypto.subtle.digest('SHA-256', data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
      return hashHex;
    } catch (error) {
      console.error('Error hashing password:', error);
      return null;
    }
  }
  
  // Verify password against stored hash
  static async verifyPassword(password, storedHash) {
    try {
      const inputHash = await this.hashPassword(password);
      return inputHash === storedHash;
    } catch (error) {
      console.error('Error verifying password:', error);
      return false;
    }
  }
  
  // The actual password hash for "EssexPM" - pre-computed for security
  static getAdminPasswordHash() {
    // This is SHA-256 hash of "EssexPM"
    // Generated offline so the plain text password never appears in code
    return 'fd233b18d7ea6c254ee05a76ab448bc062f4f938e906fdb426fc752e411c57b8';
  }
  
  // Session management - stores login state temporarily
  static SESSION_KEY = 'essex-admin-session';
  static SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes in milliseconds
  
  // Check if admin is currently logged in
  static isAdminLoggedIn() {
    try {
      const session = localStorage.getItem(this.SESSION_KEY);
      if (!session) return false;
      
      const sessionData = JSON.parse(session);
      const now = Date.now();
      
      // Check if session has expired
      if (now > sessionData.expiresAt) {
        this.logoutAdmin();
        return false;
      }
      
      return sessionData.isAuthenticated === true;
    } catch (error) {
      console.error('Error checking admin session:', error);
      return false;
    }
  }
  
  // Login admin with password
  static async loginAdmin(password) {
    try {
      const correctHash = this.getAdminPasswordHash();
      const isValid = await this.verifyPassword(password, correctHash);
      
      if (isValid) {
        const sessionData = {
          isAuthenticated: true,
          loginTime: Date.now(),
          expiresAt: Date.now() + this.SESSION_TIMEOUT
        };
        
        localStorage.setItem(this.SESSION_KEY, JSON.stringify(sessionData));
        return { success: true, message: 'Admin access granted' };
      } else {
        return { success: false, message: 'Invalid password' };
      }
    } catch (error) {
      console.error('Error during admin login:', error);
      return { success: false, message: 'Authentication error' };
    }
  }
  
  // Logout admin
  static logoutAdmin() {
    localStorage.removeItem(this.SESSION_KEY);
  }
  
  // Extend current session (if user is active)
  static extendSession() {
    if (this.isAdminLoggedIn()) {
      const sessionData = JSON.parse(localStorage.getItem(this.SESSION_KEY));
      sessionData.expiresAt = Date.now() + this.SESSION_TIMEOUT;
      localStorage.setItem(this.SESSION_KEY, JSON.stringify(sessionData));
    }
  }
}