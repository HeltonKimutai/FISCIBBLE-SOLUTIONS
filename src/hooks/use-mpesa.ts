import { useCallback } from 'react';

type InitiateParams = {
  amount: number | string;
  phone: string; // 2547XXXXXXXX
  accountReference?: string;
  transactionDesc?: string;
};

export function useMpesa() {
  const initiatePayment = useCallback(async (params: InitiateParams) => {
    const res = await fetch('/api/mpesa/stkpush', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });

    // Safely parse response: handle empty body and non-JSON responses
    const contentType = res.headers.get('content-type') || '';
    let data: any = null;
    const text = await res.text();
    if (text) {
      if (contentType.includes('application/json')) {
        try {
          data = JSON.parse(text);
        } catch (err) {
          console.warn('Failed to parse JSON response from /api/mpesa/stkpush:', text);
        }
      } else {
        // not JSON; keep raw text for debugging
        console.warn('Non-JSON response from /api/mpesa/stkpush:', text);
      }
    }

    if (!res.ok) {
      const msg = data?.error || text || `Request failed (${res.status})`;
      throw new Error(msg);
    }

    // if simulated, response.tx.checkoutRequestID will be present
    const checkoutRequestID = data?.tx?.checkoutRequestID || data?.response?.CheckoutRequestID;
    return { checkoutRequestID, raw: data ?? text };
  }, []);

  const pollTransaction = useCallback(async (checkoutRequestID: string, timeout = 60000) => {
    const start = Date.now();
    while (Date.now() - start < timeout) {
      try {
        const res = await fetch(`/api/transactions/${checkoutRequestID}`);
        const text = await res.text();
        if (!text) {
          // empty body — treat as pending and retry
          await new Promise((r) => setTimeout(r, 3000));
          continue;
        }

        let tx: any = null;
        try {
          tx = JSON.parse(text);
        } catch (err) {
          console.warn('Invalid JSON from /api/transactions:', text);
          throw new Error('Invalid JSON response from server');
        }

        if (tx.status && tx.status !== 'pending') return tx;
      } catch (err) {
        console.warn('Error polling transaction:', err);
        // retry until timeout
      }
      await new Promise((r) => setTimeout(r, 3000));
    }
    throw new Error('Transaction status poll timed out');
  }, []);

  return { initiatePayment, pollTransaction };
}
