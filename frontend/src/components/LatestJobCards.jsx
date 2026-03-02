// Compact job card used on the Home page to display recent openings
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { MapPin, Clock, Users, ArrowUpRight } from 'lucide-react'
import { formatSalary } from '@/utils/formatSalary'

const LatestJobCards = ({ job }) => {
    const navigate = useNavigate();

    const companyInitials = job?.company?.name
        ? job.company.name.slice(0, 2).toUpperCase()
        : 'CO';

    return (
        <article
            onClick={() => navigate(`/description/${job._id}`)}
            onKeyDown={(e) => e.key === 'Enter' && navigate(`/description/${job._id}`)}
            tabIndex={0}
            aria-label={`${job?.title} at ${job?.company?.name}`}
            className='group bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-lg hover:border-violet-300 transition-all duration-200 cursor-pointer flex flex-col gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400'
        >
            {/* Company */}
            <div className='flex items-center gap-3'>
                <div className='w-10 h-10 rounded-xl border border-gray-100 bg-gray-50 flex items-center justify-center overflow-hidden flex-shrink-0'>
                    {job?.company?.logo ? (
                        <img src={job.company.logo} alt={job.company.name} className='w-full h-full object-cover' />
                    ) : (
                        <span className='text-xs font-bold text-gray-500'>{companyInitials}</span>
                    )}
                </div>
                <div>
                    <p className='font-semibold text-sm text-gray-900'>{job?.company?.name}</p>
                    <div className='flex items-center gap-1'>
                        <MapPin className='w-3 h-3 text-gray-400' aria-hidden="true" />
                        {/* Issue #11 fix: dynamic location instead of hardcoded "India" */}
                        <span className='text-xs text-gray-500'>{job?.location || "Remote"}</span>
                    </div>
                </div>
            </div>

            {/* Title & Desc */}
            <div>
                <h3 className='font-bold text-gray-900 group-hover:text-violet-700 transition-colors line-clamp-1'>
                    {job?.title}
                </h3>
                {/* Issue #12 fix: text-gray-500 for better contrast */}
                <p className='text-sm text-slate-500 mt-1 line-clamp-2 leading-relaxed'>
                    {job?.description?.replace(/<[^>]*>/g, '') || ''}
                </p>
            </div>

            {/* Badges */}
            <div className='flex items-center gap-2 flex-wrap'>
                {job?.position && (
                    <span className='inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-violet-50 text-violet-700 border border-violet-100 text-xs font-semibold'>
                        <Users className='w-3 h-3' />{job.position} Positions
                    </span>
                )}
                {job?.jobType && (
                    <span className='inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-100 text-xs font-semibold'>
                        <Clock className='w-3 h-3' />{job.jobType}
                    </span>
                )}
                {job?.salary && (
                    <span className='inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-600 border border-indigo-100 text-xs font-semibold'>
                        {formatSalary(job.salary)}
                    </span>
                )}
            </div>

            {/* CTA */}
            <div className='flex items-center justify-between mt-auto pt-2 border-t border-gray-50'>
                {/* Issue #12 fix: text-gray-500 */}
                <span className='text-xs text-gray-500 font-medium'>Click to explore</span>
                <span className='inline-flex items-center gap-1 text-xs font-semibold text-violet-600 group-hover:gap-2 transition-all'>
                    View job <ArrowUpRight className='w-3.5 h-3.5' />
                </span>
            </div>
        </article>
    )
}

export default LatestJobCards