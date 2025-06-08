// src/pages/StudentForm.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import { User, Save, ArrowLeft, Upload, Trash2, X } from "lucide-react";
import useStudentStore from "../stores/studentStore";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import useCourseStore from "../stores/courseStore";
import api, { baseURL } from "../services/api";

const StudentForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    student,
    isLoading,
    error,
    getStudent,
    createStudent,
    updateStudent,
    uploadPhoto,
    clearError,
  } = useStudentStore();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    age: "",
    department: "",
  });

  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const { courses, getCourses } = useCourseStore();
  const [selectedCourses, setSelectedCourses] = useState([]);

  const isEdit = !!id;

  useEffect(() => {
    if (isEdit) {
      getStudent(id);
    }
    // eslint-disable-next-line
  }, [id]);

  useEffect(() => {
    if (student && isEdit) {
      setFormData({
        name: student.name || "",
        email: student.email || "",
        age: student.age || "",
        department: student.department || "",
      });

      if (student.profilePicture) {
        setPhotoPreview(
          `${baseURLWithoutApiPath}/${student.profilePicture}`
        );
      }

      // Add this code to set the selected courses when editing
      if (student.enrolledCourses && Array.isArray(student.enrolledCourses)) {
        // If enrolledCourses are objects with _id properties
        if (typeof student.enrolledCourses[0] === "object") {
          setSelectedCourses(
            student.enrolledCourses.map((course) => course._id)
          );
        }
        // If enrolledCourses are already just IDs
        else {
          setSelectedCourses(student.enrolledCourses);
        }
      }
    }
  }, [student, isEdit]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      clearError();
    }
  }, [error, clearError]);

  useEffect(() => {
    getCourses();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handlePhotoChange = (e) => {
    if (e.target.files[0]) {
      setPhoto(e.target.files[0]);
      setPhotoPreview(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handlePhotoError = (e) => {
    e.target.onerror = null; // Prevent infinite loop
    e.target.src = `${baseURLWithoutApiPath}/no-photo.jpg`;
  };

  const removePhoto = () => {
    setPhoto(null);
    setPhotoPreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const studentData = {
      ...formData,
      age: formData.age ? parseInt(formData.age) : undefined,
      enrolledCourses: selectedCourses,
    };

    try {
      let response;

      if (isEdit) {
        response = await updateStudent(id, studentData);
      } else {
        response = await createStudent(studentData);
      }

      const studentId = response.data._id || id;

      if (photo) {
        const formData = new FormData();
        formData.append("profilePicture", photo);
        await uploadPhoto(studentId, formData);
      }

      toast.success(`Student ${isEdit ? "updated" : "created"} successfully!`);
      navigate("/students");
    } catch (error) {
      // Error is handled by the store
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <div className="flex items-center mb-6">
        <Link to="/students" className="mr-4">
          <Button variant="secondary">
            <ArrowLeft size={16} className="mr-1" /> Back
          </Button>
        </Link>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center">
          <User className="mr-2" />{" "}
          {isEdit ? "Edit Student" : "Add New Student"}
        </h1>
      </div>

      <Card>
        {isLoading && isEdit ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-1">
                <div className="flex flex-col items-center">
                  <div className="w-40 h-40 mb-4 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center border-2 border-gray-300">
                    {photoPreview ? (
                      <div className="relative w-full h-full">
                        <img
                          src={photoPreview}
                          alt="Preview"
                          className="w-full h-full object-cover"
                          onError={handlePhotoError}
                        />
                        <button
                          type="button"
                          onClick={removePhoto}
                          className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ) : (
                      <User size={64} className="text-gray-400" />
                    )}
                  </div>
                  <Button
                    type="button"
                    variant="secondary"
                    as="label"
                    className="cursor-pointer"
                  >
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handlePhotoChange}
                    />
                    <Upload size={16} className="mr-1" /> Upload Photo
                  </Button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Enrolled Courses
                </label>
                <div className="space-y-2 max-h-40 overflow-y-auto border border-gray-300 rounded-md p-3">
                  {courses.map((course) => (
                    <label key={course._id} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedCourses.includes(course._id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedCourses([
                              ...selectedCourses,
                              course._id,
                            ]);
                          } else {
                            setSelectedCourses(
                              selectedCourses.filter((id) => id !== course._id)
                            );
                          }
                        }}
                        className="mr-2"
                      />
                      <span className="text-sm">{course.title}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="md:col-span-2">
                <Input
                  label="Full Name"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />

                <Input
                  label="Email Address"
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Age"
                    id="age"
                    name="age"
                    type="number"
                    value={formData.age}
                    onChange={handleChange}
                  />

                  <Input
                    label="Department"
                    id="department"
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <Button
                type="button"
                variant="secondary"
                onClick={() => navigate("/students")}
              >
                Cancel
              </Button>
              <Button type="submit" isLoading={isLoading}>
                <Save size={16} className="mr-1" />
                {isEdit ? "Update Student" : "Save Student"}
              </Button>
            </div>
          </form>
        )}
      </Card>
    </div>
  );
};

export default StudentForm;
