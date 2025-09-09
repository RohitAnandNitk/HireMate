// src/components/Layout.jsx
import React from "react"
import Sidebar from "./Sidebar"

const Layout = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <header className="sticky top-0 z-10 bg-white/90 backdrop-blur border-b border-gray-200">
          <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
            <div className="text-gray-900 font-semibold">Upload Resumes</div>
            <button className="px-3 py-2 text-sm rounded-md bg-gray-900 text-white hover:bg-black">
              Process Resumes
            </button>
          </div>
        </header>

        <main className="max-w-6xl mx-auto px-6 py-6">
          {children}
        </main>
      </div>
    </div>
  )
}

export default Layout
