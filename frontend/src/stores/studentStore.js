// src/stores/studentStore.js
import { create } from "zustand";
import api from "../services/api";

const useStudentStore = create((set, get) => ({
  students: [],
  student: null,
  pagination: null,
  isLoading: false,
  error: null,

  getStudents: async (page = 1, limit = 10, department = "") => {
    set({ isLoading: true, error: null });
    try {
      const params = new URLSearchParams();
      params.append("page", page);
      params.append("limit", limit);
      if (department) params.append("department", department);

      const response = await api.get(`/students?${params.toString()}`);
      set({
        students: response.data.data,
        pagination: response.data.pagination,
        isLoading: false,
      });
      return response.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to fetch students",
        isLoading: false,
      });
      throw error;
    }
  },

  getStudent: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get(`/students/${id}`);
      set({ student: response.data.data, isLoading: false });
      return response.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to fetch student",
        isLoading: false,
      });
      throw error;
    }
  },

  createStudent: async (studentData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post("/students", studentData);
      set({
        students: [response.data.data, ...get().students],
        isLoading: false,
      });
      return response.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to create student",
        isLoading: false,
      });
      throw error;
    }
  },

  updateStudent: async (id, studentData) => {
    set({ isLoading: true, error: null });
    try {
      // Make sure studentData contains enrolledCourses
      console.log("Sending student data:", studentData); // Debug line

      const response = await api.put(`/students/${id}`, studentData);
      const updatedStudent = response.data.data;

      set({
        students: get().students.map((student) =>
          student._id === id ? updatedStudent : student
        ),
        student: updatedStudent,
        isLoading: false,
      });

      return response.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to update student",
        isLoading: false,
      });
      throw error;
    }
  },

  deleteStudent: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await api.delete(`/students/${id}`);
      set({
        students: get().students.filter((student) => student._id !== id),
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to delete student",
        isLoading: false,
      });
      throw error;
    }
  },

  uploadPhoto: async (id, formData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post(`/students/${id}/photo`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // Update the student in the list
      const updatedStudents = get().students.map((student) =>
        student._id === id ? { ...student, ...response.data.data } : student
      );

      set({
        students: updatedStudents,
        student: response.data.data,
        isLoading: false,
      });

      return response.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to upload photo",
        isLoading: false,
      });
      throw error;
    }
  },

  clearError: () => set({ error: null }),
}));

export default useStudentStore;
