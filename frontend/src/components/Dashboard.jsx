import React, { useCallback, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import UploadDropzone from "./UploadDropzone";
import FileList from "./FileList";
import SkillFilter from "./SkillFilter";
import StatsCards from "./StatsCards";
import Sidebar from "./Sidebar";
import config from "../Config/BaseURL";
const BASE_URL = config.BASE_URL;

const Dashboard = () => {
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);
  const [skills, setSkills] = useState([]);
  const [processing, setProcessing] = useState(false);
  const [jobData, setJobData] = useState(null);

  // Load job data from localStorage when component mounts
  useEffect(() => {
    const savedJobData = localStorage.getItem("currentJobData");
    if (savedJobData) {
      try {
        const parsedJobData = JSON.parse(savedJobData);
        setJobData(parsedJobData);
      } catch (error) {
        console.error("Error parsing job data:", error);
      }
    }
  }, []);

  const onAddFiles = useCallback(
    (newFiles) => {
      const existing = new Set(
        files.map((f) => `${f.webkitRelativePath || f.name}|${f.size}`)
      );
      const toAdd = newFiles.filter(
        (f) => !existing.has(`${f.webkitRelativePath || f.name}|${f.size}`)
      );
      if (toAdd.length) setFiles((prev) => [...prev, ...toAdd]);
    },
    [files]
  );

  const onRemove = useCallback((idx) => {
    setFiles((prev) => prev.filter((_, i) => i !== idx));
  }, []);

  const handleProcessResumes = async () => {
    if (!jobData?.role?.trim() || files.length === 0 || skills.length === 0)
      return;

    setProcessing(true);
    try {
      const formData = new FormData();
      files.forEach((file) => {
        formData.append("resumes", file);
      });

      // Add job data and skills to formData
      formData.append("jobData", JSON.stringify(jobData));
      formData.append("skills", JSON.stringify(skills));

      const response = await fetch(`${BASE_URL}/api/resume/upload-resumes`, {
        method: "POST",
        body: formData,
      });

      const result = await response.json();
      if (response.ok) {
        alert("Resumes processed successfully!");
        console.log("Result:", result);
      } else {
        alert("Failed to process resumes");
        console.error("Error:", result);
      }
    } catch (error) {
      console.error("Error uploading resumes:", error);
      alert("Error uploading resumes");
    } finally {
      setProcessing(false);
    }
  };

  const handleBackToJobCreation = () => {
    navigate("/job-creation");
  };

  const handleCreateNewJob = () => {
    // Clear current job data and navigate to job creation
    localStorage.removeItem("currentJobData");
    navigate("/job-creation");
  };

  return (
    <div className="flex-1 w-full">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">
            {jobData ? "Resume Processing Dashboard" : "Dashboard"}
          </h1>
          {jobData && (
            <p className="text-sm text-gray-600 mt-1">
              Job ID: {jobData.job_id} | Role: {jobData.role}
            </p>
          )}
        </div>
        <div className="flex gap-3">
          {jobData ? (
            <>
              {/* <button
                onClick={handleBackToJobCreation}
                className="px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                ← Edit Job Details
              </button> */}
              <button
                onClick={handleProcessResumes}
                disabled={
                  !jobData?.role?.trim() ||
                  files.length === 0 ||
                  skills.length === 0 ||
                  processing
                }
                className={`px-4 py-2 text-sm rounded-md ${
                  !jobData?.role?.trim() ||
                  files.length === 0 ||
                  skills.length === 0 ||
                  processing
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-gray-900 text-white hover:bg-black"
                }`}
              >
                {processing ? "Processing..." : "Process Resumes"}
              </button>
            </>
          ) : (
            <button
              onClick={handleCreateNewJob}
              className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Create New Job
            </button>
          )}
        </div>
      </div>

      {/* Show job details if job data exists */}
      {jobData && (
        <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
          <h2 className="text-lg font-medium text-gray-900 mb-3">
            Job Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Job ID:</span>
              <p className="font-medium">{jobData.job_id}</p>
            </div>
            <div>
              <span className="text-gray-600">Role:</span>
              <p className="font-medium">{jobData.role}</p>
            </div>
            <div>
              <span className="text-gray-600">Location:</span>
              <p className="font-medium">{jobData.location}</p>
            </div>
            <div>
              <span className="text-gray-600">Start Date:</span>
              <p className="font-medium">{jobData.start_date}</p>
            </div>
            <div>
              <span className="text-gray-600">End Date:</span>
              <p className="font-medium">{jobData.end_date}</p>
            </div>
            <div>
              <span className="text-gray-600">Interview Rounds:</span>
              <p className="font-medium">
                {jobData.rounds?.length || 0} rounds
              </p>
            </div>
          </div>

          {jobData.rounds && jobData.rounds.length > 0 && (
            <div className="mt-4">
              <span className="text-gray-600 text-sm">Rounds:</span>
              <div className="flex flex-wrap gap-2 mt-2">
                {jobData.rounds.map((round, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs"
                  >
                    {index + 1}. {round.type}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Show message if no job data */}
      {!jobData && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-yellow-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">
                No Job Created Yet
              </h3>
              <div className="mt-2 text-sm text-yellow-700">
                <p>Please create a job first before processing resumes.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Rest of your dashboard components */}
      <UploadDropzone onAddFiles={onAddFiles} />
      <FileList files={files} onRemove={onRemove} />
      <SkillFilter skills={skills} setSkills={setSkills} />
    </div>
  );
};

export default Dashboard;
