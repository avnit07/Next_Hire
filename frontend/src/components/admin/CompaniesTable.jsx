// Table component displaying a recruiter's registered companies with actions to edit them
import React, { useEffect, useState } from 'react'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { Avatar, AvatarImage } from '../ui/avatar'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { Edit2, MoreHorizontal, Building2 } from 'lucide-react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { Button } from '../ui/button'

const CompaniesTable = () => {
    const { companies, searchCompanyByText } = useSelector(store => store.company);
    const [filterCompany, setFilterCompany] = useState(Array.isArray(companies) ? companies : []);
    const navigate = useNavigate();
    // Filter the displayed companies locally based on the search text stored in Redux
    useEffect(() => {
        const arr = Array.isArray(companies) ? companies : [];
        const filteredCompany = arr.filter((company) => {
            if (!searchCompanyByText) {
                return true
            }
            return company?.name?.toLowerCase().includes(searchCompanyByText.toLowerCase());
        });
        setFilterCompany(filteredCompany);
    }, [companies, searchCompanyByText])
    return (
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm">
            <Table>
                <TableHeader className="bg-slate-50/50 border-b border-slate-200">
                    <TableRow className="hover:bg-transparent">
                        <TableHead className="font-semibold text-slate-600 px-6 py-4 rounded-tl-xl">Logo</TableHead>
                        <TableHead className="font-semibold text-slate-600 px-6 py-4">Name</TableHead>
                        <TableHead className="font-semibold text-slate-600 px-6 py-4">Date Registered</TableHead>
                        <TableHead className="text-right font-semibold text-slate-600 px-6 py-4 rounded-tr-xl">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {
                        filterCompany?.length <= 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} className="h-64 text-center">
                                    <div className="flex flex-col items-center justify-center text-slate-500">
                                        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                                            <Building2 className="w-8 h-8 text-slate-400" />
                                        </div>
                                        <p className="text-lg font-medium text-slate-900 mb-1">No companies found</p>
                                        <p className="text-sm mb-6">You haven't registered any companies yet.</p>
                                        <Button
                                            onClick={() => navigate("/admin/companies/create")}
                                            className="bg-brand-primary hover:bg-brand-primary/90 text-white"
                                        >
                                            Register a Company
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : (
                            filterCompany?.map((company) => (
                                <TableRow key={company?._id} className="hover:bg-slate-50/80 transition-colors group">
                                    <TableCell className="px-6 py-4">
                                        <Avatar className="h-10 w-10 rounded-lg border border-slate-200">
                                            <AvatarImage src={company?.logo || "https://github.com/shadcn.png"} alt={company?.name} />
                                        </Avatar>
                                    </TableCell>
                                    <TableCell className="font-medium text-slate-900 px-6 py-4">{company?.name}</TableCell>
                                    <TableCell className="text-slate-600 px-6 py-4">{company?.createdAt?.split("T")[0]}</TableCell>
                                    <TableCell className="text-right px-6 py-4 align-middle">
                                        <div className="flex justify-end items-center h-full">
                                            <Button
                                                variant="ghost"
                                                onClick={() => navigate(`/admin/companies/${company?._id}`)}
                                                className="flex items-center gap-2 text-slate-500 hover:text-brand-primary hover:bg-brand-primary/10 transition-colors px-3 h-9"
                                            >
                                                <Edit2 className="h-4 w-4" />
                                                <span className="text-sm font-medium">Edit</span>
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )
                    }
                </TableBody>
            </Table>
        </div>
    )
}

export default CompaniesTable