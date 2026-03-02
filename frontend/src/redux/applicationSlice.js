// Stores applicant data for recruiters so they can view and manage applications without constantly refetching

import { createSlice } from "@reduxjs/toolkit";

const applicationSlice = createSlice({
    name: 'application',
    initialState: {
        applicants: null,
    },
    reducers: {
        // Store the list of applicants for a specific job
        setAllApplicants: (state, action) => {
            state.applicants = action.payload;
        },
        // Update a single application's status in the UI immediately without waiting for a server reload
        setApplicationStatus: (state, action) => {
            const { applicationId, status } = action.payload;
            const app = state.applicants?.applications?.find(a => a._id === applicationId);
            if (app) app.status = status;
        }
    }
});

export const { setAllApplicants, setApplicationStatus } = applicationSlice.actions;
export default applicationSlice.reducer;