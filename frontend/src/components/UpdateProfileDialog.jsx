// Modal dialog for users to edit their profile information, upload a new resume, or change their avatar
import React, { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog'
import { Label } from './ui/label'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { Loader2, User, Mail, Phone, FileText, Tag, Upload, X } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import api from '@/utils/axiosInstance'
import { USER_API_END_POINT } from '@/utils/constant'
import { setUser } from '@/redux/authSlice'
import { toast } from 'sonner'

const UpdateProfileDialog = ({ open, setOpen }) => {
    const [loading, setLoading] = useState(false);
    const { user } = useSelector(store => store.auth);
    const [resumePreview, setResumePreview] = useState(null);

    const [input, setInput] = useState({
        fullName: user?.fullName || "",
        email: user?.email || "",
        phoneNumber: user?.phoneNumber || "",
        bio: user?.profile?.bio || "",
        skills: user?.profile?.skills?.join(", ") || "",
        file: null,
        profilePhoto: null
    });
    const [photoPreview, setPhotoPreview] = useState(user?.profile?.profilePhoto || null);
    const dispatch = useDispatch();

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    }

    const fileChangeHandler = (e) => {
        const file = e.target.files?.[0];
        setInput({ ...input, file });
        if (file) setResumePreview(file.name);
    }

    const photoChangeHandler = (e) => {
        const file = e.target.files?.[0];
        setInput({ ...input, profilePhoto: file });
        if (file) {
            setPhotoPreview(URL.createObjectURL(file));
        }
    }

    const submitHandler = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("fullName", input.fullName);
        formData.append("email", input.email);
        formData.append("phoneNumber", input.phoneNumber);
        formData.append("bio", input.bio);
        formData.append("skills", input.skills);
        if (input.file) formData.append("file", input.file);
        if (input.profilePhoto) formData.append("profilePhoto", input.profilePhoto);
        try {
            setLoading(true);
            const res = await api.patch(`${USER_API_END_POINT}/update`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            if (res.data.success) {
                dispatch(setUser(res.data.user));
                toast.success(res.data.message);
                setOpen(false);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent
                className="sm:max-w-[480px] w-full p-0 gap-0 rounded-2xl border border-gray-200 shadow-2xl bg-white overflow-hidden"
                // Ensure the overlay is opaque and no bleed-through
                style={{ background: '#ffffff' }}
            >
                {/* ── Header ── */}
                <div className="flex items-start justify-between px-6 pt-6 pb-4 border-b border-gray-100 bg-white">
                    <div>
                        <h2 className="text-lg font-bold text-gray-900">Update Profile</h2>
                        <p className="text-sm text-gray-500 mt-0.5">Keep your profile up to date</p>
                    </div>
                    {/* Custom close button so there's no z-index conflict */}
                    <button
                        onClick={() => setOpen(false)}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors mt-0.5"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* ── Scrollable Form Body ── */}
                <form onSubmit={submitHandler} className="flex flex-col bg-white">
                    <div className="px-6 py-5 space-y-4 overflow-y-auto max-h-[58vh]">

                        {/* Profile Photo */}
                        <div className="flex flex-col items-center mb-2">
                            <label className="relative cursor-pointer group">
                                <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-gray-100 group-hover:border-violet-300 transition-all shadow-sm">
                                    {photoPreview ? (
                                        <img src={photoPreview} alt="Profile preview" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full bg-slate-100 flex items-center justify-center">
                                            <User className="w-8 h-8 text-slate-400" />
                                        </div>
                                    )}
                                </div>
                                <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Upload className="w-5 h-5 text-white" />
                                </div>
                                <input type="file" accept="image/*" className="hidden" onChange={photoChangeHandler} />
                            </label>
                            <p className="text-xs text-gray-500 mt-2 font-medium">Change Avatar</p>
                        </div>

                        {/* Full Name */}
                        <div className="space-y-1.5">
                            <Label htmlFor="fullName" className="text-sm font-medium text-gray-700">
                                Full Name
                            </Label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                                <Input
                                    id="fullName"
                                    name="fullName"
                                    type="text"
                                    value={input.fullName}
                                    onChange={changeEventHandler}
                                    placeholder="John Doe"
                                    className="pl-10 h-11 bg-white border-gray-200 focus:border-violet-400 focus:ring-2 focus:ring-violet-100 rounded-xl text-sm text-gray-900"
                                />
                            </div>
                        </div>

                        {/* Email */}
                        <div className="space-y-1.5">
                            <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                                Email
                            </Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    value={input.email}
                                    onChange={changeEventHandler}
                                    placeholder="you@example.com"
                                    className="pl-10 h-11 bg-white border-gray-200 focus:border-violet-400 focus:ring-2 focus:ring-violet-100 rounded-xl text-sm text-gray-900"
                                />
                            </div>
                        </div>

                        {/* Phone */}
                        <div className="space-y-1.5">
                            <Label htmlFor="phoneNumber" className="text-sm font-medium text-gray-700">
                                Phone
                            </Label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                                <Input
                                    id="phoneNumber"
                                    name="phoneNumber"
                                    type="text"
                                    value={input.phoneNumber}
                                    onChange={changeEventHandler}
                                    placeholder="9876543210"
                                    className="pl-10 h-11 bg-white border-gray-200 focus:border-violet-400 focus:ring-2 focus:ring-violet-100 rounded-xl text-sm text-gray-900"
                                />
                            </div>
                        </div>

                        {/* Bio */}
                        <div className="space-y-1.5">
                            <Label htmlFor="bio" className="text-sm font-medium text-gray-700">
                                Bio
                            </Label>
                            <div className="relative">
                                <User className="absolute left-3 top-3 w-4 h-4 text-gray-400 pointer-events-none" />
                                <textarea
                                    id="bio"
                                    name="bio"
                                    value={input.bio}
                                    onChange={changeEventHandler}
                                    placeholder="A short bio about yourself..."
                                    rows={3}
                                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 focus:border-violet-400 focus:ring-2 focus:ring-violet-100 rounded-xl text-sm text-gray-900 resize-none outline-none transition-all"
                                />
                            </div>
                        </div>

                        {/* Skills */}
                        <div className="space-y-1.5">
                            <Label htmlFor="skills" className="text-sm font-medium text-gray-700">
                                Skills
                            </Label>
                            <div className="relative">
                                <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                                <Input
                                    id="skills"
                                    name="skills"
                                    type="text"
                                    value={input.skills}
                                    onChange={changeEventHandler}
                                    placeholder="React, Node.js, TypeScript"
                                    className="pl-10 h-11 bg-white border-gray-200 focus:border-violet-400 focus:ring-2 focus:ring-violet-100 rounded-xl text-sm text-gray-900"
                                />
                            </div>
                            <p className="text-xs text-gray-400">Separate multiple skills with commas</p>
                        </div>

                        {/* Resume Upload */}
                        <div className="space-y-1.5">
                            <Label className="text-sm font-medium text-gray-700">
                                Resume <span className="text-gray-400 font-normal">(PDF only)</span>
                            </Label>
                            <label className="flex items-center gap-3 p-3.5 rounded-xl border-2 border-dashed border-gray-200 hover:border-violet-300 hover:bg-violet-50/50 cursor-pointer transition-all group bg-white">
                                <input
                                    type="file"
                                    accept="application/pdf"
                                    onChange={fileChangeHandler}
                                    className="sr-only"
                                />
                                <div className="w-9 h-9 rounded-lg bg-gray-100 group-hover:bg-violet-100 flex items-center justify-center flex-shrink-0 transition-colors">
                                    {resumePreview
                                        ? <FileText className="w-4 h-4 text-violet-500" />
                                        : <Upload className="w-4 h-4 text-gray-400 group-hover:text-violet-500" />
                                    }
                                </div>
                                <div className="min-w-0">
                                    <p className="text-sm font-medium text-gray-700 truncate">
                                        {resumePreview
                                            || user?.profile?.resumeOriginalName
                                            || "Click to upload resume"}
                                    </p>
                                    <p className="text-xs text-gray-400">PDF, max 5MB</p>
                                </div>
                            </label>
                        </div>

                    </div>

                    {/* ── Sticky Footer ── */}
                    <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex items-center justify-end gap-3">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setOpen(false)}
                            className="border-gray-200 text-gray-700 hover:bg-gray-100 rounded-xl font-medium px-5"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={loading}
                            className="bg-violet-600 hover:bg-violet-700 text-white font-semibold rounded-xl px-6 shadow-sm transition-all"
                        >
                            {loading
                                ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Saving...</>
                                : 'Save Changes'
                            }
                        </Button>
                    </div>
                </form>

            </DialogContent>
        </Dialog>
    )
}

export default UpdateProfileDialog