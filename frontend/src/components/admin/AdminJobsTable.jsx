// Table component displaying a recruiter's posted jobs with actions to edit or view applicants
import React, { useEffect, useState } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { Edit2, Eye, MoreHorizontal, Briefcase } from 'lucide-react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { Button } from '../ui/button'

const AdminJobsTable = () => {
    const { allAdminJobs, searchJobByText } = useSelector(store => store.job);
    const [filterJobs, setFilterJobs] = useState(Array.isArray(allAdminJobs) ? allAdminJobs : []);
    const navigate = useNavigate();

    // Filter the displayed jobs locally based on the search text stored in Redux
    useEffect(() => {
        const jobs = Array.isArray(allAdminJobs) ? allAdminJobs : [];
        const filtered = jobs.filter((job) => {
            if (!searchJobByText) return true;
            const q = searchJobByText.toLowerCase();
            return job?.title?.toLowerCase().includes(q) || job?.company?.name?.toLowerCase().includes(q);
        });
        setFilterJobs(filtered);
    }, [allAdminJobs, searchJobByText]);

    if (!filterJobs.length) {
        return (
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden flex flex-col items-center justify-center p-16 text-center">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                    <Briefcase className="w-8 h-8 text-slate-400" />
                </div>
                <h3 className="text-lg font-medium text-slate-900 mb-1">No jobs found</h3>
                <p className="text-sm text-slate-500 mb-6">
                    {searchJobByText ? `No jobs match "${searchJobByText}"` : "Post your first job to get started."}
                </p>
                {!searchJobByText && (
                    <Button
                        onClick={() => navigate("/admin/jobs/create")}
                        className="bg-brand-primary hover:bg-brand-primary/90 text-white"
                    >
                        Post a Job
                    </Button>
                )}
            </div>
        );
    }

    return (
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
                <Table>
                    <TableHeader className="bg-slate-50/50 border-b border-slate-200">
                        <TableRow className="hover:bg-transparent">
                            <TableHead className="font-semibold text-slate-600 px-6 py-4 rounded-tl-xl whitespace-nowrap">Date</TableHead>
                            <TableHead className="font-semibold text-slate-600 px-6 py-4 whitespace-nowrap">Job Title</TableHead>
                            <TableHead className="font-semibold text-slate-600 px-6 py-4 whitespace-nowrap">Company</TableHead>
                            <TableHead className="font-semibold text-slate-600 text-right px-6 py-4 rounded-tr-xl whitespace-nowrap">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filterJobs.map((job) => (
                            <TableRow key={job?._id} className="hover:bg-slate-50/80 transition-colors group">
                                <TableCell className="px-6 py-4">
                                    <span className="text-sm text-slate-600 font-medium whitespace-nowrap">{job?.createdAt?.split("T")[0]}</span>
                                </TableCell>
                                <TableCell className="px-6 py-4">
                                    <div>
                                        <span className="text-sm font-medium text-slate-900">{job?.title}</span>
                                        {job?.jobType && (
                                            <p className="text-xs text-slate-500 mt-0.5">{job.jobType}</p>
                                        )}
                                    </div>
                                </TableCell>
                                <TableCell className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        {job?.company?.logo && (
                                            <img src={job.company.logo} alt="" className="w-8 h-8 rounded-md border border-slate-200 object-cover flex-shrink-0" />
                                        )}
                                        <span className="text-sm text-slate-700 font-medium whitespace-nowrap">{job?.company?.name || '—'}</span>
                                    </div>
                                </TableCell>
                                <TableCell className="text-right px-6 py-4 align-middle">
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button variant="ghost" className="h-8 w-8 p-0 text-slate-400 hover:text-slate-900 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-44 p-1 rounded-xl shadow-lg border border-slate-100" align="end">
                                            <button
                                                onClick={() => navigate(`/admin/companies/${job?.company?._id || job?.company}`)}
                                                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-sm text-slate-700 hover:bg-slate-50 hover:text-brand-primary transition-colors"
                                            >
                                                <Edit2 className="w-4 h-4" />
                                                Edit Job
                                            </button>
                                            <button
                                                onClick={() => navigate(`/admin/jobs/${job?._id}/applicants`)}
                                                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-sm text-slate-700 hover:bg-slate-50 hover:text-brand-primary transition-colors mt-1"
                                            >
                                                <Eye className="w-4 h-4" />
                                                Applicants
                                            </button>
                                        </PopoverContent>
                                    </Popover>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}

export default AdminJobsTable