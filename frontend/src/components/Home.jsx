// Landing page for the application featuring hero section, latest jobs, and student/recruiter CTAs
import React, { useEffect, useState } from 'react'
import Navbar from './shared/Navbar'
import Footer from './shared/Footer'
import Hero from './Home/Hero'
import LatestJobs from './Home/LatestJobs'
import Features from './Home/Features'
import RecruiterCTA from './Home/RecruiterCTA'
import FinalCTA from './Home/FinalCTA'
import useGetAllJobs from '@/hooks/useGetAllJobs'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { setSearchedQuery } from '@/redux/jobSlice'

const Home = () => {
    useGetAllJobs()

    const { user } = useSelector(store => store.auth)
    const { allJobs } = useSelector(store => store.job)
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [query, setQuery] = useState('')

    // Redirect recruiters to their dashboard immediately so they don't see the student-focused landing page
    useEffect(() => {
        if (user?.role === 'recruiter') navigate('/admin/companies')
    }, [user, navigate])

    const handleSearch = () => {
        dispatch(setSearchedQuery({ keyword: query.trim() }))
        navigate('/browse')
    }

    const jobs = Array.isArray(allJobs) ? allJobs : []

    return (
        <div className="min-h-screen bg-white">
            <Navbar />
            <Hero query={query} setQuery={setQuery} onSearch={handleSearch} />
            <div className="h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent w-full" />
            <LatestJobs jobs={jobs} />
            <Features />
            <RecruiterCTA />
            <FinalCTA />
            <Footer />
        </div>
    )
}

export default Home
