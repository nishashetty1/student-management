import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Users,
  BookOpen,
  UserPlus,
  BookPlus,
  BarChart2,
  TrendingUp,
} from "lucide-react";
import api from "../services/api";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";

const Dashboard = () => {
  const [stats, setStats] = useState({
    studentCount: 0,
    courseCount: 0,
    departmentCount: 0,
    recentStudents: [],
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await api.get("/dashboard");
        const data = response.data.data;

        setStats({
          studentCount: data.studentCount || 0,
          courseCount: data.courseCount || 0,
          departmentCount: data.departmentCount || 0,
          recentStudents: data.recentStudents || [],
        });
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        toast.error("Failed to load dashboard data. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-4rem)]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-400 bg-opacity-30">
              <Users size={24} />
            </div>
            <div className="ml-4">
              <h2 className="text-lg font-semibold">Total Students</h2>
              <p className="text-3xl font-bold">{stats.studentCount}</p>
            </div>
          </div>
          <div className="mt-4">
            <Link to="/students">
              <Button className="w-full bg-white bg-opacity-20 hover:bg-opacity-30 border-none text-blue-600">
                View Students
              </Button>
            </Link>
          </div>
        </Card>

        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-400 bg-opacity-30">
              <BookOpen size={24} />
            </div>
            <div className="ml-4">
              <h2 className="text-lg font-semibold">Total Courses</h2>
              <p className="text-3xl font-bold">{stats.courseCount}</p>
            </div>
          </div>
          <div className="mt-4">
            <Link to="/courses">
              <Button className="w-full bg-white bg-opacity-20 hover:bg-opacity-30 border-none text-green-600">
                View Courses
              </Button>
            </Link>
          </div>
        </Card>

        <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-400 bg-opacity-30">
              <TrendingUp size={24} />
            </div>
            <div className="ml-4">
              <h2 className="text-lg font-semibold">Departments</h2>
              <p className="text-3xl font-bold">{stats.departmentCount}</p>
            </div>
          </div>
          <div className="mt-4">
            <Link to="/students">
              <Button className="w-full bg-white bg-opacity-20 hover:bg-opacity-30 border-none text-purple-600">
                View Details
              </Button>
            </Link>
          </div>
        </Card>

        <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-orange-400 bg-opacity-30">
              <BarChart2 size={24} />
            </div>
            <div className="ml-4">
              <h2 className="text-lg font-semibold">Quick Actions</h2>
              <p className="text-base mt-1">Add New</p>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2">
            <Link to="/students/add">
              <Button className="w-full bg-white bg-opacity-20 hover:bg-opacity-30 border-none text-orange-600 text-xs">
                <UserPlus size={14} className="mr-1" /> Student
              </Button>
            </Link>
            <Link to="/courses/add">
              <Button className="w-full bg-white bg-opacity-20 hover:bg-opacity-30 border-none text-orange-600 text-xs">
                <BookPlus size={14} className="mr-1" /> Course
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
