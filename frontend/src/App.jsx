import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import InterviewPage from "./pages/InterviewPage";
import Layout from "./components/Layout";
import ResumeLibrary from "./pages/ResumeLibrary";
import Shortlisted from "./pages/Shortlisted";
import Analytics from "./pages/Analytics";
import Home from "./pages/Home";

function App() {
  return (
    <Router>
      <Routes>
        
        <Route
          path="/"
          element={
            <Home />
          }
        />
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
