import React from 'react';

interface Props {
  paymentMethod: 'Pay on Delivery' | 'Pay Before Delivery' | 'KLUMP';
  setPaymentMethod: (m: 'Pay on Delivery' | 'Pay Before Delivery' | 'KLUMP') => void;
}

export const PaymentMethodCards: React.FC<Props> = ({ paymentMethod, setPaymentMethod }) => {
  return (
    <div style={{ textAlign: 'center' }}>
      <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 4 }}>🔒 PAYMENT METHOD</h3>
      <p style={{ fontSize: 14, color: '#666', marginBottom: 16 }}>Choose your preferred payment option</p>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
        <button onClick={() => setPaymentMethod('Pay on Delivery')} style={{ padding: 16, borderRadius: 12, border: paymentMethod === 'Pay on Delivery' ? '2px solid #B8860B' : '2px solid #E5E7EB', background: '#fff' }}>
          Pay on Delivery
        </button>
        <button onClick={() => setPaymentMethod('Pay Before Delivery')} style={{ padding: 16, borderRadius: 12, border: paymentMethod === 'Pay Before Delivery' ? '2px solid #B8860B' : '2px solid #E5E7EB', background: '#fff' }}>
          Pay Before Delivery
        </button>
        <button onClick={() => setPaymentMethod('KLUMP')} style={{ padding: 16, borderRadius: 12, border: paymentMethod === 'KLUMP' ? '2px solid #7C3AED' : '2px solid #7C3AED', background: 'linear-gradient(135deg, #F5F3FF 0%, #EDE9FE 100%)' }}>
          Pay Small Small with Klump
        </button>
      </div>
    </div>
  );
};
