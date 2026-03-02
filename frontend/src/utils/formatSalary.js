// Standardizes all legacy salary formats to a clean LPA float so filtering comparisons work universally
export const normalizeSalaryToLPA = (salary) => {
    const n = Number(salary);
    if (isNaN(n)) return 0;
    if (n >= 100000) return n / 100000;  // raw rupees  → LPA
    if (n >= 1000) return n / 100000;  // thousands   → LPA
    return n;                             // already LPA
};

// Format salaries uniformly for UI rendering without breaking existing unparsed string formats
export const formatSalary = (salary) => {
    if (salary === undefined || salary === null || salary === '') return '—';
    const n = Number(salary);
    if (isNaN(n)) return String(salary); // already formatted string e.g. "6 LPA"
    const lpa = normalizeSalaryToLPA(n);
    // Hide the decimal place if the LPA amount is a perfect whole number to keep the UI clean
    const display = lpa % 1 === 0 ? lpa : lpa.toFixed(1);
    return `₹${display} LPA`;
};
