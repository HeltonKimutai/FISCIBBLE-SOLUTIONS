import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import HowItWorks from "@/components/HowItWorks";
import LoanCalculator from "@/components/LoanCalculator";
import FeaturesSection from "@/components/FeaturesSection";
import TrustSection from "@/components/TrustSection";
import CTASection from "@/components/CTASection";
// MPesaPay intentionally removed from the main index. Use WhatsApp flow instead.
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <main className="min-h-screen">
      <Header />
      <HeroSection />
      <HowItWorks />
      <LoanCalculator />
      {/* Pay with M-Pesa section removed; using WhatsApp contact flow instead */}
      <FeaturesSection />
      <TrustSection />
      <CTASection />
      <Footer />
    </main>
  );
};

export default Index;
