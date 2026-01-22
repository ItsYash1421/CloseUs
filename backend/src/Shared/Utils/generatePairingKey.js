const generatePairingKey = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let key = '';
    for (let i = 0; i < 6; i++) {
        key += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return key;
};

module.exports = generatePairingKey;
