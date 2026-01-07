import { Button } from "@/components/ui/button";
import { ArrowRight, Phone } from "lucide-react";

const CTASection = () => {
  return (
    <section className="py-20 md:py-28 bg-hero-gradient relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary-foreground/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-primary-foreground/5 rounded-full blur-3xl" />
      </div>
      
      <div className="container relative z-10">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-6">
            Ready to Get Your Loan?
          </h2>
          <p className="text-lg text-primary-foreground/70 mb-10">
            Join thousands of Kenyans who trust FISCIBBLE SOLUTIONS for their financial needs. Apply now and get funds in minutes!
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
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
              size="lg" 
              className="w-full sm:w-auto"
              onClick={() => window.location.href = 'tel:+254773532309'}
            >
              <Phone className="w-5 h-5" />
              Call Us: 254773532309
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
