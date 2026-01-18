import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { MessageCircle, Heart, Gamepad2, Camera, Calendar, Lock, Share2, Bell } from 'lucide-react';

const features = [
    {
        icon: MessageCircle,
        title: "Heartbeat Chat",
        desc: "See your partner's heartbeat animation when they're typing. Share photos, voice notes, and exclusive couple stickers instantly.",
        highlights: ["Real-time typing indicators", "Voice messages", "Photo sharing", "Custom stickers"]
    },
    {
        icon: Gamepad2,
        title: "Couple Games",
        desc: "Play interactive games designed for two. From 'Never Have I Ever' to deep bonding questions.",
        highlights: ["10+ couple games", "Daily challenges", "Progress tracking", "Fun & meaningful"]
    },
    {
        icon: Calendar,
        title: "Shared Memories",
        desc: "Create a digital scrapbook with your favorite moments. Track your relationship timeline down to the second.",
        highlights: ["Photo & video albums", "Timeline tracker", "Special date reminders", "Memory prompts"]
    },
    {
        icon: Heart,
        title: "Daily Squeeze",
        desc: "Answer a new question every day about your relationship. Build deeper understanding through daily connection.",
        highlights: ["Daily questions", "Hidden answers until reveal", "Question history", "Personalized prompts"]
    },
    {
        icon: Lock,
        title: "Private & Secure",
        desc: "End-to-end encrypted messaging and data storage. Your private space stays private.",
        highlights: ["E2E encryption", "Secure cloud storage", "No data selling", "GDPR compliant"]
    },
    {
        icon: Share2,
        title: "Real-time Sync",
        desc: "Everything syncs instantly across all devices. Pick up right where you left off.",
        highlights: ["Cross-platform sync", "Offline mode", "Auto-backup", "Fast & reliable"]
    },
    {
        icon: Camera,
        title: "Moments Capture",
        desc: "Capture and share spontaneous moments with your partner in your private timeline.",
        highlights: ["Quick photo sharing", "Video messages", "Story timeline", "Memory alerts"]
    },
    {
        icon: Bell,
        title: "Smart Notifications",
        desc: "Get reminded of special dates, anniversaries, and when your partner is thinking of you.",
        highlights: ["Anniversary reminders", "Birthday alerts", "Custom notifications", "Partner activity"]
    }
];

const FeatureCard = ({ feature: { icon: Icon, title, desc, highlights } }) => (
    <div className="bg-white p-8 rounded-3xl shadow-lg border border-red-50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
        <div className="w-16 h-16 bg-gradient-to-br from-red-50 to-pink-50 rounded-2xl flex items-center justify-center mb-6 text-[var(--color-primary)]">
            <Icon size={32} />
        </div>
        <h3 className="text-2xl font-bold mb-3 text-[#2B2B2B]">{title}</h3>
        <p className="text-gray-600 mb-6 leading-relaxed">{desc}</p>
        <ul className="space-y-2">
            {highlights.map((highlight, idx) => (
                <li key={idx} className="flex items-center gap-2 text-sm text-gray-700">
                    <div className="w-5 h-5 rounded-full bg-red-100 text-[var(--color-primary)] flex items-center justify-center text-xs font-bold">✓</div>
                    {highlight}
                </li>
            ))}
        </ul>
    </div>
);

const Features = () => {
    return (
        <div className="min-h-screen bg-[var(--color-bg-soft)]">
            <Navbar />

            <main className="pt-[var(--header-height)]">
                {/* Hero Section */}
                <section className="py-20 bg-gradient-to-br from-[#FFE6E1] to-[#FFF5F5]">
                    <div className="container px-4 text-center">
                        <h1 className="text-5xl md:text-6xl font-bold mb-6 text-[#2B2B2B]">
                            Everything you need for a
                            <br />
                            <span className="text-gradient">stronger relationship.</span>
                        </h1>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                            CloseUs is packed with features designed exclusively for couples. Build connection, create memories, and grow closer together.
                        </p>
                    </div>
                </section>

                {/* Features Grid */}
                <section className="py-20">
                    <div className="container px-4">
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
                            {features.map((feature, idx) => (
                                <FeatureCard key={idx} feature={feature} />
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-20 bg-gradient-to-br from-[#FFE6E1] to-[#FFF5F5]">
                    <div className="container px-4 text-center">
                        <h2 className="text-4xl md:text-5xl font-bold mb-6 text-[#2B2B2B]">
                            Ready to explore all features?
                        </h2>
                        <p className="text-xl text-gray-600 mb-8">
                            Join thousands of couples building stronger relationships.
                        </p>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
};

export default Features;
