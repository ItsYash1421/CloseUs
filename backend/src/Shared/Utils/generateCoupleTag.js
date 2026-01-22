// ------------------------------------------------------------------
// Generate Couple Tag (e.g. #YashKhu)
// ------------------------------------------------------------------
const generateCoupleTag = (name1, name2) => {
    const firstName1 = name1.split(' ')[0];
    const firstName2 = name2.split(' ')[0];

    const part1 = firstName1.substring(0, 3);
    const part2 = firstName2.substring(0, 3);

    const capitalizedPart1 = part1.charAt(0).toUpperCase() + part1.slice(1).toLowerCase();
    const capitalizedPart2 = part2.charAt(0).toUpperCase() + part2.slice(1).toLowerCase();

    return `#${capitalizedPart1}${capitalizedPart2}`;
};

module.exports = generateCoupleTag;
