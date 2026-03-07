// Hook to fetch the history of jobs a student has applied to
import { setAllAppliedJobs } from "@/redux/jobSlice";
import { APPLICATION_API_END_POINT } from "@/utils/constant";
import api from "@/utils/axiosInstance"
import { useEffect } from "react"
import { useDispatch } from "react-redux"

const useGetAppliedJobs = () => {
    const dispatch = useDispatch();

    // Run once on mount to load the student's application history
    useEffect(() => {
        const fetchAppliedJobs = async () => {
            try {
                const res = await api.get(`${APPLICATION_API_END_POINT}/get`);
                if (res.data?.success) {
                    dispatch(setAllAppliedJobs(res.data.application || []));
                }
            } catch (error) {
                console.log(error);
            }
        }
        fetchAppliedJobs();
    }, [])
};
export default useGetAppliedJobs;