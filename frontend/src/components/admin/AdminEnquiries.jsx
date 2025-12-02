import React, { useState, useEffect } from 'react';
import { Mail, Calendar, User, MessageSquare, Trash2, RefreshCw, Loader2, Search, X } from 'lucide-react';
import { getAdminContacts, deleteContactEnquiry } from '../../services/api';

const AdminEnquiries = () => {
  const [enquiries, setEnquiries] = useState([]);
  const [filteredEnquiries, setFilteredEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    fetchEnquiries();
  }, []);

  useEffect(() => {
    // Auto-refresh every 30 seconds if enabled
    let interval;
    if (autoRefresh) {
      interval = setInterval(() => {
        fetchEnquiries();
      }, 30000); // 30 seconds
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [autoRefresh]);

  useEffect(() => {
    // Filter enquiries based on search term
    if (!searchTerm.trim()) {
      setFilteredEnquiries(enquiries);
    } else {
      const filtered = enquiries.filter(enquiry => 
        enquiry.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        enquiry.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        enquiry.message.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredEnquiries(filtered);
    }
  }, [searchTerm, enquiries]);

  const fetchEnquiries = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAdminContacts();
      if (Array.isArray(data)) {
        setEnquiries(data);
        setFilteredEnquiries(data);
      } else {
        setEnquiries([]);
        setFilteredEnquiries([]);
      }
    } catch (err) {
      setError('Failed to load enquiries. Please make sure you are logged in.');
      console.error('Error fetching enquiries:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation(); // Prevent expanding the enquiry when clicking delete
    e.preventDefault(); // Also prevent default behavior
    
    if (!window.confirm('Are you sure you want to delete this enquiry? This action cannot be undone.')) {
      return;
    }
    
    setDeletingId(id);
    setError(null); // Clear previous errors
    setSuccess(null); // Clear previous success messages
    
    try {
      console.log('Attempting to delete enquiry:', id, 'Type:', typeof id);
      console.log('Enquiry object:', enquiries.find(e => e.id === id));
      const result = await deleteContactEnquiry(id);
      console.log('Delete successful:', result);
      
      // Remove from local state
      const updatedEnquiries = enquiries.filter(e => e.id !== id);
      setEnquiries(updatedEnquiries);
      setFilteredEnquiries(filteredEnquiries.filter(e => e.id !== id));
      
      if (selectedEnquiry?.id === id) {
        setSelectedEnquiry(null);
      }
      
      setSuccess('Enquiry deleted successfully!');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      const errorMessage = err.message || 'Failed to delete enquiry. Please try again.';
      setError(errorMessage);
      console.error('Error deleting enquiry:', err);
      console.error('Full error object:', JSON.stringify(err, null, 2));
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-teal-500 mx-auto mb-4" />
          <p className="text-gray-600">Loading enquiries...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-br from-teal-600 to-cyan-600 rounded-xl">
            <Mail className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Contact Enquiries</h2>
            <p className="text-slate-600">View all contact form submissions from visitors</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium shadow transition-all ${
              autoRefresh 
                ? 'bg-green-500 text-white hover:bg-green-600' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            <RefreshCw className={`w-4 h-4 ${autoRefresh ? 'animate-spin' : ''}`} /> 
            Auto-refresh {autoRefresh ? 'ON' : 'OFF'}
          </button>
          <button
            onClick={fetchEnquiries}
            disabled={loading}
            className="flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-xl font-medium shadow hover:from-teal-600 hover:to-cyan-600 transition-all disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> Refresh
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search by name, email, or message..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-12 pr-10 py-3 border-2 border-gray-200 rounded-xl focus:border-teal-400 focus:outline-none transition-colors"
        />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm('')}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {success && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-xl">
          <p className="text-green-700">{success}</p>
        </div>
      )}

      {enquiries.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-gray-100">
          <Mail className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No Enquiries Yet</h3>
          <p className="text-gray-500">Contact form submissions will appear here once visitors start reaching out.</p>
        </div>
      ) : filteredEnquiries.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-gray-100">
          <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No Results Found</h3>
          <p className="text-gray-500">No enquiries match your search term "{searchTerm}"</p>
          <button
            onClick={() => setSearchTerm('')}
            className="mt-4 px-4 py-2 text-teal-600 hover:text-teal-700 underline"
          >
            Clear search
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredEnquiries.map((enquiry) => (
            <div
              key={enquiry.id}
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all cursor-pointer"
              onClick={() => setSelectedEnquiry(selectedEnquiry?.id === enquiry.id ? null : enquiry)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-gradient-to-br from-teal-100 to-cyan-100 rounded-lg">
                      <User className="w-5 h-5 text-teal-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-slate-800">{enquiry.name}</h3>
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <Mail className="w-4 h-4" />
                        <a 
                          href={`mailto:${enquiry.email}`}
                          className="text-teal-600 hover:underline"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {enquiry.email}
                        </a>
                      </div>
                    </div>
                  </div>
                  
                  {selectedEnquiry?.id === enquiry.id ? (
                    <div className="mt-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
                      <div className="flex items-center gap-2 mb-3">
                        <MessageSquare className="w-5 h-5 text-teal-600" />
                        <h4 className="font-semibold text-slate-800">Message:</h4>
                      </div>
                      <p className="text-slate-700 whitespace-pre-wrap leading-relaxed">{enquiry.message}</p>
                    </div>
                  ) : (
                    <p className="text-slate-600 line-clamp-2 ml-11">
                      {enquiry.message}
                    </p>
                  )}
                  
                  <div className="flex items-center gap-2 mt-4 ml-11 text-sm text-slate-500">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(enquiry.created_at)}</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={(e) => handleDelete(enquiry.id, e)}
                  disabled={deletingId === enquiry.id}
                  className="p-2 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed z-10 relative"
                  title="Delete enquiry"
                  aria-label="Delete enquiry"
                >
                  {deletingId === enquiry.id ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Trash2 className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {enquiries.length > 0 && (
        <div className="text-center text-sm text-gray-500 mt-6">
          Showing {filteredEnquiries.length} of {enquiries.length} {enquiries.length === 1 ? 'enquiry' : 'enquiries'}
          {searchTerm && ` (filtered by "${searchTerm}")`}
        </div>
      )}
    </div>
  );
};

export default AdminEnquiries;

