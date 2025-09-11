import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import InterviewPage from "./Pages/InterviewPage";
import Layout from "./components/Layout";
import ResumeLibrary from "./Pages/ResumeLibrary";
import Shortlisted from "./Pages/Shortlisted";
import Analytics from "./Pages/Analytics";
import Home from "./Pages/Home";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/dashboard"
          element={
            <Layout>
              <Dashboard />
            </Layout>
          }
        />
        <Route
          path="/resumes"
          element={
            <Layout>
              <ResumeLibrary />
            </Layout>
          }
        />
        <Route
          path="/shortlisted"
          element={
            <Layout>
              <Shortlisted />
            </Layout>
          }
        />
        <Route
          path="/analytics"
          element={
            <Layout>
              <Analytics />
            </Layout>
          }
        />
        <Route path="/mockinterview/:id" element={<InterviewPage />} />
      </Routes>
    </Router>
  );
}

export default App;
