// Dashboard view for recruiters to see and filter all the jobs they have posted
import React, { useEffect, useState } from 'react'
import Navbar from '../shared/Navbar'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import AdminJobsTable from './AdminJobsTable'
import useGetAllAdminJobs from '@/hooks/useGetAllAdminJobs'
import { setSearchJobByText } from '@/redux/jobSlice'

const AdminJobs = () => {
  useGetAllAdminJobs();
  const [input, setInput] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Update Redux state with the search input so the AdminJobsTable can filter the displayed jobs
  useEffect(() => {
    dispatch(setSearchJobByText(input));
  }, [input]);
  return (
    <div className="bg-slate-50 min-h-screen font-sans pb-12">
      <Navbar />
      <div className='max-w-[1200px] mx-auto my-10 px-4 sm:px-6'>
        <div className='flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8'>
          <div>
            <h1 className='font-bold text-2xl md:text-3xl text-slate-900 tracking-tight'>Posted Jobs</h1>
            <p className='text-sm text-slate-500 mt-1'>Manage all active and past job postings from your companies.</p>
          </div>
          <div className='flex items-center gap-4 w-full md:w-auto'>
            <Input
              className="w-full md:w-64 h-10 border-slate-300 focus-visible:ring-brand-primary placeholder:text-slate-400 bg-white"
              placeholder="Filter by name, role"
              onChange={(e) => setInput(e.target.value)}
            />
            <Button
              onClick={() => navigate("/admin/jobs/create")}
              className="h-10 bg-brand-primary hover:bg-brand-primary/90 text-white shadow-sm whitespace-nowrap"
            >
              Post New Job
            </Button>
          </div>
        </div>
        <AdminJobsTable />
      </div>
    </div>
  )
}

export default AdminJobs