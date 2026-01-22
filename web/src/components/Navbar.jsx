import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/Logo-Main.png';

const Navbar = () => {
    return (
        <nav
            className="fixed top-0 left-0 right-0 z-50 glass-panel"
            style={{ height: 'var(--header-height)' }}
        >
            <div className="w-full h-full flex items-center justify-between px-6 md:px-8">
                {/* Logo - Made Larger */}
                <Link to="/" className="h-16 md:h-[70px] flex items-center">
                    <img src={logo} alt="CloseUs" className="h-full w-auto object-contain" />
                </Link>

                <div className="flex items-center gap-6">
                    <a
                        href="/#features"
                        className="hidden md:block text-sm font-medium hover:text-[var(--color-primary)] transition-colors"
                    >
                        Features
                    </a>
                    <a
                        href="/#how-it-works"
                        className="hidden md:block text-sm font-medium hover:text-[var(--color-primary)] transition-colors"
                    >
                        How It Works
                    </a>

                    {/* Get App Button with Coming Soon Badge Inline */}
                    <Link
                        to="/early-access"
                        className="bg-[var(--color-primary)] text-white px-6 py-2.5 rounded-full font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all text-sm flex items-center gap-2"
                    >
                        Get Early Access
                        <span className="bg-yellow-400 text-[#2B2B2B] text-[10px] font-bold px-2 py-0.5 rounded-full">
                            Soon
                        </span>
                    </Link>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
