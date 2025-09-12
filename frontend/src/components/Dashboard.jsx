import React, { useCallback, useState } from "react";
import UploadDropzone from "./UploadDropzone";
import FileList from "./FileList";
import SkillFilter from "./SkillFilter";
import StatsCards from "./StatsCards";
import Sidebar from "./Sidebar";
import config from "../Config/BaseURL";
const BASE_URL = config.BASE_URL;

const Dashboard = () => {
  const [files, setFiles] = useState([]);
  const [skills, setSkills] = useState([]);
  const [role, setRole] = useState("");
  const [processing, setProcessing] = useState(false);

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
    if (!role.trim() || files.length === 0 || skills.length === 0) return;

    setProcessing(true);
    try {
      const formData = new FormData();
      files.forEach((file) => {
        formData.append("resumes", file);
      });

      // Add skills and role to formData
      formData.append("role", role);
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
      setProcessing(false); // re-enable button
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <main className="flex-1 w-full px-6 py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl font-semibold text-gray-900">Dashboard</h1>
          <button
            onClick={handleProcessResumes}
            disabled={
              !role.trim() ||
              files.length === 0 ||
              skills.length === 0 ||
              processing
            }
            className={`px-4 py-2 text-sm rounded-md ${
              !role.trim() ||
              files.length === 0 ||
              skills.length === 0 ||
              processing
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-gray-900 text-white hover:bg-black"
            }`}
          >
            {processing ? "Processing..." : "Process Resumes"}
          </button>
        </div>

        {/* Role Input Section */}
        <div className="mb-6">
          <label className="block text-gray-700 mb-2">Role for Hiring</label>
          <input
            type="text"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            placeholder="Enter role, e.g., Software Engineer"
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <UploadDropzone onAddFiles={onAddFiles} />
        <FileList files={files} onRemove={onRemove} />
        <SkillFilter skills={skills} setSkills={setSkills} />
      </main>
    </div>
  );
};

export default Dashboard;
