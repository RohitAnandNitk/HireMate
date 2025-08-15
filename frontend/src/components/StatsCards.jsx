import React from 'react'

const Card = ({ label, value, sub }) => (
	<div className="flex-1 min-w-[180px] rounded-lg border border-gray-200 bg-white p-4">
		<div className="text-xs text-gray-500">{label}</div>
		<div className="mt-2 text-2xl font-semibold text-gray-900">{value}</div>
		{sub && <div className="text-xs text-gray-400 mt-1">{sub}</div>}
	</div>
)

const StatsCards = ({ totalApplicants = 247, skillMatches = 89, matchRate = 36, shortlisted = 12 }) => {
	return (
		<div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
			<Card label="Total Applicants" value={totalApplicants} />
			<Card label="Skill Matches" value={skillMatches} />
			<Card label="Match Rate" value={`${matchRate}%`} />
			<Card label="Shortlisted" value={shortlisted} />
		</div>
	)
}

export default StatsCards

