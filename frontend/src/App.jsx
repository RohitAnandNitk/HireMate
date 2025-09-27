import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/clerk-react";

import Dashboard from "./components/Dashboard";
import InterviewPage from "./pages/InterviewPage";
import Layout from "./components/Layout";
import ResumeLibrary from "./pages/ResumeLibrary";
import Shortlisted from "./pages/Shortlisted";
import Analytics from "./pages/Analytics";
import Home from "./pages/Home";
import JobCreation from "./components/JobCreation";
import Drives from "./components/Drives";

import VapiInterviewPage from "./pages/VapiInterviewPage";
import InterviewStartPage from "./pages/InterviewStartPage";

import About from "./pages/About";
import Services from "./pages/Services";
import Clients from "./pages/Clients";
import Contact from "./pages/Contact";
import LayoutWithNavbar from "./pages/LayoutWithNavbar";
import Chatbot from "./components/Chatbot";
import Process from "./pages/Process";
import CustomSignUp from "./pages/CustomSignUp";
import CustomSignIn from "./pages/CustomSignIn";

import ProtectedRoute from "./components/ProtectedRoute"; // import wrapper

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route element={<LayoutWithNavbar />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/clients" element={<Clients />} />
          <Route path="/contact" element={<Contact />} />
        </Route>
        <Route path="/signup" element={<CustomSignUp />} />
        <Route path="/signin" element={<CustomSignIn />} />

        {/* Protected Routes */}
        <Route
          path="/job-creation"
          element={
            <ProtectedRoute>
              <Layout>
                <JobCreation />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/process/:driveId"
          element={
            <ProtectedRoute>
              <Layout>
                <Process />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/:drive_id"
          element={
            <ProtectedRoute>
              <Layout>
                <Dashboard />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/drives"
          element={
            <ProtectedRoute>
              <Layout>
                <Drives />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/resumes"
          element={
            <ProtectedRoute>
              <Layout>
                <ResumeLibrary />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/shortlisted"
          element={
            <ProtectedRoute>
              <Layout>
                <Shortlisted />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/analytics"
          element={
            <ProtectedRoute>
              <Layout>
                <Analytics />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/mockinterview/:id"
          element={
            <ProtectedRoute>
              <InterviewPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/mockinterview/test"
          element={
            <ProtectedRoute>
              <VapiInterviewPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/interview_start"
          element={
            <ProtectedRoute>
              <InterviewStartPage />
            </ProtectedRoute>
          }
        />
      </Routes>

      <Chatbot />
    </Router>
  );
}

export default App;
