// Role-specific promotional section highlighting statistics for recruiters and job seekers
import React from 'react'
import { ArrowRight, BriefcaseBusiness, LayoutDashboard } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

// ─── Recruiter stats ──────────────────────────────────────────────────────────
const RECRUITER_STATS = [
    { stat: '2 min', desc: 'Average time to post a job' },
    { stat: '48 hrs', desc: 'Median time to first applicant' },
    { stat: '85K+', desc: 'Verified candidate profiles' },
    { stat: '100%', desc: 'Employer verification rate' },
]

// ─── Student stats ────────────────────────────────────────────────────────────
const STUDENT_STATS = [
    { stat: '500+', desc: 'Active job listings' },
    { stat: '48 hrs', desc: 'Average response time' },
    { stat: '200+', desc: 'Verified companies' },
    { stat: 'Free', desc: 'Always free for candidates' },
]

// ─── Shared stat card ─────────────────────────────────────────────────────────
const StatCard = ({ stat, desc }) => (
    <div className="p-5 sm:p-6 rounded-2xl bg-white/10 border border-white/15 hover:bg-white/20 transition-all duration-200">
        <p className="text-2xl sm:text-[28px] font-black text-white tracking-tight mb-1">{stat}</p>
        <p className="text-[11px] sm:text-[12px] text-violet-200 leading-snug font-medium">{desc}</p>
    </div>
)

// ─── Shared card shell (gradient banner + decorations) ────────────────────────
const CTACard = ({ children }) => (
    <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-violet-600 to-indigo-700 shadow-xl shadow-violet-200">
        {/* Dot grid texture */}
        <div
            className="absolute inset-0 pointer-events-none opacity-[0.08]"
            style={{
                backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)',
                backgroundSize: '24px 24px'
            }}
        />
        {/* Ambient glow */}
        <div className="absolute -top-20 -right-20 w-[350px] h-[350px] bg-white/10 rounded-full blur-[80px] pointer-events-none" />

        <div className="relative grid lg:grid-cols-2 gap-8 lg:gap-12 items-center px-6 sm:px-12 lg:px-16 py-10 sm:py-14">
            {children}
        </div>
    </div>
)

// ─── RecruiterCTA ─────────────────────────────────────────────────────────────
const RecruiterCTA = () => {
    const navigate = useNavigate()
    const { user } = useSelector(store => store.auth)
    const isRecruiter = user?.role === 'recruiter'
    const isStudent = user?.role === 'student'
    const isGuest = !user

    return (
        <section className="pt-10 pb-12 md:pt-14 md:pb-16 bg-slate-50 border-t border-slate-100">
            <div className="container px-4 sm:px-6">

                {/* ── RECRUITER / GUEST view ──────────────────────────────── */}
                {(isRecruiter || isGuest) && (
                    <CTACard>
                        {/* Left */}
                        <div>
                            <span className="inline-block px-3 py-1 rounded-full bg-white/15 border border-white/20 text-white/80 text-xs font-bold uppercase tracking-widest mb-5">
                                For hiring teams
                            </span>
                            <h2 className="text-3xl sm:text-[40px] font-black text-white leading-[1.08] tracking-[-0.03em] mb-5">
                                Hire the engineers<br />
                                <span className="text-violet-200">you've been looking for.</span>
                            </h2>
                            <p className="text-[15px] text-violet-100/80 leading-[1.7] mb-8 max-w-md">
                                Post a role and reach 85,000+ engineers, designers, and data professionals actively looking. No agency fees. No middlemen. No noise.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-3">
                                {isRecruiter ? (
                                    <>
                                        <button
                                            onClick={() => navigate('/admin/jobs/create')}
                                            className="group w-full sm:w-auto flex items-center justify-center gap-2.5 bg-white hover:bg-slate-50 text-violet-700 font-bold px-6 py-3.5 rounded-xl text-sm transition-all duration-200 shadow-md hover:-translate-y-px min-h-[44px]"
                                        >
                                            Post a new job
                                            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                                        </button>
                                        <button
                                            onClick={() => navigate('/admin/jobs')}
                                            className="w-full sm:w-auto flex items-center justify-center gap-2 text-white/80 hover:text-white border border-white/30 hover:border-white/50 hover:bg-white/10 font-semibold px-6 py-3.5 rounded-xl text-sm transition-all duration-200 min-h-[44px]"
                                        >
                                            <LayoutDashboard className="w-4 h-4" />
                                            My Jobs Dashboard
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <Link to="/signup">
                                            <button className="group w-full sm:w-auto flex items-center justify-center gap-2.5 bg-white hover:bg-slate-50 text-violet-700 font-bold px-6 py-3.5 rounded-xl text-sm transition-all duration-200 shadow-md hover:-translate-y-px min-h-[44px]">
                                                Post a job — it's free
                                                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                                            </button>
                                        </Link>
                                        <Link to="/login">
                                            <button className="w-full sm:w-auto flex items-center justify-center gap-2 text-white/80 hover:text-white border border-white/30 hover:border-white/50 hover:bg-white/10 font-semibold px-6 py-3.5 rounded-xl text-sm transition-all duration-200 min-h-[44px]">
                                                Sign in as recruiter
                                            </button>
                                        </Link>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Right: stat grid */}
                        <div className="grid grid-cols-2 gap-3 sm:gap-4">
                            {RECRUITER_STATS.map(s => <StatCard key={s.desc} {...s} />)}
                        </div>
                    </CTACard>
                )}

                {/* ── STUDENT view ────────────────────────────────────────── */}
                {isStudent && (
                    <CTACard>
                        {/* Left */}
                        <div>
                            <span className="inline-block px-3 py-1 rounded-full bg-white/15 border border-white/20 text-white/80 text-xs font-bold uppercase tracking-widest mb-5">
                                For job seekers
                            </span>
                            <h2 className="text-3xl sm:text-[40px] font-black text-white leading-[1.08] tracking-[-0.03em] mb-5">
                                Find your next<br />
                                <span className="text-violet-200">engineering role.</span>
                            </h2>
                            <p className="text-[15px] text-violet-100/80 leading-[1.7] mb-8 max-w-md">
                                Browse thousands of verified jobs from top companies. Apply in seconds. Track your applications in one place.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-3">
                                <button
                                    onClick={() => navigate('/jobs')}
                                    className="group w-full sm:w-auto flex items-center justify-center gap-2.5 bg-white hover:bg-slate-50 text-violet-700 font-bold px-6 py-3.5 rounded-xl text-sm transition-all duration-200 shadow-md hover:-translate-y-px min-h-[44px]"
                                >
                                    Browse Jobs
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                                </button>
                                <button
                                    onClick={() => navigate('/profile')}
                                    className="w-full sm:w-auto flex items-center justify-center gap-2 text-white/80 hover:text-white border border-white/30 hover:border-white/50 hover:bg-white/10 font-semibold px-6 py-3.5 rounded-xl text-sm transition-all duration-200 min-h-[44px]"
                                >
                                    <BriefcaseBusiness className="w-4 h-4" />
                                    Update Profile
                                </button>
                            </div>
                        </div>

                        {/* Right: student stat grid */}
                        <div className="grid grid-cols-2 gap-3 sm:gap-4">
                            {STUDENT_STATS.map(s => <StatCard key={s.desc} {...s} />)}
                        </div>
                    </CTACard>
                )}

            </div>
        </section>
    )
}

export default RecruiterCTA
