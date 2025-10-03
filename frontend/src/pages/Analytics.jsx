import { useState, useEffect } from "react";
import { Users, CheckCircle, CalendarDays, Send } from "lucide-react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

import Loader from "../components/Loader";
const BASE_URL = import.meta.env.VITE_BASE_URL;

ChartJS.register(ArcElement, Tooltip, Legend);

export default function Analytics() {
  const [resumes, setResumes] = useState([]);
  const [showOffers, setShowOffers] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchResumes = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/resume/all`); // Replace with your API
        if (!response.ok) throw new Error("Failed to fetch resumes");
        const data = await response.json();
        setResumes(data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchResumes();
  }, []);

  if (loading) return <Loader />;
  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        {error}
      </div>
    );

  // Compute stats
  const stats = {
    applications: resumes.length,
    shortlisted: resumes.filter((r) => r.resume_shortlisted === "yes").length,
    interviewed: resumes.filter((r) => r.resume_shortlisted === "yes").length, // same as shortlisted
    offers: resumes.filter((r) => r.selected === "yes").length,
  };

  const pieLabels = ["Applications", "Shortlisted", "Interviewed"];
  const pieData = [stats.applications, stats.shortlisted, stats.interviewed];

  if (stats.interviewed > 0 && showOffers) {
    pieLabels.push("Offers Sent");
    pieData.push(stats.offers);
  }

  const data = {
    labels: pieLabels,
    datasets: [
      {
        label: "Students %",
        data: pieData,
        backgroundColor: ["#0369a1", "#4b5563", "#a8a29e", "#c4b5fd"],
        borderWidth: 2,
        hoverOffset: 12,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom",
        labels: { color: "#374151", font: { size: 14 } },
      },
    },
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">
          Analytics Overview
        </h1>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          title="Total Applications"
          value={stats.applications}
          change="+12% from last month"
          icon={Users}
        />
        <StatCard
          title="Shortlisted"
          value={stats.shortlisted}
          change="+8% from last month"
          icon={CheckCircle}
        />
        <StatCard
          title="Interviews Scheduled"
          value={stats.interviewed}
          change="-3% from last month"
          icon={CalendarDays}
        />
        <StatCard
          title="Offers Sent"
          value={stats.offers}
          change="+15% from last month"
          icon={Send}
        />
      </div>

      {/* Application Trends + Pie Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-lg border p-6 flex flex-col items-center justify-center">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Application Trends
          </h2>
          <Pie data={data} options={options} />
          {stats.interviewed > 0 && (
            <button
              onClick={() => setShowOffers(!showOffers)}
              className="mt-4 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-black text-sm"
            >
              {showOffers ? "Hide Offers %" : "Show Offers %"}
            </button>
          )}
        </div>

        {/* Upcoming Interviews (same as shortlisted) */}
        <div className="bg-white rounded-lg border p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Upcoming Interviews
          </h2>
          <ul className="space-y-3">
            {resumes
              .filter((r) => r.resume_shortlisted === "yes")
              .slice(0, 5) // show top 5 for example
              .map((r, idx) => (
                <li key={idx}>
                  <p className="font-medium text-gray-900">{r.name}</p>
                  <p className="text-sm text-gray-500">
                    Interview scheduled — TBD
                  </p>
                </li>
              ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, change, icon: Icon }) {
  return (
    <div className="bg-white rounded-lg border p-4 flex items-center gap-4 shadow-sm">
      <div className="w-12 h-12 flex items-center justify-center rounded-full bg-gray-100">
        <Icon className="w-6 h-6 text-gray-700" />
      </div>
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-xl font-semibold text-gray-900">{value}</p>
        <p className="text-xs text-gray-500">{change}</p>
      </div>
    </div>
  );
}
