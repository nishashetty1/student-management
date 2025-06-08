import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import {
  BookOpen,
  Search,
  Plus,
  Edit,
  Trash2,
  GraduationCap,
} from "lucide-react";
import useCourseStore from "../stores/courseStore";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";

const CourseList = () => {
  const { courses, isLoading, error, getCourses, deleteCourse, clearError } =
    useCourseStore();

  const [searchTitle, setSearchTitle] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(null);

  useEffect(() => {
    loadCourses();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (error) {
      toast.error(error);
      clearError();
    }
  }, [error, clearError]);

  const loadCourses = () => {
    getCourses(searchTitle);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    loadCourses();
  };

  const handleDelete = async (id) => {
    try {
      await deleteCourse(id);
      toast.success("Course deleted successfully");
      setConfirmDelete(null);
    } catch (error) {
      // Error is handled by the store
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center">
          <BookOpen className="mr-2" /> Course Management
        </h1>
        <Link to="/courses/add">
          <Button>
            <Plus className="mr-1 h-5 w-5" /> Add Course
          </Button>
        </Link>
      </div>

      <Card className="mb-6">
        <form onSubmit={handleSearch} className="flex flex-wrap gap-4">
          <div className="flex-grow max-w-md">
            <Input
              placeholder="Search by course title"
              value={searchTitle}
              onChange={(e) => setSearchTitle(e.target.value)}
            />
          </div>
          <Button type="submit">
            <Search className="mr-1 h-5 w-5" /> Search
          </Button>
          {searchTitle && (
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setSearchTitle("");
                getCourses("");
              }}
            >
              Clear
            </Button>
          )}
        </form>
      </Card>

      {isLoading ? (
        <div className="flex justify-center my-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <>
          {courses.length === 0 ? (
            <Card className="text-center py-12">
              <GraduationCap size={64} className="mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500 mb-4">No courses found</p>
              <Link to="/courses/add">
                <Button>
                  <Plus className="mr-1 h-5 w-5" /> Add Course
                </Button>
              </Link>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => (
                <Card
                  key={course._id}
                  className="hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <BookOpen className="h-6 w-6 text-blue-600" />
                      </div>
                      <div className="ml-3">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {course.title}
                        </h3>
                        {course.credits && (
                          <p className="text-sm text-gray-500">
                            {course.credits} Credits
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Link to={`/courses/edit/${course._id}`}>
                        <button className="text-blue-600 hover:text-blue-900">
                          <Edit size={18} />
                        </button>
                      </Link>
                      <button
                        className="text-red-600 hover:text-red-900"
                        onClick={() => setConfirmDelete(course._id)}
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>

                  {course.description && (
                    <p className="text-gray-600 text-sm mb-4">
                      {course.description}
                    </p>
                  )}

                  <div className="text-xs text-gray-500">
                    Created: {new Date(course.createdAt).toLocaleDateString()}
                  </div>
                </Card>
              ))}
            </div>
          )}
        </>
      )}

      {/* Confirmation Dialog */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="max-w-md w-full">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Confirm Deletion
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this course? This action cannot be
              undone.
            </p>
            <div className="flex justify-end space-x-3">
              <Button
                variant="secondary"
                onClick={() => setConfirmDelete(null)}
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                onClick={() => handleDelete(confirmDelete)}
              >
                Delete
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default CourseList;
