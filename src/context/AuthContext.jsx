/**
 * iHarvest — Auth Context
 *
 * Global authentication state provider.
 * Wraps the entire app and exposes { user, userProfile, loading, role }.
 *
 * @module context/AuthContext
 */

import { createContext, useState, useEffect } from 'react';
import { onAuthChange, getUserProfile } from '../services/authService.js';

/**
 * @typedef {Object} AuthContextValue
 * @property {import('firebase/auth').User|null} user - Firebase Auth user object
 * @property {object|null} userProfile - Firestore user profile document
 * @property {boolean} loading - True while auth state is being resolved
 * @property {string|null} role - Current user's role (shortcut for userProfile.role)
 * @property {Function} refreshProfile - Refetches the user profile from Firestore
 */

/** @type {import('react').Context<AuthContextValue>} */
export const AuthContext = createContext({
  user: null,
  userProfile: null,
  loading: true,
  role: null,
  refreshProfile: async () => {},
});

/**
 * AuthProvider — wrap your app with this to provide auth state everywhere.
 *
 * On mount, subscribes to Firebase Auth state changes.
 * When a user signs in, fetches their Firestore profile.
 * When they sign out, clears all state.
 *
 * @param {{ children: import('react').ReactNode }} props
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthChange(async (firebaseUser) => {
      try {
        if (firebaseUser) {
          const profile = await getUserProfile(firebaseUser.uid);
          console.log('[AuthProvider] User authenticated:', firebaseUser.uid, 'Profile:', profile);
          setUser(firebaseUser);
          setUserProfile(profile);
        } else {
          setUser(null);
          setUserProfile(null);
        }
      } catch (error) {
        console.error('[AuthProvider] Error fetching user profile:', error);
        setUser(null);
        setUserProfile(null);
      } finally {
        // Only stop loading once we've attempted to fetch the profile for an authenticated user
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const role = userProfile?.role || null;

  const refreshProfile = async () => {
    if (user) {
      const profile = await getUserProfile(user.uid);
      setUserProfile(profile);
    }
  };

  const value = {
    user,
    userProfile,
    loading,
    role,
    refreshProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContext;
