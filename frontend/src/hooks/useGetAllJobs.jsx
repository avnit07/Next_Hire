// Hook to fetch public job listings with support for search filters, sorting, and pagination
import { setAllJobs, setJobsLoading } from '@/redux/jobSlice'
import { JOB_API_END_POINT } from '@/utils/constant'
import api from '@/utils/axiosInstance'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { normalizeSalaryToLPA } from '@/utils/formatSalary'

const useGetAllJobs = (page = 1, limit = 10) => {
    const dispatch = useDispatch();
    const { searchedQuery } = useSelector(store => store.job);

    // Re-fetch jobs whenever pagination (page, limit) or active search filters change
    useEffect(() => {
        const fetchAllJobs = async () => {
            try {
                dispatch(setJobsLoading(true));
                const params = new URLSearchParams({ page, limit });

                if (searchedQuery && Object.keys(searchedQuery).length > 0) {
                    if (searchedQuery.Location) params.append('location', searchedQuery.Location);
                    if (searchedQuery.keyword) params.append('keyword', searchedQuery.keyword);
                    if (searchedQuery.Industry) params.append('type', searchedQuery.Industry);
                    if (searchedQuery.Salary) params.append('salary', searchedQuery.Salary);

                    if (searchedQuery.Sort === "Latest") params.append('sort', 'latest');
                    else if (searchedQuery.Sort === "Salary (High to Low)") params.append('sort', 'salary_desc');
                    else if (searchedQuery.Sort === "Relevance") params.append('sort', 'relevance');
                }

                const res = await api.get(`${JOB_API_END_POINT}/get?${params.toString()}`);
                if (res.data.success) {
                    let jobs = res.data.jobs || [];

                    // Client-side filter workaround: Normalize salaries to LPA so we can accurately compare against the chosen numeric filter range
                    const { SalaryMin, SalaryMax } = searchedQuery;
                    if (SalaryMin !== undefined && SalaryMax !== undefined) {
                        jobs = jobs.filter(job => {
                            const lpa = normalizeSalaryToLPA(job.salary ?? job.salaryRange ?? job.ctc ?? 0);
                            return lpa >= SalaryMin && (SalaryMax === Infinity ? true : lpa <= SalaryMax);
                        });
                    }

                    dispatch(setAllJobs(jobs));
                }
            } catch (error) {
                console.error("Failed to fetch jobs:", error);
                dispatch(setJobsLoading(false));
                dispatch(setAllJobs([]));
            }
        };
        fetchAllJobs();
    }, [searchedQuery, dispatch, page, limit]);
}

export default useGetAllJobs