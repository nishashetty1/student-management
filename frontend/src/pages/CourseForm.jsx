import React, { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import { BookOpen, Save, ArrowLeft } from "lucide-react";
import useCourseStore from "../stores/courseStore";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";

const CourseForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    course,
    isLoading,
    error,
    getCourse,
    createCourse,
    updateCourse,
    clearError,
  } = useCourseStore();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    credits: "",
  });

  const isEdit = !!id;

  useEffect(() => {
    if (isEdit) {
      getCourse(id);
    }
    // eslint-disable-next-line
  }, [id]);

  useEffect(() => {
    if (course && isEdit) {
      setFormData({
        title: course.title || "",
        description: course.description || "",
        credits: course.credits || "",
      });
    }
  }, [course, isEdit]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      clearError();
    }
  }, [error, clearError]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Convert credits to number if provided
      const courseData = {
        ...formData,
        credits: formData.credits ? parseInt(formData.credits) : undefined,
      };

      if (isEdit) {
        await updateCourse(id, courseData);
      } else {
        await createCourse(courseData);
      }

      toast.success(`Course ${isEdit ? "updated" : "created"} successfully!`);
      navigate("/courses");
    } catch (error) {
      // Error is handled by the store
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <div className="flex items-center mb-6">
        <Link to="/courses" className="mr-4">
          <Button variant="secondary">
            <ArrowLeft size={16} className="mr-1" /> Back
          </Button>
        </Link>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center">
          <BookOpen className="mr-2" />
          {isEdit ? "Edit Course" : "Add New Course"}
        </h1>
      </div>

      <Card>
        {isLoading && isEdit ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Course Title"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="e.g., Web Development"
            />

            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Description
              </label>
              <textarea
                id="description"
                name="description"
                rows={4}
                className="input"
                value={formData.description}
                onChange={handleChange}
                placeholder="Course description (optional)"
              />
            </div>

            <Input
              label="Credits"
              id="credits"
              name="credits"
              type="number"
              value={formData.credits}
              onChange={handleChange}
              placeholder="e.g., 3"
              min="1"
              max="10"
            />

            <div className="flex justify-end space-x-3">
              <Button
                type="button"
                variant="secondary"
                onClick={() => navigate("/courses")}
              >
                Cancel
              </Button>
              <Button type="submit" isLoading={isLoading}>
                <Save size={16} className="mr-1" />
                {isEdit ? "Update Course" : "Save Course"}
              </Button>
            </div>
          </form>
        )}
      </Card>
    </div>
  );
};

export default CourseForm;
