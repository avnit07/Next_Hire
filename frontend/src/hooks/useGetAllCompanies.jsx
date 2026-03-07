// Hook to fetch all companies registered by the logged-in recruiter
import { setCompanies } from '@/redux/companySlice'
import { COMPANY_API_END_POINT } from '@/utils/constant'
import api from '@/utils/axiosInstance'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'

const useGetAllCompanies = () => {
    const dispatch = useDispatch();
    // Run once on mount to populate the recruiter's companies list
    useEffect(() => {
        const fetchCompanies = async () => {
            try {
                const res = await api.get(`${COMPANY_API_END_POINT}/get`);
                console.log('called');
                if (res.data.success) {
                    dispatch(setCompanies(res.data.companies));
                }
            } catch (error) {
                console.log(error);
            }
        }
        fetchCompanies();
    }, [])
}

export default useGetAllCompanies