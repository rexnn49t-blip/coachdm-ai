import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";

import PricingHero from "@/components/pricing/PricingHero";
import PricingCards from "@/components/pricing/PricingCards";
import FeatureComparison from "@/components/pricing/FeatureComparison";
import PricingFAQ from "@/components/pricing/PricingFAQ";
import PricingCTA from "@/components/pricing/PricingCTA";

export default function PricingPage() {
  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-black text-white pt-20">

        <PricingHero />

        <PricingCards />

        <FeatureComparison />

        <PricingFAQ />

        <PricingCTA />

      </main>

      <Footer />
    </>
  );
}