// Call-to-action section that dynamically tailors its message and buttons based on the user's role
import React from 'react'
import { ArrowRight, CheckCircle2 } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

// ─── Shared section shell (gradient bg + decorations) ─────────────────────────
const CTASection = ({ children }) => (
    <section className="relative pt-10 pb-14 md:pt-14 md:pb-20 overflow-hidden bg-gradient-to-br from-[#F5F3FF] via-white to-[#EEF2FF]">
        {/* Ambient glow */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-violet-200/40 rounded-full blur-[100px] pointer-events-none" />
        {/* Dot grid */}
        <div
            className="absolute inset-0 pointer-events-none opacity-[0.04]"
            style={{
                backgroundImage: 'radial-gradient(circle, #7C3AED 1px, transparent 1px)',
                backgroundSize: '24px 24px'
            }}
        />
        <div className="container px-4 sm:px-6 relative z-10">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8 md:gap-10">
                {children}
            </div>
        </div>
    </section>
)

// ─── Shared button styles ─────────────────────────────────────────────────────
const PrimaryBtn = ({ onClick, to, children }) => {
    const cls = "group w-full sm:w-auto flex items-center justify-center gap-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold px-7 py-4 rounded-xl text-sm transition-all duration-200 shadow-lg shadow-violet-200 hover:-translate-y-px hover:shadow-violet-300 min-h-[44px]"
    if (to) return <Link to={to}><button className={cls}>{children}</button></Link>
    return <button className={cls} onClick={onClick}>{children}</button>
}

const SecondaryBtn = ({ onClick, to, children }) => {
    const cls = "w-full sm:w-auto text-sm font-bold text-slate-600 hover:text-brand-primary px-7 py-4 rounded-xl border border-slate-300 hover:border-brand-primary/50 hover:bg-brand-primary/5 transition-all duration-200 min-h-[44px]"
    if (to) return <Link to={to}><button className={cls}>{children}</button></Link>
    return <button className={cls} onClick={onClick}>{children}</button>
}

// ─── FinalCTA ─────────────────────────────────────────────────────────────────
const FinalCTA = () => {
    const navigate = useNavigate()
    const { user } = useSelector(store => store.auth)
    const isRecruiter = user?.role === 'recruiter'
    const isStudent = user?.role === 'student'
    const isGuest = !user

    return (
        <>
            {/* ── GUEST view ────────────────────────────────────────────── */}
            {isGuest && (
                <CTASection>
                    <div className="max-w-lg">
                        <h2 className="text-3xl sm:text-[38px] font-black text-slate-900 tracking-[-0.025em] leading-tight mb-3">
                            Ready to make your move?
                        </h2>
                        <p className="text-slate-500 text-[15px] leading-relaxed mb-5">
                            Join 85,000+ professionals who found their next role on NextHire.
                        </p>
                        <div className="flex flex-wrap gap-x-5 gap-y-2">
                            {['Free forever for job seekers', 'No recruiter spam', 'Cancel anytime'].map(pt => (
                                <div key={pt} className="flex items-center gap-1.5">
                                    <CheckCircle2 className="w-4 h-4 text-violet-500 flex-shrink-0" />
                                    <span className="text-[13px] font-medium text-slate-500">{pt}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                        <PrimaryBtn to="/signup">
                            Create free account
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                        </PrimaryBtn>
                        <SecondaryBtn to="/jobs">Browse all jobs</SecondaryBtn>
                    </div>
                </CTASection>
            )}

            {/* ── STUDENT view ──────────────────────────────────────────── */}
            {isStudent && (
                <CTASection>
                    <div className="max-w-lg">
                        <h2 className="text-3xl sm:text-[38px] font-black text-slate-900 tracking-[-0.025em] leading-tight mb-3">
                            Ready to land your next role?
                        </h2>
                        <p className="text-slate-500 text-[15px] leading-relaxed mb-5">
                            You're already in. Browse open positions and track your applications.
                        </p>
                        <div className="flex flex-wrap gap-x-5 gap-y-2">
                            {['Profile active', 'Applications tracked', 'Free forever'].map(pt => (
                                <div key={pt} className="flex items-center gap-1.5">
                                    <CheckCircle2 className="w-4 h-4 text-violet-500 flex-shrink-0" />
                                    <span className="text-[13px] font-medium text-violet-600">{pt}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                        <PrimaryBtn onClick={() => navigate('/jobs')}>
                            Browse Jobs
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                        </PrimaryBtn>
                        <SecondaryBtn onClick={() => navigate('/profile')}>My Profile</SecondaryBtn>
                    </div>
                </CTASection>
            )}

            {/* ── RECRUITER view ────────────────────────────────────────── */}
            {isRecruiter && (
                <CTASection>
                    <div className="max-w-lg">
                        <h2 className="text-3xl sm:text-[38px] font-black text-slate-900 tracking-[-0.025em] leading-tight mb-3">
                            Ready to find your next hire?
                        </h2>
                        <p className="text-slate-500 text-[15px] leading-relaxed mb-5">
                            Post a new role and start receiving applications within 48 hours.
                        </p>
                        <div className="flex flex-wrap gap-x-5 gap-y-2">
                            {['No agency fees', 'Verified candidates', 'Real-time applicants'].map(pt => (
                                <div key={pt} className="flex items-center gap-1.5">
                                    <CheckCircle2 className="w-4 h-4 text-violet-500 flex-shrink-0" />
                                    <span className="text-[13px] font-medium text-slate-500">{pt}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                        <PrimaryBtn onClick={() => navigate('/admin/jobs/create')}>
                            Post a Job
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                        </PrimaryBtn>
                        <SecondaryBtn onClick={() => navigate('/admin/companies')}>My Companies</SecondaryBtn>
                    </div>
                </CTASection>
            )}
        </>
    )
}

export default FinalCTA
