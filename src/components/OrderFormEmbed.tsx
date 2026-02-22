import { useState, useEffect, useCallback, useMemo, useRef, CSSProperties, memo } from 'react';
import nigeriaLGAs from '@/data/nigeriaLGAs.json';
import { fireLeadSync, fireFormStart, fireAddToCart, fireInitiateCheckout, fireCartRecovery, markEventsAsFired } from '@/utils/metaTracking';
import { WEBHOOK_URL, WEBHOOK_SECRET, FULANI_API_URL, PHONE_DISPLAY } from '@/config/api';
import { toast } from 'sonner';

// Send webhook with no-cors for Google Apps Script compatibility
async function sendToWebhook(payload: Record<string, any>): Promise<boolean> {
  try {
    // CRITICAL: no-cors is mandatory for Google Apps Script
    await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      mode: "no-cors" 
    });
    return true;
  } catch (error) {
    console.error("Webhook error:", error);
    return false;
  }
}

const submitToFulani = async (formData) => {
  const payload = {
    secret: WEBHOOK_SECRET,
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
    await fetch(WEBHOOK_URL, {
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
  { id: 'PKG-001', name: 'THE TRIAL KIT (Self Love Plus)', webhookName: 'SELF LOVE PLUS', price: 32750, originalPrice: 55000, discount: 40, items: '1× Shampoo | 1× Pomade | 1× Conditioner', supply: 'The 30-Day Test: Experience immediate scalp relief and test the formula before committing to a full recovery.', freeItems: 'Important: Hair recovery is a biological cycle. While the Trial Kit resets your scalp, permanent edge restoration and follicle wake-up typically require 60–90 days of consistent 3-step use.', isPopular: false },
  { id: 'PKG-002', name: 'SELF LOVE RETURN', webhookName: 'SELF LOVE RETURN', price: 42750, originalPrice: 75000, discount: 43, items: '3× Pomade 🧴', supply: '3-Month Maintenance: Best for returning fans to keep growth consistent. Not for first-timers—you need the Shampoo to purify your scalp for real results.', freeItems: '', isPopular: false },
  { id: 'PKG-003', name: 'SELF LOVE B2GOF', webhookName: 'SELF LOVE B2GOF', price: 52750, originalPrice: 110000, discount: 52, items: '2× Shampoo | 2× Pomade', supply: '🧴 3-Month Scalp Reset: Essential for new customers to purify the scalp and clear dandruff so the Pomade can trigger real growth.', freeItems: '+ 🎁 FREE: 1 Shampoo + 1 Pomade', isPopular: false },
  { id: 'PKG-004', name: 'SELF LOVE PLUS B2GOF', webhookName: 'SELF LOVE PLUS B2GOF', price: 66750, originalPrice: 165000, discount: 60, items: '2× Shampoo | 2× Pomade | 2× Conditioner', supply: '🧴 3-Month Recovery System: The complete professional routine. Essential for first-timers to purify, nourish, and seal for a full biological growth cycle.', freeItems: '+ 🎁 FREE: 1 Shampoo + 1 Pomade + 1 Conditioner', isPopular: true },
  { id: 'PKG-005', name: 'FAMILY SAVES', webhookName: 'FAMILY SAVES', price: 215000, originalPrice: 550000, discount: 61, items: '6× Shampoo | 6× Pomade | 6× Conditioner', supply: '12 Month Supply', freeItems: '+ 🎁 FREE: 4 Shampoos + 4 Pomades + 4 Conditioners', isPopular: false },
];

// Generate unique Order ID - YYMMDDHHmm format
const generateOrderId = (): string => {
  const now = new Date();
  const yy = String(now.getFullYear()).slice(-2);  // 26
  const mm = String(now.getMonth() + 1).padStart(2, '0');  // 01
  const dd = String(now.getDate()).padStart(2, '0');     // 09
  const hh = String(now.getHours()).padStart(2, '0');    // 19
  const min = String(now.getMinutes()).padStart(2, '0'); // 36
  return `${yy}${mm}${dd}${hh}${min}`; // 2602091936
};

// Get orderId from URL or generate new one
const getOrderIdFromURL = (): string => {
  if (typeof window !== 'undefined') {
    const urlParams = new URLSearchParams(window.location.search);
    const existingOrderId = urlParams.get('orderId');
    if (existingOrderId && existingOrderId.trim().length > 0) {
      console.log('🔄 Recovery link detected - using existing orderId:', existingOrderId);
      return existingOrderId.trim();
    }
  }
  return generateOrderId();
};

// All styles as objects
const S: { [key: string]: CSSProperties } = {
  container: { maxWidth: 500, margin: '0 auto', padding: '0 16px', fontFamily: '-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif' },
  box: { background: '#fff', border: '2px solid #DAA520', borderRadius: 16, padding: '24px 20px', boxShadow: '0 8px 30px rgba(0,0,0,0.08)' },
  // Mobile-specific container styles
  containerMobile: { padding: '0 12px' },
  boxMobile: { padding: '16px 12px', borderRadius: 12 },
  step: { fontSize: 14, fontWeight: 600, color: '#666', margin: '0 0 8px' },
  bar: { height: 8, background: '#E0E0E0', borderRadius: 4, overflow: 'hidden', marginBottom: 20 },
  fill: { height: '100%', background: 'linear-gradient(90deg, #36CA37, #2eb82e)', transition: 'width 0.3s' },
  label: { display: 'block', fontSize: 13, fontWeight: 800, color: '#1a1a1a', textTransform: 'uppercase' as const, margin: '16px 0 8px' },
  req: { color: '#D30000' },
  input: { width: '100%', padding: '14px 16px', background: '#F9F9F9', border: '2px solid #E0E0E0', borderRadius: 10, fontSize: 16, fontWeight: 600, color: '#1a1a1a', outline: 'none', boxSizing: 'border-box' as const, fontFamily: 'inherit' },
  hint: { fontSize: 12, color: '#666', margin: '6px 0 0' },
  pkgs: { display: 'flex', flexDirection: 'column' as const, gap: 12, marginTop: 12 },
  card: { display: 'block', position: 'relative' as const, padding: '14px 14px 14px 48px', background: '#fff', border: '2px solid #E0E0E0', borderRadius: 12, cursor: 'pointer', transition: 'all 0.2s' },
  cardSel: { borderColor: '#DAA520', background: '#FFFBF0', boxShadow: '0 4px 12px rgba(218,165,32,0.2)' },
  // Mobile-specific styles
  cardMobile: { padding: '10px 10px 10px 36px' },
  cardSelMobile: { padding: '10px 10px 10px 36px' },
  radio: { position: 'absolute' as const, left: 14, top: 16, width: 22, height: 22, border: '3px solid #CCC', borderRadius: '50%', background: '#fff', boxSizing: 'border-box' as const, display: 'flex', alignItems: 'center', justifyContent: 'center' },
  radioSel: { borderColor: '#DAA520', background: '#DAA520' },
  check: { color: '#fff', fontSize: 12, fontWeight: 'bold' as const },
  pop: { position: 'absolute' as const, top: -10, right: 10, background: '#D30000', color: '#fff', fontSize: 9, fontWeight: 800, padding: '4px 10px', borderRadius: 20, textTransform: 'uppercase' as const, boxShadow: '0 2px 8px rgba(211,0,0,0.3)' },
  r1: { display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 4 },
  name: { fontSize: 14, fontWeight: 800, color: '#1a1a1a' },
  nameMobile: { fontSize: 13 },
  pr: { textAlign: 'right' as const },
  old: { fontSize: 11, color: '#4b5563', textDecoration: 'line-through', marginRight: 4 },
  newP: { fontSize: 18, fontWeight: 900, color: '#D30000' },
  newPMobile: { fontSize: 16 },
  r2: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  items: { fontSize: 12, fontWeight: 600, color: '#555' },
  itemsMobile: { fontSize: 11 },
  disc: { fontSize: 12, fontWeight: 800, color: '#D30000' },
  discMobile: { fontSize: 11 },
  free: { background: 'linear-gradient(135deg, #2E8B2E, #3CB371)', color: '#fff', fontSize: 11, fontWeight: 700, padding: '6px 12px', borderRadius: 6, textAlign: 'center' as const, margin: '6px 0' },
  freeMobile: { fontSize: 10, padding: '4px 8px', margin: '4px 0' },
  dur: { fontSize: 10, fontWeight: 600, color: '#888', textAlign: 'center' as const, marginTop: 4 },
  durMobile: { fontSize: 9, marginTop: 2 },
  pay: { fontSize: 14, color: '#666', textAlign: 'center' as const, margin: '16px 0' },
  // Mobile styles for "How did you hear about us"
  hearAboutUsGridMobile: { display: 'flex', flexDirection: 'column' as const, gap: 12, marginTop: 12 },
  hearAboutUsOptionMobile: { display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer', color: '#1a1a1a', minHeight: 44, padding: '12px', background: '#F9F9F9', border: '1px solid #E0E0E0', borderRadius: 8, fontSize: 14, fontWeight: 600, transition: 'all 0.2s' },
  hearAboutUsOptionHoverMobile: { background: '#F0F0F0', borderColor: '#DAA520' },
  btn: { width: '100%', background: '#36CA37', color: '#fff', border: 'none', borderRadius: 10, padding: 18, fontSize: 16, fontWeight: 'bold' as const, textTransform: 'uppercase' as const, cursor: 'pointer', boxShadow: '0 6px 20px rgba(54,202,55,0.4)', fontFamily: 'inherit' },
  btnDis: { background: '#ccc', cursor: 'not-allowed', boxShadow: 'none' },
  back: { background: '#F0F0F0', color: '#666', border: 'none', borderRadius: 10, padding: '18px 24px', fontSize: 14, fontWeight: 'bold' as const, cursor: 'pointer', fontFamily: 'inherit' },
  sum: { background: '#F9F9F9', border: '1px solid #E0E0E0', borderRadius: 10, padding: 16, marginTop: 16 },
  sr: { display: 'flex', justifyContent: 'space-between', fontSize: 14, color: '#666', margin: '8px 0' },
  tot: { display: 'flex', justifyContent: 'space-between', fontSize: 16, fontWeight: 800, borderTop: '1px solid #E0E0E0', paddingTop: 12, marginTop: 8 },
  suc: { textAlign: 'center' as const, padding: '40px 20px' },
  sucIcon: { width: 60, height: 60, background: '#36CA37', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 30, color: '#fff', margin: '0 auto 20px' },
};

const postOrderToFulani = (bodyString: string) => {
  try {
    if (typeof navigator !== 'undefined' && typeof navigator.sendBeacon === 'function') {
      const blob = new Blob([bodyString], { type: 'application/x-www-form-urlencoded;charset=UTF-8' });
      const ok = navigator.sendBeacon(WEBHOOK_URL, blob);
      if (ok) return;
    }
  } catch {
    // ignore
  }

  fetch(WEBHOOK_URL, {
    method: 'POST',
    mode: 'no-cors',
    keepalive: true,
    headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
    body: bodyString
  }).catch((error) => {
    console.error('postOrderToFulani fallback fetch failed:', error);
  });
};

function OrderFormEmbed() {
  // const { trackFormStart, trackAddToCart, trackInitiateCheckout, isEventFired, captureIdentity, getCapturedIdentity, setupIdentityListeners } = useMetaPixel(); // Tracking removed
  const [step, setStep] = useState(1);
  
  // Generate orderId on component mount (or get from URL)
  const [orderId] = useState(() => getOrderIdFromURL());
  const [isRecoveryLink, setIsRecoveryLink] = useState(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      return urlParams.get('orderId')?.trim().length > 0;
    }
    return false;
  });
  const [lastFiredPhone, setLastFiredPhone] = useState("");
  
  const [form, setForm] = useState({ 
    name: '', 
    phone: '', 
    pkg: '', // No pre-selection
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
    orderId: orderId, // Set generated orderId
    couponCode: '',
    couponApplied: false,
  });
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [phoneError, setPhoneError] = useState('');
  const [deliveryDateError, setDeliveryDateError] = useState('');
  
  // Auto-advance ref to prevent multiple auto-advances
  const hasAutoAdvanced = useRef(false);
  
    
  // Ref to track InitiateCheckout trigger (Step 2 advancement)
  const hasTriggeredInitiateCheckout = useRef(false);
  
  // Ref to track FormStart trigger (first keystroke in any field)
  const hasTriggeredFormStart = useRef(false);
  
  // Ref to track AddToCart trigger (email + phone valid on Step 1)
  const hasTriggeredAddToCart = useRef(false);
  
  // Input refs for keyboard scroll handling
  const nameInputRef = useRef<HTMLInputElement>(null);
  const phoneInputRef = useRef<HTMLInputElement>(null);
  const emailInputRef = useRef<HTMLInputElement>(null);

  // Handle input focus to scroll into view on mobile
  const handleInputFocus = (ref: React.RefObject<HTMLInputElement>) => {
    if (window.innerWidth < 768 && ref.current) {
      setTimeout(() => {
        ref.current?.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center' 
        });
      }, 300);
    }
  };
  
  // 20-minute countdown timer state
  const [timeLeft, setTimeLeft] = useState({
    minutes: 20,
    seconds: 0
  });
  const [timerActive, setTimerActive] = useState(true);

  // Dynamic pricing based on timer
  const [currentPackages, setCurrentPackages] = useState(packages);

  // Update prices when timer expires
  useEffect(() => {
    if (!timerActive) {
      // Set prices to full original price when timer expires
      const updatedPackages = packages.map(p => ({
        ...p,
        price: p.originalPrice, // Set to full original price
        discount: 0 // No discount when timer expires
      }));
      setCurrentPackages(updatedPackages);
    }
  }, [timerActive]);

  // 4-Point Validation System with Progress Bar
  useEffect(() => {
    if (step !== 1) return;

    // Update progress bar and checkmarks
    const updateProgress = () => {
      const nameValid = form.name.trim().length >= 2;
      const phoneValid = form.phone.replace(/\D/g, '').length >= 10;
      const emailValid = form.email.includes('@') && form.email.includes('.') && form.email.length >= 5;
      const packageValid = !!form.pkg;

      let completed = 0;
      if (nameValid) completed++;
      if (phoneValid) completed++;
      if (emailValid) completed++;
      if (packageValid) completed++;

      const percent = (completed / 4) * 100;
      const progressFill = document.getElementById('progressFill');
      const progressText = document.getElementById('progressText');
      
      if (progressFill) {
        progressFill.style.width = percent + '%';
      }

      // Update field checkmarks
      const nameWrapper = document.getElementById('nameFieldWrapper');
      const phoneWrapper = document.getElementById('phoneFieldWrapper');
      const emailWrapper = document.getElementById('emailFieldWrapper');
      
      if (nameWrapper) {
        const checkmark = nameWrapper.querySelector('.field-check') as HTMLElement;
        if (checkmark) {
          checkmark.style.opacity = nameValid ? '1' : '0';
        }
      }
      if (phoneWrapper) {
        const checkmark = phoneWrapper.querySelector('.field-check') as HTMLElement;
        if (checkmark) {
          checkmark.style.opacity = phoneValid ? '1' : '0';
        }
      }
      if (emailWrapper) {
        const checkmark = emailWrapper.querySelector('.field-check') as HTMLElement;
        if (checkmark) {
          checkmark.style.opacity = emailValid ? '1' : '0';
        }
      }

      // Update progress text
      if (progressText) {
        if (completed === 0) {
          progressText.textContent = 'Step 1 of 2 — Complete your details';
        } else if (completed < 4) {
          progressText.textContent = `Step 1 of 2 — ${completed} of 4 complete`;
        } else {
          progressText.textContent = 'Step 1 of 2 — All set! Moving to delivery...';
        }
      }

      // Auto-advance when all 4 are valid (2.5s delay so user can finish typing)
      if (completed === 4 && !hasAutoAdvanced.current) {
        setTimeout(() => {
          if (!hasAutoAdvanced.current && step === 1) {
            hasAutoAdvanced.current = true;
                        setStep(2);
          }
        }, 2500);
      }
    };

    updateProgress();
  }, [form.name, form.phone, form.email, form.pkg, step]);

  // Countdown timer effect
  useEffect(() => {
    if (!timerActive) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        const { minutes, seconds } = prev;
        
        if (minutes === 0 && seconds === 0) {
          setTimerActive(false);
          return { minutes: 0, seconds: 0 };
        }
        
        if (seconds === 0) {
          return { minutes: minutes - 1, seconds: 59 };
        }
        
        return { minutes, seconds: seconds - 1 };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timerActive]);

  // Debounce phone input to reduce unnecessary re-renders and API calls
  const debouncedPhone = useDebounce(form.phone, 300);

  // Memoize selected package calculation
  const selectedPackage = useMemo(() => {
    return currentPackages.find(p => p.id === form.pkg) || null;
  }, [form.pkg, currentPackages]);

  // STRICT AddToCart trigger - fire ONLY on Step 1 when email + phone are valid
  useEffect(() => {
    // STRICT: Only fire on Step 1
    if (step !== 1) return;
    
    // STRICT: Only fire once
    if (hasTriggeredAddToCart.current) return;

    // Validate email + phone
    const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email?.trim() || '');
    const isPhoneValid = (form.phone?.replace(/\D/g, '') || '').length >= 7;

    // STRICT: Both must be valid
    if (!isEmailValid || !isPhoneValid) return;

    // STRICT: Package must be selected before firing
    if (!form.pkg || !selectedPackage) return;

    // All conditions met — fire AddToCart and lock
    hasTriggeredAddToCart.current = true;
    
    console.log('[AddToCart] Firing on Step 1 — email + phone valid + package selected');

    fireAddToCart({
      packageName: packageMapping[form.pkg] || form.pkg || 'Fulani Hair Gro',
      amount: selectedPackage.price,
      email: form.email,
      phone: form.phone,
    });

    }, [step, form.email, form.phone, form.pkg, selectedPackage]); // Note: step is in dependencies to enforce Rule 1

  // FormStart trigger - fire on first keystroke in any Step 1 field
  useEffect(() => {
    // Prevent multiple fires
    if (hasTriggeredFormStart.current) return;

    // Check if any field has at least 1 character
    const hasStartedTyping = 
      (form.name && form.name.length > 0) || 
      (form.phone && form.phone.length > 0) || 
      (form.email && form.email.length > 0);

    if (hasStartedTyping) {
      hasTriggeredFormStart.current = true;
      
      console.log('[FormStart] User began typing');
      fireFormStart();
    }
  }, [form.name, form.phone, form.email]);

  // LeadSync trigger - fire on valid email or phone input
  useEffect(() => {
    // Check if email or phone has valid data
    const hasValidEmail = form.email && form.email.includes('@') && form.email.length > 5;
    const hasValidPhone = form.phone && form.phone.replace(/\D/g, '').length >= 10;
    
    if (hasValidEmail || hasValidPhone) {
      const nameParts = form.name.trim().split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';
      
      fireLeadSync({
        email: hasValidEmail ? form.email : undefined,
        phone: hasValidPhone ? form.phone : undefined,
        firstName,
        lastName,
      });
    }
  }, [form.email, form.phone, form.name]);

  // 🎯 Aggressive Identity Capturing - Real-time email/phone capture

  // InitiateCheckout trigger - fire when user advances to Step 2
  useEffect(() => {
    // Prevent multiple fires
    if (hasTriggeredInitiateCheckout.current) return;
    if (step !== 2) return; // Only fire on Step 2

    hasTriggeredInitiateCheckout.current = true;
    
    console.log('[InitiateCheckout] User advanced to Step 2 - firing InitiateCheckout event');
    
    // Build payload with all available data from Step 1
    const payload: any = {
      fullName: form.name || '',
      email: form.email ? form.email.trim().toLowerCase() : '',
      phone: form.phone ? form.phone.replace(/\D/g, '') : '',
      state: form.state || '',
      lga: form.lga || '',
      address: form.address || '',
      
      // NEW: Enhanced tracking data
      paymentMethod: form.paymentMethod || 'Pay on Delivery',
      heardAboutUs: form.heardAboutUs || '',
      deliveryDate: form.deliveryDate || '',
      deliveryTimeWindow: form.deliveryTimeWindow || '',
      deliveryFee: form.deliveryFee || 0
    };

    // Add package info if selected
    if (form.pkg && selectedPackage) {
      const packageName = packageMapping[form.pkg] || form.pkg || 'Fulani Hair Gro';
      payload.packageName = packageName;
      payload.packagePrice = selectedPackage.price;
      console.log('[InitiateCheckout] Package selected:', packageName);
      
      // Fire InitiateCheckout event
      const nameParts = form.name.trim().split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';
      
      fireInitiateCheckout({
        packageName,
        amount: selectedPackage.price,
        email: form.email,
        phone: form.phone,
        firstName,
        lastName,
      });
    } else {
      console.log('[InitiateCheckout] No package selected - firing with contact info only');
    }

    }, [step, form.name, form.email, form.phone, form.state, form.lga, form.address, form.paymentMethod, form.heardAboutUs, form.deliveryDate, form.deliveryTimeWindow, form.deliveryFee, form.pkg, selectedPackage]);

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

  // Memoize delivery fee calculation
  const deliveryFee = useMemo(() => {
    // Free shipping for Pay Before Delivery
    if (form.paymentMethod === 'Pay Before Delivery') {
      return 0;
    }
    // Free delivery when valid coupon applied
    if (form.couponApplied) {
      return 0;
    }
    // Use user's selected delivery fee for Pay on Delivery
    return form.deliveryFee || (form.state === 'Lagos' ? 3000 : 5000);
  }, [form.state, form.paymentMethod, form.deliveryFee, form.couponApplied]);

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
    
    // Save to localStorage for abandoned cart recovery
    try {
      let fbclid = '';
      try {
        const fbcData = localStorage.getItem('meta_fbc_data');
        if (fbcData) fbclid = JSON.parse(fbcData).fbclid || '';
      } catch {}

      const recoveryData = {
        orderId,
        name: formData.name || '',
        phone: formData.phone || formData.phoneNumber || '',
        email: formData.email || '',
        pkg: form.pkg || '',
        fbclid,
        timestamp: Date.now()
      };
      localStorage.setItem(`fhg_partial_${orderId}`, JSON.stringify(recoveryData));
      console.log('💾 Saved partial data to localStorage for recovery:', orderId);
    } catch (e) {
      console.warn('localStorage save failed:', e);
    }

    const partialPkg = packages.find(p => p.id === form.pkg);
    const payload = {
      secret: WEBHOOK_SECRET,
      type: 'partial',
      orderId: orderId,
      phone: formData.phone || formData.phoneNumber,
      name: formData.name || '',
      email: formData.email || '',
      packageName: formData.packageSelected || '',
      packageSelected: formData.packageSelected || '',
      packageAmount: partialPkg ? String(partialPkg.price) : ''
    };

    const body = new URLSearchParams(
      Object.entries(payload).map(([k, v]) => [k, v == null ? '' : String(v)])
    );

    try {
      let response: Response | undefined;
      try {
        response = await fetch(FULANI_API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
          body: body.toString()
        });
      } catch (corsError) {
        console.error('Partial entry fetch error (likely CORS). Retrying with no-cors:', corsError);
        await fetch(FULANI_API_URL, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
          body: body.toString()
        });
      }

      void response;
      return { success: true, orderId };
    } catch (error) {
      console.error('Partial entry error:', error);
      return { success: false, error };
    }
  };

  // Handle phone input - optimized with debounced validation and partial webhook
  const handlePhoneChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, ''); // Numeric only
    setForm(prev => ({ ...prev, phone: value }));

    // Trigger CALL 1: Partial Order on 11 digits
    if (value.length === 11 && value !== lastFiredPhone) {
      // Skip partial webhook for recovery links (order already exists)
      if (!isRecoveryLink) {
        // Dedup across page refreshes: check localStorage for recent partial with same phone
        let alreadyFired = false;
        try {
          const dedupKey = `fhg_partial_dedup_${value}`;
          const prev = localStorage.getItem(dedupKey);
          if (prev) {
            const ts = parseInt(prev, 10);
            // Suppress duplicate if fired within last 30 minutes
            if (Date.now() - ts < 30 * 60 * 1000) {
              alreadyFired = true;
              console.log("🔕 Partial already fired for", value, "within 30min — skipping duplicate");
            }
          }
        } catch { /* localStorage unavailable */ }

        if (!alreadyFired) {
          const partialPkg = packages.find(p => p.id === form.pkg);
          const partialPayload = {
            secret: WEBHOOK_SECRET,
            type: "partial",
            orderId: orderId,
            phone: value,
            name: form.name,
            email: form.email,
            packageName: form.pkg ? (packageMapping[form.pkg] || form.pkg) : '',
            packageAmount: partialPkg ? String(partialPkg.price) : '',
            // Meta tracking identifiers for offline conversion matching
            fbp: '',
            fbc: '',
            fbclid: (() => { try { const d = localStorage.getItem('meta_fbc_data'); return d ? JSON.parse(d).fbclid || '' : ''; } catch { return ''; } })(),
          };
          
          sendToWebhook(partialPayload);
          // Persist dedup timestamp
          try { localStorage.setItem(`fhg_partial_dedup_${value}`, String(Date.now())); } catch {}
          console.log("🎯 Partial Lead Captured:", value, "Order ID:", orderId);
        }
        setLastFiredPhone(value); // Prevent re-firing for same number (in-memory)
      } else {
        console.log("🔄 Recovery link detected - skipping partial webhook for existing order:", orderId);
        setLastFiredPhone(value); // Still set to prevent re-firing
      }
    }
  }, [lastFiredPhone, orderId, form.name, form.email, form.pkg, isRecoveryLink]);

  // Effect to handle debounced phone validation and partial save
  useEffect(() => {
    const digits = debouncedPhone.replace(/\D/g, '');
    const nextPhoneError = validatePhone(debouncedPhone);
    setPhoneError(nextPhoneError);
    
    // Save partial when phone is valid (exactly 11 digits), email is valid, AND not already saved
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const validEmail = form.email && emailRegex.test(form.email);
    
    if (digits.length === 11 && validEmail && !sent && !nextPhoneError) {
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
      void nextPhoneError;
    }
  }, [debouncedPhone, validatePhone, sent, form.name, form.orderId, form.pkg]);

  // Generate Order ID on first name entry
  useEffect(() => {
    if (form.name && !form.orderId) {
      setForm(prev => ({ ...prev, orderId: generateOrderId() }));
    }
  }, [form.name, form.orderId]);

  // Auto-scroll to form and handle recovery link — restore saved partial data
  useEffect(() => {
    if (isRecoveryLink && typeof window !== 'undefined') {
      console.log('🔄 Recovery link detected - restoring partial data for orderId:', orderId);
      
      // Pre-mark Meta events as fired to prevent duplicates from pre-filled data
      markEventsAsFired(['FormStart', 'LeadSync', 'AddToCart']);
      hasTriggeredFormStart.current = true;
      hasTriggeredAddToCart.current = true;

      // Try to restore partial form data from localStorage
      let restored = false;
      try {
        const saved = localStorage.getItem(`fhg_partial_${orderId}`);
        if (saved) {
          const data = JSON.parse(saved);
          setForm(prev => ({
            ...prev,
            name: data.name || prev.name,
            phone: data.phone || prev.phone,
            email: data.email || prev.email,
            pkg: data.pkg || prev.pkg,
            orderId: orderId
          }));
          restored = true;
          console.log('✅ Restored partial data from localStorage:', data);
          toast.success('Welcome back! We restored your details.');
          if (data.fbclid) {
            try {
              localStorage.setItem('meta_fbc_data', JSON.stringify({
                fbc: `fb.1.${Date.now()}.${data.fbclid}`, fbclid: data.fbclid,
                timestamp: Date.now(), expiresAt: Date.now() + 30*24*60*60*1000,
              }));
            } catch {}
          }
          const np = (data.name || '').trim().split(' ');
          fireCartRecovery({ orderId, email: data.email, phone: data.phone, firstName: np[0] || '', lastName: np.slice(1).join(' ') || '' });
        }
      } catch (e) {
        console.warn('localStorage restore failed:', e);
      }

      // If localStorage didn't have data, try the backend API
      if (!restored) {
        (async () => {
          try {
            const payload = {
              secret: WEBHOOK_SECRET,
              type: 'retrieve_partial',
              orderId: orderId
            };
            const body = new URLSearchParams(
              Object.entries(payload).map(([k, v]) => [k, v == null ? '' : String(v)])
            );
            const response = await fetch(FULANI_API_URL, {
              method: 'POST',
              headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
              body: body.toString()
            });
            if (response.ok) {
              const result = await response.json();
              if (result.data) {
                setForm(prev => ({
                  ...prev,
                  name: result.data.name || prev.name,
                  phone: result.data.phone || prev.phone,
                  email: result.data.email || prev.email,
                  pkg: result.data.pkg || result.data.packageSelected || prev.pkg,
                  orderId: orderId
                }));
                console.log('✅ Restored partial data from backend:', result.data);
                toast.success('Welcome back! We restored your details.');
                const np = (result.data.name || '').trim().split(' ');
                fireCartRecovery({ orderId, email: result.data.email, phone: result.data.phone, firstName: np[0] || '', lastName: np.slice(1).join(' ') || '' });
              } else {
                fireCartRecovery({ orderId });
              }
            } else {
              fireCartRecovery({ orderId });
            }
          } catch (e) {
            console.warn('Backend partial restore failed:', e);
            fireCartRecovery({ orderId });
          }
        })();
      }
      
      // Mark sent to prevent re-firing partial webhook for recovered orders
      setSent(true);

      // Auto-scroll to order form after a short delay
      const timer = setTimeout(() => {
        const formElement = document.getElementById('order-form') || document.querySelector('[role="main"]') || document.querySelector('main');
        if (formElement) {
          formElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
          console.log('📍 Scrolled to order form');
        } else {
          window.scrollTo({ top: 0, behavior: 'smooth' });
          console.log('📍 Scrolled to top (form not found)');
        }
      }, 800);

      return () => clearTimeout(timer);
    }
  }, [isRecoveryLink, orderId]);

  useEffect(() => {
    if (step === 2 && !form.state) {
      setForm(prev => ({ ...prev, state: 'Abia' }));
    }
  }, [step, form.state]);

  
  const submit = async () => {
    setSubmitting(true);
    
    try {
      const orderId = form.orderId || generateOrderId();
      const packageName = packageMapping[form.pkg] || form.pkg || 'Fulani Hair Gro';
      const packageAmount = selectedPackage?.price ?? 75000; // Default fallback price
      const calculatedDeliveryFee = deliveryFee; // Use memoized calculated value
      const totalAmount = packageAmount + calculatedDeliveryFee;

      const formData = {
        name: form.name,
        phone: form.phone,
        package: packageName,
        email: form.email,
        whatsapp: form.whatsapp,
        state: form.state,
        lga: form.lga,
        address: form.address,
        landmark: form.landmark,
        deliveryFee: calculatedDeliveryFee,
        heardAboutUs: form.heardAboutUs,
        deliveryDate: form.deliveryDate,
        deliveryTimeWindow: form.deliveryTimeWindow,
        paymentMethod: form.paymentMethod,
        comment: form.comment,
      };

      // Debug: Log the name value to investigate timing issues
      console.log('[DEBUG] Submitting form with name:', formData.name);
      console.log('[DEBUG] Form state name:', form.name);
      console.log('[DEBUG] formData object:', formData);

      // Store order data in sessionStorage for ThankYou page
      try {
        window.sessionStorage.setItem(
          'fhg_order_data',
          JSON.stringify({
            orderId,
            fullName: form.name,
            phone: form.phone,
            email: form.email,
            packageName,
            packageAmount,
            deliveryFee: calculatedDeliveryFee,
            totalAmount: packageAmount + calculatedDeliveryFee,
            paymentType: form.paymentMethod === 'Pay Before Delivery' ? 'PBD' : 'POD',
            state: form.state,
            lga: form.lga,
            address: form.address,
            landmark: form.landmark,
            deliveryDate: form.deliveryDate,
            deliveryTimeWindow: form.deliveryTimeWindow,
            paymentMethod: form.paymentMethod,
            numItems: selectedPackage?.items?.length || 1,
            heardAboutUs: form.heardAboutUs
          })
        );
      } catch (error) {
        console.error('Failed to save order data to sessionStorage:', error);
      }

      const completePayload = {
        secret: WEBHOOK_SECRET,
        type: "complete",
        orderId: orderId,
        name: formData.name || 'Customer Name Not Provided',
        phone: formData.phone,
        email: formData.email || '',
        packageName: selectedPackage?.webhookName || formData.package, // Use webhookName for backend compatibility
        totalAmount: packageAmount, // Product price ONLY (no delivery fee)
        deliveryType: calculatedDeliveryFee === 5000 ? "SAME_DAY" : "STANDARD",
        state: formData.state,
        lga: formData.lga,
        address: formData.address,
        landmark: formData.landmark || '',
        // NEW: Add missing fields for Google Sheets columns P-S
        deliveryDate: formData.deliveryDate || '',
        deliveryTimeWindow: formData.deliveryTimeWindow || '',
        paymentMethod: formData.paymentMethod || 'Pay on Delivery',
        heardAboutUs: formData.heardAboutUs || '',
        couponCode: form.couponApplied ? form.couponCode : '',
        deliveryFee: calculatedDeliveryFee,
        
        // Meta tracking identifiers — passed to Apps Script for true server-side CAPI
        fbp: (() => { try { const m = document.cookie.match(/(^| )_fbp=([^;]+)/); return m ? decodeURIComponent(m[2]) : ''; } catch { return ''; } })(),
        fbc: (() => { try { const m = document.cookie.match(/(^| )_fbc=([^;]+)/); if (m) return decodeURIComponent(m[2]); const d = localStorage.getItem('meta_fbc_data'); return d ? JSON.parse(d).fbc || '' : ''; } catch { return ''; } })(),
        fbclid: (() => { try { const d = localStorage.getItem('meta_fbc_data'); return d ? JSON.parse(d).fbclid || '' : ''; } catch { return ''; } })(),
        eventId: orderId,
        userAgent: navigator.userAgent,
      };

      console.log("🚀 Sending Complete Order:", completePayload);

      // Fire webhook (keepalive ensures it completes even after navigation)
      // Do NOT await — redirect immediately for instant UX
      fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(completePayload),
        mode: 'no-cors',
        keepalive: true
      }).catch(err => console.error('Webhook error:', err));

      // Redirect instantly — order data already in sessionStorage
      window.location.href = `/thank-you?orderId=${encodeURIComponent(orderId)}`;
      return;
      
    } catch (e) {
      console.error('Order submission failed:', e);
      toast.error('Something went wrong submitting your order. Please try again.');
      setSubmitting(false);
    }
  };

  return (
    <div style={{ ...S.container, ...(window.innerWidth < 768 ? S.containerMobile : {}) }}>
      <div style={{ ...S.box, ...(window.innerWidth < 768 ? S.boxMobile : {}) }}>
        {/* PROGRESS BAR - ADD THIS AT THE TOP OF THE FORM */}
        <div id="step-indicator" style={{textAlign: 'center', fontWeight: 'bold', marginBottom: '10px', fontSize: '16px', color: '#000', padding: '12px 10px', backgroundColor: '#f0f0f0', border: '1px solid #ccc', borderRadius: '8px'}} className="step-indicator-text">
          <div style={{ fontSize: '20px', marginBottom: '2px' }}>
            Step {step} of 2
          </div>
          <div style={{ fontSize: '12px', fontWeight: '500', color: '#6B7280' }}>
            {step === 1 ? '📦 Choose Package & Enter Details' : '📍 Delivery Address & Confirm'}
          </div>
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
            {/* Progress Bar */}
            <div style={{
              marginBottom: '20px',
              textAlign: 'center'
            }}>
              <div style={{
                width: '100%',
                height: '6px',
                background: '#E5E7EB',
                borderRadius: '100px',
                overflow: 'hidden',
                marginBottom: '8px'
              }}>
                <div id="progressFill" style={{
                  height: '100%',
                  width: '0%',
                  background: 'linear-gradient(90deg, #14532d, #16a34a)',
                  borderRadius: '100px',
                  transition: 'width 0.4s ease'
                }} />
              </div>
              <p id="progressText" style={{
                fontSize: '12px',
                fontWeight: '600',
                color: '#6B7280',
                margin: '0'
              }}>Step 1 of 2 — Complete your details</p>
            </div>

            {/* 20-Minute Countdown Timer */}
            <div style={{
              background: timerActive ? 'linear-gradient(135deg, #CC0000, #FF0000)' : 'linear-gradient(135deg, #666, #999)',
              color: '#fff',
              padding: '12px',
              borderRadius: '8px',
              textAlign: 'center',
              marginBottom: '16px',
              fontSize: '14px',
              fontWeight: '600',
              boxShadow: timerActive ? '0 4px 12px rgba(204,0,0,0.3)' : '0 4px 12px rgba(0,0,0,0.2)',
              border: timerActive ? '2px solid #CC0000' : '2px solid #666'
            }}>
              <div style={{ fontSize: '12px', marginBottom: '4px', textTransform: 'uppercase' }}>
                {timerActive ? '⏰ Hurry! Price goes back to full price in:' : '⏰ Prices Increased!'}
              </div>
              <div style={{ fontSize: '18px', fontWeight: '800', fontFamily: 'monospace' }}>
                {String(timeLeft.minutes).padStart(2, '0')}min:{String(timeLeft.seconds).padStart(2, '0')}sec
              </div>
              <div style={{ fontSize: '11px', marginTop: '4px', opacity: 0.9 }}>
                {timerActive ? 'Order now to lock in your discount!' : 'Now at full price - no discount'}
              </div>
            </div>

            {/* Packages — shown FIRST so customers commit to a plan before entering details */}
            <label style={S.label}>CHOOSE YOUR HAIR REGROWTH SYSTEM <span style={S.req}>*</span></label>
            <p style={{ fontSize: '12px', color: '#6B7280', margin: '-4px 0 8px', fontWeight: '500' }}>
              Select a package below, then fill in your details to complete your order.
            </p>
            <div style={{
              fontFamily: 'DM Sans, sans-serif',
              background: '#F3F0EC',
              padding: '16px 12px 40px',
              borderRadius: '12px',
              border: '1.5px solid #E5E7EB'
            }}>
              {currentPackages.map(p => {
                const selected = form.pkg === p.id;
                const isFeatured = p.id === 'PKG-004'; // Self Love Plus B2GOF
                const isBestValue = p.id === 'PKG-005'; // Family Saves
                
                return (
                  <div
                    key={p.id}
                    onClick={() => {
                      // 1. Visual feedback - select this card
                      setForm({ ...form, pkg: p.id });
                      
                      // 2. Error nudge if fields missing
                      const nameValid = form.name.trim().length >= 2;
                      const phoneValid = form.phone.replace(/\D/g, '').length >= 10;
                      const emailValid = form.email.includes('@') && form.email.includes('.') && form.email.length >= 5;
                      
                      if (!nameValid || !phoneValid || !emailValid) {
                        const nameInput = document.getElementById('nameFieldWrapper')?.querySelector('input');
                        const phoneInput = document.getElementById('phoneFieldWrapper')?.querySelector('input');
                        const emailInput = document.getElementById('emailFieldWrapper')?.querySelector('input');
                        
                        const firstEmpty = (!nameValid && nameInput) ? nameInput
                          : (!phoneValid && phoneInput) ? phoneInput
                          : emailInput;

                        if (firstEmpty) {
                          firstEmpty.scrollIntoView({ behavior: 'smooth', block: 'center' });
                          firstEmpty.style.outline = '2px solid #1a7a4a';
                          firstEmpty.style.outlineOffset = '2px';
                          firstEmpty.focus();
                          setTimeout(() => {
                            firstEmpty.style.outline = '';
                            firstEmpty.style.outlineOffset = '';
                          }, 2000);
                        }
                      }
                    }}
                    style={{
                      border: isFeatured ? '3px solid #14532d' : isBestValue ? '2px solid #D4AF37' : '1.5px solid #E5E7EB',
                      borderRadius: '12px',
                      padding: isFeatured ? '18px' : '14px',
                      position: 'relative',
                      cursor: 'pointer',
                      marginBottom: '10px',
                      opacity: isFeatured ? 1 : (selected ? 1 : 0.7),
                      boxShadow: isFeatured 
                        ? '0 0 0 4px rgba(20,83,45,0.1), 0 4px 20px rgba(20,83,45,0.18), 0 8px 40px rgba(20,83,45,0.08)'
                        : isBestValue 
                        ? '0 2px 14px rgba(212,175,55,0.15)'
                        : 'none',
                      background: isFeatured ? 'linear-gradient(180deg, #f8fefb 0%, #ffffff 100%)' : '#fff',
                      transition: 'box-shadow 0.25s ease, border-color 0.25s ease',
                      WebkitFontSmoothing: 'antialiased',
                      MozOsxFontSmoothing: 'grayscale'
                    }}
                    onMouseEnter={(e) => {
                      const card = e.currentTarget;
                      if (isFeatured) {
                        card.style.boxShadow = '0 0 0 5px rgba(26,122,74,0.12), 0 6px 24px rgba(26,122,74,0.22)';
                      } else if (isBestValue) {
                        card.style.boxShadow = '0 6px 20px rgba(212,175,55,0.25)';
                        card.style.borderColor = '#D4AF37';
                      } else {
                        card.style.boxShadow = '0 6px 20px rgba(0,0,0,0.1)';
                        card.style.borderColor = '#aaa';
                      }
                      card.style.opacity = '1';
                    }}
                    onMouseLeave={(e) => {
                      const card = e.currentTarget;
                      if (isFeatured) {
                        card.style.boxShadow = '0 0 0 4px rgba(20,83,45,0.1), 0 4px 20px rgba(20,83,45,0.18), 0 8px 40px rgba(20,83,45,0.08)';
                        card.style.borderColor = '3px solid #14532d';
                      } else if (isBestValue) {
                        card.style.boxShadow = '0 2px 14px rgba(212,175,55,0.15)';
                        card.style.borderColor = '2px solid #D4AF37';
                      } else {
                        card.style.boxShadow = 'none';
                        card.style.borderColor = '1.5px solid #E5E7EB';
                      }
                      card.style.opacity = selected || isFeatured ? '1' : '0.7';
                    }}
                  >
                    {/* Radio circle */}
                    <div style={{
                      width: '16px',
                      height: '16px',
                      borderRadius: '50%',
                      border: selected ? '2px solid #14532d' : '2px solid #D1D5DB',
                      position: 'absolute',
                      top: isFeatured ? '18px' : '14px',
                      left: '14px',
                      background: selected ? 'radial-gradient(circle, #14532d 38%, transparent 39%)' : 'transparent'
                    }} />

                    {/* Tags */}
                    {p.isPopular && (
                      <span style={{
                        position: 'absolute',
                        top: '-10px',
                        right: '14px',
                        fontSize: '9.5px',
                        fontWeight: '700',
                        letterSpacing: '0.7px',
                        textTransform: 'uppercase',
                        padding: '3px 9px',
                        borderRadius: '5px',
                        color: '#fff',
                        background: '#DC2626',
                        zIndex: 10
                      }}>
                        🔥 Most Popular
                      </span>
                    )}
                    {isBestValue && (
                      <span style={{
                        position: 'absolute',
                        top: '-10px',
                        right: '14px',
                        fontSize: '9.5px',
                        fontWeight: '700',
                        letterSpacing: '0.7px',
                        textTransform: 'uppercase',
                        padding: '3px 9px',
                        borderRadius: '5px',
                        color: '#fff',
                        background: 'linear-gradient(135deg, #B8860B, #D4AF37)',
                        zIndex: 10
                      }}>
                        🏆 Best Value
                      </span>
                    )}

                    {/* Ribbon for featured */}
                    {isFeatured && (
                      <div style={{
                        position: 'absolute',
                        top: '0',
                        left: '0',
                        right: '0',
                        height: '4px',
                        background: 'linear-gradient(90deg, #14532d, #16a34a, #22c55e, #16a34a, #14532d)',
                        borderRadius: '12px 12px 0 0',
                        zIndex: 0
                      }} />
                    )}

                    {/* Top row */}
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      gap: '8px',
                      marginBottom: '8px',
                      paddingLeft: '26px'
                    }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{
                          fontSize: isFeatured ? '14px' : '12.5px',
                          fontWeight: '800',
                          color: '#111111',
                          lineHeight: '1.3',
                          letterSpacing: '-0.2px',
                          wordBreak: 'break-word' as const
                        }}>
                          {p.name.replace('THE TRIAL KIT (Self Love Plus)', 'The Trial Kit')
                           .replace('SELF LOVE PLUS B2GOF', 'Self Love Plus B2GOF')
                           .replace('SELF LOVE B2GOF', 'Self Love B2GOF')
                           .replace('SELF LOVE RETURN', 'Self Love Return')
                           .replace('FAMILY SAVES', 'Family Saves')}
                          {p.id === 'PKG-001' && (
                            <span style={{
                              fontWeight: '500',
                              color: '#6B7280',
                              fontSize: '11px'
                            }}> (Self Love Plus)</span>
                          )}
                        </div>
                        <div style={{
                          fontSize: '10px',
                          fontWeight: '600',
                          color: '#6B7280',
                          marginTop: '1px',
                          letterSpacing: '0.1px'
                        }}>
                          {p.supply.split(':')[0]}
                        </div>
                      </div>
                      <div style={{ textAlign: 'right', flexShrink: 0 }}>
                        <div style={{
                          fontSize: '10.5px',
                          color: '#6B7280',
                          textDecoration: 'line-through'
                        }}>
                          ₦{p.originalPrice.toLocaleString()}
                        </div>
                        <div style={{
                          fontSize: isFeatured ? '22px' : '20px',
                          fontWeight: '800',
                          color: isBestValue ? '#946B00' : '#0F6B3A',
                          lineHeight: '1.1',
                          letterSpacing: '-0.3px'
                        }}>
                          ₦{p.price.toLocaleString()}
                        </div>
                        <span style={{
                          display: 'inline-block',
                          background: '#FEE2E2',
                          color: '#DC2626',
                          fontSize: '9.5px',
                          fontWeight: '700',
                          padding: '1.5px 5px',
                          borderRadius: '3px',
                          marginTop: '1px'
                        }}>
                          {p.discount}% OFF
                        </span>
                      </div>
                    </div>

                    {/* Items */}
                    <div style={{
                      display: 'flex',
                      gap: '5px',
                      flexWrap: 'wrap',
                      marginBottom: '6px',
                      paddingLeft: '26px'
                    }}>
                      {p.items.split(' | ').map((item, idx) => {
                        const [quantity, product] = item.split('× ');
                        return (
                          <span key={idx} style={{
                            background: '#F3F4F6',
                            borderRadius: '5px',
                            padding: isFeatured ? '5px 9px' : '3.5px 7px',
                            fontSize: isFeatured ? '12.5px' : '11px',
                            fontWeight: '600',
                            color: '#1F2937',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '3px'
                          }}>
                            <span style={{
                              background: '#14532d',
                              color: '#fff',
                              fontSize: isFeatured ? '10px' : '8.5px',
                              fontWeight: '700',
                              padding: isFeatured ? '2px 5px' : '1px 4px',
                              borderRadius: '3px'
                            }}>
                              {quantity}×
                            </span>
                            {product}
                          </span>
                        );
                      })}
                    </div>

                    {/* Bonus items */}
                    {p.freeItems && p.freeItems.includes('FREE:') && (
                      <div style={{
                        background: '#FFFBEB',
                        border: '1px dashed #D97706',
                        borderRadius: '7px',
                        padding: '6px 9px',
                        fontSize: isFeatured ? '12px' : '10.5px',
                        fontWeight: '600',
                        color: '#92400E',
                        margin: '6px 0',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px'
                      }}>
                        <span style={{ fontSize: '13px', flexShrink: 0 }}>🎁</span>
                        {p.freeItems.replace('+ ', '')}
                      </div>
                    )}

                    {/* Callout for trial kit */}
                    {p.id === 'PKG-001' && (
                      <div style={{
                        background: 'linear-gradient(135deg, #14532d, #16a34a)',
                        borderRadius: '8px',
                        padding: '10px 12px',
                        margin: '8px 0 6px',
                        color: '#fff',
                        fontSize: '11px',
                        fontWeight: '600',
                        lineHeight: '1.45'
                      }}>
                        <strong>Important:</strong> Hair recovery is a biological cycle. The Trial Kit resets your scalp but permanent edge restoration & follicle wake-up typically require 60–90 days of consistent 3-step use.
                      </div>
                    )}

                    {/* Description */}
                    <p style={{
                      fontSize: isFeatured ? '12.5px' : '11px',
                      color: '#4B5563',
                      lineHeight: '1.4',
                      paddingLeft: '26px',
                      margin: p.id === 'PKG-001' ? '0' : '6px 0',
                      fontWeight: p.id === 'PKG-002' ? '400' : '400'
                    }}>
                      {p.id === 'PKG-001' && 'Experience immediate scalp relief and test the formula before committing to a full 3 month hair recovery.'}
                      {p.id === 'PKG-002' && (
                        <>
                          Keep growth consistent. <strong>For returning fans only</strong> — first-timers need the Shampoo to purify your scalp for real results.
                        </>
                      )}
                      {p.id === 'PKG-003' && 'Purify the scalp & clear dandruff so the Pomade can trigger real growth.'}
                      {p.id === 'PKG-004' && (
                        <>
                          🧴 3-Month Recovery System: The complete professional routine. <strong>Essential for first-timers</strong> to purify, nourish, and seal for a full biological hair growth cycle.
                        </>
                      )}
                      {p.id === 'PKG-005' && (
                        <>
                          🧴 12-Month Institutional Pack: The Gold Standard for total restoration. Ideal for high-level consistency or shared "Group Buying" with friends to secure the 61% discount. <strong>Includes ₦20,500 in VIP Gifts.</strong>
                        </>
                      )}
                    </p>

                    {/* For who tag */}
                    <span style={{
                      display: 'inline-block',
                      background: p.id === 'PKG-001' ? '#EEF2FF' 
                               : p.id === 'PKG-002' ? '#FFF7ED'
                               : p.id === 'PKG-003' ? '#F0FDF4'
                               : p.id === 'PKG-004' ? '#ECFDF5'
                               : '#FDF8E8',
                      color: p.id === 'PKG-001' ? '#4338CA'
                           : p.id === 'PKG-002' ? '#C2410C'
                           : p.id === 'PKG-003' ? '#15803D'
                           : p.id === 'PKG-004' ? '#059669'
                           : '#8B6914',
                      fontSize: '9.5px',
                      fontWeight: '700',
                      padding: '2px 7px',
                      borderRadius: '4px',
                      marginTop: '6px',
                      marginLeft: '26px'
                    }}>
                      Best for: {p.id === 'PKG-001' ? 'Testing the system'
                               : p.id === 'PKG-002' ? 'Returning customers'
                               : p.id === 'PKG-003' ? 'Scalp Reset & Dandruff Clearing'
                               : p.id === 'PKG-004' ? 'First-timers (recommended)'
                               : 'Families & group buying'}
                    </span>

                    {/* Social proof for featured */}
                    {isFeatured && (
                      <div style={{
                        background: 'linear-gradient(135deg, #ECFDF5, #D1FAE5)',
                        borderRadius: '7px',
                        padding: '8px 12px',
                        margin: '8px 0 4px',
                        fontSize: '12px',
                        fontWeight: '700',
                        color: '#15803D',
                        textAlign: 'center',
                        letterSpacing: '0.2px'
                      }}>
                        👥 Chosen by 8 out of 10 customers
                      </div>
                    )}

                    {/* CTA Button */}
                    <button
                      style={{
                        display: 'block',
                        width: '100%',
                        padding: isFeatured ? '15px' : '12px',
                        borderRadius: '9px',
                        fontFamily: 'DM Sans, sans-serif',
                        fontSize: isFeatured ? '15px' : '12.5px',
                        fontWeight: '700',
                        cursor: 'pointer',
                        marginTop: '10px',
                        position: 'relative',
                        overflow: 'hidden',
                        background: selected 
                          ? (isBestValue 
                            ? 'linear-gradient(135deg, #D4AF37 0%, #F5D76E 50%, #D4AF37 100%)'
                            : 'linear-gradient(135deg, #14532d, #16a34a)')
                          : '#F9FAFB',
                        color: selected 
                          ? (isBestValue ? '#1a2744' : '#fff')
                          : '#6B7280',
                        border: selected ? 'none' : '1.5px solid #D1D5DB',
                        boxShadow: selected 
                          ? (isBestValue 
                            ? '0 4px 14px rgba(212,175,55,0.35), inset 0 1px 0 rgba(255,255,255,0.3)'
                            : '0 4px 16px rgba(20,83,45,0.4)')
                          : 'none',
                        letterSpacing: selected ? '0.3px' : '0',
                        textShadow: selected ? '0 1px 0 rgba(255,255,255,0.2)' : 'none'
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        setForm({ ...form, pkg: p.id });
                        
                        // Scroll to contact fields so user fills in their details
                        setTimeout(() => {
                          const nameField = document.getElementById('nameFieldWrapper');
                          if (nameField) {
                            nameField.scrollIntoView({ behavior: 'smooth', block: 'center' });
                            const input = nameField.querySelector('input');
                            if (input) input.focus();
                          }
                        }, 400);
                      }}
                    >
                      {p.id === 'PKG-001' && 'Select Trial Kit →'}
                      {p.id === 'PKG-002' && 'Select This Plan →'}
                      {p.id === 'PKG-003' && 'Select This Plan →'}
                      {p.id === 'PKG-004' && 'Start My Hair Recovery →'}
                      {p.id === 'PKG-005' && 'Secure the Gold Standard Pack →'}
                    </button>
                  </div>
                );
              })}
              
              {/* Trust indicators */}
              <div className="trust-indicators">
                <span className="trust-indicator">
                  <span className="trust-indicator-check">✓</span>
                  Pay on Delivery
                </span>
                <span className="trust-indicator">
                  <span className="trust-indicator-check">✓</span>
                  Nationwide Shipping
                </span>
                <span className="trust-indicator">
                  <span className="trust-indicator-check">✓</span>
                  Support Active
                </span>
              </div>
            </div>

            {/* Contact Details — shown AFTER package selection */}
            {form.pkg && (
              <div style={{
                background: '#F0FDF4',
                border: '1.5px solid #BBF7D0',
                borderRadius: '8px',
                padding: '10px 14px',
                margin: '16px 0 8px',
                textAlign: 'center',
                fontSize: '13px',
                fontWeight: '600',
                color: '#15803D'
              }}>
                ✓ Great choice! Now fill in your details below to complete your order.
              </div>
            )}

            {/* Name */}
            <label style={S.label}>CUSTOMER FULL NAME <span style={S.req}>*</span></label>
            <div style={{ position: 'relative' }} id="nameFieldWrapper">
              <input
                style={S.input}
                placeholder="Enter your full name"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                ref={nameInputRef}
                onFocus={() => handleInputFocus(nameInputRef)}
              />
              <span className="field-check" style={{
                position: 'absolute',
                right: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                fontSize: '18px',
                opacity: '0',
                transition: 'opacity 0.3s ease',
                color: '#14532d',
                pointerEvents: 'none'
              }}>✓</span>
            </div>

            {/* Phone */}
            <label style={S.label}>PHONE NUMBER <span style={S.req}>*</span></label>
            <div style={{ position: 'relative' }} id="phoneFieldWrapper">
              <input
                style={{ ...S.input, border: phoneError ? '2px solid #ff3b30' : S.input.border }}
                type="tel"
                inputMode="numeric"
                placeholder="08012345678"
                value={form.phone}
                onChange={handlePhoneChange}
                ref={phoneInputRef}
                onFocus={() => handleInputFocus(phoneInputRef)}
              />
              <span className="field-check" style={{
                position: 'absolute',
                right: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                fontSize: '18px',
                opacity: '0',
                transition: 'opacity 0.3s ease',
                color: '#14532d',
                pointerEvents: 'none'
              }}>✓</span>
            </div>
            {phoneError && (
              <p style={{ margin: '6px 0 0', color: '#ff3b30', fontSize: 12, fontWeight: 800 }}>
                ⚠️ {phoneError}
              </p>
            )}
            <p style={S.hint}>We call you before delivery</p>

            {/* Email */}
            <label style={S.label}>EMAIL ADDRESS <span style={S.req}>*</span></label>
            <div style={{ position: 'relative' }} id="emailFieldWrapper">
              <input
                style={S.input}
                type="email"
                placeholder="your@email.com"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                ref={emailInputRef}
                onFocus={() => handleInputFocus(emailInputRef)}
              />
              <span className="field-check" style={{
                position: 'absolute',
                right: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                fontSize: '18px',
                opacity: '0',
                transition: 'opacity 0.3s ease',
                color: '#14532d',
                pointerEvents: 'none'
              }}>✓</span>
            </div>
            <p style={S.hint}>For order confirmation and updates</p>

            {/* Pay text */}
            <p style={S.pay}>We accept both Pay on Delivery and Pay Before Delivery</p>

            {/* Step 2 preview hint */}
            <div style={{
              textAlign: 'center',
              padding: '10px',
              marginBottom: '8px',
              background: 'linear-gradient(135deg, #EEF2FF, #E0E7FF)',
              borderRadius: '8px',
              border: '1px solid #C7D2FE'
            }}>
              <p style={{ margin: 0, fontSize: '12px', fontWeight: '600', color: '#4338CA' }}>
                📍 Next: Tell us your delivery address (Step 2 of 2)
              </p>
              <p style={{ margin: '4px 0 0', fontSize: '11px', color: '#6366F1', fontWeight: '500' }}>
                Almost done — just your address and you're set!
              </p>
            </div>

            {/* Continue button */}
            <button
              style={{
                ...S.btn,
                ...(form.pkg ? {
                  background: 'linear-gradient(135deg, #1a7a4a, #16a34a)',
                  boxShadow: '0 4px 16px rgba(20,83,45,0.4)',
                  cursor: 'pointer'
                } : S.btnDis)
              }}
              disabled={Boolean(phoneError) || form.phone.replace(/\D/g, '').length !== 11 || !form.name || !form.email || !form.pkg}
              onClick={() => {
                let pvFired: string | null = null;
                let atcFired: string | null = null;
                let icFired: string | null = null;
                try {
                  pvFired = sessionStorage.getItem('fhg_pv_fired');
                  atcFired = sessionStorage.getItem('fhg_atc_fired');
                  icFired = sessionStorage.getItem('fhg_ic_fired');
                } catch (error) {
                  void error;
                }
                void pvFired;
                void atcFired;
                void icFired;

                const phoneDigits = form.phone.replace(/\D/g, '');
                const phoneOk = phoneDigits.length === 11 && phoneDigits.startsWith('0') && !phoneError;

                if (!form.name || !form.email || !form.phone || !form.pkg) {
                  const missing = [];
                  if (!form.name) missing.push('Name');
                  if (!form.phone) missing.push('Phone');
                  if (!form.email) missing.push('Email');
                  if (!form.pkg) missing.push('Package');
                  toast.error(`Please fill: ${missing.join(', ')}`);
                  return;
                }

                // Validate email format
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(form.email)) {
                  toast.error('Please enter a valid email address');
                  return;
                }

                if (!phoneOk) {
                  toast.error('Please enter a valid 11-digit phone number starting with 0');
                  return;
                }

                const packageName = packageMapping[form.pkg] || form.pkg || 'Fulani Hair Gro';
                const packagePrice = selectedPackage?.price ?? 75000; // Default fallback price

                
                
                setStep(2);
                
                // Smooth scroll to step indicator — "walk" the user to Step 2
                setTimeout(() => {
                  const stepIndicator = document.getElementById('step-indicator');
                  if (stepIndicator) {
                    stepIndicator.scrollIntoView({ 
                      behavior: 'smooth',
                      block: 'start'
                    });
                  }
                }, 100);
              }}
            >
              CONTINUE TO STEP 2 →
              <span style={{ display: 'block', fontSize: '11px', fontWeight: '500', opacity: 0.9, marginTop: '2px' }}>Delivery Address & Confirm Order</span>
            </button>
          </>
        )}

        {step === 2 && (
          <div className="step2-enter">
            {/* Package Selection Summary */}
            {selectedPackage && (
              <div style={{
                background: '#F0FDF4', border: '1.5px solid #BBF7D0',
                borderRadius: 10, padding: '12px 14px', marginBottom: 16,
                display: 'flex', justifyContent: 'space-between', alignItems: 'center'
              }}>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 600, color: '#16A34A', textTransform: 'uppercase' as const }}>
                    ✓ Your Selection
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#14532D' }}>
                    {packageMapping[form.pkg] || form.pkg}
                  </div>
                </div>
                <div style={{ fontSize: 18, fontWeight: 800, color: '#14532D' }}>
                  ₦{selectedPackage.price.toLocaleString()}
                </div>
              </div>
            )}
            <p style={{ fontSize: 13, color: '#6B7280', textAlign: 'center' as const, margin: '0 0 14px', fontWeight: 500 }}>
              Almost done! Just tell us where to deliver 📦
            </p>

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
              onChange={e => setForm({ ...form, state: e.target.value, lga: '' })}
              aria-label="Select state of residence"
            >
              {nigerianStates.map(s => <option key={s} value={s}>{s === 'FCT' ? 'FCT Abuja' : s}</option>)}
            </select>

            {/* LGA */}
            <label style={S.label}>LOCAL GOVERNMENT AREA (LGA) <span style={S.req}>*</span></label>
            <select
              style={S.input}
              value={form.lga || ''}
              onChange={e => setForm({ ...form, lga: e.target.value })}
              aria-label="Select local government area"
              disabled={!form.state}
            >
              <option value="">Select LGA...</option>
              {form.state && nigeriaLGAs[form.state as keyof typeof nigeriaLGAs]?.map(lga => (
                <option key={lga} value={lga}>{lga}</option>
              ))}
            </select>

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

            {/* Bank details for Pay Before Delivery */}
            {form.paymentMethod === 'Pay Before Delivery' && (
              <div style={{
                background: '#f8f9fa',
                border: '2px solid #0047AB',
                borderRadius: '12px',
                padding: '20px',
                marginTop: '16px',
                fontFamily: 'Georgia, serif',
                fontSize: '16px',
                lineHeight: '1.6',
                color: '#0047AB',
                fontWeight: '600'
              }}>
                <div style={{ marginBottom: '12px', fontSize: '18px', fontWeight: '700' }}>
                  🏦 Bank: Moniepoint
                </div>
                <div style={{ marginBottom: '12px', fontSize: '16px' }}>
                  📛 Account Name: <span style={{ fontWeight: '700' }}>Fulani Hair Gro</span>
                </div>
                <div style={{ fontSize: '16px' }}>
                  🔢 Account Number: <span style={{ fontWeight: '700', fontSize: '18px' }}>5633783114</span>
                </div>
                <div style={{ marginTop: '16px', padding: '12px', backgroundColor: '#fff3cd', border: '1px solid #ffeaa7', borderRadius: '8px', color: '#856404' }}>
                  <strong>⚠️ Important:</strong> After payment, send your proof of payment to {PHONE_DISPLAY}
                </div>
              </div>
            )}

            {/* Payment notice for Pay on Delivery */}
            {form.paymentMethod === 'Pay on Delivery' && (
              <div style={{
                background: '#fff3cd',
                border: '2px solid #ffc107',
                borderRadius: '12px',
                padding: '20px',
                marginTop: '16px',
                fontFamily: 'Arial, sans-serif',
                fontSize: '15px',
                lineHeight: '1.6',
                color: '#856404',
                fontWeight: '600'
              }}>
                <div style={{ marginBottom: '12px', fontSize: '17px', fontWeight: '700', color: '#856404' }}>
                  🚨 Important Payment Notice
                </div>
                <div style={{ marginBottom: '8px', fontSize: '15px' }}>
                  When the rider arrives, please pay ONLY into our company account:
                </div>
                <div style={{ marginBottom: '10px', fontSize: '16px', fontWeight: '700' }}>
                  🏦 Bank: Moniepoint
                </div>
                <div style={{ marginBottom: '10px', fontSize: '16px', fontWeight: '700' }}>
                  📛 Account Name: Fulani Hair Gro
                </div>
                <div style={{ fontSize: '16px', fontWeight: '700' }}>
                  🔢 Account Number: 5633783114
                </div>
                <div style={{ 
                  marginTop: '12px', 
                  fontSize: '16px', 
                  fontWeight: '800', 
                  color: '#dc3545',
                  backgroundColor: '#f8d7da',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  textAlign: 'center',
                  border: '2px solid #dc3545'
                }}>
                  ⚠️ DO NOT PAY TO THE RIDER
                </div>
                <div style={{ 
                  marginTop: '12px', 
                  fontSize: '14px', 
                  color: '#856404',
                  backgroundColor: '#fff3cd',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  textAlign: 'center',
                  border: '1px solid #ffeaa7'
                }}>
                  <strong>After payment, send your proof of payment to {PHONE_DISPLAY}</strong>
                </div>
              </div>
            )}

            {/* Delivery fee & speed - only show for Pay on Delivery */}
            {form.paymentMethod === 'Pay on Delivery' && (
              <>
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
              </>
            )}

            {/* Coupon Code */}
            <label style={S.label}>HAVE A COUPON CODE?</label>
            <div style={{ display: 'flex', gap: 8, marginBottom: 4 }}>
              <input
                type="text"
                placeholder="Enter coupon code"
                value={form.couponCode}
                onChange={e => setForm({ ...form, couponCode: e.target.value.toUpperCase(), couponApplied: false })}
                disabled={form.couponApplied}
                style={{
                  ...S.input,
                  flex: 1,
                  marginBottom: 0,
                  textTransform: 'uppercase' as const,
                  ...(form.couponApplied ? { background: '#F0FFF4', borderColor: '#38A169', color: '#276749' } : {})
                }}
              />
              {!form.couponApplied ? (
                <button
                  type="button"
                  onClick={() => {
                    const code = form.couponCode.trim().toUpperCase();
                    if (code === 'CLASSROOM15') {
                      const now = new Date();
                      const expiresAt = new Date('2026-02-27T06:00:00Z'); // 48hrs from Feb 25 7AM WAT (UTC+1)
                      if (now > expiresAt) {
                        alert('Sorry, this coupon has expired.');
                      } else {
                        setForm(prev => ({ ...prev, couponApplied: true }));
                      }
                    } else if (code) {
                      alert('Invalid coupon code. Please check and try again.');
                    }
                  }}
                  style={{
                    padding: '10px 20px',
                    background: '#14532d',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 8,
                    fontWeight: 700,
                    fontSize: 13,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap' as const,
                  }}
                >
                  Apply
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setForm(prev => ({ ...prev, couponCode: '', couponApplied: false }))}
                  style={{
                    padding: '10px 16px',
                    background: '#FEE2E2',
                    color: '#DC2626',
                    border: '1px solid #DC2626',
                    borderRadius: 8,
                    fontWeight: 700,
                    fontSize: 13,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap' as const,
                  }}
                >
                  Remove
                </button>
              )}
            </div>
            {form.couponApplied && (
              <p style={{ color: '#38A169', fontWeight: 700, fontSize: 13, marginBottom: 12 }}>
                ✅ Coupon applied! You get FREE delivery.
              </p>
            )}

            {/* How did you hear */}
            <label style={{ ...S.label, textAlign: 'center' }}>HOW DID YOU HEAR ABOUT US?</label>
            <div style={window.innerWidth < 768 ? S.hearAboutUsGridMobile : { display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', columnGap: 22, rowGap: 16, marginTop: 12 }}>
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
                <label 
                  key={opt} 
                  style={window.innerWidth < 768 ? 
                    { ...S.hearAboutUsOptionMobile, ...(form.heardAboutUs === opt ? S.hearAboutUsOptionHoverMobile : {}) } :
                    { display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer', color: '#1a1a1a', minHeight: 28 }
                  }
                >
                  <input
                    type="radio"
                    name="heardAboutUs"
                    checked={form.heardAboutUs === opt}
                    onChange={() => setForm({ ...form, heardAboutUs: opt })}
                  />
                  <span
                    style={{
                      fontSize: window.innerWidth < 768 ? 14 : 14,
                      fontWeight: 600,
                      color: '#1a1a1a',
                      lineHeight: 1.2,
                      wordBreak: window.innerWidth < 768 ? 'normal' : 'normal',
                      overflowWrap: 'break-word',
                      whiteSpace: window.innerWidth < 768 ? 'normal' : (opt === 'WhatsApp' ? 'nowrap' : 'normal')
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
              placeholder="Select delivery date"
              value={form.deliveryDate}
              onChange={e => {
                const selectedDate = new Date(e.target.value + 'T00:00:00');
                const now = new Date();
                // Compare dates at midnight (strip time) so "today" is always valid
                const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
                const maxDate = new Date(today.getTime() + 2 * 24 * 60 * 60 * 1000); // 2 days from today
                
                setDeliveryDateError('');
                
                if (selectedDate < today) {
                  setDeliveryDateError('Delivery date cannot be in the past.');
                  setForm({ ...form, deliveryDate: '' });
                  return;
                }
                
                if (selectedDate > maxDate) {
                  setDeliveryDateError('Please select today, tomorrow, or the next day.');
                  setForm({ ...form, deliveryDate: '' });
                  return;
                }
                
                setForm({ ...form, deliveryDate: e.target.value });
              }}
              onClick={(e) => e.target.showPicker()}
              onFocus={(e) => e.target.showPicker()}
              min={(() => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`; })()}
              max={(() => { const d = new Date(); d.setDate(d.getDate() + 2); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`; })()}
              required
            />
            {deliveryDateError && (
              <p style={{...S.hint, fontSize: '13px', color: '#dc3545', marginTop: '4px', fontWeight: 'bold'}}>
                ⚠️ {deliveryDateError}
              </p>
            )}
            <p style={{...S.hint, fontSize: '13px', color: '#666', marginTop: '4px'}}>
              📅 Select your preferred delivery date (today, tomorrow, or the next day only)
            </p>

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

            {/* Comment */}
            <label style={S.label}>COMMENT OR MESSAGE</label>
            <textarea
              style={{ ...S.input, minHeight: 100, resize: 'vertical' as const }}
              placeholder="Comment or message (optional)"
              aria-label="Comment or message"
              value={form.comment}
              onChange={e => setForm({ ...form, comment: e.target.value })}
            />

            {/* Before you submit - only show for Pay on Delivery */}
            {form.paymentMethod === 'Pay on Delivery' && (
              <>
                <label style={S.label}>BEFORE YOU SUBMIT <span style={S.req}>*</span></label>
                <div style={{ marginTop: 10 }}>
                  <label style={{ display: 'flex', alignItems: 'flex-start', gap: 10, cursor: 'pointer', fontSize: 13, fontWeight: 600, color: '#333' }}>
                    <input
                      type="checkbox"
                      checked={form.agreeToTerms}
                      onChange={e => setForm({ ...form, agreeToTerms: e.target.checked })}
                      style={{ cursor: 'pointer', marginTop: 2 }}
                    />
                    <span>I understand that this is a Pay-on-Delivery order and I will be available to receive my package.</span>
                  </label>
                </div>
              </>
            )}

            {/* Summary */}
            <div style={S.sum}>
              <div style={{ fontSize: 14, fontWeight: 900, letterSpacing: 0.6, textAlign: 'center', marginBottom: 10, color: '#1a1a1a' }}>📋 ORDER SUMMARY</div>
              {(() => {
                const p = currentPackages.find(x => x.id === form.pkg);
                if (!p) return null;

                const currentDeliveryFee = deliveryFee; // Use memoized value
                const total = p.price + currentDeliveryFee;
                const deliveryLabel = form.couponApplied ? 'Delivery (FREE — Coupon Applied 🎉)' :
                                     currentDeliveryFee === 0 ? 'Delivery (FREE - Pay Before Delivery orders only)' : 
                                     currentDeliveryFee === 5000 ? 'Delivery (24 Hours)' : 'Delivery (1-3 Days)';
                const items = PACKAGE_CONTENTS[p.webhookName] || PACKAGE_CONTENTS[p.name] || [];
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

                      <div style={S.sr}><span style={{ fontWeight: 900 }}>🚚 {deliveryLabel}</span><span style={{ fontWeight: 900, fontSize: 15 }}>{currentDeliveryFee === 0 ? 'FREE' : `₦${currentDeliveryFee.toLocaleString()}`}</span></div>

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
                setTimeout(() => {
                  const stepIndicator = document.getElementById('step-indicator');
                  if (stepIndicator) {
                    stepIndicator.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }
                }, 100);
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
                  const dateOk = !!form.deliveryDate && !deliveryDateError;
                  const timeOk = !!form.deliveryTimeWindow;
                  const termsOk = form.paymentMethod === 'Pay on Delivery' ? !!form.agreeToTerms : true;

                  if (!phoneOk || !emailOk || !addressOk || !stateOk || !dateOk || !timeOk || !termsOk) {
                    const missing = [];
                    if (!addressOk) missing.push('Address');
                    if (!stateOk) missing.push('State');
                    if (!dateOk) missing.push('Delivery date');
                    if (!timeOk) missing.push('Delivery time');
                    if (!termsOk) missing.push('Terms agreement');
                    if (!phoneOk) missing.push('Phone number');
                    if (!emailOk) missing.push('Email');
                    toast.error(`Please complete: ${missing.join(', ')}`);
                    
                    // Scroll to first missing field
                    if (!addressOk) {
                      const el = document.querySelector('textarea[placeholder="Full address"]') as HTMLElement;
                      el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                      el?.focus();
                    } else if (!dateOk) {
                      const el = document.querySelector('input[type="date"]') as HTMLElement;
                      el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                      el?.focus();
                    } else if (!timeOk) {
                      const el = document.querySelector('[name="deliveryTimeWindow"]') as HTMLElement;
                      el?.closest('div')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    } else if (!termsOk) {
                      const el = document.querySelector('input[type="checkbox"]') as HTMLElement;
                      el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }
                    return;
                  }

                  submit();
                }}
              >
                {submitting ? 'PROCESSING...' : '→ SUBMIT'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default memo(OrderFormEmbed);
