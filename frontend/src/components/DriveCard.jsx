import React from "react";
import {
  Calendar,
  MapPin,
  Clock,
  CheckCircle,
  Eye,
  MoreVertical,
} from "lucide-react";

const DriveCard = ({ drive, onView }) => {
  const {
    _id,
    job_id,
    role,
    location,
    start_date,
    end_date,
    status,
    rounds,
    created_at,
  } = drive;

  const statusConfig = {
    resumeUploaded: {
      color: "text-black",
      bgColor: "bg-gray-200",
      icon: Clock,
      label: "Ongoing",
    },
    resumeShortlisted: {
      color: "text-black",
      bgColor: "bg-gray-200",
      icon: Clock,
      label: "Ongoing",
    },
    emailSent: {
      color: "text-black",
      bgColor: "bg-gray-200",
      icon: Clock,
      label: "Ongoing",
    },
    InterviewScheduled: {
      color: "text-black",
      bgColor: "bg-gray-200",
      icon: Clock,
      label: "Ongoing",
    },
    selectionEmailSent: {
      color: "text-gray-600",
      bgColor: "bg-gray-100",
      icon: CheckCircle,
      label: "Finished",
    },
  };

  const currentStatus = statusConfig[status] || statusConfig.ongoing;
  const StatusIcon = currentStatus.icon;

  // Calculate progress percentage
  const getProgress = () => {
    if (status === "selectionEmailSent") return 100;

    const start = new Date(start_date);
    const end = new Date(end_date);
    const now = new Date();

    if (now < start) return 0;
    if (now > end) return 100;

    const total = end - start;
    const elapsed = now - start;
    return Math.round((elapsed / total) * 100);
  };

  const progress = getProgress();

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Days remaining
  const getDaysRemaining = () => {
    if (status === "finished") return null;

    const end = new Date(end_date);
    const now = new Date();
    const diffTime = end - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays > 0 ? diffDays : 0;
  };

  const daysRemaining = getDaysRemaining();

  return (
    <div className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow duration-200">
      {/* Header */}
      <div className="p-4 border-b">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-medium text-gray-500">
                {job_id}
              </span>
              <div
                className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${currentStatus.bgColor} ${currentStatus.color}`}
              >
                <StatusIcon size={12} />
                {currentStatus.label}
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">{role}</h3>
            <div className="flex items-center gap-1 text-sm text-gray-600">
              <MapPin size={14} />
              {location}
            </div>
          </div>
          <button className="p-1 hover:bg-gray-100 rounded transition-colors">
            <MoreVertical size={16} className="text-gray-400" />
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      {status === "ongoing" && (
        <div className="px-4 py-2 bg-gray-50">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-medium text-gray-600">Progress</span>
            <span className="text-xs text-gray-600">{progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-gray-800 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          {daysRemaining !== null && (
            <div className="text-xs text-gray-600 mt-1">
              {daysRemaining > 0
                ? `${daysRemaining} days remaining`
                : "Drive ends today"}
            </div>
          )}
        </div>
      )}

      {/* Content */}
      <div className="p-4">
        {/* Date Range */}
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
          <Calendar size={14} />
          <span>
            {formatDate(start_date)} - {formatDate(end_date)}
          </span>
        </div>

        {/* Interview Rounds */}
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-900 mb-2">
            Interview Rounds ({rounds.length})
          </h4>
          <div className="flex flex-wrap gap-1">
            {rounds.slice(0, 3).map((round, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-medium"
              >
                {round.type}
              </span>
            ))}
            {rounds.length > 3 && (
              <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs font-medium">
                +{rounds.length - 3} more
              </span>
            )}
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={onView}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-black transition-colors"
        >
          <Eye size={16} />
          View Drive
        </button>
      </div>

      {/* Footer */}
      <div className="px-4 py-3 bg-gray-50 rounded-b-lg border-t">
        <div className="text-xs text-gray-500">
          Created on {formatDate(created_at)}
        </div>
      </div>
    </div>
  );
};

export default DriveCard;
