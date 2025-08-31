import React, { useCallback, useState } from "react";
import UploadDropzone from "./UploadDropzone";
import FileList from "./FileList";
import SkillFilter from "./SkillFilter";
import StatsCards from "./StatsCards";
import Sidebar from "./Sidebar";

const Dashboard = () => {
  const [files, setFiles] = useState([]);
  const [skills, setSkills] = useState(["JavaScript", "React", "Node.js"]);

  const onAddFiles = useCallback(
    (newFiles) => {
      // dedupe by path+size
      console.log(skills);
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

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <header className="sticky top-0 z-10 bg-white/90 backdrop-blur border-b border-gray-200">
          <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
            <div className="text-gray-900 font-semibold">Upload Resumes</div>
            <button
              disabled={!files.length}
              className={`px-3 py-2 text-sm rounded-md ${
                files.length
                  ? "bg-gray-900 text-white hover:bg-black"
                  : "bg-gray-200 text-gray-500 cursor-not-allowed"
              }`}
            >
              Process Resumes
            </button>
          </div>
        </header>

        <main className="max-w-6xl mx-auto px-6 py-6">
          <UploadDropzone onAddFiles={onAddFiles} />
          <FileList files={files} onRemove={onRemove} />
          <SkillFilter skills={skills} setSkills={setSkills} />

          <StatsCards />
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
