// Main site navigation header including responsive menus, role-based links, and user profile dropdown
import React, { useState } from 'react'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { Button } from '../ui/button'
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar'
import { LogOut, User2, Briefcase, ChevronDown, Menu, X } from 'lucide-react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { USER_API_END_POINT } from '@/utils/constant'
import { setUser } from '@/redux/authSlice'
import { toast } from 'sonner'

const Navbar = () => {
    const { user } = useSelector(store => store.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);

    const logoutHandler = async () => {
        try {
            const res = await axios.get(`${USER_API_END_POINT}/logout`, { withCredentials: true });
            if (res.data?.success) {
                dispatch(setUser(null));
                navigate("/");
                toast.success(res.data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Logout failed");
        }
    }

    const navLinks = user?.role === 'recruiter'
        ? [
            { to: "/admin/companies", label: "Companies" },
            { to: "/admin/jobs", label: "Jobs" },
        ]
        : [
            { to: "/", label: "Home" },
            { to: "/jobs", label: "Jobs" },
            { to: "/browse", label: "Browse" },
        ];

    const isActive = (path) => {
        if (path === '/') return location.pathname === '/';
        return location.pathname.startsWith(path);
    };

    const initials = user?.fullName
        ? user.fullName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
        : 'U';

    return (
        <header className='sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-slate-200 shadow-sm'>
            <div className='container'>
                <div className='flex items-center justify-between h-16'>

                    {/* Logo */}
                    <Link to="/" className='flex items-center gap-2 group hover:opacity-80 transition-opacity duration-200 cursor-pointer'>
                        <div className='w-8 h-8 rounded-lg bg-brand-primary flex items-center justify-center shadow-sm'>
                            <Briefcase className='w-4 h-4 text-white' />
                        </div>
                        <span className='text-xl font-bold text-slate-900'>
                            Next<span className='text-brand-primary'>Hire</span>
                        </span>
                    </Link>

                    {/* Desktop Nav */}
                    <nav className='hidden md:flex items-center gap-1' aria-label="Main navigation">
                        {navLinks.map(({ to, label }) => (
                            <Link
                                key={to}
                                to={to}
                                aria-current={isActive(to) ? 'page' : undefined}
                                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-150 ${isActive(to) ? 'bg-violet-100 text-violet-700 font-medium' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'}`}
                            >
                                {label}
                            </Link>
                        ))}
                    </nav>

                    {/* Right: Auth */}
                    <div className='hidden md:flex items-center gap-3'>
                        {!user ? (
                            <>
                                <Link to="/login">
                                    <Button
                                        variant="ghost"
                                        className='h-10 text-slate-600 hover:text-slate-900 font-medium rounded-lg'
                                    >
                                        Log in
                                    </Button>
                                </Link>
                                <Link to="/signup">
                                    <Button
                                        className='h-10 bg-brand-primary hover:bg-brand-primary/90 text-white font-medium px-5 rounded-lg shadow-sm transition-all duration-150 hover:shadow-md'
                                    >
                                        Get Started
                                    </Button>
                                </Link>
                            </>
                        ) : (
                            <Popover open={profileOpen} onOpenChange={setProfileOpen}>
                                <PopoverTrigger asChild>
                                    <button className='flex items-center gap-2 px-2 py-1 rounded-full bg-slate-50 border border-slate-200 hover:bg-violet-50 hover:border-violet-200 transition-all duration-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary/30'>
                                        {/* Avatar with online dot */}
                                        <div className='relative flex-shrink-0'>
                                            <Avatar className="h-8 w-8 ring-2 ring-violet-200 transition-all duration-200">
                                                <AvatarImage
                                                    src={user?.profile?.profilePhoto}
                                                    alt={user?.fullName}
                                                    className="rounded-full object-cover"
                                                />
                                                <AvatarFallback className='bg-brand-primary/10 text-brand-primary text-xs font-semibold'>
                                                    {initials}
                                                </AvatarFallback>
                                            </Avatar>
                                            {/* Online indicator */}
                                            <span className='absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-400 rounded-full ring-2 ring-white' aria-hidden="true" />
                                        </div>
                                        <span className='hidden sm:block text-sm font-medium text-slate-700 max-w-[100px] truncate'>
                                            {user?.fullName}
                                        </span>
                                        <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${profileOpen ? 'rotate-180' : ''}`} />
                                    </button>
                                </PopoverTrigger>
                                <PopoverContent className="w-64 p-0 bg-white shadow-xl border border-slate-100 rounded-2xl overflow-hidden" align="end" sideOffset={10}>
                                    {/* User Info Header */}
                                    <div className='relative px-4 py-3.5 bg-gradient-to-br from-[#F5F3FF] to-white border-b border-violet-100 overflow-hidden'>
                                        <div className='absolute -top-4 -right-4 w-16 h-16 bg-violet-300/20 rounded-full blur-xl pointer-events-none' />
                                        <div className='flex items-center gap-3 relative z-10'>
                                            <Avatar className="h-10 w-10 ring-2 ring-brand-primary/25 ring-offset-1 flex-shrink-0">
                                                <AvatarImage src={user?.profile?.profilePhoto} />
                                                <AvatarFallback className='bg-brand-primary text-white font-bold text-xs'>
                                                    {initials}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className='min-w-0 flex-1'>
                                                <p className='font-bold text-slate-900 text-sm truncate leading-tight'>{user?.fullName}</p>
                                                <p className='text-[11px] text-slate-500 truncate mt-0.5'>{user?.email}</p>
                                                <span className={`inline-flex items-center mt-1.5 px-2 py-px rounded-full text-[10px] font-semibold tracking-wide ${user.role === 'recruiter'
                                                    ? 'bg-indigo-100 text-indigo-700'
                                                    : 'bg-violet-100 text-violet-700'
                                                    }`}>
                                                    {user.role === 'recruiter' ? 'Recruiter' : 'Job Seeker'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Menu Items */}
                                    <div className='p-1.5'>
                                        {user.role === 'student' && (
                                            <Link to="/profile">
                                                <button className='w-full flex items-center gap-2.5 px-4 py-2.5 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-brand-primary transition-all duration-150 group'>
                                                    <User2 className='w-3.5 h-3.5 text-slate-400 group-hover:text-brand-primary flex-shrink-0' />
                                                    <span>View Profile</span>
                                                </button>
                                            </Link>
                                        )}
                                        <div className='mx-1 my-1 border-t border-slate-100' />
                                        <button
                                            type="button"
                                            onClick={logoutHandler}
                                            className='w-full flex items-center gap-2.5 px-4 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-all duration-150 group'
                                        >
                                            <LogOut className='w-3.5 h-3.5 text-red-400 group-hover:text-red-500 flex-shrink-0' />
                                            <span>Sign out</span>
                                        </button>
                                    </div>
                                </PopoverContent>
                            </Popover>
                        )}
                    </div>

                    {/* Mobile Menu Toggle */}
                    <button
                        type="button"
                        aria-label={mobileOpen ? "Close menu" : "Open menu"}
                        aria-expanded={mobileOpen}
                        className='md:hidden p-2 rounded-lg text-slate-500 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary'
                        onClick={() => setMobileOpen(!mobileOpen)}
                    >
                        {mobileOpen ? <X className='w-5 h-5' /> : <Menu className='w-5 h-5' />}
                    </button>
                </div>

                {/* Mobile Nav */}
                {mobileOpen && (
                    <div className='md:hidden border-t border-slate-200 py-3 space-y-1'>
                        {navLinks.map(({ to, label }) => (
                            <Link
                                key={to}
                                to={to}
                                onClick={() => setMobileOpen(false)}
                                aria-current={isActive(to) ? 'page' : undefined}
                                className={`block px-4 py-2.5 rounded-lg text-sm font-medium ${isActive(to) ? 'bg-brand-primary/10 text-brand-primary' : 'text-slate-600 hover:bg-slate-50'
                                    }`}
                            >
                                {label}
                            </Link>
                        ))}
                        <div className='pt-2 border-t border-slate-200 flex flex-col gap-2 px-1'>
                            {!user ? (
                                <>
                                    <Link to="/login" onClick={() => setMobileOpen(false)}>
                                        <Button variant="outline" className='h-10 w-full border-slate-300 text-slate-700 hover:bg-slate-50'>Log in</Button>
                                    </Link>
                                    <Link to="/signup" onClick={() => setMobileOpen(false)}>
                                        <Button className='h-10 w-full bg-brand-primary hover:bg-brand-primary/90 text-white'>Get Started</Button>
                                    </Link>
                                </>
                            ) : (
                                <Button
                                    variant="ghost"
                                    onClick={() => { logoutHandler(); setMobileOpen(false); }}
                                    className='h-10 w-full text-red-600 hover:bg-red-50 justify-start gap-2'
                                >
                                    <LogOut className='w-4 h-4' /> Sign out
                                </Button>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </header>
    )
}

export default Navbar