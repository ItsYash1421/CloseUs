'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiClient } from '@/lib/api';

interface AuthContextType {
    token: string | null;
    admin: any | null;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [token, setToken] = useState<string | null>(null);
    const [admin, setAdmin] = useState<any | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Check for saved token
        const savedToken = localStorage.getItem('admin_token');
        if (savedToken) {
            setToken(savedToken);
            // Fetch admin profile
            apiClient.get('/admin/auth/me', savedToken)
                .then(response => {
                    setAdmin(response.data);
                })
                .catch(() => {
                    localStorage.removeItem('admin_token');
                    setToken(null);
                })
                .finally(() => setIsLoading(false));
        } else {
            setIsLoading(false);
        }
    }, []);

    const login = async (email: string, password: string) => {
        const response = await apiClient.post('/admin/auth/login', { email, password });
        const { token: newToken, admin: adminData } = response.data;

        setToken(newToken);
        setAdmin(adminData);
        localStorage.setItem('admin_token', newToken);
    };

    const logout = () => {
        setToken(null);
        setAdmin(null);
        localStorage.removeItem('admin_token');
    };

    return (
        <AuthContext.Provider value={{ token, admin, login, logout, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
