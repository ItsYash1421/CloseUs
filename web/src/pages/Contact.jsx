import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Mail, MessageCircle, Send } from 'lucide-react';

const Contact = () => {
    return (
        <div className="min-h-screen bg-[var(--color-bg-soft)]">
            <Navbar />

            <main className="pt-[var(--header-height)]">
                {/* Hero Section */}
                <section className="py-20 bg-gradient-to-br from-[#FFE6E1] to-[#FFF5F5]">
                    <div className="container px-4 text-center">
                        <h1 className="text-5xl md:text-6xl font-bold mb-6 text-[#2B2B2B]">
                            Let's
                            <span className="text-gradient"> connect.</span>
                        </h1>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                            Have questions, feedback, or just want to say hi? We'd love to hear from you!
                        </p>
                    </div>
                </section>

                {/* Contact Options */}
                <section className="py-20">
                    <div className="container px-4">
                        <div className="max-w-5xl mx-auto">
                            <div className="grid md:grid-cols-3 gap-8 mb-16">
                                <div className="bg-white p-8 rounded-3xl shadow-lg text-center hover:shadow-xl transition-all duration-300">
                                    <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-6 text-[var(--color-primary)]">
                                        <Mail size={32} />
                                    </div>
                                    <h3 className="text-xl font-bold mb-3 text-[#2B2B2B]">Email Us</h3>
                                    <p className="text-gray-600 mb-4">
                                        Send us an email anytime
                                    </p>
                                    <a
                                        href="mailto:closeus1421@gmail.com"
                                        className="text-[var(--color-primary)] font-semibold hover:underline"
                                    >
                                        closeus1421@gmail.com
                                    </a>
                                </div>

                                <div className="bg-white p-8 rounded-3xl shadow-lg text-center hover:shadow-xl transition-all duration-300">
                                    <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-6 text-blue-500">
                                        <MessageCircle size={32} />
                                    </div>
                                    <h3 className="text-xl font-bold mb-3 text-[#2B2B2B]">Support</h3>
                                    <p className="text-gray-600 mb-4">
                                        Need help with the app?
                                    </p>
                                    <a
                                        href="mailto:closeus1421@gmail.com?subject=Support Request"
                                        className="text-blue-500 font-semibold hover:underline"
                                    >
                                        Get Support
                                    </a>
                                </div>

                                <div className="bg-white p-8 rounded-3xl shadow-lg text-center hover:shadow-xl transition-all duration-300">
                                    <div className="w-16 h-16 bg-purple-50 rounded-2xl flex items-center justify-center mx-auto mb-6 text-purple-500">
                                        <Send size={32} />
                                    </div>
                                    <h3 className="text-xl font-bold mb-3 text-[#2B2B2B]">Feedback</h3>
                                    <p className="text-gray-600 mb-4">
                                        Share your ideas with us
                                    </p>
                                    <a
                                        href="mailto:closeus1421@gmail.com?subject=Feedback"
                                        className="text-purple-500 font-semibold hover:underline"
                                    >
                                        Send Feedback
                                    </a>
                                </div>
                            </div>

                            {/* Main Contact Card */}
                            <div className="bg-gradient-to-br from-red-50 to-pink-50 p-12 rounded-3xl shadow-xl text-center">
                                <h2 className="text-4xl font-bold mb-4 text-[#2B2B2B]">Get in Touch</h2>
                                <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
                                    Whether you have a question about features, pricing, partnerships, or anything else, our team is ready to answer all your questions.
                                </p>

                                <div className="max-w-md mx-auto">
                                    <div className="bg-white p-6 rounded-2xl shadow-lg mb-6">
                                        <div className="flex items-center justify-center gap-3 text-lg">
                                            <Mail size={24} className="text-[var(--color-primary)]" />
                                            <a
                                                href="mailto:closeus1421@gmail.com"
                                                className="text-[var(--color-primary)] font-semibold hover:underline"
                                            >
                                                closeus1421@gmail.com
                                            </a>
                                        </div>
                                    </div>

                                    <p className="text-sm text-gray-500">
                                        We typically respond within 24 hours
                                    </p>
                                </div>
                            </div>

                            {/* FAQ Link */}
                            <div className="mt-16 text-center">
                                <p className="text-gray-600 mb-4">Looking for quick answers?</p>
                                <a href="/#faq" className="text-[var(--color-primary)] font-semibold hover:underline">
                                    Check out our FAQ →
                                </a>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
};

export default Contact;
