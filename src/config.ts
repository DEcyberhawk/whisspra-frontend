// This file centralizes the API and Socket URLs for the application.
// It uses Vite's environment variables to allow for different configurations
// between development, production, and native mobile builds.

// To fix "Failed to fetch" on mobile, you MUST create a `.env` file in the root
// of the project and set VITE_API_URL and VITE_SOCKET_URL to your computer's local IP address.
// Example .env file:
// VITE_API_URL=http://192.168.1.10:5000/api
// VITE_SOCKET_URL=http://192.168.1.10:5000

export const API_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:5000/api';
export const SOCKET_URL = (import.meta as any).env?.VITE_SOCKET_URL || 'http://localhost:5000';
