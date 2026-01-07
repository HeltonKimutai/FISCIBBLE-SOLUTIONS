import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useSearchParams } from "react-router-dom";

const Checkout = () => {
  const [searchParams] = useSearchParams();
  const amount = Number(searchParams.get("amount") || "0");

  const PROCESSING_FEE_RATE = 0.03;
  const fee = Math.round(amount * PROCESSING_FEE_RATE);

  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [txId, setTxId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handlePay = async () => {
    setError(null);
    setStatus(null);

    if (!/^254\d{9}$/.test(phone)) {
      setError('Phone must be in format 2547XXXXXXXX');
      return;
    }

    setLoading(true);
    try {
      const resp = await fetch('/api/initiate-stk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: fee, phone, loanAmount: amount }),
      });
      const data = await resp.json();
      if (!resp.ok) throw new Error(data.error || 'Failed to initiate STK');

      const checkoutId = data.checkoutRequestID || data.checkoutRequestID || data.checkoutRequestId || data.checkoutRequestID;
      const id = checkoutId || data.id;
      setTxId(checkoutId || id || null);

      // Poll for status
      const start = Date.now();
      const timeout = 60_000; // 60 seconds
      while (Date.now() - start < timeout) {
        await new Promise((r) => setTimeout(r, 2000));
        try {
          const poll = await fetch(`/api/transactions/${checkoutId}`);
          if (!poll.ok) continue;
          const j = await poll.json();
          if (j.status && (j.status === 'success' || j.status === 'failed')) {
            setStatus(j.status);
            setLoading(false);
            return;
          }
        } catch (e) {
          // ignore poll errors
        }
      }

      setError('Timed out waiting for confirmation');
      setLoading(false);
    } catch (err: any) {
      setError(err?.message || 'Error');
      setLoading(false);
    }
  };

  return (
    <div className="container py-20">
      <div className="max-w-md mx-auto bg-card rounded-2xl p-8 shadow-card border border-border text-center">
        <h2 className="text-2xl font-bold mb-4">Confirm Payment</h2>
        <p className="text-muted-foreground mb-2">You're applying for a loan of</p>
        <p className="text-2xl font-semibold mb-4">Ksh. {Number(amount).toLocaleString()}</p>

        <p className="text-muted-foreground mb-2">Processing fee (3%):</p>
        <p className="text-3xl font-extrabold text-primary mb-4">Ksh. {fee.toLocaleString()}</p>

        <div className="mb-4 text-left">
          <label className="block text-sm font-medium text-muted-foreground mb-1">Phone number (format: 2547XXXXXXXX)</label>
          <input
            className="w-full px-3 py-2 rounded-md border border-border"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="2547XXXXXXXX"
          />
        </div>

        {error && <p className="text-sm text-destructive mb-3">{error}</p>}
        {status === 'pending' && <p className="text-sm text-muted-foreground mb-3">Waiting for confirmation...</p>}
        {status === 'success' && <p className="text-sm text-success mb-3">Payment received — thank you!</p>}
        {status === 'failed' && <p className="text-sm text-destructive mb-3">Payment failed or was cancelled.</p>}

        <Button variant="default" size="lg" onClick={handlePay} className="w-full" disabled={loading}>
          {loading ? 'Processing...' : `Pay Ksh. ${fee.toLocaleString()}`}
          <ArrowRight className="w-5 h-5 ml-2" />
        </Button>

        {txId && (
          <div className="mt-4 text-sm text-muted-foreground">
            <p>Transaction ID: <code>{txId}</code></p>
            <p className="mt-2">If needed, you can trigger a mock callback for local testing:</p>
            <div className="flex gap-2 mt-2">
              <Button size="sm" variant="outline" onClick={async () => { await fetch(`/api/mock-callback/${txId}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status: 'success' }) }); }}>Mock Success</Button>
              <Button size="sm" variant="outline" onClick={async () => { await fetch(`/api/mock-callback/${txId}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status: 'failed' }) }); }}>Mock Fail</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Checkout;
