import React, { useCallback, useState } from "react";
import UploadDropzone from "./UploadDropzone";
import FileList from "./FileList";
import SkillFilter from "./SkillFilter";
import StatsCards from "./StatsCards";
import Sidebar from "./Sidebar";

const Dashboard = () => {
  const [files, setFiles] = useState([]);
  const [skills, setSkills] = useState([]);
  const [role, setRole] = useState("");

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
    if (files.length === 0) {
      alert("Please upload some files first!");
      return;
    }
    if (!role.trim()) {
      alert("Please enter the role you are hiring for!");
      return;
    }

    const formData = new FormData();
    files.forEach((file) => {
      formData.append("resumes", file);
    });

    // Add skills and role to formData
    formData.append("role", role);
    formData.append("skills", JSON.stringify(skills));

    try {
      const response = await fetch(
        "http://localhost:5000/api/resume/upload-resumes",
        {
          method: "POST",
          body: formData,
        }
      );
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
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <main className="max-w-6xl mx-auto px-6 py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl font-semibold text-gray-900">Dashboard</h1>
          <button
            onClick={handleProcessResumes}
            className="px-4 py-2 text-sm rounded-md bg-gray-900 text-white hover:bg-black"
          >
            Process Resumes
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
