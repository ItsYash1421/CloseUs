const supabase = require('../Config/supabaseClient');

const joinWaitlist = async (req, res) => {
    try {
        const { name, email, partnerEmail } = req.body;

        if (!name || !email || !partnerEmail) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        const { data, error } = await supabase
            .from('early_access_users')
            .insert([{ name, email: email, partner_email: partnerEmail }])
            .select();

        if (error) {
            if (error.code === '23505') {
                return res.status(409).json({ error: 'Email already registered' });
            }
            throw error;
        }

        res.status(201).json({ message: 'Successfully joined waitlist', data });
    } catch (error) {
        console.error('Error joining waitlist:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = {
    joinWaitlist,
};
