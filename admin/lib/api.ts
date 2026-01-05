const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

export const apiClient = {
    get: async (endpoint: string, token?: string) => {
        const headers: HeadersInit = {
            'Content-Type': 'application/json',
        };
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        console.log('API GET:', `${API_BASE_URL}${endpoint}`);

        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: 'GET',
            headers,
        });

        console.log('Response status:', response.status);

        if (!response.ok) {
            const error = await response.text();
            console.error('API Error:', error);
            throw new Error(`API Error: ${response.statusText}`);
        }

        return response.json();
    },

    post: async (endpoint: string, data: any, token?: string) => {
        const headers: HeadersInit = {
            'Content-Type': 'application/json',
        };
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: 'POST',
            headers,
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error(`API Error: ${response.statusText}`);
        }

        return response.json();
    },

    put: async (endpoint: string, data: any, token?: string) => {
        const headers: HeadersInit = {
            'Content-Type': 'application/json',
        };
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: 'PUT',
            headers,
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error(`API Error: ${response.statusText}`);
        }

        return response.json();
    },

    delete: async (endpoint: string, token?: string) => {
        const headers: HeadersInit = {
            'Content-Type': 'application/json',
        };
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: 'DELETE',
            headers,
        });

        if (!response.ok) {
            throw new Error(`API Error: ${response.statusText}`);
        }

        return response.json();
    },
};
