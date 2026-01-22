import React from 'react';
import { Key, MessageCircle, Heart, Lock, Smile, Gamepad2 } from 'lucide-react';

// Import Assets
import ChatImg from '../assets/Chat.png';
import GamesImg from '../assets/Games.png';
import MemoriesImg from '../assets/MEMORIES.png';
import JourneyImg from '../assets/OurJourney.png';

const FeatureCard = ({ icon: Icon, title, desc }) => (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-red-50 hover:shadow-lg hover:border-red-100 transition-all duration-300">
        <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center mb-4 text-[var(--color-primary)]">
            <Icon size={24} />
        </div>
        <h3 className="text-lg font-bold mb-2 text-[#2B2B2B]">{title}</h3>
        <p className="text-sm text-gray-500">{desc}</p>
    </div>
);

const FeatureSection = ({ title, subtitle, desc, align = 'left', visual }) => {
    return (
        <div
            className={`py-16 md:py-24 flex flex-col md:flex-row items-center gap-12 md:gap-16 ${align === 'right' ? 'md:flex-row-reverse' : ''}`}
        >
            <div className="flex-1">
                <span className="text-[var(--color-primary)] font-bold tracking-wider uppercase text-sm mb-3 block opacity-80">
                    {subtitle}
                </span>
                <h2 className="text-3xl md:text-4xl font-bold mb-6 text-[#2B2B2B] leading-tight">
                    {title}
                </h2>
                <p className="text-base md:text-lg text-gray-600 mb-6 leading-relaxed max-w-lg">
                    {desc}
                </p>

                <div className="flex flex-col gap-3 mb-6">
                    <div className="flex items-center gap-3 text-base text-gray-700">
                        <div className="w-6 h-6 rounded-full bg-red-100 text-[var(--color-primary)] flex items-center justify-center text-xs font-bold">
                            ✓
                        </div>
                        Designed exclusively for two people
                    </div>
                    <div className="flex items-center gap-3 text-base text-gray-700">
                        <div className="w-6 h-6 rounded-full bg-red-100 text-[var(--color-primary)] flex items-center justify-center text-xs font-bold">
                            ✓
                        </div>
                        End-to-end encrypted & secure
                    </div>
                    <div className="flex items-center gap-3 text-base text-gray-700">
                        <div className="w-6 h-6 rounded-full bg-red-100 text-[var(--color-primary)] flex items-center justify-center text-xs font-bold">
                            ✓
                        </div>
                        Real-time sync across all devices
                    </div>
                </div>
            </div>

            <div className="flex-1 w-full flex justify-center">{visual}</div>
        </div>
    );
};

const FeatureShowcase = () => {
    return (
        <section id="features" className="py-20 bg-white relative overflow-hidden">
            <div className="container px-4 max-w-6xl mx-auto">
                {/* Intro Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-24 max-w-5xl mx-auto">
                    <FeatureCard
                        icon={Lock}
                        title="Private Pairing"
                        desc="Unique key access for just the two of you."
                    />
                    <FeatureCard
                        icon={Smile}
                        title="Daily Squeeze"
                        desc="Fun questions to spark conversation."
                    />
                    <FeatureCard
                        icon={MessageCircle}
                        title="Heartbeat Chat"
                        desc="Feel their presence while typing."
                    />
                    <FeatureCard
                        icon={Gamepad2}
                        title="Couple Games"
                        desc="Play & explore each other's minds."
                    />
                </div>

                {/* Feature 1: Chat */}
                <FeatureSection
                    subtitle="Heartbeat Chat"
                    title="Feel closer, even when apart."
                    desc="Experience a messaging space that feels truly alive. See your partner's heartbeat animation when they're typing, share photos and voice notes instantly, and express emotions with exclusive couple stickers. Every message strengthens your bond."
                    align="left"
                    visual={
                        <div className="w-full max-w-[240px] mx-auto">
                            <img
                                src={ChatImg}
                                alt="Heartbeat Chat Interface"
                                loading="eager"
                                className="w-full h-auto object-contain rounded-2xl shadow-xl hover:scale-105 hover:shadow-2xl transition-all duration-500"
                            />
                        </div>
                    }
                />

                {/* Feature 2: Games/Questions */}
                <FeatureSection
                    subtitle="Fun & Games"
                    title="Play, Laugh, Connect."
                    desc="From 'Never Have I Ever' to deep bonding questions and interactive challenges. Discover new sides of your partner every day. Keep the spark alive with games designed specifically for couples to grow closer together."
                    align="right"
                    visual={
                        <div className="w-full max-w-[240px] mx-auto">
                            <img
                                src={GamesImg}
                                alt="Couple Games Interface"
                                loading="eager"
                                className="w-full h-auto object-contain rounded-2xl shadow-xl hover:scale-105 hover:shadow-2xl transition-all duration-500"
                            />
                        </div>
                    }
                />

                {/* Feature 3: Journey/Memories */}
                <FeatureSection
                    subtitle="Shared Memories"
                    title="Your Love Story, Documented."
                    desc="Track your journey together with a beautiful timeline showing exactly how long you've been together—down to the second. Create a shared digital scrapbook with photos, videos, and moments that matter. Your love story, perfectly preserved."
                    align="left"
                    visual={
                        <div className="w-full max-w-[240px] mx-auto">
                            <img
                                src={JourneyImg}
                                alt="Relationship Timeline Interface"
                                loading="eager"
                                className="w-full h-auto object-contain rounded-2xl shadow-xl hover:scale-105 hover:shadow-2xl transition-all duration-500"
                            />
                        </div>
                    }
                />

                {/* Feature 4: Daily Squeeze */}
                <FeatureSection
                    subtitle="Daily Squeeze"
                    title="A New Question Every Day."
                    desc="Answer thought-provoking questions about your relationship daily—from fun and lighthearted to deep and meaningful. The twist? You can't see their answer until you reveal yours! Build understanding and create a daily ritual of connection."
                    align="right"
                    visual={
                        <div className="w-full max-w-[240px] mx-auto">
                            <img
                                src={MemoriesImg}
                                alt="Daily Questions Interface"
                                loading="eager"
                                className="w-full h-auto object-contain rounded-2xl shadow-xl hover:scale-105 hover:shadow-2xl transition-all duration-500"
                            />
                        </div>
                    }
                />
            </div>
        </section>
    );
};

export default FeatureShowcase;
