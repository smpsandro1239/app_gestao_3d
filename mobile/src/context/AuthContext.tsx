import React, { createContext, ReactNode, useContext, useState } from 'react';
import { login as loginApi } from '../services/authService';

interface AuthContextData {
  signed: boolean;
  user: object | null;
  signIn: (email: string, pass: string) => Promise<void>;
  signOut: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<object | null>(null);
  const [loading, setLoading] = useState(false);

  const signIn = async (email: string, pass: string) => {
    setLoading(true);
    try {
      const response = await loginApi(email, pass);
      setUser(response.user || { email }); // Assuming response has user or just using email
      // Store token if needed persistence, for now api defaults handle it in session
    } catch (error) {
       throw error;
    } finally {
        setLoading(false);
    }
  };

  const signOut = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ signed: !!user, user, signIn, signOut, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  return context;
};
