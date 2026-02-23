import { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if (userInfo) {
      setUser(userInfo);
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      };

      const { data } = await axios.post(
        import.meta.env.VITE_API_URL + '/api/auth/login',
        { email, password },
        config
      );

      localStorage.setItem('userInfo', JSON.stringify(data));
      setUser(data);
      return data;
    } catch (error) {
      throw error.response && error.response.data.message
        ? error.response.data.message
        : error.message;
    }
  };

  const register = async (name, email, password) => {
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      };

      const { data } = await axios.post(
        import.meta.env.VITE_API_URL + '/api/auth/register',
        { name, email, password },
        config
      );

      localStorage.setItem('userInfo', JSON.stringify(data));
      setUser(data);
      return data;
    } catch (error) {
      throw error.response && error.response.data.message
        ? error.response.data.message
        : error.message;
    }
  };

  const updateProfile = async (userData) => {
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
      };

      // Ensure API URL doesn't have trailing slash before joining
      const baseUrl = import.meta.env.VITE_API_URL.endsWith('/') 
        ? import.meta.env.VITE_API_URL.slice(0, -1) 
        : import.meta.env.VITE_API_URL;

      console.log('Updating profile at:', `${baseUrl}/api/auth/profile`);
      
      const { data } = await axios.put(
        `${baseUrl}/api/auth/profile`,
        userData,
        config
      );

      localStorage.setItem('userInfo', JSON.stringify(data));
      setUser(data);
      return data;
    } catch (error) {
      console.error('Profile update error:', error.response || error);
      throw error.response && error.response.data.message
        ? error.response.data.message
        : error.message;
    }
  };

  const logout = () => {
    localStorage.removeItem('userInfo');
    setUser(null);
  };

  const value = {
    user,
    loading,
    login,
    register,
    updateProfile,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
