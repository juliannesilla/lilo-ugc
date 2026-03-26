import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '../firebase';
import { signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged, User } from 'firebase/auth';

interface AdminContextType {
  isAdmin: boolean;
  toggleAdmin: () => Promise<void>;
  user: User | null;
  isAuthReady: boolean;
}

const AdminContext = createContext<AdminContextType>({
  isAdmin: false,
  toggleAdmin: async () => {},
  user: null,
  isAuthReady: false,
});

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      // For this app, if they are logged in and email is julzsilla@gmail.com, they are admin
      if (currentUser && currentUser.email === 'julzsilla@gmail.com') {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
      }
      setIsAuthReady(true);
    });
    return () => unsubscribe();
  }, []);

  const toggleAdmin = async () => {
    if (isAdmin) {
      await signOut(auth);
    } else {
      const provider = new GoogleAuthProvider();
      try {
        await signInWithPopup(auth, provider);
      } catch (error) {
        console.error("Login failed", error);
      }
    }
  };

  return (
    <AdminContext.Provider value={{ isAdmin, toggleAdmin, user, isAuthReady }}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => useContext(AdminContext);