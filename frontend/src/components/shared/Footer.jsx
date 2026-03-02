// Global site footer containing brand information, social links, and role-specific navigation
import React from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, Twitter, Linkedin, Github } from 'lucide-react';
import { useSelector } from 'react-redux';

const socialLinks = [
    { href: "https://twitter.com", Icon: Twitter, label: "Twitter" },
    { href: "https://linkedin.com", Icon: Linkedin, label: "LinkedIn" },
    { href: "https://github.com", Icon: Github, label: "GitHub" },
];

const Footer = () => {
    const { user } = useSelector(store => store.auth);
    const isLoggedIn = !!user;
    const isRecruiter = user?.role === 'recruiter';

    // Job-seeker links
    const seekerLinks = [
        { to: "/jobs", label: "Browse Jobs" },
        { to: "/browse", label: "Explore Categories" },
        ...(isLoggedIn
            ? [{ to: "/profile", label: "My Profile" }]
            : [{ to: "/signup", label: "My Applications" }] // Changed from "Create Account"
        ),
    ];

    // Recruiter links
    const recruiterLinks = [
        { to: "/admin/companies", label: "Companies" },
        { to: "/admin/jobs", label: "Post a Job" },
        ...(!isLoggedIn ? [{ to: "/signup", label: "Get Started" }] : []),
    ];

    return (
        <footer className='bg-white border-t border-slate-200'>
            {/* Top gradient accent line */}
            <div className="h-px bg-gradient-to-r from-transparent via-violet-400 to-transparent" />

            <div className='container py-12 px-4 sm:px-6'>
                <div className='grid grid-cols-2 md:grid-cols-4 gap-8'>

                    {/* Brand */}
                    <div className='col-span-2'>
                        <div className='flex items-center gap-2 mb-4'>
                            <div className='w-8 h-8 rounded-lg bg-violet-600 flex items-center justify-center'>
                                <Briefcase className='w-4 h-4 text-white' />
                            </div>
                            <span className='text-xl'>
                                <span className='text-slate-900 font-bold'>Next</span>
                                <span className='text-violet-600 font-bold'>Hire</span>
                            </span>
                        </div>
                        <p className='text-slate-500 text-sm mt-2 max-w-[200px] leading-relaxed'>
                            Connecting talented professionals with the world's best companies. Find your next opportunity today.
                        </p>

                        {/* Social Icons */}
                        <div className='flex items-center gap-3 mt-6'>
                            {socialLinks.map(({ href, Icon, label }) => (
                                <a
                                    key={href}
                                    href={href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label={`Visit our ${label} page`}
                                    className='w-9 h-9 bg-slate-100 hover:bg-violet-50 rounded-lg flex items-center justify-center transition-colors duration-200 cursor-pointer border border-slate-200 hover:border-violet-300 group'
                                >
                                    <Icon className='text-slate-500 group-hover:text-violet-600 w-4 h-4 transition-colors duration-200' aria-hidden="true" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* For Job Seekers */}
                    <div>
                        <h3 className='text-xs font-semibold text-slate-400 tracking-widest uppercase mb-4'>For Job Seekers</h3>
                        <ul className='space-y-3'>
                            {seekerLinks.map(({ to, label }) => (
                                <li key={to}>
                                    <Link to={to} className='text-slate-500 hover:text-violet-600 text-sm transition-colors duration-200'>
                                        {label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* For Recruiters */}
                    <div>
                        <h3 className='text-xs font-semibold text-slate-400 tracking-widest uppercase mb-4'>For Recruiters</h3>
                        <ul className='space-y-3'>
                            {recruiterLinks.map(({ to, label }) => (
                                <li key={to}>
                                    <Link to={to} className='text-slate-500 hover:text-violet-600 text-sm transition-colors duration-200'>
                                        {label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                </div>
            </div>

            {/* BOTTOM BAR */}
            <div className='bg-slate-50 border-t border-slate-100 py-4 px-6 flex flex-col sm:flex-row justify-between items-center gap-3'>
                <p className='text-slate-400 text-sm'>© 2026 NextHire. All rights reserved.</p>
                <div className='flex items-center gap-5'>
                    <Link to="/privacy" className='text-slate-400 hover:text-violet-600 text-sm transition-colors'>Privacy</Link>
                    <Link to="/terms" className='text-slate-400 hover:text-violet-600 text-sm transition-colors'>Terms</Link>
                </div>
            </div>
        </footer>
    );
};

export default Footer;