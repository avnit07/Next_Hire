// Main job browsing page featuring a sidebar with advanced filters (location, industry, salary)
import React, { useState } from 'react'
import Navbar from './shared/Navbar'
import FilterCard from './FilterCard'
import Job from './Job';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import useGetAllJobs from '@/hooks/useGetAllJobs';
import { SlidersHorizontal, X } from 'lucide-react';
import { JobCardSkeleton } from '@/components/ui/LoadingStates';

const Jobs = () => {
    useGetAllJobs();
    const { allJobs, isLoading } = useSelector(store => store.job);
    const [showFilter, setShowFilter] = useState(false);

    return (
        <div className="bg-slate-50 min-h-screen">
            <Navbar />
            <div className='container px-4 sm:px-6 my-6 md:my-10'>

                {/* Mobile filter toggle */}
                <div className='lg:hidden mb-4'>
                    <button
                        onClick={() => setShowFilter(!showFilter)}
                        className='flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-sm font-medium text-slate-700 hover:border-brand-primary hover:text-brand-primary transition-all min-h-[44px]'
                    >
                        {showFilter ? <X className='w-4 h-4' /> : <SlidersHorizontal className='w-4 h-4' />}
                        {showFilter ? 'Hide Filters' : 'Show Filters'}
                    </button>
                </div>

                <div className='lg:grid lg:grid-cols-4 gap-6 lg:gap-8'>
                    {/* Filter sidebar — always visible on lg+, toggled on mobile */}
                    <div className={`col-span-1 mb-5 lg:mb-0 ${showFilter ? 'block' : 'hidden lg:block'}`}>
                        <FilterCard />
                    </div>

                    {isLoading ? (
                        <div className='lg:col-span-3 pb-5'>
                            <div className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6'>
                                {[...Array(6)].map((_, i) => <JobCardSkeleton key={i} />)}
                            </div>
                        </div>
                    ) : allJobs.length === 0 ? (
                        <span className='text-slate-500 font-medium lg:col-span-3'>No jobs found. Try adjusting your filters.</span>
                    ) : (
                        <div className='lg:col-span-3 pb-5'>
                            <div className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6'>
                                {allJobs.map((job) => (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, x: -100 }}
                                        transition={{ duration: 0.25 }}
                                        key={job?._id}
                                        className="h-full"
                                    >
                                        <Job job={job} />
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Jobs