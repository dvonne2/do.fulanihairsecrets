import { useState, useEffect, useCallback, useMemo, CSSProperties, memo } from 'react';

const FULANI_API_URL = 'https://script.google.com/macros/s/AKfycbx1dHWosMwJcMNNWQfNEyLZNMI3bbBW9wtFD58l_eP8Uo7A5p755RVBJsCIwAm2syEB/exec';
const FULANI_SECRET = 'fhg_orders_2024_secret';

const submitToFulani = async (formData) => {
  const payload = {
    secret: FULANI_SECRET,
    customerFullName: formData.name || formData.customerName || formData.fullName,
    phoneNumber: formData.phone || formData.phoneNumber || formData.tel,
    alternativePhone: formData.whatsapp || formData.altPhone || formData.phone,
    email: formData.email || '',
    packageSelected: formData.package || formData.packageName || formData.selectedPackage,
    state: formData.state || '',
    lga: formData.lga || formData.city || formData.area || '',
    fullAddress: formData.address || formData.fullAddress || formData.deliveryAddress || '',
    landmark: formData.landmark || formData.nearestLandmark || '',
    deliveryFee: formData.deliveryFee || formData.shipping || 3000,
    preferredDeliveryDate: formData.deliveryDate || formData.date || '',
    preferredDeliveryTime: formData.deliveryTimeWindow || formData.deliveryTime || formData.time || '',
    paymentMethod: formData.paymentMethod || formData.payment || 'Pay on Delivery',
    comment: formData.comment || formData.notes || formData.message || ''
  };

  const body = new URLSearchParams(
    Object.entries(payload).map(([k, v]) => [k, v == null ? '' : String(v)])
  );

  try {
    await fetch(FULANI_API_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
      body
    });
    return { success: true };
  } catch (error) {
    console.error('Fulani API error:', error);
    return { success: false, error };
  }
};

// Debounce hook for performance optimization
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

const packageMapping: Record<string, string> = {
  'PKG-001': 'SELF LOVE PLUS',
  'PKG-002': 'SELF LOVE RETURN',
  'PKG-003': 'SELF LOVE B2GOF',
  'PKG-004': 'SELF LOVE PLUS B2GOF',
  'PKG-005': 'FAMILY SAVES'
};

const PACKAGE_CONTENTS: Record<string, string[]> = {
  'SELF LOVE PLUS': ['1 Shampoo', '1 Pomade', '1 Conditioner'],
  'SELF LOVE RETURN': ['3 Pomade'],
  'SELF LOVE B2GOF': ['3 Shampoo', '3 Pomade'],
  'SELF LOVE PLUS B2GOF': ['3 Shampoo', '3 Pomade', '3 Conditioner'],
  'FAMILY SAVES': ['10 Shampoo', '10 Pomade', '10 Conditioner']
};

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

// Generate unique Order ID - YYMMDDHHmm format
const generateOrderId = (): string => {
  const now = new Date();
  const yy = String(now.getFullYear()).slice(-2);  // 26
  const mm = String(now.getMonth() + 1).padStart(2, '0');  // 01
  const dd = String(now.getDate()).padStart(2, '0');  // 13
  const hh = String(now.getHours()).padStart(2, '0');  // 05
  const min = String(now.getMinutes()).padStart(2, '0');  // 56
  return yy + mm + dd + hh + min;  // 2601130556
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

function OrderFormEmbed() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ 
    name: '', 
    phone: '', 
    pkg: '', 
    email: '', 
    whatsapp: '',
    state: '', 
    lga: '', 
    address: '', 
    landmark: '',
    deliveryFee: 3000 as 3000 | 5000,
    heardAboutUs: '',
    deliveryDate: '',
    deliveryTimeWindow: '',
    paymentMethod: 'Pay on Delivery',
    comment: '',
    agreeToTerms: false,
    orderId: '' // Unique Order ID
  });
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [phoneError, setPhoneError] = useState('');

  // Debounce phone input to reduce unnecessary re-renders and API calls
  const debouncedPhone = useDebounce(form.phone, 300);

  // Memoize phone validation function
  const validatePhone = useCallback((phone: string) => {
    const digits = phone.replace(/\D/g, '');
    
    if (digits.length === 0) return '';  // No error, empty field
    if (digits.length < 11) return `Enter ${11 - digits.length} more digits`;
    if (digits.length > 11) return 'Phone number cannot exceed 11 digits';
    if (!digits.startsWith('0')) return 'Must start with 0';
    
    const validPrefixes = ['070', '071', '080', '081', '090', '091'];
    if (!validPrefixes.includes(digits.substring(0, 3))) {
      return 'Invalid phone prefix';
    }
    
    return '';  // Valid - NO error message
  }, []);

  // Memoize selected package calculation
  const selectedPackage = useMemo(() => {
    return packages.find(p => p.id === form.pkg) || null;
  }, [form.pkg]);

  // Memoize delivery fee calculation
  const deliveryFee = useMemo(() => {
    return form.state === 'Lagos' ? 3000 : 5000;
  }, [form.state]);

  // Memoize total calculation
  const total = useMemo(() => {
    return (selectedPackage?.price || 0) + deliveryFee;
  }, [selectedPackage, deliveryFee]);

  // Memoize location string
  const location = useMemo(() => {
    return form.state && form.lga ? `${form.lga}, ${form.state}` : form.state || '';
  }, [form.state, form.lga]);

  // Partial entry function
  const savePartialEntry = async (formData) => {
    const orderId = formData.orderId || generateOrderId();
    
    const payload = {
      secret: FULANI_SECRET,
      type: 'partial',
      orderId: orderId,
      phoneNumber: formData.phone || formData.phoneNumber,
      customerFullName: formData.name || formData.customerFullName || '',
      email: formData.email || '',
      state: formData.state || '',
      lga: formData.lga || '',
      fullAddress: formData.address || formData.fullAddress || '',
      landmark: formData.landmark || '',
      packageSelected: formData.package || formData.packageSelected || ''
    };

    const body = new URLSearchParams(
      Object.entries(payload).map(([k, v]) => [k, v == null ? '' : String(v)])
    );

    console.log('Sending partial entry:', payload);
    console.log('Partial entry POST URL:', FULANI_API_URL);
    console.log('Partial entry body:', body.toString());

    try {
      let response: Response | undefined;
      try {
        response = await fetch(FULANI_API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
          body: body.toString()
        });
        console.log('Partial entry response:', response);
      } catch (corsError) {
        console.error('Partial entry fetch error (likely CORS). Retrying with no-cors:', corsError);
        await fetch(FULANI_API_URL, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
          body: body.toString()
        });
        console.log('Partial entry sent with no-cors fallback (no response available).');
      }

      console.log('Partial entry saved:', orderId);
      return { success: true, orderId };
    } catch (error) {
      console.error('Partial entry error:', error);
      return { success: false, error };
    }
  };

  // Handle phone input - optimized with debounced validation
  const handlePhoneChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setForm(prev => ({ ...prev, phone: value }));
  }, []);

  // Effect to handle debounced phone validation and partial save
  useEffect(() => {
    const digits = debouncedPhone.replace(/\D/g, '');
    const nextPhoneError = validatePhone(debouncedPhone);
    setPhoneError(nextPhoneError);

    console.log('Debounced phone validation:', {
      phone: debouncedPhone,
      digits,
      digitsLength: digits.length,
      sent,
      hasName: Boolean(form.name)
    });
    
    // Save partial when phone is valid (exactly 11 digits) AND not already saved
    if (digits.length === 11 && !sent && !nextPhoneError) {
      console.log('Triggering partial save (11 digits).');
      // Prevent duplicate sends (fast typing / paste) before awaiting network.
      setSent(true);

      const orderId = form.orderId || generateOrderId();
      if (!form.orderId) {
        setForm(prev => ({ ...prev, orderId }));
      }

      const savePartial = async () => {
        const result = await savePartialEntry({
          orderId,
          phone: digits,
          name: form.name,
          email: form.email || '',
          state: '',
          lga: '',
          address: '',
          landmark: '',
          packageSelected: form.pkg ? (packageMapping[form.pkg] || form.pkg) : ''
        });
        
        if (result.success) {
          // Ensure we keep the same orderId from partial through completion.
          if (!form.orderId) {
            setForm(prev => ({ ...prev, orderId: result.orderId }));
          }
        } else {
          // Allow retry if the request truly failed.
          setSent(false);
        }
      };

      savePartial();
    } else if (digits.length === 11) {
      console.log('11 digits reached but partial save NOT triggered due to conditions:', { sent, nextPhoneError });
    }
  }, [debouncedPhone, validatePhone, sent, form.name, form.orderId, form.pkg]);

  // Generate Order ID on first name entry
  useEffect(() => {
    if (form.name && !form.orderId) {
      setForm(prev => ({ ...prev, orderId: generateOrderId() }));
    }
  }, [form.name, form.orderId]);

  useEffect(() => {
    if (step === 2 && !form.state) {
      setForm(prev => ({ ...prev, state: 'Abia' }));
    }
  }, [step, form.state]);

  
  const submit = async () => {
    setSubmitting(true);
    
    try {
      const orderId = form.orderId || generateOrderId();
      const formData = {
        name: form.name,
        phone: form.phone,
        package: packageMapping[form.pkg] || form.pkg,
        email: form.email,
        whatsapp: form.whatsapp,
        state: form.state,
        lga: form.lga,
        address: form.address,
        landmark: form.landmark,
        deliveryFee: form.deliveryFee,
        heardAboutUs: form.heardAboutUs,
        deliveryDate: form.deliveryDate,
        deliveryTimeWindow: form.deliveryTimeWindow,
        paymentMethod: form.paymentMethod,
        comment: form.comment,
      };

      const payload = {
        secret: FULANI_SECRET,
        type: 'complete',
        orderId: orderId,
        customerFullName: formData.name,
        phoneNumber: formData.phone,
        alternativePhone: formData.whatsapp || formData.phone,
        email: formData.email || '',
        packageSelected: formData.package,
        state: formData.state,
        lga: formData.lga,
        fullAddress: formData.address,
        landmark: formData.landmark || '',
        deliveryFee: formData.deliveryFee,
        preferredDeliveryDate: formData.deliveryDate || '',
        preferredDeliveryTime: formData.deliveryTimeWindow || '',
        paymentMethod: formData.paymentMethod || 'Pay on Delivery',
        comment: formData.comment || '',
        heardAboutUs: formData.heardAboutUs || ''
      };

      const body = new URLSearchParams(
        Object.entries(payload).map(([k, v]) => [k, v == null ? '' : String(v)])
      );

      fetch(FULANI_API_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
        body
      }).catch(e => console.error('Order submission request failed (fire-and-forget):', e));

      setTimeout(() => {
        window.location.href = `/thank-you?orderId=${encodeURIComponent(orderId)}`;
      }, 500);
      
    } catch (e) {
      console.error('Order submission failed:', e);
      alert('Error submitting order. Please try again.');
    }
    
    setSubmitting(false);
  };

  return (
    <div style={S.container}>
      <div style={S.box}>
        {/* PROGRESS BAR - ADD THIS AT THE TOP OF THE FORM */}
        <div id="step-indicator" style={{textAlign: 'center', fontWeight: 'bold', marginBottom: '10px', fontSize: '20px', color: '#000', padding: '10px', backgroundColor: '#f0f0f0', border: '1px solid #ccc', borderRadius: '8px'}} className="step-indicator-text">
          Step {step} of 2
        </div>
        <div style={{
          width: '100%',
          height: '8px',
          backgroundColor: '#e0e0e0',
          borderRadius: '4px',
          marginBottom: '20px'
        }}>
          <div style={{
            width: step === 1 ? '50%' : '100%',
            height: '100%',
            backgroundColor: '#4CAF50',
            borderRadius: '4px',
            transition: 'width 0.3s ease'
          }}></div>
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
              style={{ ...S.input, border: phoneError ? '2px solid #ff3b30' : S.input.border }}
              type="tel"
              inputMode="numeric"
              placeholder="08012345678"
              value={form.phone}
              onChange={handlePhoneChange}
            />
            {phoneError && (
              <p style={{ margin: '6px 0 0', color: '#ff3b30', fontSize: 12, fontWeight: 800 }}>
                ⚠️ {phoneError}
              </p>
            )}
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
              style={{
                ...S.btn,
                ...((phoneError || form.phone.replace(/\D/g, '').length !== 11 || !form.name || !form.pkg) ? S.btnDis : {})
              }}
              disabled={Boolean(phoneError) || form.phone.replace(/\D/g, '').length !== 11 || !form.name || !form.pkg}
              onClick={() => {
                const phoneDigits = form.phone.replace(/\D/g, '');
                const phoneOk = phoneDigits.length === 11 && phoneDigits.startsWith('0') && !phoneError;

                if (!form.name || !form.phone || !form.pkg) {
                  alert('Please fill all required fields');
                  return;
                }

                if (!phoneOk) {
                  alert('Please enter a valid 11-digit phone number');
                  return;
                }
                setStep(2);
                
                // Force scroll to step indicator when moving to Step 2
                setTimeout(() => {
                  const stepIndicator = document.getElementById('step-indicator');
                  if (stepIndicator) {
                    stepIndicator.scrollIntoView({ 
                      behavior: 'auto', // Changed from 'smooth' to 'auto' for faster performance on mobile data
                      block: 'start'
                    });
                  }
                }, 30); // Reduced from 50ms to 30ms for faster response on mobile data
              }}
            >
              CONTINUE (PAY ON DELIVERY)
            </button>
          </>
        )}

        {step === 2 && (
          <>
            {/* Email */}
            <label style={S.label}>EMAIL <span style={S.req}>*</span></label>
            <input
              style={S.input}
              placeholder="Enter your email"
              aria-label="Email"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
            />

            {/* Alternative phone */}
            <label style={S.label}>ALTERNATIVE PHONE NUMBER (WHATSAPP)</label>
            <input
              style={S.input}
              placeholder="WhatsApp number (optional)"
              aria-label="Alternative phone number (WhatsApp)"
              value={form.whatsapp}
              onChange={e => setForm({ ...form, whatsapp: e.target.value })}
            />

            {/* Full address */}
            <label style={S.label}>FULL ADDRESS <span style={S.req}>*</span></label>
            <textarea
              style={{ ...S.input, minHeight: 100, resize: 'vertical' as const }}
              placeholder="Full address"
              aria-label="Full address"
              value={form.address}
              onChange={e => setForm({ ...form, address: e.target.value })}
            />

            {/* Landmark */}
            <label style={S.label}>ANY LANDMARK</label>
            <input
              style={S.input}
              placeholder="Any landmark (optional)"
              aria-label="Any landmark"
              value={form.landmark}
              onChange={e => setForm({ ...form, landmark: e.target.value })}
            />
            <p style={S.hint}>e.g my house is on the road beside Agip filling station</p>

            {/* State */}
            <label style={S.label}>STATE OF RESIDENCE <span style={S.req}>*</span></label>
            <select
              style={S.input}
              value={form.state || 'Abia'}
              onChange={e => setForm({ ...form, state: e.target.value })}
              aria-label="Select state of residence"
            >
              {nigerianStates.map(s => <option key={s} value={s}>{s === 'FCT' ? 'FCT Abuja' : s}</option>)}
            </select>

            {/* Delivery fee & speed */}
            <label style={S.label}>DELIVERY FEE AND SPEED</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 8 }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', color: '#1a1a1a' }}>
                <input
                  type="radio"
                  name="deliveryFee"
                  checked={form.deliveryFee === 3000}
                  onChange={() => setForm({ ...form, deliveryFee: 3000 })}
                />
                <span style={{ fontSize: 14, fontWeight: 800, color: '#1a1a1a' }}>1 - 3 Days Nationwide Delivery ₦3000</span>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', color: '#1a1a1a' }}>
                <input
                  type="radio"
                  name="deliveryFee"
                  checked={form.deliveryFee === 5000}
                  onChange={() => setForm({ ...form, deliveryFee: 5000 })}
                />
                <span style={{ fontSize: 14, fontWeight: 800, color: '#1a1a1a' }}>24 Hours Nationwide Delivery ₦5000</span>
              </label>
            </div>
            <p style={S.hint}>Sometimes we upgrade your delivery speed at no extra cost to you.</p>

            {/* How did you hear */}
            <label style={{ ...S.label, textAlign: 'center' }}>HOW DID YOU HEAR ABOUT US? <span style={S.req}>*</span></label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', columnGap: 22, rowGap: 16, marginTop: 12 }}>
              {[
                'Facebook Ads',
                'Instagram Ads',
                'TikTok Ads',
                'WhatsApp',
                'Google Search',
                'A Friend / Referral',
                'Your Hair Stylist',
                'Repeat Customer',
                'Other'
              ].map(opt => (
                <label key={opt} style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer', color: '#1a1a1a', minHeight: 28 }}>
                  <input
                    type="radio"
                    name="heardAboutUs"
                    checked={form.heardAboutUs === opt}
                    onChange={() => setForm({ ...form, heardAboutUs: opt })}
                  />
                  <span
                    style={{
                      fontSize: 14,
                      fontWeight: 600,
                      color: '#1a1a1a',
                      lineHeight: 1.2,
                      wordBreak: 'normal',
                      overflowWrap: 'break-word',
                      whiteSpace: opt === 'WhatsApp' ? 'nowrap' : 'normal'
                    }}
                  >
                    {opt}
                  </span>
                </label>
              ))}
            </div>

            {/* Preferred delivery date */}
            <label style={S.label}>PREFERRED DELIVERY DATE <span style={S.req}>*</span></label>
            <input
              style={S.input}
              type="date"
              aria-label="Choose Delivery Date"
              placeholder="Choose Delivery Date"
              value={form.deliveryDate}
              onClick={e => (e.currentTarget as HTMLInputElement).showPicker?.()}
              onFocus={e => (e.currentTarget as HTMLInputElement).showPicker?.()}
              onChange={e => setForm({ ...form, deliveryDate: e.target.value })}
            />

            {/* Preferred delivery time window */}
            <label style={S.label}>PREFERRED DELIVERY TIME WINDOW <span style={S.req}>*</span></label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 10 }}>
              {[
                'Morning (9am - 12pm)',
                'Afternoon (12pm - 3pm)',
                'Evening (3pm - 6pm)',
                'Anytime on Preferred Day'
              ].map(opt => (
                <label key={opt} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', color: '#1a1a1a' }}>
                  <input
                    type="radio"
                    name="deliveryTimeWindow"
                    value={opt}
                    checked={form.deliveryTimeWindow === opt}
                    onChange={e => setForm({ ...form, deliveryTimeWindow: e.target.value })}
                  />
                  <span style={{ fontSize: 13, fontWeight: 700, color: '#1a1a1a' }}>{opt}</span>
                </label>
              ))}
            </div>
            <p style={S.hint}>We will do our absolute best to deliver at your preferred time. If there's any delay or change, our customer service / dispatch rider will call you ahead so you're fully carried along.</p>

            {/* Payment method */}
            <label style={S.label}>PAYMENT METHOD</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 10 }}>
              {['Pay on Delivery', 'Pay Before Delivery'].map(opt => (
                <label key={opt} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', color: '#1a1a1a' }}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={opt}
                    checked={form.paymentMethod === opt}
                    onChange={e => setForm({ ...form, paymentMethod: e.target.value })}
                  />
                  <span style={{ fontSize: 13, fontWeight: 700, color: '#1a1a1a' }}>{opt}</span>
                </label>
              ))}
            </div>

            {/* Comment */}
            <label style={S.label}>COMMENT OR MESSAGE</label>
            <textarea
              style={{ ...S.input, minHeight: 100, resize: 'vertical' as const }}
              placeholder="Comment or message (optional)"
              aria-label="Comment or message"
              value={form.comment}
              onChange={e => setForm({ ...form, comment: e.target.value })}
            />

            {/* Before you submit */}
            <label style={S.label}>BEFORE YOU SUBMIT <span style={S.req}>*</span></label>
            <div style={{ marginTop: 10 }}>
              <label style={{ display: 'flex', alignItems: 'flex-start', gap: 10, cursor: 'pointer', fontSize: 13, fontWeight: 600, color: '#333' }}>
                <input
                  type="checkbox"
                  checked={form.agreeToTerms}
                  onChange={e => setForm({ ...form, agreeToTerms: e.target.checked })}
                  style={{ cursor: 'pointer', marginTop: 2 }}
                />
                <span>I understand this is a Pay-on-Delivery order and I will be available to receive my package.</span>
              </label>
            </div>

            {/* Summary */}
            <div style={S.sum}>
              <div style={{ fontSize: 14, fontWeight: 900, letterSpacing: 0.6, textAlign: 'center', marginBottom: 10, color: '#1a1a1a' }}>📋 ORDER SUMMARY</div>
              {(() => {
                const p = packages.find(x => x.id === form.pkg);
                if (!p) return null;

                const deliveryFee = Number(form.deliveryFee || 0);
                const total = p.price + deliveryFee;
                const deliveryLabel = deliveryFee === 5000 ? 'Delivery (24 Hours)' : 'Delivery (1-3 Days)';
                const items = PACKAGE_CONTENTS[p.name] || [];
                const hasName = Boolean(form.name && form.name.trim());
                const hasAddress = Boolean(form.address && form.address.trim());
                const hasState = Boolean(form.state && form.state.trim());
                const hasLga = Boolean(form.lga && form.lga.trim());
                const locationLine = hasLga && hasState ? `${form.lga}, ${form.state}` : (hasState ? form.state : (hasLga ? form.lga : ''));

                return (
                  <>
                    <div style={{ padding: '10px 12px', background: '#fff', borderRadius: 12, boxShadow: '0 6px 18px rgba(0,0,0,0.08)', border: '1px solid #EDEDED' }}>
                      {hasName && (
                        <div style={{ fontSize: 18, fontWeight: 900, color: '#111', lineHeight: 1.2 }}>{form.name}</div>
                      )}
                      {locationLine && (
                        <div style={{ marginTop: hasName ? 6 : 0, fontSize: 13, fontWeight: 800, color: '#1a1a1a' }}>📍 {locationLine}</div>
                      )}
                      {hasAddress && (
                        <div style={{ marginTop: 6, fontSize: 13, fontWeight: 800, color: '#1a1a1a' }}>🏠 {form.address}</div>
                      )}

                      {(hasName || locationLine || hasAddress) && (
                        <div style={{ height: 1, background: '#EFEFEF', margin: '12px 0' }} />
                      )}

                      <div style={S.sr}><span style={{ fontWeight: 900, color: '#1a1a1a' }}>{p.name}</span><span style={{ fontWeight: 900 }}>₦{p.price.toLocaleString()}</span></div>

                      <div style={{ marginTop: 10, fontSize: 13, fontWeight: 900, color: '#1a1a1a' }}>📦 You will receive:</div>
                      <div style={{ marginTop: 6, display: 'grid', gap: 4, paddingLeft: 8 }}>
                        {items.map(line => (
                          <div key={line} style={{ fontSize: 13, fontWeight: 800, color: '#1a1a1a' }}>• {line}</div>
                        ))}
                      </div>

                      <div style={{ height: 1, background: '#EFEFEF', margin: '12px 0' }} />

                      <div style={S.sr}><span>🚚 {deliveryLabel}</span><span>₦{deliveryFee.toLocaleString()}</span></div>

                      <div style={{ height: 1, background: '#EFEFEF', margin: '12px 0' }} />

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                        <span style={{ fontSize: 13, fontWeight: 900, letterSpacing: 0.5, color: '#1a1a1a' }}>TOTAL</span>
                        <span style={{ fontSize: 18, fontWeight: 900, color: '#36CA37' }}>₦{total.toLocaleString()}</span>
                      </div>
                    </div>
                  </>
                );
              })()}
            </div>

            {/* Buttons */}
            <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
              <button style={S.back} onClick={() => {
                setStep(1);
                // Force scroll to step indicator when going back to Step 1
                setTimeout(() => {
                  const stepIndicator = document.getElementById('step-indicator');
                  if (stepIndicator) {
                    stepIndicator.scrollIntoView({ 
                      behavior: 'auto', // Changed from 'smooth' to 'auto' for faster performance on mobile data
                      block: 'start'
                    });
                  }
                }, 30); // Reduced from 50ms to 30ms for faster response on mobile data
              }}>← Back</button>
              <button
                style={{ ...S.btn, flex: 1, ...(submitting ? S.btnDis : {}) }}
                disabled={submitting}
                onClick={() => {
                  const phoneDigits = form.phone.replace(/\D/g, '');
                  const phoneOk = phoneDigits.length === 11 && phoneDigits.startsWith('0') && !phoneError;
                  const emailOk = !!form.email.trim();
                  const addressOk = !!form.address.trim();
                  const stateOk = !!form.state;
                  const heardOk = !!form.heardAboutUs;
                  const dateOk = !!form.deliveryDate;
                  const timeOk = !!form.deliveryTimeWindow;
                  const termsOk = !!form.agreeToTerms;

                  if (!phoneOk || !emailOk || !addressOk || !stateOk || !heardOk || !dateOk || !timeOk || !termsOk) {
                    alert('Please fill all required fields and agree to terms');
                    return;
                  }

                  submit();
                }}
              >
                {submitting ? 'PROCESSING...' : '→ SUBMIT'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default memo(OrderFormEmbed);
