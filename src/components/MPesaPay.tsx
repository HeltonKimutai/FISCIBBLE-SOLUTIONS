import React, { useState } from 'react';
import { useMpesa } from '../hooks/use-mpesa';

export default function MPesaPay() {
  const [phone, setPhone] = useState('254773532309');
  const [amount, setAmount] = useState('1');
  const [status, setStatus] = useState<string | null>(null);
  const { initiatePayment, pollTransaction } = useMpesa();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('Initiating STK Push...');
    try {
      const { checkoutRequestID } = await initiatePayment({ amount, phone, accountReference: 'Test123', transactionDesc: 'Test payment' });
      setStatus('Prompt sent. Waiting for confirmation...');
      if (checkoutRequestID) {
        const tx = await pollTransaction(checkoutRequestID, 90000);
        setStatus(`Result: ${tx.status} - ${tx.confirmation?.ResultDesc || ''}`);
      } else {
        setStatus('No checkoutRequestID returned. Check server response.');
      }
    } catch (err: unknown) {
      const error = err as { message?: string } | undefined;
      setStatus(`Error: ${error?.message || 'unknown'}`);
    }
  };

  return (
    <div className="max-w-md p-4 bg-white rounded shadow">
      <h3 className="text-lg font-semibold mb-2">Pay with M-Pesa (Daraja STK Push)</h3>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="block text-sm">Phone (254...)</label>
          <input value={phone} onChange={(e) => setPhone(e.target.value)} className="mt-1 w-full border px-2 py-1 rounded" />
        </div>
        <div>
          <label className="block text-sm">Amount</label>
          <input value={amount} onChange={(e) => setAmount(e.target.value)} className="mt-1 w-full border px-2 py-1 rounded" />
        </div>
        <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded">Pay</button>
      </form>
      {status && <p className="mt-3 text-sm">{status}</p>}
    </div>
  );
}
