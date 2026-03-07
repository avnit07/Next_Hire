// Comprehensive job detail page that fetches single job data and handles user applications
import React, { useEffect, useState } from 'react'
import { Button } from './ui/button'
import DOMPurify from 'dompurify'
import { formatSalary } from '@/utils/formatSalary'
import { Users, Clock } from 'lucide-react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '@/utils/axiosInstance'
import { APPLICATION_API_END_POINT, JOB_API_END_POINT } from '@/utils/constant'
import { setSingleJob } from '@/redux/jobSlice'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'sonner'
import Navbar from './shared/Navbar'
import { Spinner, JobDescriptionSkeleton } from '@/components/ui/LoadingStates'

const JobDescription = () => {
    const { singleJob } = useSelector(store => store.job)
    const { user } = useSelector(store => store.auth)

    const [isApplied, setIsApplied] = useState(false)
    const [applying, setApplying] = useState(false)

    const params = useParams()
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const jobId = params.id

    // Fetch Single Job
    const fetchSingleJob = async () => {
        try {
            const res = await api.get(
                `${JOB_API_END_POINT}/get/${jobId}`,
            )

            if (res.data?.success) {
                dispatch(setSingleJob(res.data.job))

                const alreadyApplied = res.data.job?.applications?.some(
                    app => String(app?.applicant?._id || app?.applicant) === String(user?._id)
                )

                setIsApplied(alreadyApplied)
            }
        } catch (error) {
            console.log(error)
        }
    }

    // Apply Job Handler
    const applyJobHandler = async () => {
        if (!user) {
            navigate('/login')
            return
        }
        try {
            setApplying(true)
            const res = await api.post(
                `${APPLICATION_API_END_POINT}/apply/${jobId}`,
                {},
            )
            if (res.data?.success) {
                toast.success(res.data.message)
                await fetchSingleJob()
            }
        } catch (error) {
            console.log(error)
            toast.error(error.response?.data?.message || "Failed to apply")
        } finally {
            setApplying(false)
        }
    }

    // Fetch fresh job details and check if the current user has already applied whenever the page loads
    useEffect(() => {
        if (jobId) fetchSingleJob()
    }, [jobId, dispatch, user?._id])

    return (
        <div className='min-h-screen bg-slate-50'>
            <Navbar />

            <div className='max-w-4xl mx-auto px-4 sm:px-6 py-8'>
                {!singleJob ? (
                    <JobDescriptionSkeleton />
                ) : (
                    <>
                        {/* Header Card */}
                        <div className='bg-white border border-gray-100 rounded-2xl shadow-sm p-6 mb-6'>
                            <div className='flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4'>

                                <div>
                                    <h1 className='text-2xl font-bold text-slate-900'>
                                        {singleJob?.title || 'Job Details'}
                                    </h1>

                                    <div className='flex items-center gap-2 mt-3 flex-wrap'>
                                        <span className='inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-violet-50 text-violet-600 text-xs font-semibold border border-violet-100'>
                                            <Users className='w-3 h-3' />
                                            {singleJob?.position} Positions
                                        </span>
                                        <span className='inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 text-amber-600 text-xs font-semibold border border-amber-100'>
                                            <Clock className='w-3 h-3' />
                                            {singleJob?.jobType}
                                        </span>
                                        <span className='inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-600 text-xs font-semibold border border-indigo-100'>
                                            {formatSalary(singleJob?.salary)}
                                        </span>
                                    </div>
                                </div>

                                <Button
                                    onClick={applyJobHandler}
                                    disabled={isApplied || applying}
                                    className={
                                        isApplied
                                            ? 'h-11 bg-slate-100 text-slate-400 cursor-not-allowed'
                                            : applying
                                                ? 'h-11 bg-brand-primary/80 text-white disabled:opacity-70 disabled:cursor-not-allowed'
                                                : 'h-11 bg-brand-primary hover:bg-brand-primary/90 text-white shadow-sm'
                                    }
                                >
                                    {applying ? (
                                        <span className='flex items-center gap-2'>
                                            <Spinner size='sm' color='white' />
                                            Applying...
                                        </span>
                                    ) : !user ? 'Login to Apply'
                                        : isApplied ? 'Already Applied'
                                            : 'Apply Now'}
                                </Button>

                            </div>
                        </div>

                        {/* Details Card */}
                        <div className='bg-white border border-gray-100 rounded-2xl shadow-sm p-6'>
                            <h2 className='text-base font-semibold text-gray-900 border-b border-gray-100 pb-4 mb-4'>
                                Job Description
                            </h2>

                            <dl className='space-y-3'>
                                {[
                                    { label: 'Role', value: singleJob?.title },
                                    { label: 'Location', value: singleJob?.location },
                                    { label: 'Experience', value: `${singleJob?.experience} yrs` },
                                    { label: 'Salary', value: formatSalary(singleJob?.salary) },
                                    {
                                        label: 'Posted',
                                        value: singleJob?.createdAt
                                            ? new Date(singleJob.createdAt).toLocaleDateString()
                                            : ''
                                    },
                                ].map(({ label, value }) => (
                                    <div key={label} className='flex gap-3 text-sm'>
                                        <dt className='font-semibold text-gray-700 w-32 flex-shrink-0'>{label}</dt>
                                        <dd className='text-gray-500'>{value}</dd>
                                    </div>
                                ))}

                                <div className='text-sm'>
                                    <dt className='font-semibold text-slate-700 mb-1'>Description</dt>
                                    <dd
                                        // Render sanitized HTML description because employers might paste formatted text from external editors
                                        dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(singleJob?.description || '') }}
                                    />
                                </div>
                            </dl>
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}

export default JobDescription
