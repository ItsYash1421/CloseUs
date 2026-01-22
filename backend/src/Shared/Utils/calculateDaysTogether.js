const calculateDaysTogether = (anniversary) => {
    // IST is UTC+5:30
    const IST_OFFSET_MS = 5.5 * 60 * 60 * 1000;

    // Get current time in IST
    const nowUTC = new Date();
    const nowIST = new Date(nowUTC.getTime() + IST_OFFSET_MS);

    // Get start date in IST
    const startUTC = new Date(anniversary);
    const startIST = new Date(startUTC.getTime() + IST_OFFSET_MS);

    // Reset both to midnight IST for accurate day counting
    const nowISTMidnight = new Date(nowIST.getFullYear(), nowIST.getMonth(), nowIST.getDate());
    const startISTMidnight = new Date(startIST.getFullYear(), startIST.getMonth(), startIST.getDate());

    const diffTime = Math.abs(nowISTMidnight - startISTMidnight);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
};

module.exports = calculateDaysTogether;
