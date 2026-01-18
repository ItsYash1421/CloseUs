import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { CheckCircle, Clock, Sparkles } from 'lucide-react';

const roadmapItems = [
    {
        status: "building",
        quarter: "Currently Building",
        features: [
            { name: "Heartbeat Chat", desc: "Real-time messaging with typing indicators" },
            { name: "Daily Squeeze", desc: "Daily relationship questions" },
            { name: "Couple Games", desc: "10+ interactive couple games" },
            { name: "Shared Memories", desc: "Photo timeline and memory storage" },
            { name: "Relationship Timeline", desc: "Track your journey together" }
        ]
    },
    {
        status: "in-progress",
        quarter: "Q1 2026 (In Progress)",
        features: [
            { name: "Video Messages", desc: "Send video clips to your partner" },
            { name: "Advanced Analytics", desc: "Relationship insights and patterns" },
            { name: "Custom Themes", desc: "Personalize your CloseUs experience" },
            { name: "Dark Mode", desc: "Easy-on-the-eyes dark interface" },
            { name: "Widget Support", desc: "Home screen widgets for quick access" }
        ]
    },
    {
        status: "planned",
        quarter: "Q2 2026 (Planned)",
        features: [
            { name: "Couple Challenges", desc: "Weekly relationship challenges" },
            { name: "Date Night Ideas", desc: "Personalized date suggestions" },
            { name: "Shared Calendar", desc: "Plan and track important dates together" },
            { name: "Voice Notes Premium", desc: "Unlimited voice message length" },
            { name: "AI Conversation Prompts", desc: "Smart conversation starters" }
        ]
    },
    {
        status: "future",
        quarter: "Q3 2026 & Beyond",
        features: [
            { name: "Couple Therapy Resources", desc: "Professional relationship guidance" },
            { name: "Multi-language Support", desc: "CloseUs in your language" },
            { name: "Couple Journals", desc: "Shared private journaling space" },
            { name: "Anniversary Planner", desc: "Plan special celebrations together" },
            { name: "Integration with Calendars", desc: "Sync with Google Calendar & more" }
        ]
    }
];

const getStatusConfig = (status) => {
    switch (status) {
        case 'building':
            return { icon: Clock, color: 'text-orange-500', bg: 'bg-orange-50', label: 'Building' };
        case 'live':
            return { icon: CheckCircle, color: 'text-green-500', bg: 'bg-green-50', label: 'Live' };
        case 'in-progress':
            return { icon: Clock, color: 'text-blue-500', bg: 'bg-blue-50', label: 'In Progress' };
        case 'planned':
            return { icon: Sparkles, color: 'text-purple-500', bg: 'bg-purple-50', label: 'Planned' };
        case 'future':
            return { icon: Sparkles, color: 'text-gray-400', bg: 'bg-gray-50', label: 'Future' };
        default:
            return { icon: Sparkles, color: 'text-gray-400', bg: 'bg-gray-50', label: 'TBD' };
    }
};

const RoadmapSection = ({ item }) => {
    const config = getStatusConfig(item.status);
    const Icon = config.icon;

    return (
        <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center gap-3 mb-6">
                <div className={`w-12 h-12 ${config.bg} rounded-xl flex items-center justify-center ${config.color}`}>
                    <Icon size={24} />
                </div>
                <div>
                    <div className={`text-xs font-bold uppercase ${config.color} mb-1`}>{config.label}</div>
                    <h3 className="text-xl font-bold text-[#2B2B2B]">{item.quarter}</h3>
                </div>
            </div>

            <ul className="space-y-4">
                {item.features.map((feature, idx) => (
                    <li key={idx} className="border-l-2 border-gray-100 pl-4">
                        <h4 className="font-semibold text-gray-800 mb-1">{feature.name}</h4>
                        <p className="text-sm text-gray-600">{feature.desc}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

const Roadmap = () => {
    return (
        <div className="min-h-screen bg-[var(--color-bg-soft)]">
            <Navbar />

            <main className="pt-[var(--header-height)]">
                {/* Hero Section */}
                <section className="py-20 bg-gradient-to-br from-[#FFE6E1] to-[#FFF5F5]">
                    <div className="container px-4 text-center">
                        <h1 className="text-5xl md:text-6xl font-bold mb-6 text-[#2B2B2B]">
                            What's coming to
                            <br />
                            <span className="text-gradient">CloseUs.</span>
                        </h1>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                            We're constantly building new features to help couples grow closer. Here's what's live, in progress, and planned for the future.
                        </p>
                    </div>
                </section>

                {/* Roadmap Timeline */}
                <section className="py-20">
                    <div className="container px-4">
                        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
                            {roadmapItems.map((item, idx) => (
                                <RoadmapSection key={idx} item={item} />
                            ))}
                        </div>

                        {/* Feedback CTA */}
                        <div className="mt-16 text-center bg-gradient-to-br from-red-50 to-pink-50 p-12 rounded-3xl max-w-4xl mx-auto">
                            <h3 className="text-3xl font-bold mb-4 text-[#2B2B2B]">Have a feature request?</h3>
                            <p className="text-lg text-gray-600 mb-6">
                                We'd love to hear your ideas! Help us build the best app for couples.
                            </p>
                            <a
                                href="mailto:closeus1421@gmail.com?subject=Feature Request"
                                className="inline-block bg-[var(--color-primary)] text-white px-8 py-4 rounded-full font-bold shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all"
                            >
                                Share Your Idea
                            </a>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
};

export default Roadmap;
