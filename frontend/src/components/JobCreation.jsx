import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useUser } from "@clerk/clerk-react";

import config from "../Config/BaseURL";
import SkillFilter from "./SkillFilter";
const BASE_URL = config.BASE_URL;

const JobCreation = () => {
  const { user } = useUser();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [companyId, setCompanyId] = useState(null);
  const [fetchingHRInfo, setFetchingHRInfo] = useState(true);

  const [jobData, setJobData] = useState({
    company_id: "",
    job_id: "",
    role: "",
    rounds: [{ type: "Technical", description: "" }],
    start_date: "",
    end_date: "",
    location: "",
    skills: "",
  });

  // Fetch HR info when component mounts
  useEffect(() => {
    const fetchHRInfo = async () => {
      try {
        const email = user?.emailAddresses[0]?.emailAddress;
        if (!email) {
          console.log("No email found for user");
          toast.error("Unable to fetch user information");
          setFetchingHRInfo(false);
          return;
        }

        const response = await fetch(
          `${BASE_URL}/api/drive/hr-info?email=${encodeURIComponent(email)}`
        );
        
        if (!response.ok) {
          throw new Error("Failed to fetch HR info");
        }

        const hrData = await response.json();
        console.log("=".repeat(50));
        console.log("HR INFO FROM JOB CREATION:");
        console.log("Full HR Data:", hrData);
        console.log("Email:", hrData.email);
        console.log("Name:", hrData.name);
        console.log("Company ID:", hrData.company_id);
        console.log("Role:", hrData.role);
        console.log("=".repeat(50));

        // Update companyId and jobData if available in HR info
        if (hrData.company_id) {
          setCompanyId(hrData.company_id);
          setJobData((prev) => ({
            ...prev,
            company_id: hrData.company_id,
          }));
          console.log("Set companyId to:", hrData.company_id);
        } else {
          toast.error("Company ID not found in HR information");
        }
      } catch (err) {
        console.error("Error fetching HR info:", err.message);
        toast.error("Could not load HR information.");
      } finally {
        setFetchingHRInfo(false);
      }
    };

    if (user) {
      fetchHRInfo();
    }
  }, [user]);

  const handleInputChange = (field, value) => {
    setJobData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleRoundChange = (index, field, value) => {
    const updatedRounds = [...jobData.rounds];
    updatedRounds[index] = { ...updatedRounds[index], [field]: value };
    setJobData((prev) => ({
      ...prev,
      rounds: updatedRounds,
    }));
  };

  const addRound = () => {
    console.log("Adding round");
    setJobData((prev) => ({
      ...prev,
      rounds: [...prev.rounds, { type: "Technical", description: "" }],
    }));
  };

  const removeRound = (index) => {
    if (jobData.rounds.length > 1) {
      const updatedRounds = jobData.rounds.filter((_, i) => i !== index);
      setJobData((prev) => ({
        ...prev,
        rounds: updatedRounds,
      }));
    }
  };

  const handleSubmit = async () => {
    if (loading) return;
    setLoading(true);

    console.log("Inside submission");

    // Validate company_id
    if (!jobData.company_id) {
      toast.error("Company ID is missing. Please try refreshing the page.", {
        position: "top-right",
        autoClose: 3000,
      });
      setLoading(false);
      return;
    }

    // Validate required fields
    const { job_id, role, start_date, end_date, location, rounds } = jobData;

    if (
      !job_id?.trim() ||
      !role?.trim() ||
      !start_date ||
      !end_date ||
      !location?.trim()
    ) {
      toast.error("Please fill in all required fields", {
        position: "top-right",
        autoClose: 3000,
      });
      setLoading(false);
      return;
    }

    // Validate rounds
    if (rounds.some((round) => !round.type?.trim())) {
      toast.error("Please specify type for all rounds", {
        position: "top-right",
        autoClose: 3000,
      });
      setLoading(false);
      return;
    }

    console.log("Submitting job data:", jobData);
    localStorage.setItem("currentJobData", JSON.stringify(jobData));
    try {
      const response = await fetch(`${BASE_URL}/api/drive/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(jobData),
      });

      if (!response.ok) {
        throw new Error("Failed to create a drive");
      }

      const data = await response.json();
      console.log("Drive created successfully!", data);

      toast.success("Drive created successfully!", {
        position: "top-right",
        autoClose: 3000,
      });

      // Navigate to dashboard after a short delay so toast is visible
      setTimeout(() => {
        navigate(`/dashboard/${data.drive._id}`);
      }, 1000);
    } catch (err) {
      console.error("Error creating drive:", err.message);
      toast.error(
        "Something went wrong while creating the drive. Please try again.",
        {
          position: "top-right",
          autoClose: 3000,
        }
      );
    } finally {
      setLoading(false);
    }
  };

  const roundTypes = [
    "Technical",
    "HR",
    "Behavioral",
    "System Design",
    "Coding",
    "Panel",
    "Final",
  ];

  // Show loading state while fetching HR info
  if (fetchingHRInfo) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
      </div>
    );
  }

  // Show error if company ID couldn't be loaded
  if (!companyId) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p className="text-red-800 font-medium">Unable to load company information</p>
          <p className="text-red-600 text-sm mt-2">Please try refreshing the page or contact support</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <ToastContainer />
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">
            Create New Drive
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Company ID: {companyId}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg border border-gray-300 p-6 space-y-6">
        {/* Job ID */}
        <div>
          <label className="block text-gray-700 mb-2 font-medium">
            Job ID <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={jobData.job_id}
            onChange={(e) => handleInputChange("job_id", e.target.value)}
            placeholder="Enter unique job ID, e.g., JOB-2024-001"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black"
          />
        </div>

        {/* Role */}
        <div>
          <label className="block text-gray-700 mb-2 font-medium">
            Role <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={jobData.role}
            onChange={(e) => handleInputChange("role", e.target.value)}
            placeholder="Enter role, e.g., Software Engineer"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black"
          />
        </div>

        {/* Skills */}
        <div>
          <label className="block text-gray-700 mb-2 font-medium">
            Required Skills
          </label>
          <SkillFilter
            skills={jobData.skills}
            setSkills={(skills) => handleInputChange("skills", skills)}
            className="mb-2 rounded-md border border-gray-300 ring-1 focus:ring-black"
          />
        </div>

        {/* Rounds Section */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <label className="block text-gray-700 font-medium">
              Interview Rounds <span className="text-red-500">*</span>
            </label>
            <button
              onClick={addRound}
              className="px-3 py-1 text-sm bg-black cursor-pointer text-white rounded-md hover:bg-gray-800"
            >
              Add Round
            </button>
          </div>

          <div className="space-y-3">
            {jobData.rounds.map((round, index) => (
              <div
                key={index}
                className="flex gap-3 items-center p-3 border border-gray-300 rounded-md bg-gray-50"
              >
                <div className="flex-1">
                  <label className="block text-sm text-gray-600 mb-1">
                    Round {index + 1} Type
                  </label>
                  <select
                    value={round.type}
                    onChange={(e) =>
                      handleRoundChange(index, "type", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black"
                  >
                    {roundTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex-2">
                  <label className="block text-sm text-gray-600 mb-1">
                    Description (Optional)
                  </label>
                  <input
                    type="text"
                    value={round.description}
                    onChange={(e) =>
                      handleRoundChange(index, "description", e.target.value)
                    }
                    placeholder="Brief description of the round"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black"
                  />
                </div>
                {jobData.rounds.length > 1 && (
                  <button
                    onClick={() => removeRound(index)}
                    className="px-2 py-2 text-red-600 hover:bg-red-100 rounded-md"
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Date Range */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 mb-2 font-medium">
              Start Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={jobData.start_date}
              onChange={(e) => handleInputChange("start_date", e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black"
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-2 font-medium">
              End Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={jobData.end_date}
              onChange={(e) => handleInputChange("end_date", e.target.value)}
              min={jobData.start_date}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black"
            />
          </div>
        </div>

        {/* Location */}
        <div>
          <label className="block text-gray-700 mb-2 font-medium">
            Location <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={jobData.location}
            onChange={(e) => handleInputChange("location", e.target.value)}
            placeholder="Enter location, e.g., Bangalore, Remote, Hybrid"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black"
          />
        </div>

        {/* Submit Button */}
        <div className="flex justify-end pt-4">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className={`px-6 py-2 bg-gray-900 text-white rounded-md hover:bg-black focus:outline-none focus:ring-2 focus:ring-gray-500 ${
              loading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Creating..." : "Create Drive"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default JobCreation;