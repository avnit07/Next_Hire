// Individual job card component that displays summary information and a prominent apply button
import React from 'react'
import { Button } from './ui/button'
import { Bookmark, MapPin, Clock, Users, ArrowUpRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { formatSalary } from '@/utils/formatSalary'

// Strip HTML tags from description in case stored content contains markup
const stripHtml = (str) => {
    if (!str) return ''
    return str.replace(/<[^>]*>/g, '')
}

const Job = ({ job }) => {
    const navigate = useNavigate();

    const daysAgoFunction = (mongodbTime) => {
        if (!mongodbTime) return 0;
        const createdAt = new Date(mongodbTime);
        const currentTime = new Date();
        const timeDifference = currentTime - createdAt;
        const days = Math.floor(timeDifference / (1000 * 24 * 60 * 60));
        return isNaN(days) ? 0 : Math.max(0, days);
    }

    const daysAgo = daysAgoFunction(job?.createdAt);
    const postedLabel = daysAgo === 0 ? "Today" : `${daysAgo}d ago`;

    const companyInitials = job?.company?.name
        ? job.company.name.slice(0, 2).toUpperCase()
        : 'CO';

    const goToDescription = () => navigate(`/description/${job?._id}`);
    const goToApply = () => navigate(`/description/${job?._id}?apply=true`);

    return (
        <article
            className='group h-full bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-lg hover:border-violet-300 hover:-translate-y-px transition-all duration-300 flex flex-col gap-4 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary/50'
            tabIndex={0}
            aria-label={`${job?.title} at ${job?.company?.name}`}
            onClick={goToDescription}
            onKeyDown={(e) => e.key === 'Enter' && goToDescription()}
        >
            {/* Header: Company + Bookmark */}
            <div className='flex items-start justify-between'>
                <div className='flex items-center gap-3'>
                    <div className='w-11 h-11 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-center overflow-hidden flex-shrink-0 shadow-sm'>
                        {job?.company?.logo ? (
                            <img src={job.company.logo} alt={job.company.name} className='w-full h-full object-cover' />
                        ) : (
                            <span className='text-[11px] font-black text-slate-500 tracking-tight'>{companyInitials}</span>
                        )}
                    </div>
                    <div>
                        <p className='font-bold text-slate-900 text-[13px] leading-tight'>{job?.company?.name || "Company"}</p>
                        <div className='flex items-center gap-1 mt-0.5'>
                            <MapPin className='w-3 h-3 text-slate-400' aria-hidden="true" />
                            <span className='text-[11px] text-slate-500 font-medium'>{job?.location || "Remote"}</span>
                        </div>
                    </div>
                </div>
                <div className='flex items-center gap-1.5'>
                    <span className='text-[11px] text-slate-400 font-medium'>{postedLabel}</span>
                    <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            toast.success('Job saved!');
                        }}
                        aria-label="Save job"
                        className='p-1.5 rounded-lg text-slate-400 hover:text-brand-primary hover:bg-brand-primary/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary/50'
                    >
                        <Bookmark className='w-4 h-4' />
                    </button>
                </div>
            </div>

            {/* Job Title + Description */}
            <div>
                <h3 className='font-bold text-slate-900 text-[15px] mb-1.5 line-clamp-1 tracking-tight'>
                    {job?.title}
                </h3>
                <p className='text-[13px] text-slate-500 line-clamp-2 leading-relaxed'>
                    {stripHtml(job?.description)}
                </p>
            </div>

            {/* Tags — violet=positions, amber=jobType, indigo=salary */}
            <div className='flex items-center gap-2 flex-wrap'>
                {job?.position && (
                    <span className='text-[11px] font-semibold px-3 py-1 rounded-full bg-violet-50 text-violet-700 border border-violet-100'>
                        <Users className='w-3 h-3 inline mr-1' />
                        {job.position} opening{job.position > 1 ? 's' : ''}
                    </span>
                )}
                {job?.jobType && (
                    <span className='text-[11px] font-semibold px-3 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-100'>
                        <Clock className='w-3 h-3 inline mr-1' />
                        {job.jobType}
                    </span>
                )}
                {job?.salary && (
                    <span className='text-[11px] font-semibold px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 border border-indigo-100'>
                        {formatSalary(job.salary)}
                    </span>
                )}
            </div>

            {/* Footer: Actions */}
            <div className='flex items-center gap-2 pt-3 mt-auto border-t border-slate-100'>
                <Button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); goToDescription(); }}
                    variant="outline"
                    className='flex-1 h-10 text-sm font-medium border-slate-200 hover:border-brand-primary hover:text-brand-primary hover:bg-brand-primary/5 transition-all rounded-xl'
                >
                    View Details
                </Button>
                <Button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); goToApply(); }}
                    className='flex-1 h-10 bg-brand-primary hover:bg-brand-primary/90 text-white text-sm font-semibold shadow-sm transition-all flex items-center justify-center gap-1.5 rounded-xl'
                >
                    Apply Now
                    <ArrowUpRight className='w-3.5 h-3.5' />
                </Button>
            </div>
        </article>
    )
}

export default Job