// Reusable skeleton loaders and spinners to show users that content is currently being fetched
import React from 'react'

// ─── 1. SPINNER — for buttons and small inline loading ────────────────────────
export const Spinner = ({ size = 'sm', color = 'white' }) => (
    <div
        className={`animate-spin rounded-full border-2 border-t-transparent ${color === 'white' ? 'border-white' : 'border-violet-600'
            } ${size === 'sm' ? 'w-4 h-4' : 'w-6 h-6'}`}
    />
)

// ─── 2. JOB CARD SKELETON — matches exact layout of JobCard.jsx ───────────────
export const JobCardSkeleton = () => (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 animate-pulse">
        <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-slate-200 rounded-lg" />
                <div>
                    <div className="h-4 w-24 bg-slate-200 rounded mb-1" />
                    <div className="h-3 w-16 bg-slate-100 rounded" />
                </div>
            </div>
            <div className="w-4 h-4 bg-slate-100 rounded" />
        </div>
        <div className="h-5 w-48 bg-slate-200 rounded mb-2" />
        <div className="h-3 w-full bg-slate-100 rounded mb-1" />
        <div className="h-3 w-3/4 bg-slate-100 rounded mb-4" />
        <div className="flex gap-2 mb-4">
            <div className="h-6 w-20 bg-slate-100 rounded-full" />
            <div className="h-6 w-20 bg-slate-100 rounded-full" />
            <div className="h-6 w-24 bg-slate-100 rounded-full" />
        </div>
        <div className="flex gap-3 pt-3 border-t border-slate-100">
            <div className="h-9 w-full bg-slate-100 rounded-lg" />
            <div className="h-9 w-full bg-violet-100 rounded-lg" />
        </div>
    </div>
)

// ─── 3. JOB DESCRIPTION SKELETON ─────────────────────────────────────────────
export const JobDescriptionSkeleton = () => (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 animate-pulse">
        <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-slate-200 rounded-xl" />
            <div>
                <div className="h-6 w-48 bg-slate-200 rounded mb-2" />
                <div className="h-4 w-32 bg-slate-100 rounded" />
            </div>
        </div>
        <div className="h-8 w-64 bg-slate-200 rounded mb-4" />
        <div className="flex gap-2 mb-6">
            <div className="h-6 w-20 bg-violet-100 rounded-full" />
            <div className="h-6 w-20 bg-amber-100 rounded-full" />
            <div className="h-6 w-24 bg-indigo-100 rounded-full" />
        </div>
        {[...Array(4)].map((_, i) => (
            <div key={i} className={`h-4 bg-slate-100 rounded mb-2 ${i === 3 ? 'w-2/3' : 'w-full'}`} />
        ))}
        <div className="h-11 w-32 bg-violet-200 rounded-lg mt-6" />
    </div>
)

// ─── 4. PROFILE SKELETON ──────────────────────────────────────────────────────
export const ProfileSkeleton = () => (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 animate-pulse">
        <div className="h-32 bg-slate-200 rounded-t-2xl" />
        <div className="px-6 pb-6">
            <div className="w-20 h-20 bg-slate-300 rounded-full -mt-10 mb-4 ring-4 ring-white" />
            <div className="h-6 w-40 bg-slate-200 rounded mb-2" />
            <div className="h-4 w-64 bg-slate-100 rounded mb-4" />
            <div className="flex gap-2">
                <div className="h-6 w-20 bg-slate-100 rounded-full" />
                <div className="h-6 w-24 bg-slate-100 rounded-full" />
            </div>
        </div>
    </div>
)
