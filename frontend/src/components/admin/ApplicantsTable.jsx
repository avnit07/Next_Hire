// Table component showing candidate details and allowing recruiters to accept or reject applications
import React from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { MoreHorizontal, CheckCircle2, XCircle, FileText, Users } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { setApplicationStatus } from '@/redux/applicationSlice';
import { toast } from 'sonner';
import { APPLICATION_API_END_POINT } from '@/utils/constant';
import axios from 'axios';

const shortlistingStatus = ["Accepted", "Rejected"];

const StatusBadge = ({ status }) => {
    if (!status) return <span className='text-xs text-gray-400'>—</span>;
    const s = status.toLowerCase();
    const config = {
        accepted: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', dot: 'bg-emerald-500' },
        rejected: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200', dot: 'bg-red-500' },
        pending: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', dot: 'bg-amber-500' },
    };
    const c = config[s] || config.pending;
    return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${c.bg} ${c.text} ${c.border}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
            {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
    );
};

const ApplicantsTable = () => {
    const { applicants } = useSelector(store => store.application);
    const dispatch = useDispatch();

    const statusHandler = async (status, id) => {
        try {
            const res = await axios.post(
                `${APPLICATION_API_END_POINT}/status/${id}/update`,
                { status },
                { withCredentials: true }
            );
            if (res.data.success) {
                dispatch(setApplicationStatus({ applicationId: id, status: status.toLowerCase() }));
                toast.success("Applicant status updated");
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to update applicant status");
        }
    }

    if (!applicants?.applications?.length) {
        return (
            <div className='flex flex-col items-center justify-center py-12 text-center bg-white rounded-xl border border-gray-100'>
                <div className='w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center mb-4'>
                    <Users className='w-7 h-7 text-gray-400' />
                </div>
                <h3 className='text-sm font-semibold text-gray-700 mb-1'>No applicants yet</h3>
                <p className='text-sm text-gray-400'>Applicants will appear here once candidates apply.</p>
            </div>
        );
    }

    return (
        <div className='rounded-xl border border-gray-100 overflow-hidden bg-white'>
            <div className='overflow-x-auto'>
                <Table>
                    <TableHeader>
                        <TableRow className='bg-gray-50 hover:bg-gray-50'>
                            {['Name', 'Email', 'Phone', 'Resume', 'Applied', 'Status', ''].map((h, i) => (
                                <TableHead
                                    key={i}
                                    className={`text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap ${i === 0 ? 'pl-5' : ''} ${i === 6 ? 'text-right pr-5' : ''}`}
                                >
                                    {h}
                                </TableHead>
                            ))}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {applicants.applications.map((item) => (
                            <TableRow key={item._id} className='hover:bg-gray-50/70 transition-colors border-gray-100'>
                                <TableCell className='pl-5'>
                                    <span className='text-sm font-medium text-gray-900 whitespace-nowrap'>{item?.applicant?.fullName}</span>
                                </TableCell>
                                <TableCell>
                                    <span className='text-sm text-gray-600 whitespace-nowrap'>{item?.applicant?.email}</span>
                                </TableCell>
                                <TableCell>
                                    <span className='text-sm text-gray-600 whitespace-nowrap'>{item?.applicant?.phoneNumber || '—'}</span>
                                </TableCell>
                                <TableCell>
                                    {item.applicant?.profile?.resume ? (
                                        <a
                                            href={item.applicant.profile.resume}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className='inline-flex items-center gap-1.5 text-sm font-medium text-violet-600 hover:text-violet-800 hover:underline whitespace-nowrap'
                                        >
                                            <FileText className='w-3.5 h-3.5' />
                                            {item.applicant.profile.resumeOriginalName || "Resume"}
                                        </a>
                                    ) : (
                                        <span className='text-sm text-gray-400'>—</span>
                                    )}
                                </TableCell>
                                <TableCell>
                                    <span className='text-sm text-gray-500 whitespace-nowrap'>{item?.createdAt?.split("T")[0]}</span>
                                </TableCell>
                                <TableCell>
                                    <StatusBadge status={item?.status} />
                                </TableCell>
                                <TableCell className='text-right pr-5'>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <button className='p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors'>
                                                <MoreHorizontal className='w-4 h-4' />
                                            </button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-44 p-1.5 rounded-xl shadow-lg border border-gray-100" align="end">
                                            {shortlistingStatus.map((status) => (
                                                <button
                                                    key={status}
                                                    onClick={() => statusHandler(status, item?._id)}
                                                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${status === 'Accepted'
                                                        ? 'text-emerald-700 hover:bg-emerald-50'
                                                        : 'text-red-700 hover:bg-red-50'
                                                        }`}
                                                >
                                                    {status === 'Accepted'
                                                        ? <CheckCircle2 className='w-4 h-4' />
                                                        : <XCircle className='w-4 h-4' />
                                                    }
                                                    {status}
                                                </button>
                                            ))}
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

export default ApplicantsTable