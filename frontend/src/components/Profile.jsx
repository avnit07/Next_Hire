// Student profile dashboard displaying personal info, uploaded resume, skills, and application history
import React, { useState } from 'react'
import Navbar from './shared/Navbar'
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar'
import { Button } from './ui/button'
import { Contact, Mail, Pen, FileText, ExternalLink, Briefcase } from 'lucide-react'
import AppliedJobTable from './AppliedJobTable'
import UpdateProfileDialog from './UpdateProfileDialog'
import { useSelector } from 'react-redux'
import useGetAppliedJobs from '@/hooks/useGetAppliedJobs'

const Profile = () => {
    useGetAppliedJobs();
    const [open, setOpen] = useState(false);
    const { user } = useSelector(store => store.auth);

    const initials = user?.fullName
        ? user.fullName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
        : 'U';

    return (
        <div className='min-h-screen bg-slate-50'>
            <Navbar />
            <div className='max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6'>

                {/* Profile Card */}
                <div className='bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden'>
                    {/* Cover Banner */}
                    <div className='h-28 bg-gradient-to-r from-violet-600 via-violet-700 to-purple-700' aria-hidden="true" />

                    <div className='px-6 pb-6'>
                        {/* Avatar + Edit */}
                        <div className='flex items-end justify-between -mt-12 mb-4'>
                            <Avatar className="h-24 w-24 ring-4 ring-white shadow-lg">
                                <AvatarImage src={user?.profile?.profilePhoto} alt={user?.fullName} />
                                <AvatarFallback className='bg-violet-100 text-violet-700 text-2xl font-bold'>{initials}</AvatarFallback>
                            </Avatar>
                            <Button
                                onClick={() => setOpen(true)}
                                variant="outline"
                                className='flex items-center gap-2 border-gray-200 hover:border-violet-300 hover:text-violet-700 hover:bg-violet-50 transition-all'
                            >
                                <Pen className='w-3.5 h-3.5' />
                                Edit Profile
                            </Button>
                        </div>

                        {/* Info */}
                        <div className='space-y-4'>
                            <div>
                                {/* Issue #9 fix: h1 is correct here — it IS the page title */}
                                <h1 className='text-2xl sm:text-3xl font-bold text-slate-900'>{user?.fullName}</h1>
                                {user?.profile?.bio && (
                                    <p className='text-gray-500 mt-1 text-sm leading-relaxed max-w-xl'>{user.profile.bio}</p>
                                )}
                                <span className='inline-flex items-center gap-1.5 mt-2 px-2.5 py-1 bg-violet-100 text-violet-700 rounded-full text-xs font-medium'>
                                    <Briefcase className='w-3 h-3' />
                                    {user?.role === 'recruiter' ? 'Recruiter' : 'Job Seeker'}
                                </span>
                            </div>

                            {/* Contact Info */}
                            <div className='flex flex-wrap gap-4'>
                                <div className='flex items-center gap-2 text-sm text-slate-600'>
                                    <div className='p-1.5 bg-slate-100 rounded-lg'>
                                        <Mail className='w-3.5 h-3.5 text-slate-500' />
                                    </div>
                                    <span>{user?.email}</span>
                                </div>
                                {user?.phoneNumber && (
                                    <div className='flex items-center gap-2 text-sm text-slate-600'>
                                        <div className='p-1.5 bg-slate-100 rounded-lg'>
                                            <Contact className='w-3.5 h-3.5 text-slate-500' />
                                        </div>
                                        <span>{user.phoneNumber}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Two Column: Skills + Resume */}
                <div className='grid md:grid-cols-2 gap-6'>
                    {/* Skills */}
                    <div className='bg-white border border-slate-200 rounded-2xl shadow-sm p-6'>
                        {/* Issue #9 fix: h2 for section heading (not h1) */}
                        <h2 className='text-base font-semibold text-gray-900 mb-4'>Skills</h2>
                        {user?.profile?.skills?.length > 0 ? (
                            <div className='flex flex-wrap gap-2'>
                                {user.profile.skills.map((skill, i) => (
                                    <span key={i} className='px-3 py-1.5 bg-violet-50 text-violet-700 border border-violet-100 rounded-full text-sm font-medium'>
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        ) : (
                            <div className='flex flex-col items-center justify-center py-6 text-center'>
                                <div className='w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center mb-3'>
                                    <Briefcase className='w-5 h-5 text-gray-400' />
                                </div>
                                {/* Issue #12 fix: text-gray-500 for better contrast */}
                                <p className='text-sm text-gray-500'>No skills added yet</p>
                                {/* Issue #8 fix: type="button" + focus-visible ring */}
                                <button
                                    type="button"
                                    onClick={() => setOpen(true)}
                                    className='mt-2 text-sm text-violet-600 hover:underline font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 rounded'
                                >
                                    Add your skills
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Resume */}
                    <div className='bg-white border border-slate-200 rounded-2xl shadow-sm p-6'>
                        {/* Issue #9 fix: h2 for section heading */}
                        <h2 className='text-base font-semibold text-gray-900 mb-4'>Resume</h2>
                        {user?.profile?.resume ? (
                            <div className='flex items-center gap-4 p-4 bg-violet-50 rounded-xl border border-violet-100'>
                                <div className='p-3 bg-violet-100 rounded-xl'>
                                    <FileText className='w-6 h-6 text-violet-600' />
                                </div>
                                <div className='flex-1 min-w-0'>
                                    <p className='text-sm font-semibold text-gray-900 truncate'>
                                        {user.profile.resumeOriginalName || "Resume.pdf"}
                                    </p>
                                    {/* Issue #12 fix: text-gray-500 */}
                                    <p className='text-xs text-gray-500 mt-0.5'>PDF Document</p>
                                </div>
                                <a
                                    href={user.profile.resume}
                                    target='_blank'
                                    rel="noreferrer"
                                    aria-label="Open resume in new tab"
                                    className='p-2 text-violet-600 hover:bg-violet-100 rounded-lg transition-colors flex-shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400'
                                >
                                    <ExternalLink className='w-4 h-4' />
                                </a>
                            </div>
                        ) : (
                            <div className='flex flex-col items-center justify-center py-6 text-center'>
                                <div className='w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center mb-3'>
                                    <FileText className='w-5 h-5 text-gray-400' />
                                </div>
                                {/* Issue #12 fix: text-gray-500 */}
                                <p className='text-sm text-gray-500'>No resume uploaded</p>
                                {/* Issue #8 fix: type="button" + focus-visible ring */}
                                <button
                                    type="button"
                                    onClick={() => setOpen(true)}
                                    className='mt-2 text-sm text-violet-600 hover:underline font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 rounded'
                                >
                                    Upload resume
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Applied Jobs */}
                <div className='bg-white border border-slate-200 rounded-2xl shadow-sm p-6'>
                    <h2 className='text-base font-semibold text-gray-900 mb-5'>Applied Jobs</h2>
                    <AppliedJobTable />
                </div>
            </div>

            <UpdateProfileDialog open={open} setOpen={setOpen} />
        </div>
    )
}

export default Profile