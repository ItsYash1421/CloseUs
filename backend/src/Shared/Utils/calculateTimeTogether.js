const calculateTimeTogether = (startDate) => {
    // IST is UTC+5:30
    const IST_OFFSET_MS = 5.5 * 60 * 60 * 1000;

    const start = new Date(startDate);
    const now = new Date();

    // Convert to IST timestamps
    const startIST = start.getTime() + IST_OFFSET_MS;
    const nowIST = now.getTime() + IST_OFFSET_MS;

    // Floor to get the day number (independent of time)
    const msPerDay = 1000 * 60 * 60 * 24;
    const startDay = Math.floor(startIST / msPerDay);
    const nowDay = Math.floor(nowIST / msPerDay);

    const diffDays = nowDay - startDay;

    // Calculate approx months/years for display
    // Note: For precise calendar month difference we'd need Date objects, 
    // but this approximation is usually sufficient for "Time Together" stats
    // or we can reconstruct valid Dates if needed.

    // Improved month/year calc:
    // Reconstruct dates at UTC noon to avoid boundary issues
    const date1 = new Date(startDay * msPerDay);
    const date2 = new Date(nowDay * msPerDay);

    let years = date2.getUTCFullYear() - date1.getUTCFullYear();
    let months = date2.getUTCMonth() - date1.getUTCMonth();
    let days = date2.getUTCDate() - date1.getUTCDate();

    if (days < 0) {
        months--;
        // Get days in previous month
        const prevMonth = new Date(date2.getUTCFullYear(), date2.getUTCMonth(), 0);
        days += prevMonth.getUTCDate();
    }

    if (months < 0) {
        years--;
        months += 12;
    }

    return {
        days: diffDays, // Total days
        months: months + (years * 12), // Total months
        years: years
    };
};

module.exports = calculateTimeTogether;
