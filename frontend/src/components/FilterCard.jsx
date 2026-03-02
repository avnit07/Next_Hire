// Sidebar filter component for the Jobs page that dynamically extracts available locations from the job data
import React, { useEffect, useMemo, useState } from 'react'
import { RadioGroup, RadioGroupItem } from './ui/radio-group'
import { Label } from './ui/label'
import { useDispatch, useSelector } from 'react-redux'
import { setSearchedQuery, clearSearchedQuery } from '@/redux/jobSlice'
import { X, Search, ChevronDown, ChevronUp } from 'lucide-react'

// ─── Static Filter Data ───────────────────────────────────────────────────────

const sortOptions = ["Latest", "Salary (High to Low)", "Relevance"]

const industryOptions = [
    "Frontend Developer",
    "Backend Developer",
    "FullStack Developer",
    "Android Developer",
    "iOS Developer",
    "React Native Developer",
    "DevOps Engineer",
    "Cloud Engineer",
    "Site Reliability Engineer",
    "Data Analyst",
    "Data Scientist",
    "Machine Learning Engineer",
    "AI Engineer",
]

export const salaryRanges = [
    { label: "0 – 3 LPA", min: 0, max: 3 },
    { label: "3 – 6 LPA", min: 3, max: 6 },
    { label: "6 – 10 LPA", min: 6, max: 10 },
    { label: "10 – 20 LPA", min: 10, max: 20 },
    { label: "20+ LPA", min: 20, max: Infinity },
]

// ─── Section Component ────────────────────────────────────────────────────────

const FilterSection = ({ title, isOpen, onToggle, children }) => (
    <div>
        <button
            type="button"
            onClick={onToggle}
            className="flex items-center justify-between w-full py-1 mb-2 group"
        >
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                {title}
            </p>
            {isOpen
                ? <ChevronUp className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 transition-colors" />
                : <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 transition-colors" />
            }
        </button>
        {isOpen && <div className="pb-1">{children}</div>}
    </div>
)

// ─── FilterCard ───────────────────────────────────────────────────────────────

const LOCATION_LIMIT = 6

const FilterCard = () => {
    const [keyword, setKeyword] = useState("")
    const [showAllLocations, setShowAllLocations] = useState(false)
    const dispatch = useDispatch()
    const { searchedQuery, allJobs } = useSelector(store => store.job)

    // Collapsible section state
    const [open, setOpen] = useState({
        Sort: true,
        Location: true,
        Industry: false,
        Salary: false,
    })
    const toggleSection = (key) => setOpen(prev => ({ ...prev, [key]: !prev[key] }))

    // ── Dynamic locations derived from actual jobs data ────────────────────────
    const locations = useMemo(() => {
        if (!allJobs || allJobs.length === 0) return []
        const unique = [...new Set(allJobs.map(job => job.location).filter(Boolean))]
        const sorted = unique.filter(l => l.toLowerCase() !== 'remote').sort()
        return unique.some(l => l.toLowerCase() === 'remote')
            ? ['Remote', ...sorted]
            : sorted
    }, [allJobs])

    // Count jobs for a given location
    const locationCount = (loc) =>
        (allJobs || []).filter(j => j.location === loc).length

    const visibleLocations = showAllLocations ? locations : locations.slice(0, LOCATION_LIMIT)

    // Sync the local keyword state with Redux so the input field reflects external resets or URL changes
    useEffect(() => {
        setKeyword(searchedQuery.keyword ?? "")
    }, [searchedQuery.keyword])

    // Debounce keyboard input to prevent dispatching a Redux filter update on every single keystroke
    useEffect(() => {
        const timer = setTimeout(() => {
            if (keyword !== searchedQuery.keyword) {
                if (!keyword && !searchedQuery.keyword) return
                dispatch(setSearchedQuery({ keyword }))
            }
        }, 300)
        return () => clearTimeout(timer)
    }, [keyword, dispatch, searchedQuery.keyword])

    const changeHandler = (type, value) => {
        dispatch(setSearchedQuery({ [type]: value }))
    }

    const clearHandler = () => {
        setKeyword("")
        setShowAllLocations(false)
        dispatch(clearSearchedQuery())
    }

    // Count active filters
    const activeCount = Object.keys(searchedQuery).filter(
        k => searchedQuery[k] !== undefined && searchedQuery[k] !== ""
    ).length

    return (
        <div className="w-full bg-white border border-slate-200 rounded-xl shadow-sm p-5">

            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <h2 className="text-sm font-semibold text-slate-900">Filter Jobs</h2>
                    {activeCount > 0 && (
                        <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-violet-100 text-violet-700 text-[10px] font-bold">
                            {activeCount}
                        </span>
                    )}
                </div>
                {activeCount > 0 && (
                    <button
                        type="button"
                        onClick={clearHandler}
                        className="flex items-center gap-1 text-xs text-brand-primary hover:text-brand-primary/80 font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary/50 rounded"
                    >
                        <X className="w-3 h-3" />
                        Clear
                    </button>
                )}
            </div>

            {/* Keyword Search */}
            <div className="mb-5 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                    type="text"
                    placeholder="Search by role or keyword..."
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:border-brand-primary focus:ring-1 focus:ring-brand-primary outline-none transition-all placeholder:text-slate-400"
                />
            </div>

            {/* Scrollable filter sections */}
            <div className="space-y-4 overflow-y-auto max-h-[600px] pr-1">

                {/* SORT */}
                <FilterSection title="Sort" isOpen={open.Sort} onToggle={() => toggleSection('Sort')}>
                    <RadioGroup
                        value={searchedQuery.Sort || ""}
                        onValueChange={(val) => changeHandler('Sort', val)}
                    >
                        {sortOptions.map((item, idx) => (
                            <div key={idx} className="flex items-center gap-2 py-1.5">
                                <RadioGroupItem value={item} id={`sort-${idx}`} />
                                <Label htmlFor={`sort-${idx}`} className="text-sm text-slate-700 cursor-pointer font-normal">
                                    {item}
                                </Label>
                            </div>
                        ))}
                    </RadioGroup>
                </FilterSection>

                <div className="border-t border-slate-100" />

                {/* LOCATION — dynamic from jobs data */}
                <FilterSection title="Location" isOpen={open.Location} onToggle={() => toggleSection('Location')}>
                    {locations.length === 0 ? (
                        <p className="text-xs text-slate-400 py-1">No locations available</p>
                    ) : (
                        <>
                            <RadioGroup
                                value={searchedQuery.Location || ""}
                                onValueChange={(val) => changeHandler('Location', val)}
                            >
                                {visibleLocations.map((item, idx) => (
                                    <div key={idx} className="flex items-center gap-2 py-1.5">
                                        <RadioGroupItem value={item} id={`loc-${idx}`} />
                                        <Label htmlFor={`loc-${idx}`} className="flex items-center gap-1.5 text-sm text-slate-700 cursor-pointer font-normal">
                                            {item}
                                            <span className="text-xs text-slate-400 font-normal">
                                                ({locationCount(item)})
                                            </span>
                                        </Label>
                                    </div>
                                ))}
                            </RadioGroup>

                            {/* Show more / Show less toggle */}
                            {locations.length > LOCATION_LIMIT && (
                                <button
                                    type="button"
                                    onClick={() => setShowAllLocations(prev => !prev)}
                                    className="mt-2 text-sm text-violet-600 hover:text-violet-700 font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 rounded"
                                >
                                    {showAllLocations
                                        ? `Show less`
                                        : `Show ${locations.length - LOCATION_LIMIT} more`
                                    }
                                </button>
                            )}
                        </>
                    )}
                </FilterSection>

                <div className="border-t border-slate-100" />

                {/* INDUSTRY */}
                <FilterSection title="Industry" isOpen={open.Industry} onToggle={() => toggleSection('Industry')}>
                    <RadioGroup
                        value={searchedQuery.Industry || ""}
                        onValueChange={(val) => changeHandler('Industry', val)}
                    >
                        {industryOptions.map((item, idx) => (
                            <div key={idx} className="flex items-center gap-2 py-1.5">
                                <RadioGroupItem value={item} id={`ind-${idx}`} />
                                <Label htmlFor={`ind-${idx}`} className="text-sm text-slate-700 cursor-pointer font-normal">
                                    {item}
                                </Label>
                            </div>
                        ))}
                    </RadioGroup>
                </FilterSection>

                <div className="border-t border-slate-100" />

                {/* SALARY */}
                <FilterSection title="Salary" isOpen={open.Salary} onToggle={() => toggleSection('Salary')}>
                    <RadioGroup
                        value={searchedQuery.SalaryLabel || ""}
                        onValueChange={(val) => {
                            const range = salaryRanges.find(r => r.label === val)
                            if (range) {
                                dispatch(setSearchedQuery({
                                    SalaryLabel: range.label,
                                    SalaryMin: range.min,
                                    SalaryMax: range.max,
                                }))
                            }
                        }}
                    >
                        {salaryRanges.map((item, idx) => (
                            <div key={idx} className="flex items-center gap-2 py-1.5">
                                <RadioGroupItem value={item.label} id={`sal-${idx}`} />
                                <Label htmlFor={`sal-${idx}`} className="text-sm text-slate-700 cursor-pointer font-normal">
                                    {item.label}
                                </Label>
                            </div>
                        ))}
                    </RadioGroup>
                </FilterSection>

            </div>
        </div>
    )
}

export default FilterCard