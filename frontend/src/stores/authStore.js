import { create } from "zustand";
import api from "../services/api";

const parseStoredUser = () => {
  try {
    const storedUser = localStorage.getItem("user");
    if (storedUser && storedUser !== "undefined" && storedUser !== "null") {
      return JSON.parse(storedUser);
    }
    return null;
  } catch (error) {
    console.warn("Failed to parse stored user:", error);
    localStorage.removeItem("user");
    return null;
  }
};

const useAuthStore = create((set, get) => ({
  user: parseStoredUser(),
  token: localStorage.getItem("token") || null,
  isAuthenticated: !!(
    localStorage.getItem("token") && localStorage.getItem("token") !== "null"
  ),
  isLoading: false,
  error: null,

  initializeAuth: async () => {
    const token = localStorage.getItem("token");
    const user = parseStoredUser();
    
    if (token && token !== "null") {
      try {
        set({ 
          isAuthenticated: true,
          user,
          token
        });
        return true;
      } catch (error) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        });
        return false;
      }
    } else {
      set({
        isAuthenticated: false,
        user: null,
        token: null
      });
      return false;
    }
  },

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post("/auth/login", { email, password });
      const { token, user } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      set({
        user,
        token,
        isAuthenticated: true,
        isLoading: false,
      });

      return response.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || "Login failed",
        isLoading: false,
      });
      throw error;
    }
  },

  register: async (userData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post("/auth/register", userData);
      const { token, user } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      set({
        user,
        token,
        isAuthenticated: true,
        isLoading: false,
      });

      return response.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || "Registration failed",
        isLoading: false,
      });
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    set({
      user: null,
      token: null,
      isAuthenticated: false,
    });
  },

  clearError: () => set({ error: null }),
}));

export default useAuthStore;
