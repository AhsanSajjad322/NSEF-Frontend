import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { decodeToken } from '../utils/auth';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/base/token/obtain-pair/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Login failed');
      }
    
      const decodedToken = decodeToken(data.access);
      console.log("Decoded token: ", decodedToken);

      login(data.access, data.refresh);
      
      // Redirect based on user type (array of roles)
      const userTypes = Array.isArray(decodedToken.user_type) ? decodedToken.user_type : [decodedToken.user_type]; 
      const userTypesLowerCase = userTypes.map((user)=> user.toLocaleLowerCase());

      if (userTypesLowerCase.includes('nsft')) {
        navigate('/nsft/dashboard');
      } else if (userTypesLowerCase.includes('bp')) {
        navigate('/bp/dashboard');
      } else if (userTypesLowerCase.includes('cr')) {
        navigate('/cr/dashboard');
      } else if (userTypesLowerCase.includes('student') || userTypesLowerCase.includes('personal')) {
        navigate('/student/dashboard');
      } else {
        navigate('/'); // Default redirection if no recognized role is found
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background-DEFAULT py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-card-DEFAULT p-8 rounded-lg shadow-lg">
        <div>
          <h2 className="mt-6 text-center text-2xl font-bold text-text-DEFAULT">
            NUST Student Endowment Fund (NSEF)
          </h2>
          <p className="mt-2 text-center text-sm text-text-light">
            Sign in to your account
          </p>
        </div>
        <form className="mt-6 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md -space-y-px">
            <div>
              <label htmlFor="username" className="sr-only">
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                className="appearance-none relative block w-full px-3 py-2 border border-muted-DEFAULT placeholder-text-light text-text-DEFAULT rounded-t-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm bg-background-DEFAULT"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="appearance-none relative block w-full px-3 py-2 border border-muted-DEFAULT placeholder-text-light text-text-DEFAULT rounded-b-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm bg-background-DEFAULT"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {error && (
            <div className="text-red-500 text-sm text-center">{error}</div>
          )}

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-500 hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 transition-colors duration-200"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login; 