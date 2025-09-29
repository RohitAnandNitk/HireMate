import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Search, Filter, Briefcase } from "lucide-react";
import DriveCard from "./DriveCard";
import Loader from "./Loader";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import config from "../Config/BaseURL";
const BASE_URL = config.BASE_URL;

const Drives = () => {
  const navigate = useNavigate();
  const [drives, setDrives] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all"); // all, ongoing, finished
  const [loading, setLoading] = useState(true);

  // we have to bring the company id form the current user(hr)
  const [companyId, setCompanyId] = useState("comp_01");

  useEffect(() => {
    const fetchDrives = async () => {
      try {
        setLoading(true);

        const response = await fetch(
          `${BASE_URL}/api/drive/company/${companyId}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch drives");
        }

        const data = await response.json();
        console.log("All drives : ", data.drives);
        setDrives(data.drives); // assuming API returns array of drives
      } catch (err) {
        console.error("Error fetching drives:", err.message);
        //use toast here
        toast.error("Could not load drives. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchDrives();
  }, []);

  // Filter drives based on search and status
  const filteredDrives = drives.filter((drive) => {
    const matchesSearch =
      drive.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      drive.job_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      drive.location.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      filterStatus === "all" || drive.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  const handleCreateNewDrive = () => {
    // here we have to navigate to the progress page.....
    navigate("/job-creation");
  };

  const handleViewDrive = (driveId) => {
    // Navigate to drive details or dashboard with drive data
    console.log("Viewing drive:", driveId);
    // You can navigate to a specific drive dashboard or details page
    // navigate(`/drive/${driveId}`);

    //for testing purpose we are navigating to process (currently dont have drive id)
    navigate(`/process/${driveId}`);
  };

  const ongoingDrives = drives.filter(
    (drive) =>
      drive.status === "resumeUploaded" ||
      drive.status === "resumeShortlisted" ||
      drive.status === "emailSent" ||
      drive.status === "InterviewScheduled"
  );
  const finishedDrives = drives.filter(
    (drive) => drive.status === "selectionEmailSent"
  );

  if (loading) {
    return <Loader />;
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
        <div className="bg-white rounded-lg shadow-lg border border-gray-300 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Drives</p>
              <p className="text-2xl font-semibold text-gray-900">
                {drives.length}
              </p>
            </div>
            <div className="p-3 bg-gray-100 rounded-full">
              <Briefcase className="h-6 w-6 text-gray-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-lg border border-gray-300 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Ongoing Drives</p>
              <p className="text-2xl font-semibold text-black">
                {ongoingDrives.length}
              </p>
            </div>
            <div className="p-3 bg-gray-200 rounded-full">
              <div className="h-6 w-6 bg-gray-800 rounded-full flex items-center justify-center">
                <div className="h-2 w-2 bg-white rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-lg border border-gray-300 p-4">
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
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter size={16} className="text-gray-400" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300  rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            <option value="all">All Status</option>
            {/* here we have to handle more caase like resumeuplaoded , emailsent and others how can we */}
            <option
              value={
                "resumeUploaded" ||
                "resumeShortlisted" ||
                "emailSent" ||
                "InterviewScheduled"
              }
            >
              Ongoing
            </option>
            <option value="selectionEmailSent">Finished</option>
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
              key={drive._id}
              drive={drive}
              onView={() => handleViewDrive(drive._id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Drives;
