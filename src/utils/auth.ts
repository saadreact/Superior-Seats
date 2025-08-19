import { User } from '@/store/authSlice';

/**
 * Check if a user has super admin privileges
 * @param user - The user object from auth state
 * @param isAuthenticated - Whether the user is authenticated
 * @returns boolean indicating if user is super admin
 */
export const isSuperAdmin = (user: User | null, isAuthenticated: boolean): boolean => {
  console.log('🔍 isSuperAdmin - Input:', { user, isAuthenticated });
  
  if (!user || !isAuthenticated) {
    console.log('🔍 isSuperAdmin - Early return: No user or not authenticated');
    return false;
  }
  
  // Check if user has role with is_super_admin flag
  if (user.role?.is_super_admin) {
    console.log('🔍 isSuperAdmin - Found super admin via role.is_super_admin');
    return true;
  }
  
  // Check if user has any roles with super admin permissions
  if (user.roles && user.roles.length > 0) {
    const hasAdminRole = user.roles.some(role => 
      role.name === 'super_admin' || 
      role.name === 'admin'
    );
    console.log('🔍 isSuperAdmin - Checking roles:', user.roles, 'Result:', hasAdminRole);
    if (hasAdminRole) return true;
  }
  
  // Fallback check for role_type
  if (user.role_type === 'super_admin' || user.role_type === 'admin') {
    console.log('🔍 isSuperAdmin - Found admin via role_type:', user.role_type);
    return true;
  }
  
  console.log('🔍 isSuperAdmin - No admin privileges found');
  return false;
};

/**
 * Check if user has any admin privileges (including regular admin)
 * @param user - The user object from auth state
 * @param isAuthenticated - Whether the user is authenticated
 * @returns boolean indicating if user has admin access
 */
export const isAdmin = (user: User | null, isAuthenticated: boolean): boolean => {
  if (!user || !isAuthenticated) return false;
  
  // First check super admin
  if (isSuperAdmin(user, isAuthenticated)) return true;
  
  // Check for regular admin roles
  if (user.roles && user.roles.length > 0) {
    return user.roles.some(role => 
      role.name === 'admin' || 
      role.name === 'moderator' ||
      role.name === 'manager'
    );
  }
  
  // Fallback check for role_type
  if (user.role_type === 'admin' || user.role_type === 'moderator') return true;
  
  return false;
};

/**
 * Get user display name
 * @param user - The user object from auth state
 * @returns string with user's display name
 */
export const getUserDisplayName = (user: User | null): string => {
  if (!user) return 'Unknown User';
  
  return user.name || user.username || user.email || 'User';
};

/**
 * Get user role display name
 * @param user - The user object from auth state
 * @returns string with user's role
 */
export const getUserRole = (user: User | null): string => {
  if (!user) return 'No Role';
  
  if (user.role?.name) return user.role.name;
  if (user.role_type) return user.role_type;
  if (user.roles && user.roles.length > 0) {
    return user.roles[0].name;
  }
  
  return 'User';
}; 