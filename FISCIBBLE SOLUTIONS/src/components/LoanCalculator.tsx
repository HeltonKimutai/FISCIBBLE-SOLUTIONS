import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Calculator, ArrowRight } from "lucide-react";

const LoanCalculator = () => {
  const [loanAmount, setLoanAmount] = useState(20000);
  
  const INTEREST_RATE = 0.05; // 5%
  const PROCESSING_FEE_RATE = 0.03; // 3% processing fee
  
  const interest = loanAmount * INTEREST_RATE;
  const processingFee = loanAmount * PROCESSING_FEE_RATE;
  const totalRepayment = loanAmount + interest;
  const amountReceived = loanAmount - processingFee;
  
  return (
    <section id="calculator" className="py-20 md:py-28 bg-background">
      <div className="container">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary text-secondary-foreground text-sm font-medium mb-4">
            <Calculator className="w-4 h-4" />
            Loan Calculator
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Calculate Your Loan
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            See exactly what you'll receive and pay back. No hidden fees, completely transparent.
          </p>
        </div>
        
        <div className="max-w-2xl mx-auto">
          <div className="bg-card rounded-2xl p-8 shadow-card border border-border">
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <label className="text-foreground font-semibold">Loan Amount</label>
                <span className="text-2xl font-bold text-primary">
                  Ksh. {loanAmount.toLocaleString()}
                </span>
              </div>
              <Slider
                value={[loanAmount]}
                onValueChange={(value) => setLoanAmount(value[0])}
                min={1000}
                max={100000}
                step={1000}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-muted-foreground mt-2">
                <span>Ksh. 1,000</span>
                <span>Ksh. 100,000</span>
              </div>
            </div>
            
            <div className="space-y-4 mb-8">
              <div className="flex items-center justify-between py-3 border-b border-border">
                <span className="text-muted-foreground">Loan Amount</span>
                <span className="font-semibold text-foreground">Ksh. {loanAmount.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-border">
                <span className="text-muted-foreground">Processing Fee (3%)</span>
                <span className="font-semibold text-destructive">- Ksh. {processingFee.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-border bg-secondary/50 -mx-4 px-4 rounded-lg">
                <span className="font-semibold text-foreground">You Receive (M-Pesa)</span>
                <span className="font-bold text-primary text-lg">Ksh. {amountReceived.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-border">
                <span className="text-muted-foreground">Interest (5%)</span>
                <span className="font-semibold text-foreground">+ Ksh. {interest.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between py-4 bg-primary/5 -mx-4 px-4 rounded-xl">
                <span className="font-bold text-foreground">Total to Repay</span>
                <span className="font-extrabold text-primary text-xl">Ksh. {totalRepayment.toLocaleString()}</span>
              </div>
            </div>
            
            <Button 
              variant="default" 
              size="lg" 
              className="w-full group"
              onClick={() => window.open('https://wa.me/254700000000?text=I%20want%20to%20apply%20for%20a%20loan%20of%20Ksh.%20' + loanAmount.toLocaleString(), '_blank')}
            >
              Apply for Ksh. {loanAmount.toLocaleString()}
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LoanCalculator;
