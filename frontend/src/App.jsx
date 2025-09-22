import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import InterviewPage from "./pages/InterviewPage";
import Layout from "./components/Layout";
import ResumeLibrary from "./pages/ResumeLibrary";
import Shortlisted from "./pages/Shortlisted";
import Analytics from "./pages/Analytics";
import Home from "./pages/Home";
import JobCreation from "./components/JobCreation";

import VapiInterviewPage from "./pages/VapiInterviewPage";
import InterviewStartPage from "./pages/InterviewStartPage";

import About from "./pages/About";
import Services from "./pages/Services";
import Clients from "./pages/Clients";
import Contact from "./pages/Contact";
import LayoutWithNavbar from "./pages/LayoutWithNavbar";

function App() {
  return (
    <Router>
      <Routes>
        <Route element={<LayoutWithNavbar />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/clients" element={<Clients />} />
          <Route path="/contact" element={<Contact />} />
        </Route>

        {/* Job Creation Route - First page */}
        <Route
          path="/job-creation"
          element={
            <Layout>
              <JobCreation />
            </Layout>
          }
        />

        {/* Dashboard Route - Modified to accept job data */}
        <Route
          path="/dashboard"
          element={
            <Layout>
              <Dashboard />
            </Layout>
          }
        />

        <Route path="/interview_start" element={<InterviewStartPage />} />
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
        <Route path="/mockinterview/test" element={<VapiInterviewPage />} />
      </Routes>
    </Router>
  );
}

export default App;
