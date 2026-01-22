import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Check, X } from 'lucide-react';

const pricingPlans = [
    {
        name: 'Free',
        price: '₹0',
        period: 'forever',
        description: 'Perfect for couples starting their journey together',
        features: [
            { name: 'Unlimited messaging', included: true },
            { name: 'Photo sharing (10/day)', included: true },
            { name: 'Daily question', included: true },
            { name: 'Basic couple games (3)', included: true },
            { name: 'Relationship timeline', included: true },
            { name: 'Memory storage (50 photos)', included: true },
            { name: 'Voice messages', included: false },
            { name: 'All couple games', included: false },
            { name: 'Unlimited photo storage', included: false },
            { name: 'Video messages', included: false },
            { name: 'Advanced analytics', included: false },
            { name: 'Custom themes', included: false },
        ],
        cta: 'Start Free',
        popular: false,
    },
    {
        name: 'Premium',
        price: '₹0',
        originalPrice: '₹99',
        period: 'per month',
        description: 'Unlock the full CloseUs experience - Limited time offer!',
        features: [
            { name: 'Unlimited messaging', included: true },
            { name: 'Unlimited photo sharing', included: true },
            { name: 'Daily question', included: true },
            { name: 'All couple games (10+)', included: true },
            { name: 'Relationship timeline', included: true },
            { name: 'Unlimited memory storage', included: true },
            { name: 'Voice messages', included: true },
            { name: 'Video messages', included: true },
            { name: 'Advanced analytics', included: true },
            { name: 'Custom themes', included: true },
            { name: 'Priority support', included: true },
            { name: 'Early access to features', included: true },
        ],
        cta: 'Go Premium',
        popular: true,
    },
];

const PricingCard = ({ plan }) => (
    <div
        className={`relative bg-white p-8 rounded-3xl shadow-lg border-2 ${plan.popular ? 'border-[var(--color-primary)] shadow-2xl scale-105' : 'border-gray-100'} transition-all duration-300 hover:shadow-xl`}
    >
        {plan.popular && (
            <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <span className="bg-[var(--color-primary)] text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg">
                    Most Popular
                </span>
            </div>
        )}

        <div className="text-center mb-8">
            <h3 className="text-2xl font-bold mb-2 text-[#2B2B2B]">{plan.name}</h3>
            <p className="text-gray-600 text-sm mb-4">{plan.description}</p>
            <div className="mb-2">
                {plan.originalPrice && (
                    <div className="text-gray-400 line-through text-lg mb-1">
                        {plan.originalPrice}/{plan.period}
                    </div>
                )}
                <div>
                    <span className="text-5xl font-bold text-[#2B2B2B]">{plan.price}</span>
                    <span className="text-gray-500 text-sm ml-2">/{plan.period}</span>
                </div>
                {plan.originalPrice && (
                    <div className="mt-2 inline-block bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">
                        100% OFF - Limited Time!
                    </div>
                )}
            </div>
        </div>

        <ul className="space-y-4 mb-8">
            {plan.features.map((feature, idx) => (
                <li key={idx} className="flex items-center gap-3">
                    {feature.included ? (
                        <Check size={20} className="text-green-500 flex-shrink-0" />
                    ) : (
                        <X size={20} className="text-gray-300 flex-shrink-0" />
                    )}
                    <span className={feature.included ? 'text-gray-700' : 'text-gray-400'}>
                        {feature.name}
                    </span>
                </li>
            ))}
        </ul>

        <button
            className={`w-full py-4 rounded-full font-bold transition-all ${plan.popular ? 'bg-[var(--color-primary)] text-white hover:shadow-xl hover:-translate-y-1' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}
        >
            {plan.cta}
        </button>
    </div>
);

const Pricing = () => {
    return (
        <div className="min-h-screen bg-[var(--color-bg-soft)]">
            <Navbar />

            <main className="pt-[var(--header-height)]">
                {/* Hero Section */}
                <section className="py-20 bg-gradient-to-br from-[#FFE6E1] to-[#FFF5F5]">
                    <div className="container px-4 text-center">
                        <h1 className="text-5xl md:text-6xl font-bold mb-6 text-[#2B2B2B]">
                            Simple, transparent
                            <br />
                            <span className="text-gradient">pricing.</span>
                        </h1>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                            Start free and upgrade when you're ready. No hidden fees, cancel
                            anytime.
                        </p>
                    </div>
                </section>

                {/* Pricing Cards */}
                <section className="py-20">
                    <div className="container px-4">
                        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                            {pricingPlans.map((plan, idx) => (
                                <PricingCard key={idx} plan={plan} />
                            ))}
                        </div>

                        {/* FAQ Note */}
                        <div className="mt-16 text-center">
                            <p className="text-gray-600 mb-4">Have questions about pricing?</p>
                            <a
                                href="mailto:closeus1421@gmail.com"
                                className="text-[var(--color-primary)] font-semibold hover:underline"
                            >
                                Contact us →
                            </a>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
};

export default Pricing;
