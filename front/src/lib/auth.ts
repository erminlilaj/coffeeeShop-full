// src/lib/auth.ts - Updated AuthService
import axios from 'axios';

const API_URL = 'http://localhost:8080/api';
//const API_URL = 'https://ms-coffeeshop.onrender.com/api';
export interface AuthResponse {
    token: string;
}

export interface LoginCredentials {
    username: string;
    password: string;
}

class AuthService {
    private static TOKEN_KEY = 'coffee_shop_token';

    async login(credentials: LoginCredentials): Promise<boolean> {
        try {
            const response = await axios.post<AuthResponse>(`${API_URL}/auth/login`, credentials);
            if (response.data.token) {
                this.setToken(response.data.token);
                return true;
            }
            return false;
        } catch (error) {
            console.error('Login failed:', error);
            return false;
        }
    }

    logout(): void {
        // Clear both localStorage and cookie
        localStorage.removeItem(AuthService.TOKEN_KEY);
        document.cookie = 'coffee_shop_token=; max-age=0; path=/;';
        
        // Use window.location.replace for more reliable redirection
        window.location.replace('/login');
    }

    setToken(token: string): void {
        localStorage.setItem(AuthService.TOKEN_KEY, token);
        // Also set the token in document.cookie for Astro SSR
        document.cookie = `coffee_shop_token=${token}; path=/`;
    }

    getToken(): string | null {
        return localStorage.getItem(AuthService.TOKEN_KEY);
    }

    isAuthenticated(): boolean {
        return !!this.getToken();
    }

    getAuthHeaders() {
        const token = this.getToken();
        return token ? { Authorization: `Bearer ${token}` } : {};
    }
}

export const authService = new AuthService();