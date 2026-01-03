import { useState, useEffect, CSSProperties } from 'react';

const nigerianStates = ['Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue', 'Borno', 'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu', 'FCT', 'Gombe', 'Imo', 'Jigawa', 'Kaduna', 'Kano', 'Katsina', 'Kebbi', 'Kogi', 'Kwara', 'Lagos', 'Nasarawa', 'Niger', 'Ogun', 'Ondo', 'Osun', 'Oyo', 'Plateau', 'Rivers', 'Sokoto', 'Taraba', 'Yobe', 'Zamfara'];

const lgasByState: { [key: string]: string[] } = {
  'Lagos': ['Agege', 'Ajeromi-Ifelodun', 'Alimosho', 'Amuwo-Odofin', 'Apapa', 'Badagry', 'Epe', 'Eti-Osa', 'Ibeju-Lekki', 'Ifako-Ijaiye', 'Ikeja', 'Ikorodu', 'Kosofe', 'Lagos Island', 'Lagos Mainland', 'Mushin', 'Ojo', 'Oshodi-Isolo', 'Shomolu', 'Surulere'],
  'FCT': ['Abaji', 'Bwari', 'Gwagwalada', 'Kuje', 'Kwali', 'Municipal Area Council'],
  'Rivers': ['Port Harcourt', 'Obio-Akpor', 'Okrika', 'Ogu-Bolo', 'Eleme', 'Tai', 'Gokana', 'Khana', 'Oyigbo', 'Bonny', 'Degema'],
  'Oyo': ['Ibadan North', 'Ibadan South-West', 'Ibadan South-East', 'Ibadan North-East', 'Akinyele', 'Lagelu', 'Egbeda', 'Oluyole'],
  'Kano': ['Kano Municipal', 'Dala', 'Gwale', 'Fagge', 'Tarauni', 'Nassarawa', 'Kumbotso', 'Ungogo'],
  'Kaduna': ['Kaduna North', 'Kaduna South', 'Chikun', 'Igabi', 'Zaria', 'Sabon Gari'],
};

const packages = [
  { id: 'PKG-001', name: 'SELF LOVE PLUS', price: 32750, originalPrice: 55000, discount: 40, items: '1× Shampoo | 1× Pomade | 1× Conditioner', supply: '1 Month Supply', freeItems: '', isPopular: false },
  { id: 'PKG-002', name: 'SELF LOVE RETURN', price: 42750, originalPrice: 75000, discount: 43, items: '3× Pomade', supply: '3 Month Supply', freeItems: '', isPopular: false },
  { id: 'PKG-003', name: 'SELF LOVE B2GOF', price: 52750, originalPrice: 110000, discount: 52, items: '2× Shampoo | 2× Pomade', supply: '3 Month Supply', freeItems: '+ 🎁 FREE: 1 Shampoo + 1 Pomade', isPopular: false },
  { id: 'PKG-004', name: 'SELF LOVE PLUS B2GOF', price: 66750, originalPrice: 165000, discount: 60, items: '2× Shampoo | 2× Pomade | 2× Conditioner', supply: '3 Month Supply', freeItems: '+ 🎁 FREE: 1 Shampoo + 1 Pomade + 1 Conditioner', isPopular: true },
  { id: 'PKG-005', name: 'FAMILY SAVES', price: 215000, originalPrice: 550000, discount: 61, items: '6× Shampoo | 6× Pomade | 6× Conditioner', supply: '12 Month Supply', freeItems: '+ 🎁 FREE: 4 Shampoos + 4 Pomades + 4 Conditioners', isPopular: false },
];

// Generate unique Order ID
const generateOrderId = (): string => {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, ''); // YYYYMMDD
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let random = '';
  for (let i = 0; i < 5; i++) {
    random += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `FHG-${date}-${random}`;
};

// All styles as objects
const S: { [key: string]: CSSProperties } = {
  container: { maxWidth: 500, margin: '0 auto', padding: '0 16px', fontFamily: '-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif' },
  box: { background: '#fff', border: '2px solid #DAA520', borderRadius: 16, padding: '24px 20px', boxShadow: '0 8px 30px rgba(0,0,0,0.08)' },
  step: { fontSize: 14, fontWeight: 600, color: '#666', margin: '0 0 8px' },
  bar: { height: 8, background: '#E0E0E0', borderRadius: 4, overflow: 'hidden', marginBottom: 20 },
  fill: { height: '100%', background: 'linear-gradient(90deg, #36CA37, #2eb82e)', transition: 'width 0.3s' },
  label: { display: 'block', fontSize: 13, fontWeight: 800, color: '#1a1a1a', textTransform: 'uppercase' as const, margin: '16px 0 8px' },
  req: { color: '#FF0000' },
  input: { width: '100%', padding: '14px 16px', background: '#F9F9F9', border: '2px solid #E0E0E0', borderRadius: 10, fontSize: 16, fontWeight: 600, color: '#1a1a1a', outline: 'none', boxSizing: 'border-box' as const, fontFamily: 'inherit' },
  hint: { fontSize: 12, color: '#666', margin: '6px 0 0' },
  pkgs: { display: 'flex', flexDirection: 'column' as const, gap: 12, marginTop: 12 },
  card: { display: 'block', position: 'relative' as const, padding: '14px 14px 14px 48px', background: '#fff', border: '2px solid #E0E0E0', borderRadius: 12, cursor: 'pointer', transition: 'all 0.2s' },
  cardSel: { borderColor: '#DAA520', background: '#FFFBF0', boxShadow: '0 4px 12px rgba(218,165,32,0.2)' },
  radio: { position: 'absolute' as const, left: 14, top: 16, width: 22, height: 22, border: '3px solid #CCC', borderRadius: '50%', background: '#fff', boxSizing: 'border-box' as const, display: 'flex', alignItems: 'center', justifyContent: 'center' },
  radioSel: { borderColor: '#DAA520', background: '#DAA520' },
  check: { color: '#fff', fontSize: 12, fontWeight: 'bold' as const },
  pop: { position: 'absolute' as const, top: -10, right: 10, background: '#FF0000', color: '#fff', fontSize: 9, fontWeight: 800, padding: '4px 10px', borderRadius: 20, textTransform: 'uppercase' as const, boxShadow: '0 2px 8px rgba(255,0,0,0.3)' },
  r1: { display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 4 },
  name: { fontSize: 14, fontWeight: 800, color: '#1a1a1a' },
  pr: { textAlign: 'right' as const },
  old: { fontSize: 11, color: '#999', textDecoration: 'line-through', marginRight: 4 },
  newP: { fontSize: 18, fontWeight: 900, color: '#FF0000' },
  r2: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  items: { fontSize: 12, fontWeight: 600, color: '#555' },
  disc: { background: '#FF0000', color: '#fff', fontSize: 9, fontWeight: 800, padding: '3px 6px', borderRadius: 4 },
  free: { background: 'linear-gradient(135deg, #2E8B2E, #3CB371)', color: '#fff', fontSize: 11, fontWeight: 700, padding: '6px 12px', borderRadius: 6, textAlign: 'center' as const, margin: '6px 0' },
  dur: { fontSize: 10, fontWeight: 600, color: '#888', textAlign: 'center' as const, marginTop: 4 },
  pay: { fontSize: 14, color: '#666', textAlign: 'center' as const, margin: '16px 0' },
  btn: { width: '100%', background: '#36CA37', color: '#fff', border: 'none', borderRadius: 10, padding: 18, fontSize: 16, fontWeight: 'bold' as const, textTransform: 'uppercase' as const, cursor: 'pointer', boxShadow: '0 6px 20px rgba(54,202,55,0.4)', fontFamily: 'inherit' },
  btnDis: { background: '#ccc', cursor: 'not-allowed', boxShadow: 'none' },
  back: { background: '#F0F0F0', color: '#666', border: 'none', borderRadius: 10, padding: '18px 24px', fontSize: 14, fontWeight: 'bold' as const, cursor: 'pointer', fontFamily: 'inherit' },
  sum: { background: '#F9F9F9', border: '1px solid #E0E0E0', borderRadius: 10, padding: 16, marginTop: 16 },
  sr: { display: 'flex', justifyContent: 'space-between', fontSize: 14, color: '#666', margin: '8px 0' },
  tot: { display: 'flex', justifyContent: 'space-between', fontSize: 16, fontWeight: 800, borderTop: '1px solid #E0E0E0', paddingTop: 12, marginTop: 8 },
  suc: { textAlign: 'center' as const, padding: '40px 20px' },
  sucIcon: { width: 60, height: 60, background: '#36CA37', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 30, color: '#fff', margin: '0 auto 20px' },
};

export default function OrderFormEmbed() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ 
    name: '', 
    phone: '', 
    pkg: '', 
    state: '', 
    lga: '', 
    address: '', 
    landmark: '',
    orderId: '' // Unique Order ID
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [sent, setSent] = useState(false);

  // Generate Order ID on first name entry
  useEffect(() => {
    if (form.name && !form.orderId) {
      setForm(prev => ({ ...prev, orderId: generateOrderId() }));
    }
  }, [form.name, form.orderId]);

  // Send progressive updates
  const sendUpdate = async (progress: string, data: any = {}) => {
    const pkg = packages.find(p => p.id === form.pkg);
    const payload = {
      order_id: form.orderId,
      phone: form.phone,
      name: form.name,
      package: pkg ? { id: pkg.id, name: pkg.name, price: pkg.price } : null,
      status: success ? 'complete' : 'partial',
      progress,
      captured_at: new Date().toISOString(),
      ...data
    };

    try {
      await fetch('https://systemforce.ng/wp-json/systemforce/v1/telesales/partial-leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      console.log(`Update sent: ${progress}`, payload);
    } catch (error) {
      console.error('Failed to send update:', error);
    }
  };

  // Phone captured - create lead
  useEffect(() => {
    const digits = form.phone.replace(/\D/g, '');
    if (digits.length === 11 && !sent && form.name && form.orderId) {
      sendUpdate('phone_captured');
      setSent(true);
    }
  }, [form.phone, form.name, sent, form.orderId]);

  // Package selected - update lead
  useEffect(() => {
    if (form.pkg && sent && form.orderId) {
      sendUpdate('package_selected');
    }
  }, [form.pkg, sent, form.orderId]);

  const submit = async () => {
    setSubmitting(true);
    try {
      await sendUpdate('order_completed', {
        state: form.state,
        lga: form.lga,
        address: form.address,
        landmark: form.landmark
      });
      setSuccess(true);
    } catch (e) {
      alert('Error submitting order. Please try again.');
    }
    setSubmitting(false);
  };

  if (success) {
    return (
      <div style={S.container}>
        <div style={S.box}>
          <div style={S.suc}>
            <div style={S.sucIcon}>✓</div>
            <h2 style={{ fontSize: 24, fontWeight: 800, margin: '0 0 12px' }}>Order Received!</h2>
            <p style={{ color: '#666', margin: '0 0 8px' }}>Our team will call you shortly to confirm delivery.</p>
            <p style={{ fontSize: 14, fontWeight: 600, color: '#36CA37', margin: '0 0 16px' }}>📞 Expect our call within 30 minutes</p>
            <p style={{ fontSize: 12, color: '#888', margin: 0 }}>Order ID: <strong>{form.orderId}</strong></p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={S.container}>
      <div style={S.box}>
        {/* Progress */}
        <p style={S.step}>Step {step} of 2</p>
        <div style={S.bar}>
          <div style={{ ...S.fill, width: step === 1 ? '50%' : '100%' }} />
        </div>

        {step === 1 && (
          <>
            {/* Name */}
            <label style={S.label}>CUSTOMER FULL NAME <span style={S.req}>*</span></label>
            <input
              style={S.input}
              placeholder="Enter your full name"
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
            />

            {/* Phone */}
            <label style={S.label}>PHONE NUMBER <span style={S.req}>*</span></label>
            <input
              style={S.input}
              placeholder="08012345678"
              value={form.phone}
              onChange={e => setForm({ ...form, phone: e.target.value })}
            />
            <p style={S.hint}>We call you before delivery"</p>

            {/* Packages */}
            <label style={S.label}>BUY MORE, SAVE MORE <span style={S.req}>*</span></label>
            <div style={S.pkgs}>
              {packages.map(p => {
                const selected = form.pkg === p.id;
                return (
                  <div
                    key={p.id}
                    onClick={() => setForm({ ...form, pkg: p.id })}
                    style={{ ...S.card, ...(selected ? S.cardSel : {}) }}
                  >
                    {/* Radio circle */}
                    <div style={{ ...S.radio, ...(selected ? S.radioSel : {}) }}>
                      {selected && <span style={S.check}>✓</span>}
                    </div>

                    {/* Popular tag */}
                    {p.isPopular && <span style={S.pop}>🔥 MOST POPULAR</span>}

                    {/* Row 1 */}
                    <div style={S.r1}>
                      <span style={S.name}>{p.name}</span>
                      <div style={S.pr}>
                        <span style={S.old}>₦{p.originalPrice.toLocaleString()}</span>
                        <span style={S.newP}>₦{p.price.toLocaleString()}</span>
                      </div>
                    </div>

                    {/* Row 2 */}
                    <div style={S.r2}>
                      <span style={S.items}>{p.items}</span>
                      <span style={S.disc}>{p.discount}% OFF</span>
                    </div>

                    {/* Free items */}
                    {p.freeItems && <div style={S.free}>{p.freeItems}</div>}

                    {/* Duration */}
                    <div style={S.dur}>🧴 {p.supply}</div>
                  </div>
                );
              })}
            </div>

            {/* Pay text */}
            <p style={S.pay}>Pay only when it arrives"</p>

            {/* Continue button */}
            <button
              style={S.btn}
              onClick={() => {
                if (!form.name || !form.phone || !form.pkg) {
                  alert('Please fill all required fields');
                  return;
                }
                setStep(2);
              }}
            >
              CONTINUE (PAY ON DELIVERY)
            </button>
          </>
        )}

        {step === 2 && (
          <>
            {/* State */}
            <label style={S.label}>STATE <span style={S.req}>*</span></label>
            <select
              style={S.input}
              value={form.state}
              onChange={e => setForm({ ...form, state: e.target.value, lga: '' })}
              aria-label="Select your state"
            >
              <option value="">Select State</option>
              {nigerianStates.map(s => <option key={s} value={s}>{s}</option>)}
            </select>

            {/* LGA */}
            <label style={S.label}>LGA <span style={S.req}>*</span></label>
            <select
              style={S.input}
              value={form.lga}
              onChange={e => setForm({ ...form, lga: e.target.value })}
              disabled={!form.state}
              aria-label="Select your local government area"
            >
              <option value="">Select LGA</option>
              {(lgasByState[form.state] || []).map(l => <option key={l} value={l}>{l}</option>)}
            </select>

            {/* Address */}
            <label style={S.label}>DELIVERY ADDRESS <span style={S.req}>*</span></label>
            <textarea
              style={{ ...S.input, minHeight: 80, resize: 'vertical' as const }}
              placeholder="Full delivery address"
              value={form.address}
              onChange={e => setForm({ ...form, address: e.target.value })}
            />

            {/* Landmark */}
            <label style={S.label}>LANDMARK (Optional)</label>
            <input
              style={S.input}
              placeholder="Near GTBank, Opposite Shell..."
              value={form.landmark}
              onChange={e => setForm({ ...form, landmark: e.target.value })}
            />

            {/* Summary */}
            <div style={S.sum}>
              <b style={{ display: 'block', marginBottom: 12 }}>Order Summary</b>
              {(() => {
                const p = packages.find(x => x.id === form.pkg);
                return p ? (
                  <>
                    <div style={S.sr}><span>{p.name}</span><span>₦{p.price.toLocaleString()}</span></div>
                    <div style={S.sr}><span>Delivery</span><span style={{ color: '#36CA37' }}>FREE</span></div>
                    <div style={S.tot}><span>Total</span><span>₦{p.price.toLocaleString()}</span></div>
                  </>
                ) : null;
              })()}
            </div>

            {/* Buttons */}
            <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
              <button style={S.back} onClick={() => setStep(1)}>← Back</button>
              <button
                style={{ ...S.btn, flex: 1, ...(submitting ? S.btnDis : {}) }}
                disabled={submitting}
                onClick={() => {
                  if (!form.state || !form.lga || !form.address) {
                    alert('Please fill all required fields');
                    return;
                  }
                  submit();
                }}
              >
                {submitting ? 'PROCESSING...' : 'COMPLETE ORDER'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
