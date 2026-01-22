import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Instagram, Mail } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-gradient-to-br from-[#FFF5F5] to-white pt-20 pb-10 border-t border-red-50">
            <div className="w-full max-w-7xl mx-auto px-6 md:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-16">
                    {/* Brand */}
                    <div className="md:col-span-2">
                        <h2 className="text-3xl font-bold font-[Poppins] text-[#2B2B2B] mb-3">
                            <span className="text-[var(--color-primary)]">Close</span>Us
                        </h2>
                        <p className="text-gray-600 max-w-sm mb-6 leading-relaxed">
                            A private digital space designed purely for two. Grow closer, stay
                            connected, build memories together.
                        </p>
                        <div className="flex gap-4">
                            <a
                                href="https://www.instagram.com/closeus_001"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-gray-600 hover:text-[var(--color-primary)] hover:shadow-md hover:scale-110 transition-all"
                            >
                                <Instagram size={20} />
                            </a>
                            <a
                                href="mailto:closeus1421@gmail.com"
                                className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-gray-600 hover:text-[var(--color-primary)] hover:shadow-md hover:scale-110 transition-all"
                            >
                                <Mail size={20} />
                            </a>
                        </div>
                    </div>

                    {/* Product */}
                    <div>
                        <h3 className="font-bold text-gray-800 mb-4">Product</h3>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link
                                    to="/features"
                                    className="text-gray-600 hover:text-[var(--color-primary)] transition-colors"
                                >
                                    Features
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/pricing"
                                    className="text-gray-600 hover:text-[var(--color-primary)] transition-colors"
                                >
                                    Pricing
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/roadmap"
                                    className="text-gray-600 hover:text-[var(--color-primary)] transition-colors"
                                >
                                    Roadmap
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Company */}
                    <div>
                        <h3 className="font-bold text-gray-800 mb-4">Company</h3>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link
                                    to="/about"
                                    className="text-gray-600 hover:text-[var(--color-primary)] transition-colors"
                                >
                                    About Us
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/contact"
                                    className="text-gray-600 hover:text-[var(--color-primary)] transition-colors"
                                >
                                    Contact
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-6">
                        <p>© 2026 CloseUs Team. All rights reserved.</p>
                        <a href="#" className="hover:text-[var(--color-primary)] transition-colors">
                            Privacy
                        </a>
                        <a href="#" className="hover:text-[var(--color-primary)] transition-colors">
                            Terms
                        </a>
                    </div>
                    <div className="flex items-center gap-2">
                        <span>Built with</span>
                        <Heart size={14} className="text-red-400 fill-red-400" />
                        <span>for couples.</span>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
