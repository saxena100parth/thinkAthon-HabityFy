import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { authAPI } from "../utils/api";
import * as SecureStore from "expo-secure-store";

interface User {
  _id: string;
  email: string;
  username: string;
  mobile: string;
  isEmailVerified: boolean;
  isMobileVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (credentials: {
    emailOrUsername: string;
    password: string;
  }) => Promise<{ success: boolean; error?: string; data?: any }>;
  signup: (userData: {
    email: string;
    username: string;
    mobile: string;
  }) => Promise<{ success: boolean; error?: string; data?: any }>;
  verifyOTP: (otpData: {
    email: string;
    otp: string;
    password: string;
  }) => Promise<{ success: boolean; error?: string; data?: any }>;
  forgotPassword: (
    email: string
  ) => Promise<{ success: boolean; error?: string; data?: any }>;
  resetPassword: (resetData: {
    email: string;
    otp: string;
    password: string;
  }) => Promise<{ success: boolean; error?: string; data?: any }>;
  updateUser: (userData: User) => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = await SecureStore.getItemAsync("token");
        const userData = await SecureStore.getItemAsync("user");

        if (token && userData) {
          try {
            // Verify token with backend
            const response = await authAPI.getProfile();
            setUser(response.data.user);
          } catch (error) {
            // Token is invalid, clear storage
            await SecureStore.deleteItemAsync("token");
            await SecureStore.deleteItemAsync("user");
            setUser(null);
          }
        }
      } catch (error) {
        console.error("Error initializing auth:", error);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (credentials: {
    emailOrUsername: string;
    password: string;
  }) => {
    try {
      const response = await authAPI.login(credentials);
      const { token, user: userData } = response.data;

      await SecureStore.setItemAsync("token", token);
      await SecureStore.setItemAsync("user", JSON.stringify(userData));
      setUser(userData);

      return { success: true, data: response.data };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || "Login failed",
      };
    }
  };

  const signup = async (userData: {
    email: string;
    username: string;
    mobile: string;
  }) => {
    try {
      console.log("AuthContext signup - sending data:", userData);
      const response = await authAPI.signup(userData);
      console.log("AuthContext signup - response:", response.data);
      return { success: true, data: response.data };
    } catch (error: any) {
      console.log("AuthContext signup - error:", error);
      console.log("AuthContext signup - error response:", error.response?.data);
      return {
        success: false,
        error: error.response?.data?.message || "Signup failed",
      };
    }
  };

  const verifyOTP = async (otpData: {
    email: string;
    otp: string;
    password: string;
  }) => {
    try {
      const response = await authAPI.verifyOTP(otpData);
      const { token, user: userData } = response.data;

      await SecureStore.setItemAsync("token", token);
      await SecureStore.setItemAsync("user", JSON.stringify(userData));
      setUser(userData);

      return { success: true, data: response.data };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || "OTP verification failed",
      };
    }
  };

  const forgotPassword = async (email: string) => {
    try {
      const response = await authAPI.forgotPassword(email);
      return { success: true, data: response.data };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || "Failed to send reset code",
      };
    }
  };

  const resetPassword = async (resetData: {
    email: string;
    otp: string;
    password: string;
  }) => {
    try {
      const response = await authAPI.resetPassword(resetData);
      return { success: true, data: response.data };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || "Password reset failed",
      };
    }
  };

  const updateUser = async (userData: User) => {
    setUser(userData);
    await SecureStore.setItemAsync("user", JSON.stringify(userData));
  };

  const logout = async () => {
    try {
      await SecureStore.deleteItemAsync("token");
      await SecureStore.deleteItemAsync("user");
      setUser(null);
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    login,
    signup,
    verifyOTP,
    forgotPassword,
    resetPassword,
    updateUser,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
