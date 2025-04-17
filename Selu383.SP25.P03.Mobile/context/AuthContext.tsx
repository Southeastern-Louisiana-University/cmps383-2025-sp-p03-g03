import React, { createContext, useEffect, useState, ReactNode } from "react";
import AuthServices from "@/services/AuthServices";
import AsyncStorage from "@react-native-async-storage/async-storage";

const authServices = new AuthServices();

interface UserDto {
  id: number;
  userName: string;
  roles: string[];
}

interface AuthType {
  isAuthenticated: boolean;
  isLoading: boolean;
  signin: (username: string, password: string) => Promise<boolean>;
  signout: () => Promise<void>;
  user: UserDto | null;
  error: string | null;
}

export const AuthContext = createContext<AuthType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<UserDto | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Load user from storage or API on app startup
  useEffect(() => {
    const initializeAuth = async () => {
      setIsLoading(true);
      try {
        const stored = await AsyncStorage.getItem("user");
        if (stored) {
          const parsed = JSON.parse(stored);
          setUser(parsed);
          setIsAuthenticated(true);
        } else {
          const currentUser = await authServices.getCurrentUser();
          if (currentUser) {
            setUser(currentUser);
            setIsAuthenticated(true);
            await AsyncStorage.setItem("user", JSON.stringify(currentUser));
          }
        }
      } catch (err) {
        console.error("❌ Error during auth init:", err);
        await clearAuthState();
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const clearAuthState = async () => {
    await AsyncStorage.removeItem("user");
    setUser(null);
    setIsAuthenticated(false);
  };

  const signin = async (username: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    try {
        const response = await authServices.login({ userName: username, password });


      // Support for both { user, token } and just user
      const userData = response.user ?? response;

      if (!userData?.id) {
        throw new Error("Invalid login response.");
      }

      setUser(userData);
      setIsAuthenticated(true);
      await AsyncStorage.setItem("user", JSON.stringify(userData));
      return true;
    } catch (err: any) {
      console.error("❌ Login failed:", err);
      setError(err.message || "Login failed");
      await clearAuthState();
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const signout = async () => {
    setIsLoading(true);
    try {
      await authServices.logout();
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
      await clearAuthState();
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        signin,
        signout,
        user,
        isLoading,
        error,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
