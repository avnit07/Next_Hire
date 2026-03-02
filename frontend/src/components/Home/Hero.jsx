// Main hero banner with a search bar and quick-click category filters
import React from 'react'
import { Search, ArrowRight, Sparkles } from 'lucide-react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { setSearchedQuery } from '@/redux/jobSlice'

const Hero = ({ query, setQuery, onSearch }) => {
    const handleKey = (e) => { if (e.key === 'Enter') onSearch() }
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const quickSearch = (term) => {
        dispatch(setSearchedQuery({ keyword: term }))
        navigate('/browse')
    }

    return (
        <section className="relative overflow-hidden pt-20 pb-16 sm:pb-20 bg-gradient-to-br from-[#312E81] via-[#5B21B6] to-[#7C3AED]">
            {/* Ambient glow */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[400px] sm:w-[600px] h-[400px] sm:h-[600px] bg-[radial-gradient(circle_at_center,rgba(167,139,250,0.25),transparent_70%)] rounded-full blur-[80px]" />
            </div>

            {/* Dot grid texture */}
            <div
                className="absolute inset-0 pointer-events-none opacity-[0.025]"
                style={{
                    backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)',
                    backgroundSize: '32px 32px'
                }}
            />

            <div className="relative container px-4 sm:px-6">
                <div className="grid lg:grid-cols-2 gap-10 lg:gap-20 items-center">

                    {/* ── Left ── */}
                    <div>
                        {/* Eyebrow badge */}
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/20 bg-white/10 mb-6 lg:mb-7">
                            <Sparkles className="w-3.5 h-3.5 text-purple-300" />
                            <span className="text-xs font-semibold text-white/80 tracking-wide">
                                India's #1 tech job platform
                            </span>
                        </div>

                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-[1.05] tracking-tight mb-5 mt-4">
                            The career move<br />
                            <span className="text-[#C4B5FD]">
                                you've earned.
                            </span>
                        </h1>

                        <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-[440px] mb-8 lg:mb-10">
                            Curated engineering roles from verified companies. Skip the noise — every listing here is worth your time.
                        </p>

                        {/* Search bar */}
                        <div className="flex items-center gap-2 w-full max-w-[520px] bg-white/5 border border-white/10 rounded-xl p-1.5 mb-5 focus-within:border-white/20 focus-within:bg-white/10 transition-all duration-200 backdrop-blur-md">
                            <Search className="w-4 h-4 text-slate-300 ml-3 flex-shrink-0" />
                            <input
                                type="text"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                onKeyDown={handleKey}
                                placeholder="Role, skill, or company..."
                                className="flex-1 bg-transparent text-sm text-white placeholder:text-slate-400 outline-none py-3 px-2 min-w-0"
                            />
                            <button
                                onClick={onSearch}
                                className="group flex items-center gap-2 bg-gradient-to-r from-[#7C3AED] to-[#6D28D9] hover:shadow-[0_0_30px_rgba(124,58,237,0.45)] text-white text-sm font-bold px-4 sm:px-5 py-3 rounded-lg transition-all duration-300 flex-shrink-0"
                            >
                                Search
                                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                            </button>
                        </div>

                        {/* Quick filters */}
                        <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-xs text-slate-400 font-medium">Trending:</span>
                            {['React', 'Node.js', 'Data Science', 'DevOps', 'Full Stack'].map((tag) => (
                                <button
                                    key={tag}
                                    onClick={() => quickSearch(tag)}
                                    className="text-xs px-3 py-1.5 rounded-full bg-white/10 text-slate-300 hover:bg-white/20 hover:text-white font-medium transition-all duration-150 border border-white/15 hover:border-white/30"
                                >
                                    {tag}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* ── Right: stat cards — visible on all sizes, 2-col grid ── */}
                    <div className="grid grid-cols-2 gap-3 sm:gap-4">
                        {[
                            { value: '12,000+', label: 'Active roles', sub: 'Updated daily' },
                            { value: '85,000+', label: 'Job seekers', sub: 'Active profiles' },
                            { value: '9,200+', label: 'Placements', sub: 'This year alone' },
                            { value: '3,000+', label: 'Companies', sub: 'Verified employers' },
                        ].map(({ value, label, sub }) => (
                            <div
                                key={label}
                                className="group relative p-4 sm:p-7 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-xl hover:bg-white/15 transition-all duration-300 overflow-hidden"
                            >
                                <p className="text-2xl sm:text-4xl font-black text-white tracking-tight mb-1">{value}</p>
                                <p className="text-xs sm:text-sm font-semibold text-slate-100">{label}</p>
                                <p className="text-[10px] sm:text-xs text-slate-300 mt-0.5">{sub}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Hero
