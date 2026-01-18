import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const StatCard = ({ number, label, delay }) => {
    const [ref, inView] = useInView({ threshold: 0.5, triggerOnce: true });

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay }}
            className="text-center"
        >
            <div className="text-4xl md:text-5xl font-bold text-[var(--color-primary)] mb-2">{number}</div>
            <div className="text-sm md:text-base text-gray-600">{label}</div>
        </motion.div>
    );
};

const Stats = () => {
    return (
        <section className="py-16 bg-gradient-to-br from-red-50 to-pink-50">
            <div className="container">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
                    <StatCard number="2,000+" label="Active Couples" delay={0} />
                    <StatCard number="50,000+" label="Questions Answered" delay={0.1} />
                    <StatCard number="95%" label="Daily Engagement" delay={0.2} />
                    <StatCard number="4.9/5" label="Average Rating" delay={0.3} />
                </div>
            </div>
        </section>
    );
};

export default Stats;
