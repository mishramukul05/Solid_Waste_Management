import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // State to hold our form inputs
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Clear previous errors

    try {
      // Determine which endpoint to hit based on the toggle
      const endpoint = isLogin 
        ? 'http://localhost:5000/api/v1/auth/login' 
        : 'http://localhost:5000/api/v1/auth/register';

      // If logging in, we only need to send email and password
      const payload = isLogin 
        ? { email: formData.email, password: formData.password } 
        : formData;

      const response = await axios.post(endpoint, payload);
      // 1. Save the digital ID card (JWT)
      localStorage.setItem('token', response.data.token);

      // 2. Save the user's name and role (Updated to match your backend exactly!)
      localStorage.setItem('userName', response.data.name);
      localStorage.setItem('userRole', response.data.role);
      // 3. Redirect the user to the protected dashboard
      navigate('/dashboard');

    } catch (err) {
      // Catch validation errors from our backend and display them
      if (err.response && err.response.data && err.response.data.errors) {
        setError(err.response.data.errors[0].msg);
      } else if (err.response && err.response.data) {
        setError(err.response.data.message);
      } else {
        setError('Something went wrong. Please try again.');
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-64px)] bg-eco-bg px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg border border-eco-light">
        <h2 className="text-3xl font-bold text-center text-eco-dark mb-6">
          {isLogin ? 'Welcome Back' : 'Join EcoManage'}
        </h2>

        {/* Display Error Messages */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Only show the Name field if we are registering */}
          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Mukul Mishra"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-eco focus:border-eco outline-none transition"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="mukul@example.com"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-eco focus:border-eco outline-none transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-eco focus:border-eco outline-none transition"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-eco hover:bg-eco-dark text-white font-bold py-3 px-4 rounded-lg transition duration-200"
          >
            {isLogin ? 'Sign In' : 'Register Account'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
              }}
              className="text-eco-dark font-semibold hover:underline"
            >
              {isLogin ? 'Register here' : 'Login here'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}