// Page component for recruiters that fetches and displays all applicants for a specific job posting
import React, { useEffect } from 'react'
import Navbar from '../shared/Navbar'
import ApplicantsTable from './ApplicantsTable'
import api from '@/utils/axiosInstance';
import { APPLICATION_API_END_POINT } from '@/utils/constant';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setAllApplicants } from '@/redux/applicationSlice';

const Applicants = () => {
    const params = useParams();
    const dispatch = useDispatch();
    const { applicants } = useSelector(store => store.application);

    // Fetch applicant data when the component mounts or the job ID changes in the URL
    useEffect(() => {
        const fetchAllApplicants = async () => {
            try {
                const res = await api.get(`${APPLICATION_API_END_POINT}/${params.id}/applicants`);
                if (res.data?.success) {
                    dispatch(setAllApplicants(res.data.job));
                }
            } catch (error) {
                console.log(error);
            }
        }
        fetchAllApplicants();
    }, [params.id, dispatch]);
    return (
        <div>
            <Navbar />
            <div className='max-w-7xl mx-auto px-4 sm:px-6'>
                <h1 className='font-bold text-xl my-5'>Applicants {applicants?.applications?.length}</h1>
                <ApplicantsTable />
            </div>
        </div>
    )
}

export default Applicants