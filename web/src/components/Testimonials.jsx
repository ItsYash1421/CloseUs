import React from 'react';
import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';

const testimonials = [
    {
        name: 'Sarah & Mike',
        duration: 'Together for 2 years',
        text: "CloseUs brought back the spark in our long-distance relationship. The daily questions help us stay connected even when we're miles apart.",
        rating: 5,
    },
    {
        name: 'Priya & Arjun',
        duration: 'Together for 3 years',
        text: 'We love the privacy of having our own space. No distractions, just us. The games are fun and really help us understand each other better!',
        rating: 5,
    },
    {
        name: 'Emily & James',
        duration: 'Together for 5 years',
        text: "The anniversary counter and memory timeline are beautiful. It's like a digital scrapbook of our relationship. Highly recommend!",
        rating: 5,
    },
];

const TestimonialCard = ({ testimonial, delay }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay }}
            viewport={{ once: true }}
            className="bg-white p-8 rounded-3xl shadow-lg border border-red-50 hover:shadow-xl transition-shadow"
        >
            <div className="flex items-start mb-4">
                <Quote size={32} className="text-red-200" />
            </div>

            <p className="text-gray-700 mb-6 leading-relaxed italic">"{testimonial.text}"</p>

            <div className="flex items-center gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                    <span key={i} className="text-yellow-400 text-lg">
                        ★
                    </span>
                ))}
            </div>

            <div>
                <div className="font-bold text-gray-800">{testimonial.name}</div>
                <div className="text-sm text-gray-500">{testimonial.duration}</div>
            </div>
        </motion.div>
    );
};

const Testimonials = () => {
    return (
        <section className="py-20 bg-gradient-to-br from-white to-red-50">
            <div className="container px-4">
                <div className="text-center mb-16">
                    <span className="text-[var(--color-primary)] font-bold tracking-wider uppercase text-sm mb-2 block">
                        Testimonials
                    </span>
                    <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-800">
                        Loved by Couples Everywhere
                    </h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        See what real couples are saying about CloseUs.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {testimonials.map((testimonial, index) => (
                        <TestimonialCard
                            key={index}
                            testimonial={testimonial}
                            delay={index * 0.15}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Testimonials;
