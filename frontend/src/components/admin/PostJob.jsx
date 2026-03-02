// Form component for recruiters to publish a new job opening linked to one of their registered companies
import React, { useState } from 'react'
import Navbar from '../shared/Navbar'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { useSelector } from 'react-redux'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import axios from 'axios'
import { JOB_API_END_POINT } from '@/utils/constant'
import { toast } from 'sonner'
import { useNavigate } from 'react-router-dom'
import { Loader2, ArrowLeft } from 'lucide-react'

const companyArray = [];

const PostJob = () => {
    const [input, setInput] = useState({
        title: "",
        description: "",
        requirements: "",
        salary: "",
        location: "",
        jobType: "",
        experience: "",
        position: 0,
        companyId: ""
    });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const { companies } = useSelector(store => store.company);
    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    };

    const selectChangeHandler = (value) => {
        const selectedCompany = companies.find((company) => company._id === value);
        if (selectedCompany) {
            setInput({ ...input, companyId: selectedCompany._id });
        }
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const res = await axios.post(`${JOB_API_END_POINT}/post`, input, {
                headers: {
                    'Content-Type': 'application/json'
                },
                withCredentials: true
            });
            if (res.data.success) {
                toast.success("Job published successfully");
                navigate("/admin/jobs");
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to publish job");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="bg-slate-50 min-h-screen font-sans pb-12">
            <Navbar />
            <div className='max-w-[800px] mx-auto mt-12 mb-24 px-4 sm:px-6'>
                <div className='bg-white rounded-xl shadow-sm border border-slate-200 p-6 md:p-8'>
                    {/* Header Section */}
                    <div className='mb-8 border-b border-slate-100 pb-6'>
                        <Button
                            type="button"
                            onClick={() => navigate("/admin/jobs")}
                            variant="ghost"
                            size="sm"
                            className="flex items-center gap-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors px-2 h-8 -ml-2 mb-4"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            <span>Back</span>
                        </Button>
                        <div>
                            <h1 className='font-bold text-2xl md:text-3xl text-slate-900 tracking-tight'>Post a New Job</h1>
                            <p className='text-sm text-slate-500 mt-1'>Fill out the role details to publish a new open position.</p>
                        </div>
                    </div>

                    <form onSubmit={submitHandler} className="space-y-6">

                        {/* Core Info Section */}
                        <div className="space-y-6">
                            <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2">Core Details</h3>
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                                <div className="space-y-2 col-span-1 md:col-span-2">
                                    <Label className="text-sm text-slate-700 font-medium">Job Title <span className="text-red-500">*</span></Label>
                                    <Input
                                        type="text"
                                        name="title"
                                        value={input.title}
                                        onChange={changeEventHandler}
                                        required
                                        placeholder="e.g. Senior Frontend Developer"
                                        className="h-11 border-slate-300 rounded-lg focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:border-brand-primary transition-all text-slate-900"
                                    />
                                </div>

                                <div className="space-y-2 col-span-1 md:col-span-2">
                                    <Label className="text-sm text-slate-700 font-medium">Job Description <span className="text-red-500">*</span></Label>
                                    <textarea
                                        name="description"
                                        value={input.description}
                                        onChange={changeEventHandler}
                                        required
                                        placeholder="Describe the role, responsibilities, and team..."
                                        className="w-full min-h-[140px] p-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary transition-all text-slate-900 resize-y text-sm"
                                    />
                                </div>

                                <div className="space-y-2 col-span-1 md:col-span-2">
                                    <Label className="text-sm text-slate-700 font-medium">Requirements <span className="text-red-500">*</span></Label>
                                    <textarea
                                        name="requirements"
                                        value={input.requirements}
                                        onChange={changeEventHandler}
                                        required
                                        placeholder="Separate key requirements with commas (e.g. React, Node.js, 5+ years experience)"
                                        className="w-full min-h-[100px] p-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary transition-all text-slate-900 resize-y text-sm"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Logistics Section */}
                        <div className="space-y-6 pt-2">
                            <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2">Logistics & Compensation</h3>
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                                <div className="space-y-2">
                                    <Label className="text-sm text-slate-700 font-medium">Location <span className="text-red-500">*</span></Label>
                                    <Input
                                        type="text"
                                        name="location"
                                        value={input.location}
                                        onChange={changeEventHandler}
                                        required
                                        placeholder="e.g. Remote, New York, London"
                                        className="h-11 border-slate-300 rounded-lg focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:border-brand-primary text-slate-900"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-sm text-slate-700 font-medium">Salary (in LPA or base) <span className="text-red-500">*</span></Label>
                                    <Input
                                        type="number"
                                        name="salary"
                                        value={input.salary}
                                        onChange={changeEventHandler}
                                        required
                                        min="0"
                                        placeholder="e.g. 120000"
                                        className="h-11 border-slate-300 rounded-lg focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:border-brand-primary text-slate-900"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-sm text-slate-700 font-medium">Job Type <span className="text-red-500">*</span></Label>
                                    <Select
                                        onValueChange={(val) => setInput({ ...input, jobType: val })}
                                        value={input.jobType}
                                        required
                                    >
                                        <SelectTrigger className="h-11 border-slate-300 rounded-lg text-slate-900 focus:ring-brand-primary focus:border-brand-primary">
                                            <SelectValue placeholder="Select Job Type" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-white z-50">
                                            <SelectGroup>
                                                <SelectItem value="Full-time">Full-time</SelectItem>
                                                <SelectItem value="Part-time">Part-time</SelectItem>
                                                <SelectItem value="Contract">Contract</SelectItem>
                                                <SelectItem value="Internship">Internship</SelectItem>
                                                <SelectItem value="Freelance">Freelance</SelectItem>
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-sm text-slate-700 font-medium">Experience Level (Years) <span className="text-red-500">*</span></Label>
                                    <Input
                                        type="number"
                                        name="experience"
                                        value={input.experience}
                                        onChange={changeEventHandler}
                                        required
                                        min="0"
                                        max="50"
                                        placeholder="e.g. 5"
                                        className="h-11 border-slate-300 rounded-lg focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:border-brand-primary text-slate-900"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-sm text-slate-700 font-medium">Number of Positions <span className="text-red-500">*</span></Label>
                                    <Input
                                        type="number"
                                        name="position"
                                        value={input.position}
                                        onChange={changeEventHandler}
                                        required
                                        min="1"
                                        placeholder="e.g. 2"
                                        className="h-11 border-slate-300 rounded-lg focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:border-brand-primary text-slate-900"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-sm text-slate-700 font-medium">Company <span className="text-red-500">*</span></Label>
                                    {companies.length > 0 ? (
                                        <Select onValueChange={selectChangeHandler} value={input.companyId} required>
                                            <SelectTrigger className="h-11 border-slate-300 rounded-lg text-slate-900 focus:ring-brand-primary focus:border-brand-primary">
                                                <SelectValue placeholder="Select a Company" />
                                            </SelectTrigger>
                                            <SelectContent className="bg-white z-50">
                                                <SelectGroup>
                                                    {companies.map((company) => (
                                                        <SelectItem key={company._id} value={company._id}>{company.name}</SelectItem>
                                                    ))}
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                    ) : (
                                        <div className="h-11 rounded-lg border border-red-200 bg-red-50 flex items-center px-3">
                                            <p className='text-xs text-red-600 font-medium'>No companies registered. Please register one first.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Footer / Actions */}
                        <div className="pt-6 mt-6 border-t border-slate-100">
                            <Button
                                type="submit"
                                disabled={loading || companies.length === 0}
                                className="h-12 w-full rounded-lg bg-brand-primary hover:bg-brand-primary/90 text-white font-medium transition-all shadow-sm"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className='mr-2 h-5 w-5 animate-spin' />
                                        Publishing Job...
                                    </>
                                ) : (
                                    "Post New Job"
                                )}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default PostJob