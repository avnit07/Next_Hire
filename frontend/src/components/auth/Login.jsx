// User authentication page with role selection (Student/Recruiter) and form validation
import React, { useState, useEffect } from 'react'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import axios from 'axios'
import { USER_API_END_POINT } from '@/utils/constant'
import { toast } from 'sonner'
import { useDispatch, useSelector } from 'react-redux'
import { setLoading, setUser } from '@/redux/authSlice'
import { Loader2, Mail, Lock, BriefcaseBusiness, User, Building2, Eye, EyeOff, ArrowLeft, Check } from 'lucide-react'

// ─── LEFT PANEL ───────────────────────────────────────────────────────────────
const LeftPanel = () => (
    <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-violet-600 via-violet-700 to-indigo-900 flex-col p-12 relative overflow-hidden min-h-screen">
        {/* Decorative blobs */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-900/40 rounded-full translate-y-1/2 -translate-x-1/2 pointer-events-none" />
        <div className="absolute top-1/2 right-0 w-40 h-40 bg-white/5 rounded-full pointer-events-none" />

        {/* TOP — Logo */}
        <div className="relative flex items-center gap-3 z-10">
            <div className="w-9 h-9 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/20">
                <BriefcaseBusiness className="w-4 h-4 text-white" />
            </div>
            <span className="text-white font-bold text-lg tracking-tight">NextHire</span>
        </div>

        {/* MIDDLE */}
        <div className="relative z-10 flex-1 flex flex-col justify-center space-y-8">
            {/* Pulse badge */}
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 w-fit">
                <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                <span className="text-white/90 text-xs font-medium tracking-wide">New jobs posted today</span>
            </div>

            <div className="space-y-4">
                <h2 className="text-4xl font-bold text-white leading-[1.15] tracking-tight">
                    Welcome<br />back.
                </h2>
                <p className="text-violet-200 text-base leading-relaxed max-w-xs">
                    Your applications and profile are waiting. Pick up right where you left off.
                </p>
            </div>

            {/* Feature highlights */}
            <div className="space-y-3">
                {[
                    { icon: '🎯', title: 'Smart job matching', desc: 'Jobs matched to your skills and location' },
                    { icon: '📊', title: 'Track applications', desc: 'See status updates in real time' },
                    { icon: '🔔', title: 'Instant alerts', desc: 'Get notified when recruiters view your profile' },
                ].map(({ icon, title, desc }) => (
                    <div key={title} className="flex items-start gap-3 bg-white/[0.08] border border-white/10 rounded-xl px-4 py-3">
                        <span className="text-xl mt-0.5">{icon}</span>
                        <div>
                            <p className="text-white text-sm font-semibold">{title}</p>
                            <p className="text-violet-300 text-xs mt-0.5">{desc}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>

        {/* BOTTOM */}
        <div className="relative z-10 pt-6 border-t border-white/10">
            <p className="text-violet-400 text-xs">
                Trusted by engineers at Google, Microsoft, Razorpay &amp; more.
            </p>
        </div>
    </div>
)

// ─── Login ────────────────────────────────────────────────────────────────────
const Login = () => {
    const [input, setInput] = useState({ email: '', password: '', role: '' })
    const [showPassword, setShowPassword] = useState(false)

    const { loading, user } = useSelector(store => store.auth)
    const navigate = useNavigate()
    const location = useLocation()
    const dispatch = useDispatch()

    // Redirect authenticated users away from the login page based on their role
    useEffect(() => {
        if (user) navigate(user.role === 'recruiter' ? '/admin/companies' : '/')
    }, [user, navigate])

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value })
    }

    const submitHandler = async (e) => {
        e.preventDefault()
        try {
            dispatch(setLoading(true))
            const res = await axios.post(`${USER_API_END_POINT}/login`, input, {
                headers: { 'Content-Type': 'application/json' },
                withCredentials: true,
            })
            if (res.data.success) {
                dispatch(setUser(res.data.user))
                const redirectPath = location.state?.from?.pathname ||
                    (res.data.user.role === 'recruiter' ? '/admin/companies' : '/')
                navigate(redirectPath)
                toast.success(`Welcome back, ${res.data.user.fullName}`)
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Invalid login credentials')
        } finally {
            dispatch(setLoading(false))
        }
    }

    return (
        <div className="min-h-screen flex">
            <LeftPanel />

            {/* RIGHT PANEL */}
            <div className="w-full lg:w-1/2 flex flex-col justify-center px-6 sm:px-12 lg:px-16 py-12 bg-slate-50 overflow-y-auto">

                {/* Back button */}
                <button
                    onClick={() => navigate('/')}
                    className="flex items-center gap-2 text-slate-500 hover:text-slate-800 text-sm mb-8 w-fit group transition-colors duration-200"
                >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-200" />
                    Back to home
                </button>

                {/* Header */}
                <div className="mb-8 max-w-md">
                    <h1 className="text-3xl font-bold text-slate-900 mb-2">Welcome back</h1>
                    <p className="text-slate-500">
                        Don't have an account?{' '}
                        <Link to="/signup" className="text-violet-600 font-medium hover:text-violet-700 hover:underline">
                            Create one
                        </Link>
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={submitHandler} className="space-y-5 max-w-md w-full">

                    {/* Role Selector */}
                    <div>
                        <Label className="text-sm font-medium text-slate-700 mb-2 block">I am a</Label>
                        <div className="grid grid-cols-2 gap-3">
                            {[
                                { value: 'student', label: 'Job Seeker', Icon: User },
                                { value: 'recruiter', label: 'Recruiter', Icon: Building2 },
                            ].map(({ value, label, Icon }) => (
                                <label
                                    key={value}
                                    className={`relative flex items-center gap-3 p-3.5 rounded-xl border-2 cursor-pointer transition-all duration-150 ${input.role === value
                                        ? 'border-violet-500 bg-violet-50'
                                        : 'border-slate-200 bg-white hover:border-slate-300'
                                        }`}
                                >
                                    <input
                                        type="radio" name="role" value={value}
                                        checked={input.role === value}
                                        onChange={changeEventHandler}
                                        className="sr-only"
                                    />
                                    {/* Checkmark */}
                                    {input.role === value && (
                                        <span className="absolute top-2 right-2 w-4 h-4 bg-violet-600 rounded-full flex items-center justify-center">
                                            <Check className="w-2.5 h-2.5 text-white" />
                                        </span>
                                    )}
                                    <div className={`p-1.5 rounded-lg flex-shrink-0 ${input.role === value ? 'bg-violet-100' : 'bg-slate-100'}`}>
                                        <Icon className={`w-4 h-4 ${input.role === value ? 'text-violet-600' : 'text-slate-400'}`} />
                                    </div>
                                    <span className={`text-sm font-medium ${input.role === value ? 'text-violet-700' : 'text-slate-600'}`}>
                                        {label}
                                    </span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Email */}
                    <div className="space-y-1.5">
                        <Label htmlFor="email" className="text-sm font-medium text-slate-700">Email address</Label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <Input
                                id="email" type="email" name="email"
                                value={input.email} onChange={changeEventHandler}
                                placeholder="Enter your email"
                                className="pl-10 h-11 bg-white border-slate-200 focus:border-violet-500 focus:ring-2 focus:ring-violet-100 focus:border-transparent rounded-xl shadow-sm transition-all"
                            />
                        </div>
                    </div>

                    {/* Password */}
                    <div className="space-y-1.5">
                        <Label htmlFor="password" className="text-sm font-medium text-slate-700">Password</Label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <Input
                                id="password" type={showPassword ? 'text' : 'password'}
                                name="password" value={input.password} onChange={changeEventHandler}
                                placeholder="Enter your password"
                                className="pl-10 pr-11 h-11 bg-white border-slate-200 focus:border-violet-500 focus:ring-2 focus:ring-violet-100 focus:border-transparent rounded-xl shadow-sm transition-all"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                aria-label={showPassword ? 'Hide password' : 'Show password'}
                            >
                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                    </div>

                    {/* Submit */}
                    <Button
                        type="submit"
                        disabled={loading}
                        className="w-full h-12 bg-gradient-to-r from-violet-600 to-violet-700 hover:from-violet-700 hover:to-indigo-700 text-white font-semibold tracking-wide rounded-xl shadow-lg shadow-violet-500/25 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed mt-2"
                    >
                        {loading ? (
                            <span className="flex items-center justify-center gap-2">
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Signing in...
                            </span>
                        ) : 'Sign in'}
                    </Button>

                </form>
            </div>
        </div>
    )
}

export default Login