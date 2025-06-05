import {jwtDecode} from 'jwt-decode';

interface StudentInfo {
  id: number;
  cms: number;
  batch: number;
  class_section: string;
  student_class: string;
  user: number;
}

interface UserInfo {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  username: string;
}

export interface TokenPayload {
  token_type: string;
  exp: number;
  iat: number;
  jti: string;
  user_id: number;
  user_type: string[];
  user: UserInfo;
  student?: StudentInfo;
}

export const getToken = () => localStorage.getItem('access_token');
export const getRefreshToken = () => localStorage.getItem('refresh_token');

export const setTokens = (access: string, refresh: string) => {
  localStorage.setItem('access_token', access);
  localStorage.setItem('refresh_token', refresh);
};

export const removeTokens = () => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
};

export const decodeToken = (token: string): TokenPayload => {
  try {
    console.log("Token decoded as:")
    console.log(jwtDecode<TokenPayload>(token));
    return jwtDecode<TokenPayload>(token);
  } catch (error) {
    console.error('Error decoding token:', error);
    throw error;
  }
};

export const isTokenValid = (token: string): boolean => {
  try {
    const decoded = decodeToken(token);
    return decoded.exp * 1000 > Date.now();
  } catch {
    return false;
  }
};

export const getUserInfo = (): { user: UserInfo; student?: StudentInfo } | null => {
  const token = getToken();
  if (!token) return null;
  try {
    const decoded = decodeToken(token);
    return {
      user: decoded.user,
      student: decoded.student
    };
  } catch {
    return null;
  }
}; 