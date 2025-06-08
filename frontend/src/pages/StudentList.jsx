// src/pages/StudentList.jsx
import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import {
  Users,
  Search,
  Plus,
  Edit,
  Trash2,
  ArrowLeft,
  ArrowRight,
  Filter,
} from "lucide-react";
import useStudentStore from "../stores/studentStore";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";

const StudentList = () => {
  const {
    students,
    pagination,
    isLoading,
    error,
    getStudents,
    deleteStudent,
    clearError,
  } = useStudentStore();

  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = Number(searchParams.get("page") || 1);
  const currentDepartment = searchParams.get("department") || "";
  const currentLimit = Number(searchParams.get("limit") || 10);

  const [confirmDelete, setConfirmDelete] = useState(null);

  useEffect(() => {
    // This effect will run whenever any search parameter changes
    loadStudents();
    // eslint-disable-next-line
  }, [currentPage, currentLimit, currentDepartment]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      clearError();
    }
  }, [error, clearError]);

  const loadStudents = () => {
    getStudents(currentPage, currentLimit, currentDepartment);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchParams({
      page: 1,
      limit: currentLimit,
      department: searchParams.get("department") || "",
    });
  };

  const handlePageChange = (newPage) => {
    setSearchParams({
      page: newPage,
      limit: currentLimit,
      department: currentDepartment,
    });
  };

  const handleDelete = async (id) => {
    try {
      await deleteStudent(id);
      toast.success("Student deleted successfully");
      setConfirmDelete(null);
    } catch (error) {
      // Error is handled by the store
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center">
          <Users className="mr-2" /> Student Management
        </h1>
        <Link to="/students/add">
          <Button>
            <Plus className="mr-1 h-5 w-5" /> Add Student
          </Button>
        </Link>
      </div>

      <Card className="mb-6">
        <form onSubmit={handleSearch} className="flex flex-wrap gap-4">
          <div className="flex-grow max-w-md">
            <Input
              placeholder="Search by department"
              value={currentDepartment}
              onChange={(e) =>
                setSearchParams({
                  ...Object.fromEntries(searchParams),
                  department: e.target.value,
                })
              }
            />
          </div>
          <Button type="submit">
            <Search className="mr-1 h-5 w-5" /> Search
          </Button>
          {currentDepartment && (
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setSearchParams({
                  page: 1,
                  limit: currentLimit,
                  department: "",
                });
              }}
            >
              <Filter className="mr-1 h-5 w-5" /> Clear Filter
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
          {students.length === 0 ? (
            <Card className="text-center py-12">
              <p className="text-gray-500 mb-4">No students found</p>
              <Link to="/students/add">
                <Button>
                  <Plus className="mr-1 h-5 w-5" /> Add Student
                </Button>
              </Link>
            </Card>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white rounded-lg overflow-hidden shadow-md">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="py-3 px-4 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="py-3 px-4 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="py-3 px-4 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">
                      Department
                    </th>
                    <th className="py-3 px-4 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">
                      Age
                    </th>
                    <th className="py-3 px-4 text-right text-sm font-medium text-gray-600 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {students.map((student) => (
                    <tr key={student._id} className="hover:bg-gray-50">
                      <td className="py-4 px-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 flex-shrink-0">
                            <img
                              className="h-10 w-10 rounded-full object-cover"
                              src={`http://localhost:3000/uploads/${
                                student.profilePicture || "no-photo.jpg"
                              }`}
                              alt={student.name}
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src =
                                  "http://localhost:3000/no-photo.jpg";
                              }}
                            />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {student.name}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4 whitespace-nowrap text-sm text-gray-600">
                        {student.email}
                      </td>
                      <td className="py-4 px-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                          {student.department || "Not Specified"}
                        </span>
                      </td>
                      <td className="py-4 px-4 whitespace-nowrap text-sm text-gray-600">
                        {student.age || "N/A"}
                      </td>
                      <td className="py-4 px-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <Link to={`/students/edit/${student._id}`}>
                            <button className="text-blue-600 hover:text-blue-900">
                              <Edit size={18} />
                            </button>
                          </Link>
                          <button
                            className="text-red-600 hover:text-red-900"
                            onClick={() => setConfirmDelete(student._id)}
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {pagination && pagination.total > 0 && (
            <div className="flex justify-between items-center mt-6">
              <div className="text-sm text-gray-700">
                Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
                {Math.min(pagination.page * pagination.limit, pagination.total)}{" "}
                of {pagination.total} students
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="secondary"
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page === 1}
                >
                  <ArrowLeft size={16} />
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={
                    pagination.page ===
                    Math.ceil(pagination.total / pagination.limit)
                  }
                >
                  <ArrowRight size={16} />
                </Button>
              </div>
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
              Are you sure you want to delete this student? This action cannot
              be undone.
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

export default StudentList;
