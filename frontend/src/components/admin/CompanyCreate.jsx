// Form component for recruiters to register a new company by providing its preliminary name
import React, { useState } from 'react'
import Navbar from '../shared/Navbar'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { useNavigate } from 'react-router-dom'
import api from '@/utils/axiosInstance'
import { COMPANY_API_END_POINT } from '@/utils/constant'
import { toast } from 'sonner'
import { useDispatch } from 'react-redux'
import { setSingleCompany } from '@/redux/companySlice'
import { Loader2 } from 'lucide-react'

const CompanyCreate = () => {
    const navigate = useNavigate();
    const [companyName, setCompanyName] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const dispatch = useDispatch();
    const registerNewCompany = async () => {
        if (!companyName?.trim()) {
            toast.warning("Company name is required");
            return;
        }
        try {
            setIsLoading(true);
            const res = await api.post(`${COMPANY_API_END_POINT}/register`, { companyName: companyName.trim() }, {
                headers: {
                    'Content-Type': 'application/json'
                },
            });
            if (res?.data?.success) {
                dispatch(setSingleCompany(res.data.company));
                toast.success("Company registered successfully");
                const companyId = res?.data?.company?._id;
                navigate(`/admin/companies/${companyId}`);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || "Failed to register company");
        } finally {
            setIsLoading(false);
        }
    }
    return (
        <div className="bg-slate-50 min-h-screen font-sans pb-12">
            <Navbar />
            <div className='max-w-xl mx-auto mt-16 px-4 sm:px-6'>
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
                    <div className='mb-8'>
                        <h1 className='font-bold text-2xl md:text-3xl text-slate-900 tracking-tight'>Name Your Company</h1>
                        <p className='text-sm text-slate-500 mt-2'>What would you like to call your company? You can easily change this later in settings.</p>
                    </div>

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label className="text-sm font-medium text-slate-700">Company Name <span className="text-red-500">*</span></Label>
                            <Input
                                type="text"
                                className="h-11 border-slate-300 rounded-lg focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:border-brand-primary text-slate-900"
                                placeholder="e.g. Acme Corp, TechNova, etc."
                                value={companyName}
                                onChange={(e) => setCompanyName(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className='flex flex-col-reverse sm:flex-row items-stretch sm:items-center gap-3 mt-10 pt-6 border-t border-slate-100'>
                        <Button
                            variant="outline"
                            onClick={() => navigate("/admin/companies")}
                            className="h-11 px-6 border-slate-300 text-slate-700 hover:bg-slate-50 rounded-lg"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={registerNewCompany}
                            disabled={isLoading}
                            className="h-11 px-6 bg-brand-primary hover:bg-brand-primary/90 text-white rounded-lg shadow-sm w-full sm:w-auto"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                "Continue to Setup"
                            )}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CompanyCreate