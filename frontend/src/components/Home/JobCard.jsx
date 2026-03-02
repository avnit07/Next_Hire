// A styled reusable card component displaying summary details for a single job posting
import React from 'react'
import { MapPin, ArrowUpRight, Clock } from 'lucide-react'
import { formatSalary } from '@/utils/formatSalary'
import { useNavigate } from 'react-router-dom'

// Strip HTML tags from description in case the stored text contains markup
const stripHtml = (str) => {
    if (!str) return ''
    return str.replace(/<[^>]*>/g, '')
}

const JobCard = ({ job }) => {
    const navigate = useNavigate()

    const daysAgo = (() => {
        if (!job?.createdAt) return null
        const d = Math.floor((Date.now() - new Date(job.createdAt)) / 86400000)
        return isNaN(d) ? null : Math.max(0, d)
    })()

    const initials = job?.company?.name
        ? job.company.name.slice(0, 2).toUpperCase()
        : 'CO'

    return (
        <div
            onClick={() => navigate(`/description/${job._id}`)}
            className="group relative flex flex-col gap-4 p-6 bg-white rounded-2xl border border-slate-200 shadow-sm hover:border-violet-300 hover:shadow-lg hover:-translate-y-px transition-all duration-300 cursor-pointer overflow-hidden"
        >
            {/* Subtle purple tint on hover */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none bg-gradient-to-br from-violet-50 via-transparent to-transparent" />

            {/* Company row */}
            <div className="flex items-start justify-between gap-3 relative z-10">
                <div className="flex items-center gap-3.5">
                    <div className="w-11 h-11 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-center overflow-hidden flex-shrink-0 shadow-sm">
                        {job?.company?.logo
                            ? <img src={job.company.logo} alt="" className="w-full h-full object-cover" />
                            : <span className="text-[11px] font-black text-slate-500 tracking-tight">{initials}</span>
                        }
                    </div>
                    <div>
                        <p className="text-[13px] font-bold text-slate-800 leading-tight">{job?.company?.name || 'Company'}</p>
                        <div className="flex items-center gap-1 mt-0.5">
                            <MapPin className="w-3 h-3 text-slate-400" />
                            <span className="text-[11px] text-slate-500 font-medium">{job?.location || 'India'}</span>
                        </div>
                    </div>
                </div>
                {daysAgo !== null && (
                    <div className="flex items-center gap-1 flex-shrink-0 mt-0.5">
                        <Clock className="w-3 h-3 text-slate-400" />
                        <span className="text-[11px] text-slate-400 font-medium">
                            {daysAgo === 0 ? 'Today' : `${daysAgo}d ago`}
                        </span>
                    </div>
                )}
            </div>

            {/* Title + description */}
            <div className="relative z-10">
                <h3 className="font-bold text-slate-900 text-[15px] leading-snug line-clamp-1 mb-1.5 tracking-tight">
                    {job?.title}
                </h3>
                {/* stripHtml: descriptions stored in DB may contain HTML anchor tags that render as live links */}
                <p className="text-[13px] text-slate-500 line-clamp-2 leading-relaxed">
                    {stripHtml(job?.description)}
                </p>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 relative z-10">
                {job?.position && (
                    <span className="text-[11px] font-semibold px-3 py-1 rounded-full bg-violet-50 text-violet-700 border border-violet-100">
                        {job.position} opening{job.position > 1 ? 's' : ''}
                    </span>
                )}
                {job?.jobType && (
                    <span className="text-[11px] font-semibold px-3 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-100">
                        {job.jobType}
                    </span>
                )}
                {job?.salary && (
                    <span className="text-[11px] font-semibold px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 border border-indigo-100">
                        {formatSalary(job.salary)}
                    </span>
                )}
            </div>

            {/* Footer */}
            <div className="pt-3 border-t border-[#F1F5F9] flex items-center justify-between relative z-10">
                <span className="text-[11px] text-slate-500 font-medium">View full job description</span>
                <span className="inline-flex items-center gap-1 text-xs font-bold text-violet-600 opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all duration-200">
                    Open <ArrowUpRight className="w-3.5 h-3.5" />
                </span>
            </div>
        </div>
    )
}

export default JobCard
