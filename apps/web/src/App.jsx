import React from 'react';
import { Route, Routes, HashRouter as Router } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext.jsx';
import ScrollToTop from '@/components/ScrollToTop.jsx';
import Header from '@/components/Header.jsx';
import HomePage from '@/pages/HomePage.jsx';
import LoginPage from '@/pages/LoginPage.jsx';
import MediaPipeHandPosePage from '@/pages/MediaPipeHandPosePage.jsx';
import CustomSignRecorderPage from '@/pages/CustomSignRecorderPage.jsx';
import CustomSignGalleryPage from '@/pages/CustomSignGalleryPage.jsx';

function App() {
  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <Header />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/hand-pose" element={<MediaPipeHandPosePage />} />
          <Route path="/custom-recorder" element={<CustomSignRecorderPage />} />
          <Route path="/custom-gallery" element={<CustomSignGalleryPage />} />
          <Route path="*" element={<HomePage />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;