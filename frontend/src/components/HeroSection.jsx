// Landing page hero section highlighting platform stats and providing quick search options
import React, { useState } from 'react'
import { Search, Sparkles } from 'lucide-react'
import { Button } from './ui/button'
import { useDispatch } from 'react-redux'
import { setSearchedQuery } from '@/redux/jobSlice'
import { useNavigate } from 'react-router-dom'

const stats = [
    { value: "12,000+", label: "Active roles", sub: "Updated daily" },
    { value: "85,000+", label: "Job seekers", sub: "Active profiles" },
    { value: "9,200+", label: "Placements", sub: "This year alone" },
    { value: "3,000+", label: "Companies", sub: "Verified employers" },
]

const trendingTags = ["React", "Node.js", "Data Science", "DevOps", "Full Stack"]

const HeroSection = () => {
    const [query, setQuery] = useState("")
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const searchJobHandler = () => {
        dispatch(setSearchedQuery(query))
        navigate("/browse")
    }

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') searchJobHandler()
    }

    return (
        <section className='relative min-h-[90vh] flex items-center pt-24 pb-32 overflow-hidden bg-[linear-gradient(135deg,#1E1B4B,#5B21B6,#7C3AED)]'>
            {/* Ambient Glowing Aura */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[radial-gradient(circle_at_center,rgba(167,139,250,0.25),transparent_70%)] blur-3xl rounded-full pointer-events-none"></div>

            <div className='container relative z-10'>
                <div className='grid lg:grid-cols-2 gap-16 items-center'>

                    {/* ── Left: Copy ── */}
                    <div className='flex flex-col gap-6'>

                        {/* Badge */}
                        <span className='inline-flex items-center gap-2 w-fit px-4 py-2 rounded-full bg-white/[0.08] backdrop-blur-[12px] border border-white/[0.18] text-[#A78BFA] text-sm font-medium shadow-sm'>
                            <Sparkles className='w-3.5 h-3.5' aria-hidden="true" />
                            India's #1 tech job platform
                        </span>

                        {/* Heading */}
                        <div>
                            <h1 className='text-5xl lg:text-6xl font-extrabold text-[#F9FAFB] leading-[1.15] tracking-tight'>
                                The career move
                            </h1>
                            <h1 className='text-5xl lg:text-6xl font-extrabold leading-[1.15] tracking-tight'>
                                <span className='bg-[linear-gradient(to_right,#FFFFFF,#A78BFA)] bg-clip-text text-transparent inline-block'>
                                    you've earned.
                                </span>
                            </h1>
                        </div>

                        {/* Subheading */}
                        <p className='text-[#CBD5E1] text-lg leading-relaxed max-w-md'>
                            Curated engineering roles from verified companies. Skip
                            the noise — every listing here is worth your time.
                        </p>

                        {/* Search Bar */}
                        <div className='flex items-center bg-white/[0.85] backdrop-blur-[12px] border border-white/[0.18] rounded-[16px] p-1.5 max-w-lg shadow-[0_10px_30px_rgba(0,0,0,0.15)] focus-within:ring-2 focus-within:ring-[#A78BFA] transition-all duration-200'>
                            <div className='flex items-center gap-3 flex-1 pl-3'>
                                <Search className='w-4 h-4 text-slate-400 flex-shrink-0' aria-hidden="true" />
                                <label htmlFor="hero-search" className="sr-only">Search jobs</label>
                                <input
                                    id="hero-search"
                                    type="search"
                                    placeholder='Role, skill, or company...'
                                    onChange={(e) => setQuery(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    value={query}
                                    aria-label="Search jobs by role, skill, or company"
                                    className='flex-1 bg-transparent text-slate-900 placeholder:text-slate-400 text-sm outline-none py-2'
                                />
                            </div>
                            <Button
                                onClick={searchJobHandler}
                                className='bg-[linear-gradient(to_right,#7C3AED,#6D28D9)] hover:bg-[linear-gradient(to_right,#6D28D9,#5B21B6)] text-white font-medium px-6 py-2.5 rounded-lg transition-all duration-200 border border-white/10 hover:shadow-[0_0_30px_rgba(124,58,237,0.45)]'
                            >
                                Search
                            </Button>
                        </div>

                        {/* Trending Tags */}
                        <div className='flex items-center gap-3 flex-wrap mt-2'>
                            <span className='text-xs text-[#CBD5E1] font-medium'>Trending:</span>
                            {trendingTags.map((tag) => (
                                <button
                                    key={tag}
                                    type="button"
                                    onClick={() => {
                                        dispatch(setSearchedQuery(tag))
                                        navigate("/browse")
                                    }}
                                    className='px-3 py-1.5 rounded-full border border-white/[0.18] bg-white/[0.08] backdrop-blur-[12px] text-[#F9FAFB] text-xs font-medium hover:border-[#A78BFA] hover:text-[#A78BFA] hover:bg-white/[0.12] transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A78BFA]'
                                >
                                    {tag}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* ── Right: Stat Cards ── */}
                    <div className='grid grid-cols-2 gap-4'>
                        {stats.map(({ value, label, sub }) => (
                            <div
                                key={label}
                                className='bg-white/[0.08] backdrop-blur-[12px] border border-white/[0.18] rounded-[16px] p-6 shadow-[0_10px_30px_rgba(0,0,0,0.25)] hover:bg-white/[0.12] hover:scale-[1.02] transform transition-all duration-200 group'
                            >
                                <p className='text-3xl font-extrabold text-[#F9FAFB] mb-1 group-hover:text-[#A78BFA] transition-colors'>
                                    {value}
                                </p>
                                <p className='text-sm font-semibold text-[#F9FAFB]'>{label}</p>
                                <p className='text-xs text-[#CBD5E1] mt-1'>{sub}</p>
                            </div>
                        ))}
                    </div>

                </div>
            </div>
        </section>
    )
}

export default HeroSection