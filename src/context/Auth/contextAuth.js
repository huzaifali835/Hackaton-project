import React, { createContext, useState, useEffect, useContext } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth, db } from '../../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

// Create the AuthContext
export const AuthContext = createContext();

// Custom hook to use the AuthContext
export const useAuth = () => {
  return useContext(AuthContext);
};

// AuthProvider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Save the UID to localStorage
        localStorage.setItem("uid", user.uid);
        setUser(user);

        // Check if the user is an admin
        const docRef = doc(db, 'admins', user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setIsAdmin(true);
          // Redirect to admin page if not already there
          if (!window.location.pathname.startsWith('/admin') && window.location.pathname !== '/signup') {
            navigate('/admin');
          }
        } else {
          setIsAdmin(false);
          // Redirect to user page if not already there
          if (!window.location.pathname.startsWith('/user') && window.location.pathname !== '/signup') {
            navigate('/user');
          }
        }
      } else {
        setUser(null);
        setIsAdmin(false);
        // Redirect to home page if not authenticated
        if (window.location.pathname !== '/signup') {
          navigate('/');
        }
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  // Function to handle sign out
  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAdmin, handleSignOut }}>
      {children}
    </AuthContext.Provider>
  );
};
