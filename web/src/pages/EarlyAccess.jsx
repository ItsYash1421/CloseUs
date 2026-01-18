import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Mail, Check, Sparkles, Lock, Heart, Zap } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

const EarlyAccess = () => {
    const [name, setName] = useState('');
    const [yourEmail, setYourEmail] = useState('');
    const [partnerEmail, setPartnerEmail] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
            const response = await fetch(`${apiUrl}/api/web/early-access`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name,
                    email: yourEmail,
                    partnerEmail
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                // Handle duplication specific error message
                if (response.status === 409) {
                    throw new Error('This email is already on the waitlist!');
                }
                throw new Error(data.error || 'Something went wrong');
            }

            toast.success("You've joined the waitlist! Check your email.");
            setSubmitted(true);
            setName('');
            setYourEmail('');
            setPartnerEmail('');
        } catch (err) {
            toast.error(err.message, {
                style: {
                    borderRadius: '10px',
                    background: '#FEF2F2',
                    color: '#B91C1C',
                },
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[var(--color-bg-soft)]">
            <Navbar />
            <Toaster
                position="bottom-center"
                reverseOrder={false}
                containerStyle={{
                    zIndex: 99999
                }}
            />

            <main className="pt-[var(--header-height)]">
                {/* Hero Section */}
                <section className="py-20 bg-gradient-to-br from-[#FFE6E1] to-[#FFF5F5] relative overflow-hidden">
                    {/* Decorative Elements */}
                    <div className="absolute top-0 right-0 w-96 h-96 bg-red-200 rounded-full blur-3xl opacity-30"></div>
                    <div className="absolute bottom-0 left-0 w-96 h-96 bg-pink-200 rounded-full blur-3xl opacity-20"></div>

                    <div className="container px-4 relative z-10">
                        <div className="max-w-3xl mx-auto text-center">
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-red-100 rounded-full text-[var(--color-primary)] text-sm font-semibold mb-6 shadow-sm">
                                <Sparkles size={16} />
                                <span>Join the Waitlist</span>
                            </div>

                            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-[#2B2B2B]">
                                Be among the first
                                <br />
                                <span className="text-gradient">couples to connect.</span>
                            </h1>

                            <p className="text-xl text-gray-600 mb-12 leading-relaxed">
                                Join our exclusive waitlist and get early access to CloseUs. Plus, enjoy <span className="font-bold text-[var(--color-primary)]">lifetime premium features</span> when we launch.
                            </p>

                            {!submitted ? (
                                <form onSubmit={handleSubmit} className="max-w-md mx-auto">
                                    <div className="bg-white p-8 rounded-3xl shadow-xl border border-red-50">
                                        <h3 className="text-2xl font-bold mb-6 text-[#2B2B2B]">Join Waitlist as a Couple</h3>

                                        {/* Your Name */}
                                        <div className="mb-5">
                                            <label className="block text-left font-semibold text-gray-700 mb-2 text-sm">
                                                Your Name
                                            </label>
                                            <div className="relative">
                                                <input
                                                    type="text"
                                                    value={name}
                                                    onChange={(e) => setName(e.target.value)}
                                                    placeholder="John Doe"
                                                    required
                                                    className="w-full px-4 py-3 pl-11 border-2 border-gray-200 rounded-xl focus:border-[var(--color-primary)] focus:outline-none transition-colors text-gray-800"
                                                />
                                                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                                                    <Sparkles size={18} />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Your Email */}
                                        <div className="mb-5">
                                            <label className="block text-left font-semibold text-gray-700 mb-2 text-sm">
                                                Your Email
                                            </label>
                                            <div className="relative">
                                                <input
                                                    type="email"
                                                    value={yourEmail}
                                                    onChange={(e) => setYourEmail(e.target.value)}
                                                    placeholder="you@example.com"
                                                    required
                                                    className="w-full px-4 py-3 pl-11 border-2 border-gray-200 rounded-xl focus:border-[var(--color-primary)] focus:outline-none transition-colors text-gray-800"
                                                />
                                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                            </div>
                                        </div>

                                        {/* Partner's Email */}
                                        <div className="mb-6">
                                            <label className="block text-left font-semibold text-gray-700 mb-2 text-sm">
                                                Partner's Email
                                            </label>
                                            <div className="relative">
                                                <input
                                                    type="email"
                                                    value={partnerEmail}
                                                    onChange={(e) => setPartnerEmail(e.target.value)}
                                                    placeholder="partner@example.com"
                                                    required
                                                    className="w-full px-4 py-3 pl-11 border-2 border-gray-200 rounded-xl focus:border-[var(--color-primary)] focus:outline-none transition-colors text-gray-800"
                                                />
                                                <Heart className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                            </div>
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="w-full bg-[var(--color-primary)] text-white px-8 py-4 rounded-xl font-bold shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {loading ? 'Joining Waitlist...' : 'Join Waitlist'}
                                        </button>

                                        <p className="text-xs text-gray-500 mt-4">
                                            No spam, ever. Unsubscribe anytime.
                                        </p>
                                    </div>
                                </form>
                            ) : (
                                <div className="max-w-md mx-auto bg-white p-8 rounded-3xl shadow-xl border border-green-100">
                                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Check size={32} className="text-green-600" />
                                    </div>
                                    <h3 className="text-2xl font-bold mb-2 text-[#2B2B2B]">You're on the waitlist!</h3>
                                    <p className="text-gray-600 mb-6">
                                        Check both inboxes for confirmation emails. We'll notify you both as soon as we launch.
                                    </p>
                                    <button
                                        onClick={() => setSubmitted(false)}
                                        className="text-[var(--color-primary)] font-semibold hover:underline"
                                    >
                                        Add another couple
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </section>

                {/* Benefits Section */}
                <section className="py-20">
                    <div className="container px-4">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl font-bold mb-4 text-[#2B2B2B]">Early Access Benefits</h2>
                            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                                Get more by joining early
                            </p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                            <div className="bg-white p-8 rounded-3xl shadow-lg text-center hover:shadow-xl transition-all duration-300">
                                <div className="w-16 h-16 bg-purple-50 rounded-2xl flex items-center justify-center mx-auto mb-6 text-purple-500">
                                    <Sparkles size={32} />
                                </div>
                                <h3 className="text-xl font-bold mb-3 text-[#2B2B2B]">Lifetime Premium</h3>
                                <p className="text-gray-600">
                                    Get free lifetime access to all premium features worth ₹1,188/year
                                </p>
                            </div>

                            <div className="bg-white p-8 rounded-3xl shadow-lg text-center hover:shadow-xl transition-all duration-300">
                                <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-6 text-blue-500">
                                    <Zap size={32} />
                                </div>
                                <h3 className="text-xl font-bold mb-3 text-[#2B2B2B]">First to Try</h3>
                                <p className="text-gray-600">
                                    Be the first to experience new features before anyone else
                                </p>
                            </div>

                            <div className="bg-white p-8 rounded-3xl shadow-lg text-center hover:shadow-xl transition-all duration-300">
                                <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-6 text-[var(--color-primary)]">
                                    <Heart size={32} />
                                </div>
                                <h3 className="text-xl font-bold mb-3 text-[#2B2B2B]">Shape the Future</h3>
                                <p className="text-gray-600">
                                    Your feedback will directly influence what we build next
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Trust Section */}
                <section className="py-20 bg-gradient-to-br from-[#FFF5F5] to-white">
                    <div className="container px-4">
                        <div className="max-w-4xl mx-auto text-center">
                            <div className="bg-white p-12 rounded-3xl shadow-xl">
                                <Lock size={48} className="text-[var(--color-primary)] mx-auto mb-6" />
                                <h2 className="text-3xl font-bold mb-4 text-[#2B2B2B]">Your Privacy Matters</h2>
                                <p className="text-lg text-gray-600 leading-relaxed">
                                    We'll never share your emails with anyone. You're signing up for early access to CloseUs—a private app designed exclusively for couples. We respect your inbox.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
};

export default EarlyAccess;
