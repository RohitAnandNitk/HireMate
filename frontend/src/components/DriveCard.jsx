import React from "react";
import {
  Calendar,
  MapPin,
  Users,
  Star,
  Clock,
  CheckCircle,
  Eye,
  MoreVertical,
} from "lucide-react";

const DriveCard = ({ drive, onView }) => {
  const {
    id,
    jobId,
    role,
    location,
    startDate,
    endDate,
    status,
    rounds,
    totalApplicants,
    shortlisted,
    createdAt,
  } = drive;

  const statusConfig = {
    ongoing: {
      color: "text-green-600",
      bgColor: "bg-green-100",
      icon: Clock,
      label: "Ongoing",
    },
    finished: {
      color: "text-gray-600",
      bgColor: "bg-gray-100",
      icon: CheckCircle,
      label: "Finished",
    },
  };

  const currentStatus = statusConfig[status] || statusConfig.ongoing;
  const StatusIcon = currentStatus.icon;

  // Calculate progress percentage for ongoing drives
  const getProgress = () => {
    if (status === "finished") return 100;

    const start = new Date(startDate);
    const end = new Date(endDate);
    const now = new Date();

    if (now < start) return 0;
    if (now > end) return 100;

    const total = end - start;
    const elapsed = now - start;
    return Math.round((elapsed / total) * 100);
  };

  const progress = getProgress();

  // Format date for display
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Calculate days remaining for ongoing drives
  const getDaysRemaining = () => {
    if (status === "finished") return null;

    const end = new Date(endDate);
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
              <span className="text-xs font-medium text-gray-500">{jobId}</span>
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

      {/* Progress Bar for Ongoing Drives */}
      {status === "ongoing" && (
        <div className="px-4 py-2 bg-gray-50">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-medium text-gray-600">Progress</span>
            <span className="text-xs text-gray-600">{progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
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
            {formatDate(startDate)} - {formatDate(endDate)}
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
                className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs font-medium"
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

        {/* Statistics */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="text-center p-2 bg-gray-50 rounded">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Users size={14} className="text-gray-600" />
              <span className="text-xs text-gray-600">Total</span>
            </div>
            <div className="text-lg font-semibold text-gray-900">
              {totalApplicants}
            </div>
          </div>
          <div className="text-center p-2 bg-green-50 rounded">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Star size={14} className="text-green-600" />
              <span className="text-xs text-green-600">Shortlisted</span>
            </div>
            <div className="text-lg font-semibold text-green-700">
              {shortlisted}
            </div>
          </div>
        </div>

        {/* Success Rate */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs text-gray-600">Success Rate</span>
            <span className="text-xs font-medium text-gray-900">
              {totalApplicants > 0
                ? Math.round((shortlisted / totalApplicants) * 100)
                : 0}
              %
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1">
            <div
              className="bg-green-500 h-1 rounded-full"
              style={{
                width: `${
                  totalApplicants > 0
                    ? (shortlisted / totalApplicants) * 100
                    : 0
                }%`,
              }}
            ></div>
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
          Created on {formatDate(createdAt)}
        </div>
      </div>
    </div>
  );
};

export default DriveCard;
