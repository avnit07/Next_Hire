// Section displaying a grid of the newest job openings or an empty state if none exist
import React from 'react'
import { ArrowRight, Briefcase } from 'lucide-react'
import { Link } from 'react-router-dom'
import JobCard from './JobCard'

const EmptyJobs = () => (
    <div className="flex flex-col items-center justify-center py-24 text-center bg-white/60 rounded-2xl border-2 border-dashed border-violet-200">
        <div className="w-14 h-14 rounded-xl bg-violet-50 border border-violet-100 flex items-center justify-center mb-5 shadow-sm">
            <Briefcase className="w-6 h-6 text-violet-400" />
        </div>
        <p className="text-sm font-bold text-slate-700">No roles posted yet</p>
        <p className="text-xs text-slate-500 mt-1.5 max-w-xs leading-relaxed">
            Fresh opportunities are added daily. Come back soon or set up job alerts.
        </p>
    </div>
)

const LatestJobs = ({ jobs }) => {
    const visible = jobs.slice(0, 6)

    return (
        <section className="relative pt-14 pb-10 md:pt-24 md:pb-14 overflow-hidden">
            {/* Rich layered background */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#EDE9FE]/60 via-[#F5F3FF]/80 to-white pointer-events-none" />
            {/* Subtle dot grid */}
            <div
                className="absolute inset-0 pointer-events-none opacity-[0.035]"
                style={{
                    backgroundImage: 'radial-gradient(circle, #7C3AED 1px, transparent 1px)',
                    backgroundSize: '28px 28px'
                }}
            />
            {/* Ambient glow top */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[300px] bg-violet-300/15 rounded-full blur-[100px] pointer-events-none" />

            <div className="container relative z-10 px-4 sm:px-6">

                {/* Section header */}
                <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8 md:mb-12">
                    <div>
                        <div className="inline-flex items-center gap-1.5 mb-3">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest">
                                Live now
                            </span>
                        </div>
                        <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-[-0.025em] leading-tight">
                            Latest openings
                        </h2>
                        <p className="text-slate-500 text-[15px] mt-2 leading-relaxed">
                            Hand-picked roles from companies building the future.
                        </p>
                    </div>
                    <Link
                        to="/jobs"
                        className="hidden sm:flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-brand-primary transition-colors group whitespace-nowrap"
                    >
                        Browse all jobs
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                    </Link>
                </div>

                {/* Grid */}
                {visible.length === 0 ? (
                    <EmptyJobs />
                ) : (
                    <>
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                            {visible.map((job) => (
                                <JobCard key={job._id} job={job} />
                            ))}
                        </div>

                        {/* Mobile CTA */}
                        <div className="sm:hidden mt-10 text-center">
                            <Link
                                to="/jobs"
                                className="inline-flex items-center gap-2 text-sm font-bold text-brand-primary"
                            >
                                Browse all jobs <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>
                    </>
                )}
            </div>
        </section>
    )
}

export default LatestJobs
