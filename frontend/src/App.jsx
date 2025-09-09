import React from "react";
import Dashboard from "./components/Dashboard";
import InterviewPage from "./Pages/InterviewPage";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AllResume from "./components/AllResume";

function App() {
  return (
    <BrowserRouter>
      {/* <InterviewPage /> */}
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/all_resume" element={<AllResume />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
