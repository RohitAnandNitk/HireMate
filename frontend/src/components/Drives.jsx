import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Search, Filter, Briefcase } from "lucide-react";
import DriveCard from "./DriveCard";
import Loader from "./Loader";

const Drives = () => {
  const navigate = useNavigate();
  const [drives, setDrives] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all"); // all, ongoing, finished
  const [loading, setLoading] = useState(true);

  // Sample data - replace with actual API call
  useEffect(() => {
    const sampleDrives = [
      {
        id: "DRIVE-001",
        jobId: "JOB-2024-001",
        role: "Senior Software Engineer",
        location: "Bangalore",
        startDate: "2024-01-15",
        endDate: "2024-02-15",
        status: "ongoing",
        rounds: [
          { type: "Technical", description: "Coding round" },
          { type: "System Design", description: "Architecture discussion" },
          { type: "HR", description: "Final interview" },
        ],
        totalApplicants: 45,
        shortlisted: 12,
        createdAt: "2024-01-10",
      },
      {
        id: "DRIVE-002",
        jobId: "JOB-2024-002",
        role: "Frontend Developer",
        location: "Remote",
        startDate: "2023-12-01",
        endDate: "2023-12-20",
        status: "finished",
        rounds: [
          { type: "Technical", description: "React assessment" },
          { type: "Behavioral", description: "Culture fit" },
        ],
        totalApplicants: 78,
        shortlisted: 8,
        createdAt: "2023-11-25",
      },
      {
        id: "DRIVE-003",
        jobId: "JOB-2024-003",
        role: "Data Scientist",
        location: "Hyderabad",
        startDate: "2024-02-01",
        endDate: "2024-02-28",
        status: "ongoing",
        rounds: [
          { type: "Technical", description: "ML algorithms" },
          { type: "Panel", description: "Team interview" },
        ],
        totalApplicants: 23,
        shortlisted: 5,
        createdAt: "2024-01-20",
      },
    ];

    // Simulate API call
    setTimeout(() => {
      setDrives(sampleDrives);
      setLoading(false);
    }, 1000);
  }, []);

  // Filter drives based on search and status
  const filteredDrives = drives.filter((drive) => {
    const matchesSearch =
      drive.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      drive.jobId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      drive.location.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      filterStatus === "all" || drive.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  const handleCreateNewDrive = () => {
    navigate("/job-creation");
  };

  const handleViewDrive = (driveId) => {
    // Navigate to drive details or dashboard with drive data
    console.log("Viewing drive:", driveId);
    // You can navigate to a specific drive dashboard or details page
    // navigate(`/drive/${driveId}`);
  };

  const ongoingDrives = drives.filter((drive) => drive.status === "ongoing");
  const finishedDrives = drives.filter((drive) => drive.status === "finished");

  if (loading) {
    return (
      <Loader />
    );
  }

  return (
    <div className="flex-1 w-full">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Drives</h1>
          <p className="text-sm text-gray-600 mt-1">
            Manage your recruitment drives and track progress
          </p>
        </div>
        <button
          onClick={handleCreateNewDrive}
          className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-black transition-colors"
        >
          <Plus size={16} />
          Create New Drive
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Drives</p>
              <p className="text-2xl font-semibold text-gray-900">
                {drives.length}
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <Briefcase className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Ongoing Drives</p>
              <p className="text-2xl font-semibold text-green-600">
                {ongoingDrives.length}
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <div className="h-6 w-6 bg-green-600 rounded-full flex items-center justify-center">
                <div className="h-2 w-2 bg-white rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Completed Drives</p>
              <p className="text-2xl font-semibold text-gray-600">
                {finishedDrives.length}
              </p>
            </div>
            <div className="p-3 bg-gray-100 rounded-full">
              <div className="h-6 w-6 bg-gray-600 rounded-full flex items-center justify-center">
                <div className="h-2 w-2 bg-white rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={16}
          />
          <input
            type="text"
            placeholder="Search drives by role, job ID, or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter size={16} className="text-gray-400" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Status</option>
            <option value="ongoing">Ongoing</option>
            <option value="finished">Finished</option>
          </select>
        </div>
      </div>

      {/* Drives Grid */}
      {filteredDrives.length === 0 ? (
        <div className="text-center py-12">
          <Briefcase className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No drives found
          </h3>
          <p className="text-gray-600 mb-4">
            {drives.length === 0
              ? "Get started by creating your first recruitment drive."
              : "Try adjusting your search or filter criteria."}
          </p>
          {drives.length === 0 && (
            <button
              onClick={handleCreateNewDrive}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-black transition-colors"
            >
              <Plus size={16} />
              Create Your First Drive
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredDrives.map((drive) => (
            <DriveCard
              key={drive.id}
              drive={drive}
              onView={() => handleViewDrive(drive.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Drives;
