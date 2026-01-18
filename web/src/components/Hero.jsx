import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';

// Import branded logo for the phone mockup
import LogoImg from '../assets/LOGO.png';

const Hero = () => {
    return (
        <section className="relative min-h-screen pt-[var(--header-height)] flex items-center overflow-hidden">
            {/* Background Blobs */}
            <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-[#FFE6E1] rounded-full blur-[120px] opacity-50 pointer-events-none"></div>
            <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-[#E3F9EC] rounded-full blur-[120px] opacity-40 pointer-events-none"></div>

            <div className="container grid md:grid-cols-2 gap-16 items-center relative z-10 w-full px-4 py-12">
                {/* Text Content */}
                <div className="text-left order-2 md:order-1">
                    <div>
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-red-100 rounded-full text-[var(--color-primary)] text-sm font-semibold mb-6 shadow-sm">
                            <Sparkles size={16} className="text-[var(--color-primary)]" />
                            <span>Private Space for Two</span>
                        </div>

                        <h1 className="text-5xl md:text-7xl font-bold mb-6 text-[#2B2B2B] leading-[1.1]">
                            Closer than <br />
                            <span className="text-gradient">ever.</span>
                        </h1>

                        <p className="text-lg md:text-xl text-[#6B6B6B] mb-8 max-w-lg leading-relaxed">
                            Your private digital sanctuary. Built exclusively for two hearts, one relationship.
                        </p>

                        <div className="flex flex-wrap gap-4 mb-10">
                            <button className="group bg-[var(--color-primary)] text-white px-8 py-4 rounded-full font-bold shadow-[0_10px_25px_rgba(255,107,107,0.3)] hover:shadow-[0_15px_30px_rgba(255,107,107,0.4)] hover:-translate-y-1 transition-all flex items-center gap-2">
                                Get Early Access
                                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                            <a href="#how-it-works" className="bg-white text-[#2B2B2B] px-8 py-4 rounded-full font-bold border-2 border-gray-200 hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-all">
                                How it works
                            </a>
                        </div>

                        {/* Social proof - 2,000+ couples */}
                        {/* <div className="flex items-center gap-4 text-sm text-gray-500">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-gradient-to-br from-red-200 to-pink-200" />
                ))}
              </div>
              <div>
                <p className="font-semibold text-gray-700">2,000+ couples</p>
                <p className="text-xs">already connected</p>
              </div>
            </div> */}
                    </div>
                </div>

                {/* Visual Content - Phone with Logo */}
                <div className="flex justify-center md:justify-end relative order-1 md:order-2">
                    {/* Decorative rotating border */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] border-2 border-dashed border-red-200 rounded-full opacity-40 animate-spin-slow"></div>

                    {/* Phone Frame with Branded Logo */}
                    <div className="relative z-10 hover:scale-105 transition-transform duration-300">
                        <div className="relative w-[220px] md:w-[260px] aspect-[9/19.5] bg-black rounded-[2.5rem] p-2.5 shadow-2xl">
                            {/* Phone Notch */}
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-6 bg-black rounded-b-2xl z-20"></div>

                            {/* Screen Content - Using branded logo */}
                            <div className="w-full h-full bg-gradient-to-br from-[#1a1a2e] to-[#2a2a3e] rounded-[2rem] overflow-hidden relative flex items-center justify-center p-4">
                                <img
                                    src={LogoImg}
                                    alt="CloseUs App"
                                    className="w-[85%] h-auto object-contain drop-shadow-2xl"
                                />
                            </div>
                        </div>

                        {/* Floating Stats Pills - Smaller */}
                        <div className="absolute -top-2 -left-2 bg-white px-3 py-2 rounded-xl shadow-lg border border-red-50 z-30 animate-float">
                            <div className="flex items-center gap-2">
                                <div className="w-6 h-6 bg-gradient-to-br from-red-400 to-pink-400 rounded-full flex items-center justify-center text-white text-xs">
                                    ❤️
                                </div>
                                <div className="text-left">
                                    <div className="text-[9px] text-gray-400 font-bold uppercase">Daily</div>
                                    <div className="text-xs font-bold text-gray-800">Answered</div>
                                </div>
                            </div>
                        </div>

                        <div className="absolute -bottom-2 -right-2 bg-white px-3 py-2 rounded-xl shadow-lg border border-green-50 z-30 animate-float-delayed">
                            <div className="flex items-center gap-2">
                                <div className="w-6 h-6 bg-gradient-to-br from-green-400 to-emerald-400 rounded-full flex items-center justify-center text-white text-xs">
                                    💬
                                </div>
                                <div className="text-left">
                                    <div className="text-[9px] text-gray-400 font-bold uppercase">Chat</div>
                                    <div className="text-xs font-bold text-gray-800">Active</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
