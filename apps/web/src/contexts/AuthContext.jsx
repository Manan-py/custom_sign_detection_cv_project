import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [initialLoading, setInitialLoading] = useState(false);
  const [cameraPermissionGranted, setCameraPermissionGranted] = useState(false);

  useEffect(() => {}, []);

  const login = async (email, password) => {
    return { success: false, error: 'Authentication is disabled in this build.' };
  };

  const logout = () => {
    setCurrentUser(null);
    setCameraPermissionGranted(false);
  };

  const requestCameraPermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      stream.getTracks().forEach(track => track.stop());
      setCameraPermissionGranted(true);
      return true;
    } catch (error) {
      console.error('Camera permission error:', error);
      setCameraPermissionGranted(false);
      return false;
    }
  };

  const value = {
    currentUser,
    initialLoading,
    cameraPermissionGranted,
    login,
    logout,
    requestCameraPermission,
    isAuthenticated: !!currentUser
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};