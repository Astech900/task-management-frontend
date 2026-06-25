import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../store/slices/authSlice';
import useAxios from '../hooks/useAxios';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { execute, loading, error } = useAxios<{ user: any; token: string }>();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const data = await execute({
        method: 'POST',
        url: '/auth/login',
        data: formData
      });
      
      if (data) {
        dispatch(loginSuccess({ user: data.user, token: data.token }));
        navigate('/');
      }
    } catch (err: any) {
      // Error is handled by the hook
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="card w-full max-w-sm bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title justify-center text-2xl font-bold mb-4">Welcome Back</h2>
          
          {error && (
            <div className="alert alert-error shadow-sm mb-4">
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Email Address</span>
              </label>
              <input 
                type="email" 
                placeholder="email@example.com" 
                className="input input-bordered w-full" 
                required 
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Password</span>
              </label>
              <input 
                type="password" 
                placeholder="********" 
                className="input input-bordered w-full" 
                required 
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>

            <button type="submit" className="btn w-full mt-4 bg-gradient-to-r from-indigo-500 to-cyan-500 hover:from-indigo-600 hover:to-cyan-600 text-white border-none shadow-md" disabled={loading}>
              {loading ? <span className="loading loading-spinner text-white"></span> : 'Login'}
            </button>
          </form>

          <p className="text-center mt-4 text-sm text-base-content/70">
            Don't have an account? <Link to="/register" className="link link-primary font-semibold hover:text-primary-focus">Register</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
