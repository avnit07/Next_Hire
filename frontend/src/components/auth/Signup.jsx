// User registration page handling new account creation, role selection, and profile photo uploads
import React, { useState, useEffect } from 'react'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { USER_API_END_POINT } from '@/utils/constant'
import { toast } from 'sonner'
import { useDispatch, useSelector } from 'react-redux'
import { setLoading } from '@/redux/authSlice'
import {
    Loader2, User, Mail, Phone, Lock, Building2,
    Upload, BriefcaseBusiness, Eye, EyeOff, ArrowLeft, AlertCircle, Check
} from 'lucide-react'

// ─── Helpers ──────────────────────────────────────────────────────────────────
const FieldError = ({ msg }) =>
    msg ? (
        <p className="flex items-center gap-1 text-red-500 text-xs mt-1">
            <AlertCircle className="w-3 h-3 flex-shrink-0" />{msg}
        </p>
    ) : null

const inputCls = (hasError) =>
    `pl-10 h-11 rounded-xl bg-white shadow-sm transition-all ${hasError
        ? 'border-red-400 focus:border-red-400 focus:ring-2 focus:ring-red-100'
        : 'border-slate-200 focus:border-violet-500 focus:ring-2 focus:ring-violet-100 focus:border-transparent'
    }`

// ─── LEFT PANEL ───────────────────────────────────────────────────────────────
const STATS = [
    { value: '500+', label: 'Active jobs' },
    { value: '200+', label: 'Companies' },
    { value: '48hrs', label: 'Avg response' },
    { value: 'Free', label: 'For job seekers' },
]

const LeftPanel = () => (
    <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-violet-600 via-violet-700 to-indigo-900 flex-col p-12 relative overflow-hidden">

        {/* Blobs */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-900/40 rounded-full translate-y-1/2 -translate-x-1/2" />

        {/* 1. LOGO */}
        <div className="relative z-10 flex items-center gap-3 mb-0">
            <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center border border-white/20">
                <BriefcaseBusiness className="w-4 h-4 text-white" />
            </div>
            <span className="text-white font-bold text-lg">NextHire</span>
        </div>

        {/* 2. MAIN CONTENT — centered in remaining space */}
        <div className="relative z-10 flex-1 flex flex-col justify-start pt-10 space-y-5">
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-3 py-1 w-fit">
                <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                <span className="text-white/90 text-[11px] font-medium">500+ jobs added this month</span>
            </div>
            <h2 className="text-4xl font-bold text-white leading-tight">
                Your next opportunity<br />starts here.
            </h2>
            <p className="text-violet-200 text-base leading-relaxed max-w-xs">
                Join engineers and recruiters who found their perfect match on NextHire.
            </p>
            <div className="grid grid-cols-2 gap-3">
                {[
                    { value: '500+', label: 'Active jobs', icon: '💼' },
                    { value: '200+', label: 'Companies', icon: '🏢' },
                    { value: '48hrs', label: 'First response', icon: '⚡' },
                    { value: '100%', label: 'Free for seekers', icon: '✨' },
                ].map(stat => (
                    <div key={stat.label} className="flex items-center gap-3 bg-white/8 border border-white/10 rounded-xl px-3 py-3">
                        <span className="text-base">{stat.icon}</span>
                        <div>
                            <p className="text-white font-bold text-base leading-none">{stat.value}</p>
                            <p className="text-violet-300 text-xs mt-0.5">{stat.label}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>

        {/* 3. BOTTOM — social proof */}
        <div className="relative z-10 pt-6 border-t border-white/10">
            <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                    {['RK', 'AM', 'PS', 'VN'].map((init, i) => (
                        <div key={i} className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-300 to-indigo-400 border-2 border-violet-700 flex items-center justify-center text-white text-[9px] font-bold">{init}</div>
                    ))}
                </div>
                <p className="text-violet-200 text-xs"><span className="text-white font-semibold">2,400+</span> joined this year</p>
            </div>
            <p className="text-violet-400 text-xs mt-2">Trusted by engineers at Google, Microsoft, Razorpay &amp; more.</p>
        </div>

    </div>
)

// ─── Signup ───────────────────────────────────────────────────────────────────
const Signup = () => {
    const [input, setInput] = useState({
        fullName: '', email: '', phoneNumber: '', password: '', role: '', file: ''
    })
    const [showPassword, setShowPassword] = useState(false)
    const [photoPreview, setPhotoPreview] = useState(null)
    const [errors, setErrors] = useState({})
    const [roleError, setRoleError] = useState(false)

    const { loading, user } = useSelector(store => store.auth)
    const navigate = useNavigate()
    const dispatch = useDispatch()

    // Prevent logged-in users from accessing the signup page by redirecting them
    useEffect(() => {
        if (user) navigate(user.role === 'recruiter' ? '/admin/companies' : '/')
    }, [user, navigate])

    const changeEventHandler = (e) => {
        const { name, value } = e.target
        setInput(prev => ({ ...prev, [name]: value }))
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }))
    }

    const handlePhoneChange = (e) => {
        const val = e.target.value.replace(/\D/g, '').slice(0, 10)
        setInput(prev => ({ ...prev, phoneNumber: val }))
        if (errors.phoneNumber) setErrors(prev => ({ ...prev, phoneNumber: '' }))
    }

    const handleRoleSelect = (role) => {
        setInput(prev => ({ ...prev, role }))
        setRoleError(false)
    }

    const changeFileHandler = (e) => {
        const file = e.target.files?.[0]
        setInput(prev => ({ ...prev, file }))
        if (file) {
            const reader = new FileReader()
            reader.onload = (ev) => setPhotoPreview(ev.target.result)
            reader.readAsDataURL(file)
        }
    }

    const validate = () => {
        const newErrors = {}
        if (!input.role) { setRoleError(true); newErrors.role = true }
        if (!input.fullName?.trim() || input.fullName.trim().length < 2)
            newErrors.fullName = 'Enter your full name (at least 2 characters)'
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email))
            newErrors.email = 'Enter a valid email address'
        if (!input.phoneNumber || input.phoneNumber.length !== 10)
            newErrors.phoneNumber = 'Enter a valid 10-digit mobile number'
        if (!input.password || input.password.length < 6)
            newErrors.password = 'Password must be at least 6 characters'
        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const submitHandler = async (e) => {
        e.preventDefault()
        if (!validate()) {
            if (!input.role) toast.error("Please select how you're joining")
            return
        }
        const formData = new FormData()
        formData.append('fullName', input.fullName)
        formData.append('email', input.email)
        formData.append('phoneNumber', input.phoneNumber)
        formData.append('password', input.password)
        formData.append('role', input.role)
        if (input.file) formData.append('file', input.file)
        try {
            dispatch(setLoading(true))
            const res = await axios.post(`${USER_API_END_POINT}/register`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
                withCredentials: true,
            })
            if (res.data.success) {
                navigate('/login')
                toast.success('Account created successfully')
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to create account')
        } finally {
            dispatch(setLoading(false))
        }
    }

    return (
        <div className="min-h-screen flex items-stretch">
            <LeftPanel />

            {/* RIGHT PANEL */}
            <div className="w-full lg:w-1/2 flex flex-col justify-center px-6 sm:px-12 lg:px-16 py-12 bg-white">

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
                    <h1 className="text-3xl font-bold text-slate-900 mb-2">Create your account</h1>
                    <p className="text-slate-500">
                        Already have an account?{' '}
                        <Link to="/login" className="text-violet-600 font-medium hover:text-violet-700 hover:underline">Sign in</Link>
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={submitHandler} className="space-y-5 max-w-md w-full" noValidate>

                    {/* Role Selector */}
                    <div>
                        <Label className="text-sm font-medium text-slate-700 mb-2 block">I am joining as</Label>
                        <div className={`grid grid-cols-2 gap-3 ${roleError ? 'ring-2 ring-red-400 rounded-2xl p-1' : ''}`}>
                            {[
                                { value: 'student', label: 'Job Seeker', Icon: User, desc: 'Find your next role' },
                                { value: 'recruiter', label: 'Recruiter', Icon: Building2, desc: 'Hire top talent' },
                            ].map(({ value, label, Icon, desc }) => (
                                <label
                                    key={value}
                                    onClick={() => handleRoleSelect(value)}
                                    className={`relative flex flex-col gap-1 p-4 rounded-xl border-2 cursor-pointer transition-all duration-150 ${input.role === value
                                        ? 'border-violet-500 bg-violet-50'
                                        : roleError
                                            ? 'border-red-300 bg-red-50'
                                            : 'border-slate-200 bg-white hover:border-slate-300'
                                        }`}
                                >
                                    <input
                                        type="radio" name="role" value={value}
                                        checked={input.role === value}
                                        onChange={() => handleRoleSelect(value)}
                                        className="sr-only"
                                    />
                                    {/* Checkmark badge */}
                                    {input.role === value && (
                                        <span className="absolute top-2 right-2 w-5 h-5 bg-violet-600 rounded-full flex items-center justify-center">
                                            <Check className="w-3 h-3 text-white" />
                                        </span>
                                    )}
                                    <div className={`p-2 rounded-lg w-fit ${input.role === value ? 'bg-violet-100' : 'bg-slate-100'}`}>
                                        <Icon className={`w-4 h-4 ${input.role === value ? 'text-violet-600' : 'text-slate-400'}`} />
                                    </div>
                                    <span className={`text-sm font-semibold ${input.role === value ? 'text-violet-700' : 'text-slate-700'}`}>{label}</span>
                                    <span className="text-xs text-slate-400">{desc}</span>
                                </label>
                            ))}
                        </div>
                        {roleError && (
                            <p className="flex items-center gap-1 text-red-500 text-sm mt-1.5">
                                <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                                Please select Job Seeker or Recruiter to continue
                            </p>
                        )}
                    </div>

                    {/* Full Name */}
                    <div className="space-y-1">
                        <Label htmlFor="fullName" className="text-sm font-medium text-slate-700">Full Name</Label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <Input
                                id="fullName" type="text" name="fullName"
                                value={input.fullName} onChange={changeEventHandler}
                                placeholder="Enter your full name"
                                className={inputCls(errors.fullName)}
                            />
                        </div>
                        <FieldError msg={errors.fullName} />
                    </div>

                    {/* Email + Phone */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <Label htmlFor="email" className="text-sm font-medium text-slate-700">Email</Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <Input
                                    id="email" type="email" name="email"
                                    value={input.email} onChange={changeEventHandler}
                                    placeholder="Enter your email"
                                    className={inputCls(errors.email)}
                                />
                            </div>
                            <FieldError msg={errors.email} />
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor="phoneNumber" className="text-sm font-medium text-slate-700">Phone</Label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <Input
                                    id="phoneNumber" type="tel" name="phoneNumber"
                                    value={input.phoneNumber}
                                    onChange={handlePhoneChange}
                                    onKeyPress={(e) => { if (!/[0-9]/.test(e.key)) e.preventDefault() }}
                                    maxLength={10} inputMode="numeric"
                                    placeholder="10-digit number"
                                    className={inputCls(errors.phoneNumber)}
                                />
                            </div>
                            <FieldError msg={errors.phoneNumber} />
                        </div>
                    </div>

                    {/* Password */}
                    <div className="space-y-1">
                        <Label htmlFor="password" className="text-sm font-medium text-slate-700">Password</Label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <Input
                                id="password" type={showPassword ? 'text' : 'password'}
                                name="password" value={input.password} onChange={changeEventHandler}
                                placeholder="Create a strong password (min 6 chars)"
                                className={`${inputCls(errors.password)} pr-11`}
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
                        <FieldError msg={errors.password} />
                    </div>

                    {/* Profile Photo */}
                    <div className="space-y-1.5">
                        <Label className="text-sm font-medium text-slate-700">
                            Profile Photo <span className="text-slate-400 font-normal">(optional)</span>
                        </Label>
                        <label className="flex items-center gap-3 p-3.5 rounded-xl border-2 border-dashed border-slate-200 hover:border-violet-300 hover:bg-violet-50/50 cursor-pointer transition-all group bg-white">
                            <input type="file" accept="image/*" onChange={changeFileHandler} className="sr-only" />
                            {photoPreview ? (
                                <img src={photoPreview} alt="preview" className="w-10 h-10 rounded-lg object-cover" />
                            ) : (
                                <div className="w-10 h-10 rounded-lg bg-slate-100 group-hover:bg-violet-100 flex items-center justify-center transition-colors">
                                    <Upload className="w-4 h-4 text-slate-400 group-hover:text-violet-500" />
                                </div>
                            )}
                            <div>
                                <p className="text-sm font-medium text-slate-700">
                                    {photoPreview ? 'Photo selected' : 'Upload a photo'}
                                </p>
                                <p className="text-xs text-slate-400">PNG, JPG up to 5MB</p>
                            </div>
                        </label>
                    </div>

                    {/* Submit */}
                    <Button
                        type="submit"
                        disabled={loading}
                        className="w-full h-12 bg-gradient-to-r from-violet-600 to-violet-700 hover:from-violet-700 hover:to-indigo-700 text-white font-semibold tracking-wide rounded-xl shadow-lg shadow-violet-500/25 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <span className="flex items-center justify-center gap-2">
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Creating account...
                            </span>
                        ) : 'Create Account'}
                    </Button>

                </form>
            </div>
        </div>
    )
}

export default Signup