import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from '@/utils/baseUrl';



interface LoginCredentials {
    username: string,
    password: string
}

interface LoginResponse {
    user?: any;
    token?: string;
}

class AuthServices {
    private axiosInstance = axios.create({
        baseURL: `${BASE_URL}/api`, 
        withCredentials: true,
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        }
    });

    async login(credentials: LoginCredentials): Promise<LoginResponse> {
        try {
            const response = await this.axiosInstance.post('/authentication/login', credentials);
            
            // More flexible response checking
            const userData = response.data?.user || response.data;
            if (!userData) {
                throw new Error("Authentication succeeded but no user data received");
            }
            
            return { user: userData };
        } catch (error) {
            console.error("Login Failed:", error);
            throw error;
        }
    }
    
    async logout(): Promise<void> {
        try {
            await this.axiosInstance.post('/authentication/logout');
            // Clear any stored tokens
            await AsyncStorage.removeItem('auth_token');
        } catch (error) {
            console.error("Logout failed:", error);
            throw error;
        }
    }
    
    async getCurrentUser(): Promise<any> {
        try {
            // First check if we have a token
            const token = await AsyncStorage.getItem('auth_token');
            if (!token) return null; // No token means no logged-in user
            
            const response = await this.axiosInstance.get('/authentication/me', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error) && error.response?.status === 401) {
                await AsyncStorage.removeItem('auth_token');
                return null;
            }
            console.error("Error fetching user:", error);
            return null;
        }
    }

    async isAuthenticated(): Promise<boolean> {
        try {
            const token = await AsyncStorage.getItem('auth_token');
            if (!token) return false;
            
            await this.axiosInstance.head('/authentication/validate-token');
            return true;
        } catch (error) {
            return false;
        }
    }
}

export default AuthServices;