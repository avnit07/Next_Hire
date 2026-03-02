// Form component for recruiters to update comprehensive company details including logo and description
import React, { useEffect, useState, useRef } from 'react'
import Navbar from '../shared/Navbar'
import { Button } from '../ui/button'
import { ArrowLeft, Loader2, UploadCloud } from 'lucide-react'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import axios from 'axios'
import { COMPANY_API_END_POINT } from '@/utils/constant'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import { useSelector } from 'react-redux'
import useGetCompanyById from '@/hooks/useGetCompanyById'

const CompanySetup = () => {
    const params = useParams();
    useGetCompanyById(params.id);
    const [input, setInput] = useState({
        name: "",
        description: "",
        website: "",
        location: "",
        file: null
    });
    const { singleCompany } = useSelector(store => store.company);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    }

    const changeFileHandler = (e) => {
        const file = e.target.files?.[0];
        setInput({ ...input, file });
    }

    const submitHandler = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("name", input.name);
        formData.append("description", input.description);
        formData.append("website", input.website);
        formData.append("location", input.location);
        if (input.file) {
            formData.append("file", input.file);
        }
        try {
            setLoading(true);
            const res = await axios.put(`${COMPANY_API_END_POINT}/update/${params.id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                withCredentials: true
            });
            if (res.data.success) {
                toast.success("Company details saved");
                navigate("/admin/companies");
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || "Failed to save company details");
        } finally {
            setLoading(false);
        }
    }

    // Pre-fill the form with the company's existing data once it has been fetched from the server
    useEffect(() => {
        if (!singleCompany) return;
        setInput({
            name: singleCompany.name || "",
            description: singleCompany.description || "",
            website: singleCompany.website || "",
            location: singleCompany.location || "",
            file: null
        });
    }, [singleCompany]);

    const fileInputRef = useRef(null);

    return (
        <div className="bg-slate-50 min-h-screen font-sans">
            <Navbar />
            <div className='max-w-[800px] mx-auto mt-12 mb-24 px-4 sm:px-6'>
                <div className='bg-white rounded-xl shadow-sm border border-slate-200 p-6 md:p-8'>
                    {/* Header Section */}
                    <div className='mb-8 border-b border-slate-100 pb-6'>
                        <Button
                            type="button"
                            onClick={() => navigate("/admin/companies")}
                            variant="ghost"
                            size="sm"
                            className="flex items-center gap-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors px-2 h-8 -ml-2 mb-4"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            <span>Back</span>
                        </Button>
                        <div>
                            <h1 className='font-bold text-2xl md:text-3xl text-slate-900 tracking-tight'>Company Setup</h1>
                            <p className='text-sm text-slate-500 mt-1'>Update your company's profile, logo, and public information.</p>
                        </div>
                    </div>

                    <form onSubmit={submitHandler} className="space-y-6">
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                            <div className="space-y-2">
                                <Label className="text-sm text-slate-700 font-medium">Company Name <span className="text-red-500">*</span></Label>
                                <Input
                                    type="text"
                                    name="name"
                                    value={input.name}
                                    onChange={changeEventHandler}
                                    required
                                    className="h-11 border-slate-300 rounded-lg focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:border-brand-primary transition-all text-slate-900"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-sm text-slate-700 font-medium">Location <span className="text-red-500">*</span></Label>
                                <Input
                                    type="text"
                                    name="location"
                                    value={input.location}
                                    onChange={changeEventHandler}
                                    required
                                    className="h-11 border-slate-300 rounded-lg focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:border-brand-primary transition-all text-slate-900"
                                />
                            </div>
                            <div className="space-y-2 col-span-1 md:col-span-2">
                                <Label className="text-sm text-slate-700 font-medium">Description</Label>
                                <textarea
                                    name="description"
                                    value={input.description}
                                    onChange={changeEventHandler}
                                    placeholder="Briefly describe your company, its mission, and what you do..."
                                    className="w-full min-h-[120px] p-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary transition-all text-slate-900 resize-y text-sm"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-sm text-slate-700 font-medium">Website</Label>
                                <Input
                                    type="url"
                                    name="website"
                                    value={input.website}
                                    onChange={changeEventHandler}
                                    placeholder="https://"
                                    className="h-11 border-slate-300 rounded-lg focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:border-brand-primary transition-all text-slate-900 placeholder:text-slate-400"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-sm text-slate-700 font-medium">Company Logo</Label>
                                <div className="flex flex-col gap-2">
                                    <Input
                                        type="file"
                                        accept="image/*"
                                        onChange={changeFileHandler}
                                        ref={fileInputRef}
                                        className="hidden"
                                    />
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => fileInputRef.current?.click()}
                                        className="h-11 border-slate-300 border-dashed hover:border-brand-primary hover:bg-brand-primary/5 transition-colors gap-2 text-slate-600 rounded-lg w-full justify-center"
                                    >
                                        <UploadCloud className="w-4 h-4" />
                                        Upload Image
                                    </Button>
                                    {input.file && (
                                        <div className="text-xs text-brand-primary mt-1 font-medium bg-brand-primary/10 py-1.5 px-3 rounded-md w-fit border border-brand-primary/20">
                                            Selected: {input.file.name}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Footer / Actions */}
                        <div className="pt-6 mt-6 border-t border-slate-100 flex justify-end">
                            <Button
                                type="submit"
                                disabled={loading}
                                className="h-11 px-8 rounded-lg bg-brand-primary hover:bg-brand-primary/90 text-white font-medium transition-all shadow-sm w-full sm:w-auto"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                                        Updating...
                                    </>
                                ) : (
                                    "Save Changes"
                                )}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default CompanySetup