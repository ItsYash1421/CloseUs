// ------------------------------------------------------------------
// Calculate Time Together (Years, Months, Days)
// ------------------------------------------------------------------
const calculateTimeTogether = (startDate) => {
    const IST_OFFSET_MS = 5.5 * 60 * 60 * 1000;

    const start = new Date(startDate);
    const now = new Date();

    const startIST = start.getTime() + IST_OFFSET_MS;
    const nowIST = now.getTime() + IST_OFFSET_MS;

    const msPerDay = 1000 * 60 * 60 * 24;
    const startDay = Math.floor(startIST / msPerDay);
    const nowDay = Math.floor(nowIST / msPerDay);

    const diffDays = nowDay - startDay;

    // ------------------------------------------------------------------
    // Improved Month/Year Calculation
    // ------------------------------------------------------------------

    const date1 = new Date(startDay * msPerDay);
    const date2 = new Date(nowDay * msPerDay);

    let years = date2.getUTCFullYear() - date1.getUTCFullYear();
    let months = date2.getUTCMonth() - date1.getUTCMonth();
    let days = date2.getUTCDate() - date1.getUTCDate();

    if (days < 0) {
        months--;

        const prevMonth = new Date(date2.getUTCFullYear(), date2.getUTCMonth(), 0);
        days += prevMonth.getUTCDate();
    }

    if (months < 0) {
        years--;
        months += 12;
    }

    return {
        days: diffDays,
        months: months + years * 12,
        years: years,
    };
};

module.exports = calculateTimeTogether;
