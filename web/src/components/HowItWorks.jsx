import React from 'react';
import { UserPlus, Key, Heart, MessageCircle } from 'lucide-react';

const Step = ({ number, icon: Icon, title, desc, isLast }) => {
    return (
        <div className="relative flex flex-col items-center text-center group">

            {/* Step Number Badge */}
            <div className="mb-6 relative z-10">
                <span className="inline-block px-3 py-1 rounded-full bg-red-50 text-[var(--color-primary)] text-xs font-bold tracking-wider uppercase border border-red-100">
                    Step 0{number}
                </span>
            </div>

            {/* Icon Circle */}
            <div className="w-20 h-20 rounded-2xl bg-white border border-gray-100 shadow-xl flex items-center justify-center text-gray-700 mb-6 group-hover:scale-110 group-hover:shadow-2xl group-hover:border-[var(--color-primary)] group-hover:text-[var(--color-primary)] transition-all duration-300 relative z-10">
                <Icon size={32} />

                {/* Subtle pulse behind icon on hover */}
                <div className="absolute inset-0 bg-[var(--color-primary)] opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-300"></div>
            </div>

            <h3 className="text-xl font-bold mb-3 text-[#2B2B2B] group-hover:text-[var(--color-primary)] transition-colors">{title}</h3>
            <p className="text-sm text-gray-500 max-w-[250px] leading-relaxed">{desc}</p>

            {/* Connector Line - Modern Dashed Style */}
            {!isLast && (
                <div className="hidden md:block absolute top-[88px] left-[50%] w-full h-[2px] z-0">
                    <div className="w-full h-full border-t-2 border-dashed border-gray-200"></div>
                </div>
            )}
        </div>
    );
};

const HowItWorks = () => {
    return (
        <section id="how-it-works" className="py-24 bg-white relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-10 right-0 w-96 h-96 bg-red-50 rounded-full blur-3xl opacity-30"></div>
                <div className="absolute bottom-10 left-0 w-96 h-96 bg-pink-50 rounded-full blur-3xl opacity-30"></div>
            </div>

            <div className="container px-4 relative z-10">
                <div className="text-center mb-20">
                    <span className="text-[var(--color-primary)] font-bold tracking-wider uppercase text-sm mb-3 block">Simple Setup</span>
                    <h2 className="text-4xl md:text-5xl font-bold mb-6 text-[#2B2B2B]">Start your journey</h2>
                    <p className="text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed">
                        We've made it incredibly easy to create your private space. Just follow these simple steps.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8 max-w-7xl mx-auto relative">
                    <Step
                        number="1"
                        icon={UserPlus}
                        title="Create Account"
                        desc="Sign up instantly with your email or Google account. Safe, secure, and ready in seconds."
                        isLast={false}
                    />
                    <Step
                        number="2"
                        icon={Key}
                        title="Generate Key"
                        desc="One partner creates a unique, private key. This is the bridge to your shared world."
                        isLast={false}
                    />
                    <Step
                        number="3"
                        icon={Heart}
                        title="Link Partner"
                        desc="Share the key. Your partner enters it, and magically—you are connected."
                        isLast={false}
                    />
                    <Step
                        number="4"
                        icon={MessageCircle}
                        title="Start Connecting"
                        desc="Unlock daily questions, heartbeat chat, games, and memories together."
                        isLast={true}
                    />
                </div>
            </div>
        </section>
    );
};

export default HowItWorks;
