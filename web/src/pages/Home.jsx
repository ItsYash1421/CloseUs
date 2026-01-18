import React from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import HowItWorks from '../components/HowItWorks';
import FeatureShowcase from '../components/FeatureShowcase';
import FAQ from '../components/FAQ';
import CTA from '../components/CTA';
import Footer from '../components/Footer';

const Home = () => {
    return (
        <div className="min-h-screen bg-[var(--color-bg-soft)] text-[var(--color-text-main)] overflow-x-hidden selection:bg-red-100 selection:text-red-900">
            <Navbar />
            <main>
                <Hero />
                {/* <Stats /> */}
                <HowItWorks />
                <FeatureShowcase />
                {/* <Testimonials /> */}
                <FAQ />
                <CTA />
            </main>
            <Footer />
        </div>
    );
};

export default Home;
