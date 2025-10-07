import React, { useState, useMemo } from "react";
import { Search, FileText } from "lucide-react";

import Loader from "../components/Loader";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const ResumeLibrary = () => {
  const [candidates, setCandidates] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [jobId, setJobId] = useState("");

  const candidatesPerPage = 5;

  // Fetch candidates based on job ID
  const fetchCandidates = async (jobIdValue) => {
    if (!jobIdValue.trim()) {
      setCandidates([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Step 1: Get drive_id from job_id
      const jobResponse = await fetch(
        `${BASE_URL}/api/drive/job?job_id=${jobIdValue}`
      );
      if (!jobResponse.ok) throw new Error("Failed to fetch job data");

      const jobData = await jobResponse.json();
      const driveId = jobData.drive_ids?.[0];

      if (!driveId) {
        throw new Error("No drive ID found for this job");
      }

      // Step 2: Get candidate_ids from drive_id
      const candidatesResponse = await fetch(
        `${BASE_URL}/api/drive/${driveId}/candidates`
      );
      if (!candidatesResponse.ok) throw new Error("Failed to fetch candidates");

      const candidatesData = await candidatesResponse.json();

      // Handle different response formats
      let candidateIds = [];
      if (Array.isArray(candidatesData)) {
        candidateIds = candidatesData;
      } else if (
        candidatesData.candidates &&
        Array.isArray(candidatesData.candidates)
      ) {
        candidateIds = candidatesData.candidates;
      } else if (candidatesData.data && Array.isArray(candidatesData.data)) {
        candidateIds = candidatesData.data;
      }

      if (candidateIds.length === 0) {
        setCandidates([]);
        setCurrentPage(1);
        return;
      }

      // Step 3: Fetch candidate details (name and email) for each candidate_id
      const candidateDetailsPromises = candidateIds.map(async (candidate) => {
        try {
          // Extract candidate_id flexibly
          const candidateId =
            candidate.candidate_id ||
            candidate._id ||
            candidate.id ||
            candidate;

          if (!candidateId) {
            throw new Error("No candidate_id found");
          }

          const response = await fetch(
            `${BASE_URL}/api/user/candidate?candidate_id=${candidateId}`
          );
          if (!response.ok)
            throw new Error(`Failed to fetch candidate ${candidateId}`);

          const data = await response.json();
          const candidateInfo = data.candidate || data.data || data;

          return {
            name: candidateInfo?.name || "N/A",
            email: candidateInfo?.email || "N/A",
            id: candidateInfo?._id || candidateId,
          };
        } catch (err) {
          console.error(`Error fetching candidate:`, err);
          return {
            name: "Error loading",
            email: "Error loading",
            id: candidate.candidate_id || "unknown",
          };
        }
      });

      const candidateDetails = await Promise.all(candidateDetailsPromises);
      setCandidates(candidateDetails);
      setCurrentPage(1);
    } catch (err) {
      setError(err.message);
      setCandidates([]);
    } finally {
      setLoading(false);
    }
  };

  // Filter candidates based on search term
  const filteredCandidates = useMemo(() => {
    if (!candidates.length) return [];

    return candidates.filter((c) => {
      return (
        c.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.email?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
  }, [candidates, searchTerm]);

  // Pagination logic
  const totalPages = Math.ceil(filteredCandidates.length / candidatesPerPage);
  const startIndex = (currentPage - 1) * candidatesPerPage;
  const currentCandidates = filteredCandidates.slice(
    startIndex,
    startIndex + candidatesPerPage
  );

  const getInitials = (name) => {
    if (!name || name === "N/A" || name === "Error loading") return "NA";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <h1 className="text-3xl font-light text-gray-900 mb-2">
            Resume Library
          </h1>
          <p className="text-gray-600">Browse and manage candidate resumes</p>
        </div>
      </div>

      {/* Filters */}
      <div className="max-w-6xl mx-auto px-6 py-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 bg-white focus:ring-1 focus:ring-gray-400 focus:border-gray-400 text-sm transition-colors"
          />
        </div>

        {/* Job ID Input */}
        <div className="flex gap-2 flex-1 max-w-md">
          <input
            type="text"
            placeholder="Enter Job ID..."
            value={jobId}
            onChange={(e) => setJobId(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                fetchCandidates(jobId);
              }
            }}
            className="flex-1 px-3 py-3 rounded-lg border border-gray-300 bg-white focus:ring-1 focus:ring-gray-400 focus:border-gray-400 text-sm transition-colors"
          />
          <button
            onClick={() => fetchCandidates(jobId)}
            className="px-6 py-3 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
          >
            Search
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="max-w-6xl mx-auto px-6 pb-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 text-sm">
            {error}
          </div>
        </div>
      )}

      {/* Candidate Cards */}
      <div className="max-w-6xl mx-auto px-6 pb-12">
        <div className="grid gap-4">
          {currentCandidates.map((candidate, idx) => (
            <div
              key={candidate.id || idx}
              className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-sm transition-shadow"
            >
              <div className="flex items-start gap-4">
                {/* Avatar */}
                <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 font-medium text-sm flex-shrink-0">
                  {getInitials(candidate.name)}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-medium text-gray-900 mb-1">
                    {candidate.name}
                  </h3>
                  <p className="text-gray-600 text-sm">{candidate.email}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredCandidates.length === 0 && !loading && (
          <div className="text-center py-16">
            <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {jobId
                ? "No candidates found"
                : "Enter a Job ID to view candidates"}
            </h3>
            <p className="text-gray-500">
              {jobId
                ? "Try adjusting your search."
                : "Search for candidates by entering a Job ID above."}
            </p>
          </div>
        )}

        {/* Pagination */}
        {filteredCandidates.length > 0 && (
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
