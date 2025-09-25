import React, { useState, useMemo, useEffect } from "react";
import { Search, FileText } from "lucide-react";

import config from "../Config/BaseURL";
import Loader from "../components/Loader";

const BASE_URL = config.BASE_URL;

const ResumeLibrary = () => {
  const [resumes, setResumes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const [selectedHiring, setSelectedHiring] = useState("current");
  const [jobId, setJobId] = useState("");

  const resumesPerPage = 5;

  // Fetch resumes from API
  useEffect(() => {
    const fetchResumes = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/resume/all`);
        if (!response.ok) throw new Error("Failed to fetch resumes");

        const data = await response.json();
        setResumes(data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchResumes();
  }, []);

  // Filter resumes
  const filteredResumes = useMemo(() => {
    return resumes.filter((r) => {
      const matchesSearch =
        r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (r.id && r.id.toString().includes(searchTerm));

      const matchesHiring =
        selectedHiring === "current"
          ? r.hiringBatch === "current"
          : r.hiringBatch === selectedHiring;

      const matchesJob = jobId ? r.jobId?.toString() === jobId : true;

      return matchesSearch && matchesHiring && matchesJob;
    });
  }, [resumes, searchTerm, selectedHiring, jobId]);

  // Pagination logic
  const totalPages = Math.ceil(filteredResumes.length / resumesPerPage);
  const startIndex = (currentPage - 1) * resumesPerPage;
  const currentResumes = filteredResumes.slice(
    startIndex,
    startIndex + resumesPerPage
  );

  const getInitials = (name) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();

  if (loading) return <Loader />;

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <h1 className="text-3xl font-light text-gray-900 mb-2">
            Resume Library
          </h1>
          <p className="text-gray-600">
            Browse and manage candidate resumes
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="max-w-6xl mx-auto px-6 py-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, email, or ID..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 bg-white focus:ring-1 focus:ring-gray-400 focus:border-gray-400 text-sm transition-colors"
          />
        </div>

        {/* Hiring Dropdown */}
        <select
          value={selectedHiring}
          onChange={(e) => {
            setSelectedHiring(e.target.value);
            setCurrentPage(1);
          }}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:ring-1 focus:ring-gray-400 focus:border-gray-400"
        >
          <option value="current">Current Hiring</option>
          <option value="prev1">Hiring Cycle-Q1 2025</option>
          <option value="prev2">Hiring Cycle-Q2 2024</option>
          <option value="prev3">Hiring Cycle-Q1 2024</option>
          <option value="prev4">Hiring Cycle-Q1 2023</option>
        </select>

        {/* Job ID Input */}
        <input
          type="text"
          placeholder="Filter by Job ID..."
          value={jobId}
          onChange={(e) => {
            setJobId(e.target.value);
            setCurrentPage(1);
          }}
          className="flex-1 px-3 py-3 rounded-lg border border-gray-300 bg-white focus:ring-1 focus:ring-gray-400 focus:border-gray-400 text-sm transition-colors"
        />
      </div>

      {/* Resume Cards */}
      <div className="max-w-6xl mx-auto px-6 pb-12">
        <div className="grid gap-4">
          {currentResumes.map((resume, idx) => (
            <div
              key={idx}
              className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-sm transition-shadow"
            >
              <div className="flex items-start gap-4">
                {/* Avatar */}
                <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 font-medium text-sm flex-shrink-0">
                  {getInitials(resume.name)}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-medium text-gray-900 mb-1">
                    {resume.name}
                  </h3>
                  <p className="text-gray-600 text-sm">{resume.email}</p>

                  {resume.id && (
                    <p className="text-xs text-gray-500 mt-1">
                      ID: {resume.id}
                    </p>
                  )}
                  {resume.jobId && (
                    <p className="text-xs text-gray-500">
                      Job ID: {resume.jobId}
                    </p>
                  )}
                  {resume.hiringBatch && (
                    <p className="text-xs text-gray-400">
                      Hiring: {resume.hiringBatch}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredResumes.length === 0 && (
          <div className="text-center py-16">
            <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No resumes found
            </h3>
            <p className="text-gray-500">
              Try adjusting filters or search.
            </p>
          </div>
        )}

        {/* Pagination */}
        {filteredResumes.length > 0 && (
          <div className="flex justify-center items-center gap-2 mt-8">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Prev
            </button>

            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-3 py-1 border rounded ${
                  currentPage === i + 1 ? "bg-gray-200 font-medium" : ""
                }`}
              >
                {i + 1}
              </button>
            ))}

            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResumeLibrary;
