// Stores company data so recruiters can manage their registered companies without repeated API calls
import { createSlice } from "@reduxjs/toolkit";

const companySlice = createSlice({
    name: "company",
    initialState: {
        singleCompany: null,
        companies: [],
        searchCompanyByText: "",
    },
    reducers: {
        // Store details of the company currently being viewed or edited
        setSingleCompany: (state, action) => {
            state.singleCompany = action.payload;
        },
        // Store the list of all companies owned by the recruiter for the dashboard
        setCompanies: (state, action) => {
            state.companies = action.payload;
        },
        // Store the user's search input to instantly filter the displayed companies
        setSearchCompanyByText: (state, action) => {
            state.searchCompanyByText = action.payload;
        }
    }
});
export const { setSingleCompany, setCompanies, setSearchCompanyByText } = companySlice.actions;
export default companySlice.reducer;