import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const faqs = [
    {
        question: 'Is CloseUs really just for two people?',
        answer: 'Yes! CloseUs is designed exclusively for couples. No groups, no friends list, no social feed. Just you and your partner in a private digital space.',
    },
    {
        question: 'How does the pairing process work?',
        answer: 'One partner creates an account and generates a unique pairing key. The other partner signs up and enters that key to connect. Once paired, you unlock your shared dashboard.',
    },
    {
        question: 'Is my data private and secure?',
        answer: 'Absolutely. Your conversations, photos, and answers are encrypted and stored securely. We never share your data with third parties, and only you and your partner can access your private space.',
    },
    {
        question: 'What happens to our data if we break up?',
        answer: 'You maintain full control. Either partner can unpair at any time from settings. You can choose to export your memories or delete everything permanently.',
    },
    {
        question: 'Do you offer a free version?',
        answer: 'Yes! CloseUs offers a generous free tier that includes daily questions, chat, and basic games. Premium features like advanced analytics and unlimited game categories are available with our paid plan.',
    },
    {
        question: 'Can we use CloseUs in a long-distance relationship?',
        answer: 'Definitely! CloseUs is perfect for long-distance couples. The real-time chat, daily questions, and shared timeline help you stay connected no matter the distance.',
    },
];

const FAQItem = ({ faq, index }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true }}
            className="border-b border-gray-200 last:border-0"
        >
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full py-5 flex items-center justify-between text-left hover:text-[var(--color-primary)] transition-colors group"
            >
                <span className="font-semibold text-lg pr-8">{faq.question}</span>
                <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.3 }}>
                    <ChevronDown
                        size={24}
                        className="text-gray-400 group-hover:text-[var(--color-primary)] transition-colors"
                    />
                </motion.div>
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                    >
                        <p className="pb-5 text-gray-600 leading-relaxed">{faq.answer}</p>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

const FAQ = () => {
    return (
        <section className="py-20 bg-white">
            <div className="container px-4">
                <div className="text-center mb-16">
                    <span className="text-[var(--color-primary)] font-bold tracking-wider uppercase text-sm mb-2 block">
                        FAQ
                    </span>
                    <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-800">
                        Questions? We've Got Answers.
                    </h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Everything you need to know about CloseUs.
                    </p>
                </div>

                <div className="max-w-3xl mx-auto bg-white rounded-3xl border border-gray-100 shadow-lg p-8">
                    {faqs.map((faq, index) => (
                        <FAQItem key={index} faq={faq} index={index} />
                    ))}
                </div>

                <div className="text-center mt-12">
                    <p className="text-gray-600 mb-4">Still have questions?</p>
                    <a
                        href="mailto:closeus1421@gmail.com"
                        className="text-[var(--color-primary)] font-semibold hover:underline"
                    >
                        Contact our team →
                    </a>
                </div>
            </div>
        </section>
    );
};

export default FAQ;
