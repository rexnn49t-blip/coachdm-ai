import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import TrustedBy from "@/components/landing/TrustedBy";
import Features from "@/components/landing/Features";
import HowItWorks from "@/components/landing/HowItWorks";

import FAQ from "@/components/landing/FAQ";
import Testimonials from "@/components/landing/Testimonials";
import CTA from "@/components/landing/CTA";
import Footer from "@/components/landing/Footer";
import Pricing from "@/components/landing/Pricing";


export default function Home() {
  return (
    <main className="pt-20">
      <Hero />
      <TrustedBy />
      <Features />
      <HowItWorks />
     
      <FAQ />
      <Testimonials />
      <CTA />
      <Footer />
    </main>
  );
}