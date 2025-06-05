import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getToken, setTokens, removeTokens, getUserInfo, TokenPayload, decodeToken } from '../utils/auth';

interface AuthContextType {
  isAuthenticated: boolean;
  userType: string[] | null;
  userInfo: { user: TokenPayload['user']; student?: TokenPayload['student'] } | null;
  login: (access: string, refresh: string) => void;
  logout: () => void;
  canAccess: (userType: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!getToken());
  const [userInfo, setUserInfo] = useState<AuthContextType['userInfo']>(getUserInfo());
  const [userType, setUserType] = useState<string[] | null>(() => {
    const token = getToken();
    if (!token) return null;
    try {
      const decoded = decodeToken(token);
      return Array.isArray(decoded.user_type) ? decoded.user_type : [decoded.user_type];
    } catch {
      return null;
    }
  });
  const navigate = useNavigate();

  const canAccess = (targetUserType: string): boolean => {
    if (!userType || userType.length === 0) return false;

    const accessMap: { [key: string]: string[] } = {
      'Student': ['Student', 'CR', 'BP', 'NSFT'],
      'CR': ['CR', 'BP', 'NSFT'],
      'BP': ['BP', 'NSFT'],
      'NSFT': ['NSFT'],
    };

    if (!accessMap[targetUserType]) {
        console.warn(`Unknown targetUserType: ${targetUserType}`);
        return false;
    }

    return userType.some(role => accessMap[targetUserType].includes(role));
  };

  const login = (access: string, refresh: string) => {
    setTokens(access, refresh);
    const info = getUserInfo();
    setUserInfo(info);
    const decoded = decodeToken(access);
    setUserType(Array.isArray(decoded.user_type) ? decoded.user_type : [decoded.user_type]);
    setIsAuthenticated(true);
  };

  const logout = () => {
    removeTokens();
    setIsAuthenticated(false);
    setUserInfo(null);
    setUserType(null);
    navigate('/login');
  };

  useEffect(() => {
    const token = getToken();
    if (token) {
      const info = getUserInfo();
      setUserInfo(info);
      try {
        const decoded = decodeToken(token);
        setUserType(Array.isArray(decoded.user_type) ? decoded.user_type : [decoded.user_type]);
      } catch {
        setUserType(null);
      }
      setIsAuthenticated(true);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, userType, userInfo, login, logout, canAccess }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 