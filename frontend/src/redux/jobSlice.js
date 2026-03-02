// Central store for all job-related data, including search results, active filters, and applied jobs

import { createSlice } from "@reduxjs/toolkit";

const jobSlice = createSlice({
    name: "job",
    initialState: {
        allJobs: [],
        allAdminJobs: [],
        singleJob: null,
        searchJobByText: "",
        allAppliedJobs: [],
        searchedQuery: {},
        isLoading: false,
    },
    reducers: {
        // Store the retrieved list of jobs for students to browse
        setAllJobs: (state, action) => {
            state.allJobs = action.payload;
            state.isLoading = false;
        },
        // Track loading state specifically for job fetching to show skeleton loaders
        setJobsLoading: (state, action) => {
            state.isLoading = action.payload;
        },
        // Store details of the job currently being viewed on the details page
        setSingleJob: (state, action) => {
            state.singleJob = action.payload;
        },
        // Store jobs created by the logged-in recruiter for their management dashboard
        setAllAdminJobs: (state, action) => {
            state.allAdminJobs = action.payload;
        },
        // Store the generic keyword search input for quick title/description filtering
        setSearchJobByText: (state, action) => {
            state.searchJobByText = action.payload;
        },
        // Store jobs the student has already applied to so they can track their history
        setAllAppliedJobs: (state, action) => {
            state.allAppliedJobs = action.payload;
        },
        // Merge new filter values (e.g., location, salary) into the active search query to allow multi-select filtering
        setSearchedQuery: (state, action) => {
            state.searchedQuery = { ...state.searchedQuery, ...action.payload };
        },
        // Reset all active filters to easily return to the unfiltered job list
        clearSearchedQuery: (state) => {
            state.searchedQuery = {};
        }
    }
});

export const {
    setAllJobs,
    setJobsLoading,
    setSingleJob,
    setAllAdminJobs,
    setSearchJobByText,
    setAllAppliedJobs,
    setSearchedQuery,
    clearSearchedQuery
} = jobSlice.actions;

export default jobSlice.reducer;