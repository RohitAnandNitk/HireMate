import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import config from "../Config/BaseURL";
const BASE_URL = config.BASE_URL;

const JobCreation = () => {
  const navigate = useNavigate();
  // we have to bring the company id from the hhr(user) data.
  const [jobData, setJobData] = useState({
    company_id: "comp_01",
    job_id: "",
    role: "",
    rounds: [{ type: "Technical", description: "" }],
    start_date: "",
    end_date: "",
    location: "",
  });

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
    console.log("Inside submission");

    // Validate required fields
    const { job_id, role, start_date, end_date, location, rounds } = jobData;

    if (
      !job_id?.trim() ||
      !role?.trim() ||
      !start_date ||
      !end_date ||
      !location?.trim()
    ) {
      return alert("Please fill in all required fields");
    }

    // Validate rounds
    if (rounds.some((round) => !round.type?.trim())) {
      return alert("Please specify type for all rounds");
    }

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

      // Navigate to dashboard
      navigate("/dashboard");
    } catch (err) {
      console.error("Error creating drive:", err.message);
      alert("Something went wrong while creating the drive. Please try again.");
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

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-semibold text-gray-900">
          Create New Drive
        </h1>
      </div>

      <div className="bg-white rounded-lg shadow-sm border p-6 space-y-6">
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
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-black"
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
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-black"
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
                className="flex gap-3 items-center p-3 border rounded-md bg-gray-50"
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
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-black"
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
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-black"
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
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-black"
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
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-black"
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
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-black"
          />
        </div>

        {/* Submit Button */}
        <div className="flex justify-end pt-4">
          <button
            onClick={handleSubmit}
            className="px-6 py-2 bg-gray-900 text-white rounded-md hover:bg-black focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Create Drive & Continue to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default JobCreation;
