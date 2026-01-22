import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Heart, Users, Target, Zap } from 'lucide-react';

const AboutUs = () => {
    return (
        <div className="min-h-screen bg-[var(--color-bg-soft)]">
            <Navbar />

            <main className="pt-[var(--header-height)]">
                {/* Hero Section */}
                <section className="py-20 bg-gradient-to-br from-[#FFE6E1] to-[#FFF5F5]">
                    <div className="container px-4 text-center">
                        <h1 className="text-5xl md:text-6xl font-bold mb-6 text-[#2B2B2B]">
                            Built with
                            <span className="text-gradient"> ❤️ </span>
                            for couples.
                        </h1>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                            CloseUs was created to help couples build stronger, more meaningful
                            relationships in the digital age.
                        </p>
                    </div>
                </section>

                {/* Our Story */}
                <section className="py-20">
                    <div className="container px-4">
                        <div className="max-w-4xl mx-auto">
                            <div className="bg-white p-12 rounded-3xl shadow-lg">
                                <h2 className="text-4xl font-bold mb-6 text-[#2B2B2B]">
                                    Our Story
                                </h2>
                                <div className="prose prose-lg text-gray-600 leading-relaxed space-y-4">
                                    <p>
                                        CloseUs started from a simple observation: while social
                                        media connects us to hundreds of people, there wasn't a
                                        dedicated space designed purely for two people in a
                                        relationship.
                                    </p>
                                    <p>
                                        We believed couples deserved their own private digital
                                        sanctuary—a place free from distractions, ads, and the noise
                                        of social networks. A place where they could truly focus on
                                        each other.
                                    </p>
                                    <p>
                                        So we built CloseUs: a private, secure, and beautifully
                                        designed app that helps couples stay connected, build
                                        memories, and grow closer together—whether they're sitting
                                        next to each other or miles apart.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Our Values */}
                <section className="py-20 bg-gradient-to-br from-[#FFF5F5] to-white">
                    <div className="container px-4">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-[#2B2B2B]">
                                What We Believe In
                            </h2>
                            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                                The values that guide everything we build
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
                            <div className="bg-white p-8 rounded-3xl shadow-lg text-center hover:shadow-xl transition-all duration-300">
                                <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-6 text-[var(--color-primary)]">
                                    <Heart size={32} />
                                </div>
                                <h3 className="text-xl font-bold mb-3 text-[#2B2B2B]">
                                    Privacy First
                                </h3>
                                <p className="text-gray-600">
                                    Your relationship is yours alone. We never share your data or
                                    show ads.
                                </p>
                            </div>

                            <div className="bg-white p-8 rounded-3xl shadow-lg text-center hover:shadow-xl transition-all duration-300">
                                <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-6 text-blue-500">
                                    <Users size={32} />
                                </div>
                                <h3 className="text-xl font-bold mb-3 text-[#2B2B2B]">
                                    Built for Two
                                </h3>
                                <p className="text-gray-600">
                                    Every feature is designed exclusively for couples, not groups or
                                    networks.
                                </p>
                            </div>

                            <div className="bg-white p-8 rounded-3xl shadow-lg text-center hover:shadow-xl transition-all duration-300">
                                <div className="w-16 h-16 bg-purple-50 rounded-2xl flex items-center justify-center mx-auto mb-6 text-purple-500">
                                    <Target size={32} />
                                </div>
                                <h3 className="text-xl font-bold mb-3 text-[#2B2B2B]">
                                    Meaningful Connection
                                </h3>
                                <p className="text-gray-600">
                                    We focus on quality over quantity, depth over superficiality.
                                </p>
                            </div>

                            <div className="bg-white p-8 rounded-3xl shadow-lg text-center hover:shadow-xl transition-all duration-300">
                                <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center mx-auto mb-6 text-green-500">
                                    <Zap size={32} />
                                </div>
                                <h3 className="text-xl font-bold mb-3 text-[#2B2B2B]">
                                    Always Improving
                                </h3>
                                <p className="text-gray-600">
                                    We listen to couples and constantly add features that matter.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Contact CTA */}
                <section className="py-20">
                    <div className="container px-4">
                        <div className="max-w-4xl mx-auto text-center bg-gradient-to-br from-red-50 to-pink-50 p-12 rounded-3xl">
                            <h2 className="text-4xl font-bold mb-4 text-[#2B2B2B]">
                                Want to know more?
                            </h2>
                            <p className="text-lg text-gray-600 mb-8">
                                We'd love to hear from you. Reach out anytime!
                            </p>
                            <a
                                href="mailto:closeus1421@gmail.com"
                                className="inline-block bg-[var(--color-primary)] text-white px-8 py-4 rounded-full font-bold shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all"
                            >
                                Get in Touch
                            </a>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
};

export default AboutUs;
