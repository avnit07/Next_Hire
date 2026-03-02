// Search Results page displaying jobs that match the user's explicit query from the Home page hero section
import React, { useEffect } from 'react'
import Navbar from './shared/Navbar'
import Job from './Job';
import { useDispatch, useSelector } from 'react-redux';
import { setSearchedQuery, clearSearchedQuery } from '@/redux/jobSlice';
import useGetAllJobs from '@/hooks/useGetAllJobs';

const Browse = () => {
    useGetAllJobs();
    const { allJobs } = useSelector(store => store.job);
    const dispatch = useDispatch();

    // Clear the search query when the user leaves the Browse page so subsequent "Jobs" visits start fresh
    useEffect(() => {
        return () => {
            dispatch(clearSearchedQuery());
        }
    }, [dispatch]);

    return (
        <div className="bg-slate-50 min-h-screen">
            <Navbar />
            <div className='container py-10'>
                <h1 className='font-bold text-xl text-slate-900 mb-8'>Search Results ({allJobs.length})</h1>
                <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6'>
                    {
                        allJobs.length > 0 ? allJobs.map((job) => {
                            return (
                                <Job key={job._id} job={job} />
                            )
                        }) : <span className="text-slate-500 font-medium col-span-full">No jobs found matching your criteria.</span>
                    }
                </div>

            </div>
        </div>
    )
}

export default Browse