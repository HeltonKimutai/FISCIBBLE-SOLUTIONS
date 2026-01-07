import { Zap, FileX, Shield, Users, Percent, Clock } from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "5-Minute Approval",
    description: "Instant credit assessment with automated approval system",
  },
  {
    icon: FileX,
    title: "No Paperwork",
    description: "100% digital process, apply from anywhere on your phone",
  },
  {
    icon: Shield,
    title: "Bank-Level Security",
    description: "Your data is encrypted and protected at all times",
  },
  {
    icon: Users,
    title: "No Guarantors",
    description: "Your loan is based on your own creditworthiness",
  },
  {
    icon: Percent,
    title: "Low Interest",
    description: "Only 5% interest rate with transparent fee structure",
  },
  {
    icon: Clock,
    title: "Flexible Terms",
    description: "Choose repayment periods that work for your budget",
  },
];

const FeaturesSection = () => {
  return (
    <section id="features" className="py-20 md:py-28 bg-background">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Why Choose FISCIBBLE SOLUTIONS?
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            We make borrowing simple, fast, and secure for every Kenyan
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="group p-6 rounded-2xl border-2 border-border bg-card hover:border-primary/30 hover:shadow-card transition-all duration-300"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="w-14 h-14 rounded-xl bg-secondary flex items-center justify-center mb-4 group-hover:bg-primary/10 transition-colors">
                <feature.icon className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-lg font-bold text-foreground mb-2">{feature.title}</h3>
              <p className="text-muted-foreground text-sm">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
