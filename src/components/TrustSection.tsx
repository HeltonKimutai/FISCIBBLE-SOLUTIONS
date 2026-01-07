import { Lock, BadgeCheck, Award } from "lucide-react";

const TrustSection = () => {
  return (
    <section className="py-16 bg-secondary/30">
      <div className="container">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
            Trusted & Secure
          </h2>
          <p className="text-muted-foreground">
            Your security and trust are our top priorities
          </p>
        </div>
        
        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Lock className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="font-semibold text-foreground">SSL Secured</p>
              <p className="text-sm text-muted-foreground">256-bit encryption</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <BadgeCheck className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="font-semibold text-foreground">CBK Licensed</p>
              <p className="text-sm text-muted-foreground">Regulated lender</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Award className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="font-semibold text-foreground">Verified Service</p>
              <p className="text-sm text-muted-foreground">50,000+ customers</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustSection;
