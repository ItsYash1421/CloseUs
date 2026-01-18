import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Smartphone } from 'lucide-react';

const CTA = () => {
    return (
        <section className="py-20 bg-gradient-to-br from-[#FFE6E1] to-[#FFF5F5] relative overflow-hidden">
            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-red-200 rounded-full blur-3xl opacity-30"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-pink-200 rounded-full blur-3xl opacity-20"></div>

            <div className="container px-4 relative z-10">
                <div className="max-w-4xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-4xl md:text-6xl font-bold mb-6 text-gray-800 leading-tight">
                            Ready to grow closer<br />with your partner?
                        </h2>
                        <p className="text-lg md:text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
                            Join thousands of couples who are building stronger, more meaningful relationships every single day.
                        </p>

                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
                            <Link to="/early-access" className="group bg-[var(--color-primary)] text-white px-8 py-4 rounded-full font-bold shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all flex items-center gap-2 text-lg">
                                Get Early Access
                                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                            </Link>
                            {/* Download App button hidden */}
                        </div>

                        <div className="flex items-center justify-center gap-6 text-sm text-gray-500">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-green-400"></div>
                                <span>Free to start</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-green-400"></div>
                                <span>No credit card</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-green-400"></div>
                                <span>Cancel anytime</span>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default CTA;
