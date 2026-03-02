// Informational section on the Home page highlighting platform benefits and core features
import React from 'react'
import { Zap, ShieldCheck, BarChart2 } from 'lucide-react'

const FEATURES = [
    {
        icon: Zap,
        title: 'Signal, not noise.',
        body: 'Our matching engine surfaces roles calibrated to your skills and trajectory — not every posting that contains your keywords.',
        accent: 'violet',
    },
    {
        icon: ShieldCheck,
        title: 'Every employer is vetted.',
        body: 'We verify every company before they can post. Apply confidently knowing your time and data are treated with respect.',
        accent: 'indigo',
    },
    {
        icon: BarChart2,
        title: 'Full application visibility.',
        body: 'A clean, real-time dashboard shows exactly where each application stands — submitted, reviewed, shortlisted, or closed.',
        accent: 'brand-primary',
    },
]

const accentMap = {
    violet: {
        bg: 'bg-violet-50',
        border: 'border-violet-200',
        icon: 'text-violet-600',
        iconBg: 'bg-violet-50 border-violet-200',
        glow: 'from-violet-100',
        ring: 'group-hover:border-violet-300 group-hover:shadow-violet-100/80',
    },
    indigo: {
        bg: 'bg-indigo-50',
        border: 'border-indigo-200',
        icon: 'text-indigo-600',
        iconBg: 'bg-indigo-50 border-indigo-200',
        glow: 'from-indigo-100',
        ring: 'group-hover:border-indigo-300 group-hover:shadow-indigo-100/80',
    },
    'brand-primary': {
        bg: 'bg-violet-50',
        border: 'border-violet-200',
        icon: 'text-brand-primary',
        iconBg: 'bg-violet-50 border-violet-200',
        glow: 'from-violet-100',
        ring: 'group-hover:border-violet-300 group-hover:shadow-violet-100/80',
    },
}

const Features = () => (
    <section className="pt-10 pb-12 md:pt-14 md:pb-16 relative overflow-hidden bg-white border-t border-slate-100">
        {/* Subtle angled stripe */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.03]"
            style={{
                backgroundImage: 'repeating-linear-gradient(45deg, #7C3AED 0, #7C3AED 1px, transparent 0, transparent 50%)',
                backgroundSize: '20px 20px'
            }}
        />
        <div className="container px-4 sm:px-6 relative z-10">

            {/* Header */}
            <div className="max-w-2xl mx-auto text-center mb-12 md:mb-16">
                <span className="inline-block px-3 py-1 rounded-full bg-brand-primary/10 text-brand-primary text-xs font-bold uppercase tracking-widest mb-4">
                    Why NextHire
                </span>
                <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-[-0.025em] leading-tight mb-4">
                    Built for the way you actually work.
                </h2>
                <p className="text-[15px] sm:text-[16px] text-slate-500 leading-relaxed">
                    Most job boards optimise for volume. We obsess over fit.
                </p>
            </div>

            {/* Cards — 1 col mobile, 3 col desktop */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 sm:gap-6">
                {FEATURES.map(({ icon: Icon, title, body, accent }) => {
                    const a = accentMap[accent]
                    return (
                        <div
                            key={title}
                            className={`group relative p-6 sm:p-8 bg-white rounded-2xl border border-slate-200 hover:shadow-xl transition-all duration-300 overflow-hidden ${a.ring}`}
                        >
                            {/* Hover gradient wash */}
                            <div className={`absolute inset-0 bg-gradient-to-br ${a.glow} to-transparent opacity-0 group-hover:opacity-60 transition-opacity duration-500 pointer-events-none rounded-2xl`} />

                            {/* Icon */}
                            <div className={`w-11 h-11 rounded-xl ${a.iconBg} border flex items-center justify-center mb-5 shadow-sm`}>
                                <Icon className={`w-5 h-5 ${a.icon}`} />
                            </div>

                            <h3 className="text-[15px] sm:text-[16px] font-extrabold text-slate-900 mb-2.5 tracking-tight">
                                {title}
                            </h3>
                            <p className="text-[13px] sm:text-[14px] text-slate-500 leading-relaxed">
                                {body}
                            </p>
                        </div>
                    )
                })}
            </div>
        </div>
    </section>
)

export default Features
