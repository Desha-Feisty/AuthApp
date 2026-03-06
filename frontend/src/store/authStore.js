import { create } from "zustand";
import axios from "axios";

const API_URL = "http://localhost:5001/api/auth";
axios.defaults.withCredentials = true;
export const useAuthStore = create((set) => ({
    user: null,
    isAuthenticated: false,
    error: false,
    isLoading: false,
    isCheckingAuth: true,
    signup: async (email, password, name) => {
        set({ isLoading: true, error: null });
        try {
            const response = await axios.post(`${API_URL}/signup`, {
                email,
                password,
                name,
            });
            set({
                user: response.data.user,
                isAuthenticated: true,
                isLoading: false,
            });
        } catch (error) {
            set({
                error:
                    error.response?.data?.message ||
                    error.message ||
                    "Signup failed",
                isLoading: false,
            });
        }
    },
    verifyEmail: async (code) => {
        set({ isLoading: true, error: null });
        try {
            const response = await axios.post(`${API_URL}/verify-email`, {
                code,
            });
            set({
                user: response.data.user,
                isAuthenticated: true,
                isLoading: false,
            });
            return response.data.user;
        } catch (error) {
            set({
                error:
                    error.response?.data?.message ||
                    error.message ||
                    "Email verification failed",
                isLoading: false,
            });
        }
    },
    checkAuth: async () => {
        set({ isCheckingAuth: true });
        try {
            const response = await axios.get(`${API_URL}/check-auth`);
            set({
                user: response.data.user,
                isAuthenticated: true,
                isCheckingAuth: false,
            });
        } catch (error) {
            set({
                isAuthenticated: false,
                isCheckingAuth: false,
                error: null,
            });
            console.log(error);
        }
    },
    login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
            const response = await axios.post(`${API_URL}/login`, {
                email,
                password,
            });
            set({
                user: response.data.user,
                isAuthenticated: true,
                isLoading: false,
                error: null,
            });
        } catch (error) {
            set({
                error:
                    error.response?.data?.message ||
                    error.message ||
                    "Login failed",
                isLoading: false,
            });
        }
    },
    logout: async () => {
        set({ isLoading: true, error: null });
        try {
            await axios.get(`${API_URL}/logout`);
            set({
                user: null,
                isAuthenticated: false,
                isLoading: false,
                error: null,
            });
        } catch (error) {
            set({
                error: "Error logging out",
                isLoading: false,
            });
            throw error;
        }
    },
}));
