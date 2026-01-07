import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, Clock, Smartphone } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-hero-gradient" />
      
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 right-10 w-72 h-72 bg-primary-foreground/5 rounded-full blur-3xl animate-pulse-soft" />
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-primary-foreground/5 rounded-full blur-3xl animate-pulse-soft" style={{ animationDelay: '1s' }} />
      </div>
      
      <div className="container relative z-10 pt-24 pb-16">
        <div className="max-w-3xl mx-auto text-center">
          <div className="animate-fade-up">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-foreground/10 text-primary-foreground/90 text-sm font-medium mb-6 backdrop-blur-sm border border-primary-foreground/20">
              <Smartphone className="w-4 h-4" />
              Instant M-Pesa Disbursement
            </span>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-primary-foreground leading-tight mb-6 animate-fade-up" style={{ animationDelay: '0.1s' }}>
            Instant M-Pesa Loans
            <br />
            <span className="text-primary-foreground/80">When You Need It Most</span>
          </h1>
          
          <p className="text-lg md:text-xl text-primary-foreground/70 mb-10 max-w-2xl mx-auto animate-fade-up" style={{ animationDelay: '0.2s' }}>
            Get funds directly to your M-Pesa in minutes. Simple application, fast approval, and secure transactions with only 5% interest.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12 animate-fade-up" style={{ animationDelay: '0.3s' }}>
            <Button 
              variant="hero" 
              size="xl" 
              className="w-full sm:w-auto group"
              onClick={() => document.getElementById('calculator')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Apply Now
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button 
              variant="heroOutline" 
              size="xl" 
              className="w-full sm:w-auto"
              onClick={() => document.getElementById('calculator')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Check Eligibility
            </Button>
          </div>
          
          {/* Trust badges */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-primary-foreground/60 animate-fade-up" style={{ animationDelay: '0.4s' }}>
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              <span className="text-sm font-medium">CBK Regulated</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              <span className="text-sm font-medium">5-Min Approval</span>
            </div>
            <div className="flex items-center gap-2">
              <Smartphone className="w-5 h-5" />
              <span className="text-sm font-medium">100% M-Pesa</span>
            </div>
          </div>
        </div>
        
        {/* Loan amount card */}
        <div className="mt-12 max-w-md mx-auto animate-fade-up" style={{ animationDelay: '0.5s' }}>
          <div className="bg-card rounded-2xl p-8 shadow-elevated text-center">
            <p className="text-muted-foreground font-medium mb-2">Borrow up to</p>
            <p className="text-4xl md:text-5xl font-extrabold text-primary mb-2">
              Ksh. 100,000
            </p>
            <p className="text-muted-foreground">
              New customers qualify for up to Ksh. 10,000 instantly
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
