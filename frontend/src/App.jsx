import React from "react"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Dashboard from "./components/Dashboard"
import InterviewPage from "./pages/InterviewPage"
import Layout from "./components/Layout"
import ResumeLibrary from "./pages/ResumeLibrary"
import Shortlisted from "./pages/Shortlisted"
import Analytics from "./pages/Analytics"

function App() {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <Layout>
              <Dashboard />
            </Layout>
          }
        />
        <Route
          path="/interview"
          element={
            <Layout>
              <InterviewPage />
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
      </Routes>
    </Router>
  )
}

export default App
