const getNextMilestone = (days) => {
    let step;

    if (days < 100) step = 10;
    else if (days < 300) step = 25;
    else if (days < 700) step = 50;
    else step = 100;

    return Math.ceil(days / step) * step;
};

module.exports = getNextMilestone;
