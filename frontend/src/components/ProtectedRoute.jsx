import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const adminToken = localStorage.getItem('adminToken');
    if (!adminToken) {
      navigate('/admin/login');
    }
  }, [navigate]);

  // Check if token exists before rendering children
  const adminToken = localStorage.getItem('adminToken');
  if (!adminToken) {
    return null; // Don't render anything while redirecting
  }

  return children;
};

export default ProtectedRoute; 