import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Dashboard() {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Get user details from localStorage
  const userName = localStorage.getItem('userName') || 'User';
  const userRole = localStorage.getItem('userRole') || 'citizen';

  // Form state for creating a new request
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    wasteCategory: 'Municipal Solid Waste', // Default value
    location: ''
  });

  // 1. Fetch data as soon as the dashboard loads
  useEffect(() => {
    const fetchRequests = async () => {
      const token = localStorage.getItem('token');
      
      // If no token is found, kick them back to the login page
      if (!token) {
        navigate('/');
        return;
      }

      try {
        // Pass the token in the Authorization header, just like we did in Postman!
        const config = {
          headers: { Authorization: `Bearer ${token}` }
        };
        
        const response = await axios.get('http://localhost:5000/api/v1/requests', config);
        setRequests(response.data.data);
      } catch (err) {
        setError('Failed to fetch requests. Please log in again.');
        localStorage.removeItem('token');
        navigate('/');
      }
    };

    fetchRequests();
  }, [navigate]);

  // 2. Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 3. Submit a new Waste Request
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };

      const response = await axios.post('http://localhost:5000/api/v1/requests', formData, config);
      
      // Add the newly created request to our UI list immediately
      setRequests([response.data.data, ...requests]);
      setSuccess('Waste request submitted successfully!');
      
      // Clear the form
      setFormData({ title: '', description: '', wasteCategory: 'Municipal Solid Waste', location: '' });
      
      // Remove success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit request');
    }
  };

  // 4. Update a Waste Request Status (Manager Only)
  const updateStatus = async (id, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };

      await axios.put(`http://localhost:5000/api/v1/requests/${id}`, { status: newStatus }, config);
      
      // Update the local state to match the new status
      setRequests(requests.map(req => req._id === id ? { ...req, status: newStatus } : req));
      setSuccess('Request status updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update status');
    }
  };

  // 5. Delete a Waste Request (Citizen or Manager)
  const deleteRequest = async (id) => {
    if (!window.confirm("Are you sure you want to delete this request?")) return;
    
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };

      await axios.delete(`http://localhost:5000/api/v1/requests/${id}`, config);
      
      // Remove the deleted request from the local state
      setRequests(requests.filter(req => req._id !== id));
      setSuccess('Request deleted successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete request');
    }
  };

  // 6. Logout User
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <div className="max-w-7xl mx-auto p-6 mt-8">
      {/* Dashboard Header */}
      <div className="flex justify-between items-center mb-8 border-b-2 border-eco pb-4">
        <div>
          <h1 className="text-3xl font-bold text-eco-dark">Solid Waste Management</h1>
          <p className="text-gray-600 mt-1 capitalize text-lg">
            Welcome, <span className="font-semibold text-gray-800">{userName}</span> 
            <span className={`ml-2 px-2 py-0.5 text-xs rounded-full font-medium ${userRole === 'manager' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'}`}>
              {userRole === 'manager' ? '🛡️ Manager' : '👤 Citizen'}
            </span>
          </p>
        </div>
        <button 
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded shadow transition"
        >
          Logout
        </button>
      </div>

      {/* Notifications */}
      {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}
      {success && <div className="bg-eco-light text-eco-dark p-3 rounded mb-4 border border-eco">{success}</div>}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Left Column: Form to Submit Request */}
        <div className="md:col-span-1 bg-white p-6 rounded-xl shadow-md border border-gray-200 h-fit">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Report an Issue</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Title</label>
              <input type="text" name="title" value={formData.title} onChange={handleChange} required className="w-full mt-1 px-3 py-2 border rounded-md focus:ring-eco focus:border-eco outline-none" placeholder="e.g., Broken Bin" />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Category</label>
              <select name="wasteCategory" value={formData.wasteCategory} onChange={handleChange} className="w-full mt-1 px-3 py-2 border rounded-md focus:ring-eco focus:border-eco outline-none bg-white">
                <option value="Municipal Solid Waste">Municipal Solid Waste</option>
                <option value="Hazardous">Hazardous</option>
                <option value="Recyclable">Recyclable</option>
                <option value="Biomedical">Biomedical</option>
                <option value="E-Waste">E-Waste</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Location</label>
              <input type="text" name="location" value={formData.location} onChange={handleChange} required className="w-full mt-1 px-3 py-2 border rounded-md focus:ring-eco focus:border-eco outline-none" placeholder="123 Main St" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea name="description" value={formData.description} onChange={handleChange} required rows="3" className="w-full mt-1 px-3 py-2 border rounded-md focus:ring-eco focus:border-eco outline-none" placeholder="Describe the problem..."></textarea>
            </div>

            <button type="submit" className="w-full bg-eco hover:bg-eco-dark text-white font-bold py-2 px-4 rounded transition">
              Submit Request
            </button>
          </form>
        </div>

        {/* Right Column: List of Requests */}
        <div className="md:col-span-2">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Active Requests</h2>
          {requests.length === 0 ? (
            <p className="text-gray-500 italic">No requests found. Create one to get started!</p>
          ) : (
            <div className="grid gap-4">
              {requests.map((req) => (
                <div key={req._id} className="bg-white p-5 rounded-lg shadow border-l-4 border-eco flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-lg text-gray-800">{req.title}</h3>
                      <div className="flex items-center gap-2">
                         {/* Status Badge / Dropdown for Managers */}
                        {userRole === 'manager' ? (
                          <select 
                            value={req.status} 
                            onChange={(e) => updateStatus(req._id, e.target.value)}
                            className={`px-3 py-1 text-xs font-semibold rounded-full border-none outline-none cursor-pointer ${
                              req.status === 'Resolved' ? 'bg-green-100 text-green-800' : 
                              req.status === 'Dispatched' ? 'bg-blue-100 text-blue-800' : 
                              'bg-yellow-100 text-yellow-800'
                            }`}
                          >
                            <option value="Pending">Pending</option>
                            <option value="Dispatched">Dispatched</option>
                            <option value="Resolved">Resolved</option>
                          </select>
                        ) : (
                          <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                            req.status === 'Resolved' ? 'bg-green-100 text-green-800' : 
                            req.status === 'Dispatched' ? 'bg-blue-100 text-blue-800' : 
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {req.status}
                          </span>
                        )}
                        
                        {/* Delete Button for Managers and Citizens */}
                        <button
                          onClick={() => deleteRequest(req._id)}
                          className="bg-red-100 text-red-600 hover:bg-red-200 hover:text-red-800 py-1 px-2 rounded ml-2 transition text-xs font-bold"
                          title="Delete Request"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{req.description}</p>
                  </div>
                  <div className="text-xs flex gap-4">
                    <span className="text-gray-500">📍 {req.location}</span>
                    <span className="text-gray-500">♻️ {req.wasteCategory}</span>
                    {req.citizenId?.name && (
                       <span className="text-purple-600 font-medium ml-auto">Reported by: {req.citizenId.name}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}