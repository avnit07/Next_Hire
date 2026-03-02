// Table component that displays a student's job application history with color-coded status badges
import React from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table'
import { useSelector } from 'react-redux'
import { Briefcase, Clock } from 'lucide-react'

const StatusBadge = ({ status }) => {
    const s = (status || 'pending').toLowerCase();
    const config = {
        accepted: {
            dot: 'bg-emerald-500',
            bg: 'bg-emerald-50',
            text: 'text-emerald-700',
            border: 'border-emerald-200',
            label: 'Accepted',
        },
        rejected: {
            dot: 'bg-red-500',
            bg: 'bg-red-50',
            text: 'text-red-700',
            border: 'border-red-200',
            label: 'Rejected',
        },
        pending: {
            dot: 'bg-amber-500',
            bg: 'bg-amber-50',
            text: 'text-amber-700',
            border: 'border-amber-200',
            label: 'Pending',
        },
    };
    const c = config[s] || config.pending;
    return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${c.bg} ${c.text} ${c.border}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
            {c.label}
        </span>
    );
};

const AppliedJobTable = () => {
    const { allAppliedJobs } = useSelector(store => store.job);

    if (!allAppliedJobs?.length) {
        return (
            <div className='flex flex-col items-center justify-center py-12 text-center'>
                <div className='w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center mb-4'>
                    <Briefcase className='w-7 h-7 text-gray-400' />
                </div>
                <h3 className='text-sm font-semibold text-gray-700 mb-1'>No applications yet</h3>
                <p className='text-sm text-gray-400'>Start applying to jobs to track your progress here.</p>
            </div>
        );
    }

    return (
        <div className='rounded-xl border border-gray-100 overflow-hidden'>
            <Table>
                <TableHeader>
                    <TableRow className='bg-gray-50 hover:bg-gray-50'>
                        <TableHead className='text-xs font-semibold text-gray-500 uppercase tracking-wide pl-5'>Date</TableHead>
                        <TableHead className='text-xs font-semibold text-gray-500 uppercase tracking-wide'>Job Role</TableHead>
                        <TableHead className='text-xs font-semibold text-gray-500 uppercase tracking-wide'>Company</TableHead>
                        <TableHead className='text-xs font-semibold text-gray-500 uppercase tracking-wide text-right pr-5'>Status</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {allAppliedJobs.map((appliedJob) => (
                        <TableRow key={appliedJob?._id} className='hover:bg-gray-50/70 transition-colors border-gray-100'>
                            <TableCell className='pl-5'>
                                <div className='flex items-center gap-1.5 text-sm text-gray-500'>
                                    <Clock className='w-3.5 h-3.5' />
                                    {appliedJob?.createdAt?.split("T")[0]}
                                </div>
                            </TableCell>
                            <TableCell>
                                <span className='text-sm font-medium text-gray-900'>{appliedJob?.job?.title}</span>
                            </TableCell>
                            <TableCell>
                                <span className='text-sm text-gray-600'>{appliedJob?.job?.company?.name}</span>
                            </TableCell>
                            <TableCell className='text-right pr-5'>
                                <StatusBadge status={appliedJob?.status} />
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}

export { StatusBadge };
export default AppliedJobTable