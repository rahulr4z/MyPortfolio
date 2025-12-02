import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, LogOut } from 'lucide-react';
import { logout } from '../../services/api';

const AdminLayout = ({ title, children }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-100 to-slate-200 p-8">
      <main className="max-w-7xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <Link 
            to="/admin" 
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors font-medium"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Dashboard
          </Link>
          
          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors font-medium"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
        <div className="bg-white/80 backdrop-blur-lg p-8 rounded-2xl shadow-lg border border-gray-200">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">{title}</h2>
          {children}
        </div>
      </main>
    </div>
  );
};

export default AdminLayout; 