const axios = require('axios');

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';
const MODEL = 'meta-llama/llama-3.1-8b-instruct';

class AIService {
    /**
     * Generate daily questions using OpenRouter (Llama)
     * @param {number} count Number of questions to generate
     * @returns {Promise<string[]>} Array of questions
     */
    async generateQuestions(count = 20) {
        try {
            // Validate API key
            if (!OPENROUTER_API_KEY) {
                console.error('❌ OPENROUTER_API_KEY is not set in environment variables');
                throw new Error('OPENROUTER_API_KEY is required');
            }

            const prompt = `Generate exactly ${count} unique, engaging, and thoughtful relationship questions for couples. 
            The questions should vary between fun, deep, romantic, and future-oriented. 
            Return ONLY the questions, one per line. Do not number them. Do not add any intro or outro text. Just the questions.`;

            console.log('🤖 Calling OpenRouter API...');
            const response = await axios.post(OPENROUTER_URL, {
                model: MODEL,
                messages: [
                    { role: 'user', content: prompt }
                ]
            }, {
                headers: {
                    'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
                    'Content-Type': 'application/json',
                    'HTTP-Referer': 'http://localhost',
                    'X-Title': 'CloseUs'
                },
                timeout: 30000 // 30 second timeout
            });

            if (response.data && response.data.choices && response.data.choices[0]?.message?.content) {
                const text = response.data.choices[0].message.content;
                // Split by newline and filter empty lines
                const questions = text.split('\n')
                    .map(q => q.trim())
                    .filter(q => q.length > 0 && !q.startsWith('Here are') && !q.startsWith('**') && !q.startsWith('Sure'));

                console.log(`✅ Generated ${questions.length} questions via OpenRouter`);
                return questions.slice(0, count); // Ensure we only return the requested count
            }

            console.error('❌ Invalid response structure from OpenRouter:', response.data);
            throw new Error('Invalid response structure from OpenRouter API');
        } catch (error) {
            console.error('❌ AI Service Error:', error.response?.data || error.message);
            console.log('⚠️ Using fallback questions');

            // Fallback questions in case of API failure
            return [
                "What's one adventure you'd love for us to take together?",
                "What is your favorite memory of us so far?",
                "How do you feel most loved by me?",
                "What is one goal you want us to achieve this year?",
                "What's the funniest thing that has happened to us?",
                "If we could live anywhere in the world, where would it be?",
                "What song reminds you of us?",
                "What's your favorite thing about our relationship?",
                "If you could describe our love in three words, what would they be?",
                "What's something new you'd like us to try together?",
                "What do you think our future looks like in 5 years?",
                "What's the most romantic thing I've ever done for you?",
                "What's one thing you want to learn about me?",
                "How can I support you better?",
                "What's your dream date night?",
                "What tradition would you like us to start?",
                "What's one thing that always makes you smile about us?",
                "If we could relive one day together, which would it be?",
                "What's your favorite way to spend time with me?",
                "What makes you feel closest to me?"
            ];
        }
    }
}

module.exports = new AIService();
