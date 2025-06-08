import { create } from "zustand";
import api from "../services/api";

const useCourseStore = create((set, get) => ({
  courses: [],
  course: null,
  isLoading: false,
  error: null,

  getCourses: async (title = "") => {
    set({ isLoading: true, error: null });
    try {
      const params = new URLSearchParams();
      if (title) params.append("title", title);

      const response = await api.get(`/courses?${params.toString()}`);
      set({
        courses: response.data.data,
        isLoading: false,
      });
      return response.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to fetch courses",
        isLoading: false,
      });
      throw error;
    }
  },

  getCourse: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get(`/courses/${id}`);
      set({ course: response.data.data, isLoading: false });
      return response.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to fetch course",
        isLoading: false,
      });
      throw error;
    }
  },

  createCourse: async (courseData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post("/courses", courseData);
      set({
        courses: [response.data.data, ...get().courses],
        isLoading: false,
      });
      return response.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to create course",
        isLoading: false,
      });
      throw error;
    }
  },

  updateCourse: async (id, courseData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.put(`/courses/${id}`, courseData);
      const updatedCourse = response.data.data;

      set({
        courses: get().courses.map((course) =>
          course._id === id ? updatedCourse : course
        ),
        course: updatedCourse,
        isLoading: false,
      });

      return response.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to update course",
        isLoading: false,
      });
      throw error;
    }
  },

  deleteCourse: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await api.delete(`/courses/${id}`);
      set({
        courses: get().courses.filter((course) => course._id !== id),
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to delete course",
        isLoading: false,
      });
      throw error;
    }
  },

  clearError: () => set({ error: null }),
}));

export default useCourseStore;
