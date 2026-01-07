import { Smartphone, FileCheck, Banknote, CheckCircle } from "lucide-react";

const steps = [
  {
    icon: Smartphone,
    title: "Register",
    description: "Sign up with your phone number and verify via SMS OTP",
  },
  {
    icon: FileCheck,
    title: "Apply",
    description: "Complete a quick application with your ID and M-Pesa details",
  },
  {
    icon: CheckCircle,
    title: "Get Approved",
    description: "Instant credit check with approval in just 5 minutes",
  },
  {
    icon: Banknote,
    title: "Receive Funds",
    description: "Money sent directly to your M-Pesa instantly",
  },
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-20 md:py-28 bg-secondary/30">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            How It Works
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Get your loan in 4 simple steps. No paperwork, no guarantors required.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div
              key={step.title}
              className="relative group"
            >
              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-12 left-[60%] w-[80%] h-0.5 bg-border" />
              )}
              
              <div className="bg-card rounded-2xl p-6 shadow-card border border-border hover:shadow-elevated transition-all duration-300 hover:-translate-y-1">
                <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center mb-5 group-hover:bg-primary/20 transition-colors">
                  <step.icon className="w-8 h-8 text-primary" />
                </div>
                
                <div className="absolute top-6 right-6 w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-sm font-bold text-secondary-foreground">
                  {index + 1}
                </div>
                
                <h3 className="text-lg font-bold text-foreground mb-2">{step.title}</h3>
                <p className="text-muted-foreground text-sm">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
