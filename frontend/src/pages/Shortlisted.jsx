import React, { useState, useMemo, useEffect } from "react";
import { Search, FileText } from "lucide-react";
import config from "../Config/BaseURL";
import Loader from "../components/Loader";

const BASE_URL = config.BASE_URL;

const Shortlisted = () => {
  const [resumes, setResumes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const resumesPerPage = 5;

  // Fetch resumes from API
  useEffect(() => {
    const fetchResumes = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/resume/all`);
        if (!response.ok) {
          throw new Error("Failed to fetch resumes");
        }
        const data = await response.json();

        // Filter only shortlisted resumes
        const shortlisted = data.data.filter(
          (resume) => resume.resume_shortlisted === "yes"
        );
        setResumes(shortlisted);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchResumes();
  }, []);

  // Filter resumes based on search
  const filteredResumes = useMemo(() => {
    return resumes.filter(
      (r) =>
        r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (r.id && r.id.toString().includes(searchTerm))
    );
  }, [resumes, searchTerm]);

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

  if (loading) {
    return (
      <Loader />
    );
  }

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
            Shortlisted Resumes
          </h1>
        </div>
      </div>

      {/* Search */}
      <div className="max-w-6xl mx-auto px-6 py-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, email, or ID..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1); // reset to first page on search
            }}
            className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 bg-white focus:ring-1 focus:ring-gray-400 focus:border-gray-400 text-sm transition-colors"
          />
        </div>
      </div>

      {/* Resume Cards */}
      <div className="max-w-6xl mx-auto px-6 pb-12">
        <div className="grid gap-4">
          {currentResumes.map((resume) => (
            <div
              key={resume.id}
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
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty state */}
        {filteredResumes.length === 0 && (
          <div className="text-center py-16">
            <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No shortlisted resumes found
            </h3>
            <p className="text-gray-500">Try adjusting your search criteria.</p>
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

export default Shortlisted;
