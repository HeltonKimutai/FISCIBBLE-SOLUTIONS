import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";
import { openWhatsApp } from "@/lib/utils";

const WhatsAppFab = () => {
  const WA_NUMBER = "254773532309"; // updated international number per request
  const WA_MESSAGE = "Welcome to FISCIBBLE SOLUTIONS, how may we assist you";

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Button
        variant="ghost"
        size="icon"
        className="bg-emerald-500 text-white hover:bg-emerald-600"
        onClick={() => openWhatsApp(WA_NUMBER, WA_MESSAGE)}
        aria-label="Chat on WhatsApp"
      >
        <MessageSquare className="w-5 h-5" />
      </Button>
    </div>
  );
};

export default WhatsAppFab;
