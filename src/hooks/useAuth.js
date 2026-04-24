/**
 * iHarvest — useAuth Hook
 *
 * Convenience hook to access the AuthContext value.
 * Returns { user, userProfile, loading, role }.
 *
 * @module hooks/useAuth
 */

import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext.jsx';

/**
 * Access the global auth state.
 *
 * Used by: **All components** that need auth info.
 *
 * @returns {{ user: import('firebase/auth').User|null, userProfile: object|null, loading: boolean, role: string|null }}
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default useAuth;
