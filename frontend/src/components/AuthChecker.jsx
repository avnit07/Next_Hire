// Silent component mounted at the root to verify the user's JWT token on initial app load
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import api from "@/utils/axiosInstance";
import { USER_API_END_POINT } from "@/utils/constant";
import { setUser } from "@/redux/authSlice";

const AuthChecker = () => {
    const dispatch = useDispatch();

    // Run once on app load to restore the user session if a valid HTTP-only cookie exists
    useEffect(() => {
        const validateSession = async () => {
            try {
                const res = await api.get(`${USER_API_END_POINT}/me`);
                if (res.data?.success && res.data?.user) {
                    dispatch(setUser(res.data.user));
                }
            } catch {
                dispatch(setUser(null));
            }
        };
        validateSession();
    }, [dispatch]);

    return null;
};

export default AuthChecker;
