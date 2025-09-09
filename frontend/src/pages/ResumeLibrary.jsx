import React, { useState, useMemo } from 'react';
import { Search, ChevronDown, Download, Eye, Trash2, FileText, CheckCircle2, AlertCircle, Clock3 } from 'lucide-react';

// Mock initial data
const initialResumes = [
  {
    id: 1,
    name: 'John Smith',
    email: 'john.smith@email.com',
    avatar: '👨‍💻',
    position: 'Frontend Developer',
    uploadDate: '2024-01-15',
    fileSize: '2.3 MB',
    status: 'Processed',
    skills: ['React', 'JavaScript', 'TypeScript', 'CSS'],
    experience: '5+ years'
  },
  {
    id: 2,
    name: 'Emily Davis',
    email: 'emily.davis@email.com',
    avatar: '👩‍🎨',
    position: 'UI/UX Designer',
    uploadDate: '2024-01-14',
    fileSize: '1.8 MB',
    status: 'Under Review',
    skills: ['Figma', 'Adobe XD'],
    experience: '3+ years'
  },
  {
    id: 3,
    name: 'Michael Chen',
    email: 'michael.chen@email.com',
    avatar: '👨‍🔬',
    position: 'Data Scientist',
    uploadDate: '2024-01-13',
    fileSize: '3.1 MB',
    status: 'New',
    skills: ['Python', 'Machine Learning', 'SQL'],
    experience: '4+ years'
  }
];

const positions = ['All Positions', 'Frontend Developer', 'Backend Developer', 'Full Stack Developer', 'UI/UX Designer', 'Data Scientist'];
const statuses = ['All Status', 'New', 'Under Review', 'Processed', 'Rejected'];

const StatusBadge = ({ status }) => {
  const style = {
    Processed: 'bg-green-50 text-green-700 border-green-200',
    'Under Review': 'bg-yellow-50 text-yellow-700 border-yellow-200',
    New: 'bg-blue-50 text-blue-700 border-blue-200',
    Rejected: 'bg-red-50 text-red-700 border-red-200'
  }[status] || 'bg-gray-50 text-gray-700 border-gray-200';

  const icon = {
    Processed: <CheckCircle2 className="w-3 h-3" />,
    'Under Review': <Clock3 className="w-3 h-3" />,
    New: <AlertCircle className="w-3 h-3" />
  }[status] || null;

  return (
    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${style}`}>
      {icon}
      {status}
    </span>
  );
};

const ResumeLibrary = () => {
  const [resumes, setResumes] = useState(initialResumes);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPosition, setSelectedPosition] = useState('All Positions');
  const [selectedStatus, setSelectedStatus] = useState('All Status');
  const [selectedResumes, setSelectedResumes] = useState([]);

  // Delete single resume
  const handleDeleteResume = (id) => {
    setResumes(prev => prev.filter(resume => resume.id !== id));
    setSelectedResumes(prev => prev.filter(resumeId => resumeId !== id));
  };

  // Delete selected resumes
  const handleDeleteSelected = () => {
    setResumes(prev => prev.filter(resume => !selectedResumes.includes(resume.id)));
    setSelectedResumes([]);
  };

  // Select all
  const handleSelectAll = () => {
    if (selectedResumes.length === filteredResumes.length) {
      setSelectedResumes([]);
    } else {
      setSelectedResumes(filteredResumes.map(r => r.id));
    }
  };

  // Toggle select
  const handleSelectResume = (id) => {
    setSelectedResumes(prev =>
      prev.includes(id) ? prev.filter(rid => rid !== id) : [...prev, id]
    );
  };

  // Filter resumes
  const filteredResumes = useMemo(() => {
    return resumes.filter(r => {
      const matchesSearch =
        r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.position.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesPosition = selectedPosition === 'All Positions' || r.position === selectedPosition;
      const matchesStatus = selectedStatus === 'All Status' || r.status === selectedStatus;
      return matchesSearch && matchesPosition && matchesStatus;
    });
  }, [resumes, searchTerm, selectedPosition, selectedStatus]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Resume Library</h1>
            <p className="text-gray-600 text-sm">Manage and review uploaded resumes</p>
          </div>

          {selectedResumes.length > 0 && (
            <button
              onClick={handleDeleteSelected}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm"
            >
              Delete Selected
            </button>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search resumes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
          />
        </div>

        {/* Dropdown filters */}
        <div className="flex gap-3">
          <select
            value={selectedPosition}
            onChange={(e) => setSelectedPosition(e.target.value)}
            className="border border-gray-200 rounded-lg px-4 py-2.5 text-sm"
          >
            {positions.map(pos => (
              <option key={pos} value={pos}>{pos}</option>
            ))}
          </select>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="border border-gray-200 rounded-lg px-4 py-2.5 text-sm"
          >
            {statuses.map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="max-w-7xl mx-auto px-6">
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          {/* Header Row */}
          <div className="bg-gray-50 border-b p-4 flex items-center gap-3">
            <input
              type="checkbox"
              checked={selectedResumes.length === filteredResumes.length && filteredResumes.length > 0}
              onChange={handleSelectAll}
              className="w-4 h-4"
            />
            <span className="text-sm text-gray-700">
              {selectedResumes.length > 0
                ? `${selectedResumes.length} selected`
                : `${filteredResumes.length} resumes`}
            </span>
          </div>

          {/* Body */}
          <div>
            {filteredResumes.map((r) => (
              <div
                key={r.id}
                className="p-4 border-b flex items-center justify-between hover:bg-gray-50"
              >
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={selectedResumes.includes(r.id)}
                    onChange={() => handleSelectResume(r.id)}
                    className="w-4 h-4"
                  />
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                    {r.avatar}
                  </div>
                  <div>
                    <div className="font-medium">{r.name}</div>
                    <div className="text-sm text-gray-500">{r.position}</div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <StatusBadge status={r.status} />
                  <button className="p-2 text-gray-500 hover:text-blue-600">
                    <Download size={16} />
                  </button>
                  <button className="p-2 text-gray-500 hover:text-green-600">
                    <Eye size={16} />
                  </button>
                  <button
                    onClick={() => handleDeleteResume(r.id)}
                    className="p-2 text-gray-500 hover:text-red-600"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Empty */}
          {filteredResumes.length === 0 && (
            <div className="text-center py-16 text-gray-500">
              <FileText className="w-8 h-8 mx-auto mb-3 text-gray-400" />
              No resumes found
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResumeLibrary;
