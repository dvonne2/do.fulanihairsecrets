import { useState, useEffect, useCallback, useMemo, useRef, CSSProperties, memo } from 'react';
import nigeriaLGAs from '@/data/nigeriaLGAs.json';
import { fireLeadSync, fireFormStart, fireAddToCart, fireInitiateCheckout, fireCartRecovery, markEventsAsFired } from '@/utils/metaTracking';
import { fireTikTokAddToCart, fireTikTokLeadSync, fireTikTokInitiateCheckout } from '@/utils/tiktokTracking';
import { WEBHOOK_URL, WEBHOOK_SECRET, FULANI_API_URL, PHONE_DISPLAY } from '@/config/api';
import { toast } from 'sonner';
import { BundleDropdown, BundlePackage } from "./BundleDropdown";

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

const packageNameToId: Record<string, string> = Object.fromEntries(Object.entries(packageMapping).map(([id, name]) => [String(name).trim().toUpperCase(), id]));
const resolvePkgId = (v: any): string => {
  const s = String(v ?? "").trim();
  if (!s) return "";
  if (s.startsWith("PKG-")) return s;
  const key = s.toUpperCase();
  return packageNameToId[key] || "";
};

const PACKAGE_CONTENTS: Record<string, string[]> = {
  'SELF LOVE PLUS': ['1 500ml Net Shampoo', '1 150ml Net Pomade', '1 500ml Net Conditioner'],
  'SELF LOVE RETURN': ['3 x 150ml Net Pomade'],
  'SELF LOVE B2GOF': ['3 500ml Net Shampoo', '3 x 150ml Net Pomade'],
  'SELF LOVE PLUS B2GOF': ['3 500ml Net Shampoo', '3 x 150ml Net Pomade', '3 500ml Net Conditioner'],
  'FAMILY SAVES': ['10 500ml Net Shampoo', '10 150ml Net Pomade', '10 500ml Net Conditioner']
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
  { id: 'PKG-002', name: 'SELF LOVE RETURN', webhookName: 'SELF LOVE RETURN', price: 42750, originalPrice: 75000, discount: 43, items: '3× Pomade', supply: '3-Month Maintenance: <strong>For returning fans only</strong> — first-timers need the Shampoo to purify your scalp for real results.', freeItems: '', isPopular: false },
  { id: 'PKG-003', name: 'SELF LOVE B2GOF', webhookName: 'SELF LOVE B2GOF', price: 52750, originalPrice: 110000, discount: 52, items: '2× Shampoo | 2× Pomade', supply: '3-Month Scalp Reset: Essential for new customers to purify the scalp and clear dandruff so the Pomade can trigger real growth.', freeItems: '+ FREE: 1 500ml Shampoo + 1 150g Pomade', isPopular: false },
  { id: 'PKG-004', name: 'SELF LOVE PLUS B2GOF', webhookName: 'SELF LOVE PLUS B2GOF', price: 66750, originalPrice: 165000, discount: 60, items: '2× Shampoo | 2× Pomade | 2× Conditioner', supply: '🔥 3-Month Hair Recovery System - If your hair is breaking, thinning, or refusing to grow, this set is your reset. In just 90 days, it will wake up dormant follicles, restore your scalp, and have you seeing the fuller, longer hair you\'ve been waiting for. Affordable. Effective. Built for serious results.', freeItems: '+ FREE: 1 500ml Shampoo + 1 150g Pomade + 1 500ml Conditioner', isPopular: true },
  { id: 'PKG-005', name: 'FAMILY SAVES', webhookName: 'FAMILY SAVES', price: 215000, originalPrice: 550000, discount: 61, items: '6× Shampoo | 6× Pomade | 6× Conditioner', supply: '12 Month Supply', freeItems: '+ FREE: 4 500ml Shampoos + 4 150g Pomades + 4 500ml Conditioners', isPopular: true },
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

// Single source of truth for Order ID - generate once, persist everywhere
const getOrCreateOrderId = (formOrderId?: string): string => {
  // Priority 1: URL parameter (for recovery links)
  if (typeof window !== 'undefined') {
    const urlParams = new URLSearchParams(window.location.search);
    const urlOrderId = urlParams.get('orderId');
    if (urlOrderId?.trim()) {
      localStorage.setItem('fhg_persistent_order_id', urlOrderId.trim());
      return urlOrderId.trim();
    }
  }

  // Priority 2: Already in form state
  if (formOrderId) return formOrderId;

  // Priority 3: Already in localStorage
  const stored = localStorage.getItem('fhg_persistent_order_id');
  if (stored?.trim()) return stored.trim();

  // Priority 4: Generate new, persist immediately
  const newOrderId = generateOrderId();
  localStorage.setItem('fhg_persistent_order_id', newOrderId);
  return newOrderId;
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
  container: { margin: '0 auto', padding: '40px 20px', fontFamily: 'Inter, system-ui, sans-serif', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: '#fafbfc' },
  box: { background: '#ffffff', borderRadius: 16, padding: '36px 32px 32px', width: '100%', position: 'relative', overflow: 'visible', boxShadow: '0 4px 24px rgba(0, 0, 0, 0.08)' },
  // Mobile-specific container styles
  containerMobile: { padding: '0', maxWidth: '100%' },
  boxMobile: { padding: '16px 8px', borderRadius: 0 },
  step: { fontSize: 14, fontWeight: 600, color: '#666', margin: '0 0 8px' },
  bar: { height: 8, background: '#E0E0E0', borderRadius: 4, overflow: 'hidden', marginBottom: 20 },
  fill: { height: '100%', background: 'linear-gradient(90deg, #36CA37, #2eb82e)', transition: 'width 0.3s' },
  label: { display: 'block', fontSize: 13, fontWeight: 800, color: '#1a1a1a', textTransform: 'uppercase' as const, margin: '16px 0 8px' },
  req: { color: '#D30000' },
  input: { width: '100%', padding: '14px 16px', background: '#F9F9F9', border: '2px solid #DAA520', borderRadius: 10, fontSize: 16, fontWeight: 600, color: '#1a1a1a', outline: 'none', boxSizing: 'border-box' as const, fontFamily: 'inherit' },
  inputFocus: { borderColor: '#DAA520' },
  hint: { fontSize: 12, color: '#666', margin: '6px 0 0' },
  pkgs: { display: 'flex', flexDirection: 'column' as const, gap: 10, marginTop: 12 },
  card: { display: 'block', position: 'relative' as const, padding: '20px 18px', background: '#ffffff', border: '2px solid #e5e7eb', borderRadius: 12, cursor: 'pointer', transition: 'all 0.3s ease', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)' },
  cardSel: { borderColor: '#059669', background: '#f0fdf4', boxShadow: '0 4px 12px rgba(5, 150, 105, 0.15)' },
  // Mobile-specific styles
  cardMobile: { padding: '10px 10px 10px 36px' },
  cardSelMobile: { padding: '10px 10px 10px 36px' },
  radio: { position: 'absolute' as const, left: 16, top: 18, width: 24, height: 24, border: '3px solid #d1d5db', borderRadius: '50%', background: '#fff', boxSizing: 'border-box' as const, display: 'flex', alignItems: 'center', justifyContent: 'center' },
  radioSel: { borderColor: '#059669', background: '#059669' },
  check: { color: '#fff', fontSize: 14, fontWeight: 'bold' as const },
  pop: { position: 'absolute' as const, top: -10, right: 10, background: '#dc2626', color: '#fff', fontSize: 10, fontWeight: 700, padding: '4px 8px', borderRadius: 12, textTransform: 'uppercase' as const },
  r1: { display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6 },
  name: { fontSize: 15, fontWeight: 700, color: '#111827', lineHeight: '1.3' },
  nameMobile: { fontSize: 14 },
  pr: { textAlign: 'right' as const },
  old: { fontSize: 12, color: '#6b7280', textDecoration: 'line-through', marginRight: 6 },
  newP: { fontSize: 20, fontWeight: 800, color: '#059669' },
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
  pay: { fontSize: 10, color: '#666', textAlign: 'center' as const, margin: '16px 0' },
  // Mobile styles for "How did you hear about us"
  hearAboutUsGridMobile: { display: 'flex', flexDirection: 'column' as const, gap: 12, marginTop: 12 },
  hearAboutUsOptionMobile: { display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer', color: '#1a1a1a', minHeight: 44, padding: '12px', background: '#F9F9F9', border: '1px solid #E0E0E0', borderRadius: 8, fontSize: 14, fontWeight: 600, transition: 'background 0.2s' },
  hearAboutUsOptionHoverMobile: { background: '#F0F0F0', borderColor: '#DAA520' },
  btn: { width: '100%', background: 'linear-gradient(135deg, #059669, #047857)', color: '#fff', border: 'none', borderRadius: 12, padding: '20px 24px', fontSize: 17, fontWeight: '700', letterSpacing: '0.02em', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', transition: 'all 0.3s ease', fontFamily: 'Inter, system-ui, sans-serif', boxShadow: '0 4px 12px rgba(5, 150, 105, 0.3)', textTransform: 'none' as const },
  btnDis: { background: '#d1d5db', cursor: 'not-allowed', boxShadow: 'none' },
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
      const orderId = urlParams.get('orderId');
      // Only treat as recovery link if orderId is actually provided (not empty/null)
      // and we're not on the homepage with just a hash
      return orderId && orderId.trim().length > 0 && !window.location.pathname.includes('/thank-you');
    }
    return false;
  });
  const [lastFiredPhone, setLastFiredPhone] = useState("");
  const didRestoreRef = useRef(false);
  
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
    addressType: 'home' as 'home' | 'office' | 'other',
    paymentMethod: 'Pay on Delivery' as 'Pay on Delivery' | 'Pay Before Delivery',
    agreeToMarketing: false,
    orderId: ''
  });

  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [phoneError, setPhoneError] = useState('');
  const [deliveryDateError, setDeliveryDateError] = useState('');
  const [mediaBuyer, setMediaBuyer] = useState("");
  const [source, setSource] = useState("");
  
  // Initialize orderId on component mount - single source of truth
  useEffect(() => {
    const orderId = getOrCreateOrderId();
    setForm(prev => ({ ...prev, orderId }));
  }, []);

  // Capture media buyer and source from URL and persist to localStorage
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    let mb = (params.get("mb") || "").trim().toLowerCase();
    let src = (params.get("src") || "").trim().toLowerCase();

    if (mb) localStorage.setItem("mb", mb);
    else mb = localStorage.getItem("mb") || "";

    if (src) localStorage.setItem("src", src);
    else src = localStorage.getItem("src") || "unknown";

    setMediaBuyer(mb);
    setSource(src);
  }, []);

  // Auto-advance ref to prevent multiple auto-advances
  const hasAutoAdvanced = useRef(false);
  
    
  // Ref to track InitiateCheckout trigger (Step 2 advancement)
  const hasTriggeredInitiateCheckout = useRef(false);
  
  // Ref to track FormStart trigger (first keystroke in any field)
  const hasTriggeredFormStart = useRef(false);
  
  // Ref to track AddToCart trigger (first form interaction/focus on Step 1)
  const hasTriggeredAddToCart = useRef(false);
  
  // State to track first form interaction (instead of ref to trigger useEffect)
  const [hasTriggeredFormInteraction, setHasTriggeredFormInteraction] = useState(false);
  
  // Input refs for keyboard scroll handling
  const nameInputRef = useRef<HTMLInputElement>(null);
  const phoneInputRef = useRef<HTMLInputElement>(null);
  const emailInputRef = useRef<HTMLInputElement>(null);

  // Handle input focus to scroll into view on mobile and track first interaction
  const handleInputFocus = (ref: React.RefObject<HTMLInputElement>) => {
    // Track first form interaction for AddToCart trigger
    if (!hasTriggeredFormInteraction) {
      setHasTriggeredFormInteraction(true);
      console.log('[Events] First form interaction detected - hasTriggeredFormInteraction set to true');
    }
    
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

      
      // Auto-advance when all 4 are valid (1.0s delay so user can finish typing)
      if (completed === 4 && !hasAutoAdvanced.current) {
        setTimeout(() => {
          if (!hasAutoAdvanced.current && step === 1) {
            hasAutoAdvanced.current = true;
                        setStep(2);
          }
        }, 1000);
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

  // AddToCart trigger - fires when user clicks into the Step 1 form (first interaction/focus)
  useEffect(() => {
    console.log('[Events] AddToCart useEffect triggered:', {
      step,
      hasTriggeredFormInteraction,
      hasTriggeredAddToCart: hasTriggeredAddToCart.current,
      formPkg: form.pkg,
      selectedPackage: selectedPackage?.id
    });
    
    // Only fire on Step 1
    if (step !== 1) {
      console.log('[Events] AddToCart: Not Step 1, skipping');
      return;
    }
    
    // Only fire once
    if (hasTriggeredAddToCart.current) {
      console.log('[Events] AddToCart: Already fired, skipping');
      return;
    }
    
    // Fire when user shows any form interaction (focus on any field)
    if (!hasTriggeredFormInteraction) {
      console.log('[Events] AddToCart: No form interaction yet, skipping');
      return;
    }
    
    // Package must be selected
    if (!form.pkg || !selectedPackage) {
      console.log('[Events] AddToCart: No package selected, skipping', { formPkg: form.pkg, selectedPackage: selectedPackage?.id });
      return;
    }
    
    // Fire AddToCart and lock
    hasTriggeredAddToCart.current = true;
    
    const packageName = packageMapping[form.pkg] || form.pkg || 'Fulani Hair Gro';
    
    // Fire events asynchronously without blocking UI
    Promise.resolve().then(async () => {
      try {
        // Fire Meta AddToCart
        await fireAddToCart({
          packageName,
          amount: selectedPackage.price,
          email: form.email,
          phone: form.phone,
        });
        
        // Fire TikTok AddToCart
        await fireTikTokAddToCart({
          content_name: packageName,
          value: selectedPackage.price,
          currency: 'NGN',
          email: form.email,
          phone: form.phone,
        });
        
        console.log('[Events] AddToCart fired - first form interaction detected');
      } catch (error) {
        console.error('[Events] AddToCart failed:', error);
      }
    });
    
  }, [step, hasTriggeredFormInteraction, form.pkg]); // Now hasTriggeredFormInteraction will trigger re-render

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
      console.log('[FormStart] User began typing');
      fireFormStart().then(success => {
        if (success) hasTriggeredFormStart.current = true;
      });
    }
  }, [form.name, form.phone, form.email]);

  // LeadSync / CompleteRegistration trigger - fires after email AND phone number are captured in Step 1's form
  useEffect(() => {
    console.log('[Events] LeadSync useEffect triggered:', {
      step,
      formEmail: form.email,
      formPhone: form.phone,
      isEmailValid: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email?.trim() || ''),
      isPhoneValid: (form.phone?.replace(/\D/g, '') || '').length >= 10
    });
    
    // Only fire on Step 1
    if (step !== 1) {
      console.log('[Events] LeadSync: Not Step 1, skipping');
      return;
    }
    
    // Validate either email OR phone
    const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email?.trim() || '');
    const isPhoneValid = (form.phone?.replace(/\D/g, '') || '').length >= 10;
    
    console.log('[Events] LeadSync validation:', { isEmailValid, isPhoneValid, email: form.email, phone: form.phone });
    
    // Fire when EITHER email OR phone is valid
    if (!isEmailValid && !isPhoneValid) {
      console.log('[Events] LeadSync: Neither email nor phone valid, skipping', { isEmailValid, isPhoneValid });
      return;
    }
    
    const nameParts = form.name.trim().split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';
    
    // Fire events asynchronously without blocking UI
    Promise.resolve().then(async () => {
      try {
        // Fire Meta LeadSync
        await fireLeadSync({
          email: form.email,
          phone: form.phone,
          firstName,
          lastName,
        });
        
        // Fire TikTok CompleteRegistration (equivalent to LeadSync)
        await fireTikTokCompleteRegistration({
          email: form.email,
          phone: form.phone,
          firstName,
          lastName,
        });
        
        console.log('[Events] LeadSync/CompleteRegistration fired - email and phone captured');
      } catch (error) {
        console.error('[Events] LeadSync/CompleteRegistration failed:', error);
      }
    });
    
  }, [step, form.email, form.phone, form.name]);

  // 🎯 Aggressive Identity Capturing - Real-time email/phone capture

  // InitiateCheckout trigger - fires when Step 2 is reached
  useEffect(() => {
    // Prevent multiple fires
    if (hasTriggeredInitiateCheckout.current) return;
    if (step !== 2) return; // Only fire on Step 2

    hasTriggeredInitiateCheckout.current = true;
    
    console.log('[Events] User advanced to Step 2 - firing InitiateCheckout events');
    
    // Build payload with all available data from Step 1
    const payload: any = {
      email: form.email,
      phone: form.phone,
      firstName: form.name.trim().split(' ')[0] || '',
      lastName: form.name.trim().split(' ').slice(1).join(' ') || '',
    };
    
    // Package info
    const packageName = packageMapping[form.pkg] || form.pkg || 'Fulani Hair Gro';
    payload.packageName = packageName;
    payload.packagePrice = selectedPackage?.price || 0;
    
    // Fire events asynchronously without blocking UI
    Promise.resolve().then(async () => {
      try {
        // Fire Meta InitiateCheckout
        await fireInitiateCheckout({
          packageName,
          amount: selectedPackage?.price || 0,
          email: form.email,
          phone: form.phone,
          firstName: payload.firstName,
          lastName: payload.lastName,
        });
        
        // Fire TikTok InitiateCheckout
        await fireTikTokInitiateCheckout({
          content_name: packageName,
          value: selectedPackage?.price || 0,
          currency: 'NGN',
          email: form.email,
          phone: form.phone,
        });
        
        console.log('[Events] InitiateCheckout fired for both Meta and TikTok');
      } catch (error) {
        console.error('[Events] InitiateCheckout failed:', error);
      }
    });
    
  }, [step, form.email, form.phone, form.name, form.pkg]); // Remove selectedPackage to prevent re-trigger

  // Memoize phone validation function
  const validatePhone = useCallback((phone: string) => {
    const digits = phone.replace(/\D/g, '');
    
    if (digits.length === 0) return '';  // No error, empty field
    if (digits.length < 11) return 'Please enter a valid 11-digit phone number';
    if (digits.length > 11) return 'Please enter a valid 11-digit phone number';
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
    const orderId = formData.orderId; // must already exist from mount
    
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

      const orderId = form.orderId; // guaranteed to exist from mount

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
        if (saved && !didRestoreRef.current) {
          didRestoreRef.current = true;
          const data = JSON.parse(saved);
          setForm(prev => {
            // IMPORTANT: do not overwrite a user-selected pkg
            if (prev.pkg) return prev;
            return {
              ...prev,
              name: data.name || prev.name,
              phone: data.phone || prev.phone,
              email: data.email || prev.email,
              pkg: resolvePkgId(data.pkg) || prev.pkg,
              orderId: orderId
            };
          });
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
        console.error('Failed to restore partial data:', e);
      }

      // Only auto-scroll if we actually restored data (genuine recovery scenario)
      if (restored) {
        const timer = setTimeout(() => {
          const formElement = document.getElementById('order-form') || document.querySelector('[role="main"]') || document.querySelector('main');
          if (formElement) {
            formElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
            console.log('📍 Scrolled to order form (recovery scenario with restored data)');
          } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            console.log('📍 Scrolled to top (form not found)');
          }
        }, 800);

        return () => clearTimeout(timer);
      } else {
        console.log('📍 No auto-scroll - no data to restore (not a genuine recovery)');
      }

      // Mark sent to prevent re-firing partial webhook for recovered orders
      setSent(true);

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
              if (result.data && !didRestoreRef.current) {
                didRestoreRef.current = true;
                setForm(prev => {
                  // IMPORTANT: do not overwrite a user-selected pkg
                  if (prev.pkg) return prev;
                  return {
                    ...prev,
                    name: result.data.name || prev.name,
                    phone: result.data.phone || prev.phone,
                    email: result.data.email || prev.email,
                    pkg: resolvePkgId(result.data.pkg || result.data.packageSelected) || prev.pkg,
                    orderId: orderId
                  };
                });
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
      const orderId = form.orderId; // guaranteed to exist from mount
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
        mediaBuyer,
        source,
        
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

      // Clear persistent orderId after successful completion
      localStorage.removeItem('fhg_persistent_order_id');

      // Redirect instantly — order data already in sessionStorage
      window.location.href = `/thank-you?orderId=${encodeURIComponent(orderId)}`;
      return;
      
    } catch (e) {
      console.error('Order submission failed:', e);
      toast.error('Something went wrong submitting your order. Please try again.');
      setSubmitting(false);
    }
  };

  // Validation variables for checkmarks
  const nameValid = form.name.trim().length >= 2;
  const phoneValid = form.phone.replace(/\D/g, '').length >= 10;
  const emailValid = form.email.includes('@') && form.email.includes('.') && form.email.length >= 5;


  const bundlePackages: BundlePackage[] = [
    {
      id: "PKG-001", name: "Self Love Plus", subtitle: "The 30-Day Test",
      price: 32750, originalPrice: 55000, badge: null,
      description: "Within 2 weeks many women see baby hairs and feel scalp relief. One bundle resets your scalp — women serious about hair growth move to the 3-Month Recovery System for fuller, longer hair.",
      bestFor: "Testing the system", bestForColor: "#4338CA", bestForBg: "#EEF2FF",
      socialProof: null,
      items: [
        { name: "500ml Net Shampoo",     qty: 1, freeQty: 0, freeName: "" },
        { name: "150ml Net Pomade",       qty: 1, freeQty: 0, freeName: "" },
        { name: "500ml Net Conditioner", qty: 1, freeQty: 0, freeName: "" },
      ],
    },
    {
      id: "PKG-002", name: "Self Love Return", subtitle: "3-Month Maintenance",
      price: 42750, originalPrice: 75000, badge: null,
      description: "For returning customers only — first-timers need the Shampoo to purify your scalp for real results.",
      bestFor: "Returning customers", bestForColor: "#C2410C", bestForBg: "#FFF7ED",
      socialProof: null,
      items: [
        { name: "150ml Net Pomade", qty: 3, freeQty: 0, freeName: "" },
      ],
    },
    {
      id: "PKG-003", name: "Self Love B2GOF", subtitle: "3-Month Scalp Reset",
      price: 52750, originalPrice: 110000, badge: null,
      description: "Purify the scalp & clear dandruff so the Pomade can trigger real growth.",
      bestFor: "Scalp Reset & Dandruff Clearing", bestForColor: "#047857", bestForBg: "#ECFDF5",
      socialProof: null,
      items: [
        { name: "500ml Net Shampoo", qty: 2, freeQty: 1, freeName: "500ml Net Shampoo" },
        { name: "150ml Net Pomade",   qty: 2, freeQty: 1, freeName: "150ml Net Pomade"   },
      ],
    },
    {
      id: "PKG-004", name: "Self Love Plus B2GOF", subtitle: "🔥 3-Month Hair Recovery System",
      price: 66750, originalPrice: 165000, badge: "popular",
      description: "🔥 If your hair is breaking, thinning, or refusing to grow — this is your reset. In 90 days it will wake up dormant follicles, restore your scalp, and give you the fuller, longer hair you've been waiting for.",
      bestFor: "First-timers (recommended)", bestForColor: "#DC2626", bestForBg: "#FEF2F2",
      socialProof: "👥 Chosen by 8 out of 10 customers",
      items: [
        { name: "500ml Net Shampoo",     qty: 2, freeQty: 1, freeName: "500ml Net Shampoo"      },
        { name: "150ml Net Pomade",       qty: 2, freeQty: 1, freeName: "150ml Net Pomade"        },
        { name: "500ml Net Conditioner", qty: 2, freeQty: 1, freeName: "500ml Net Conditioner" },
      ],
    },
    {
      id: "PKG-005", name: "Family Saves", subtitle: "12 Month Supply",
      price: 215000, originalPrice: 550000, badge: "best_value",
      description: "👆 The Gold Standard. Maximum consistency. Share with friends through Group Buying and unlock a massive 61% discount — plus ₦20,500 in exclusive VIP Gifts.",
      bestFor: "Families & group buying", bestForColor: "#92400E", bestForBg: "#FFFBEB",
      socialProof: null,
      items: [
        { name: "500ml Net Shampoo",     qty: 6, freeQty: 4, freeName: "500ml Net Shampoos"      },
        { name: "150ml Net Pomade",       qty: 6, freeQty: 4, freeName: "150ml Net Pomades"        },
        { name: "500ml Net Conditioner", qty: 6, freeQty: 4, freeName: "500ml Net Conditioners" },
      ],
    },
  ];


  return (
    <div style={{ ...S.container, ...(window.innerWidth < 768 ? S.containerMobile : {}) }}>
      <div style={{ ...S.box, ...(window.innerWidth < 768 ? S.boxMobile : {}), position: 'relative' }}>
        {/* Gradient top border */}
        <div style={{
          position: 'absolute',
          top: 0, left: 0, right: 0,
          height: '3px',
          background: 'linear-gradient(90deg, #1f4d34, #3a8c5c, #1f4d34)'
        }} />
        {/* PROGRESS BAR - ADD THIS AT THE TOP OF THE FORM */}
        <div id="step-indicator" style={{textAlign: 'center', fontWeight: 'bold', marginBottom: '10px', fontSize: '16px', color: '#000', padding: '12px 10px', backgroundColor: '#f0f0f0', border: '1px solid #ccc', borderRadius: '8px'}} className="step-indicator-text">
          <div style={{ fontSize: '20px', marginBottom: '2px' }}>
            {step === 1 ? 'Step 1 of 2' : '📍 STEP 2: Tell us your delivery address (Step 2 of 2)'}
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

            {/* Bundle Dropdown */}
            <label style={S.label}>CHOOSE YOUR HAIR REGROWTH SYSTEM <span style={S.req}>*</span></label>
            <BundleDropdown
              packages={bundlePackages}
              value={form.pkg}
              onChange={(pkg) => {
                setForm(f => ({ ...f, pkg: pkg.id }));
                setTimeout(() => {
                  const nameField = document.getElementById('nameFieldWrapper');
                  if (nameField) {
                    nameField.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    const input = nameField.querySelector('input');
                    if (input) input.focus();
                  }
                }, 400);
              }}
            />

            {/* Name */}
            <label style={S.label}>CUSTOMER FULL NAME <span style={S.req}>*</span></label>
            <div style={{ position: 'relative' }} id="nameFieldWrapper">
              <input
                type="text"
                id="name"
                name="name"
                placeholder="Your full name"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                ref={nameInputRef}
                onFocus={() => {
                  handleInputFocus(nameInputRef);
                  if (nameInputRef.current) {
                    Object.assign(nameInputRef.current.style, S.inputFocus);
                  }
                }}
                onBlur={() => {
                  if (nameInputRef.current) {
                    nameInputRef.current.style.borderColor = '#E0E0E0';
                  }
                }}
                style={{ ...S.input }}
              />
              <span className="field-check" style={{
                position: 'absolute',
                right: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                fontSize: '18px',
                opacity: nameValid ? '1' : '0',
                transition: 'opacity 0.3s ease',
                color: '#14532d',
                pointerEvents: 'none'
              }}>✓</span>
            </div>

            {/* Phone */}
            <label style={S.label}>PHONE NUMBER <span style={S.req}>*</span></label>
            <div style={{ position: 'relative' }} id="phoneFieldWrapper">
              <input
                type="tel"
                id="phone"
                name="phone"
                placeholder="Phone number (e.g., 08012345678)"
                value={form.phone}
                onChange={handlePhoneChange}
                ref={phoneInputRef}
                onFocus={() => {
                  handleInputFocus(phoneInputRef);
                  if (phoneInputRef.current) {
                    Object.assign(phoneInputRef.current.style, S.inputFocus);
                  }
                }}
                onBlur={() => {
                  if (phoneInputRef.current) {
                    phoneInputRef.current.style.borderColor = '#E0E0E0';
                  }
                }}
                style={{ ...S.input, border: phoneError ? '2px solid #ff3b30' : S.input.border }}
              />
              <span className="field-check" style={{
                position: 'absolute',
                right: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                fontSize: '18px',
                opacity: phoneValid ? '1' : '0',
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
                type="email"
                id="email"
                name="email"
                placeholder="Email address"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                ref={emailInputRef}
                onFocus={() => {
                  handleInputFocus(emailInputRef);
                  if (emailInputRef.current) {
                    Object.assign(emailInputRef.current.style, S.inputFocus);
                  }
                }}
                onBlur={() => {
                  if (emailInputRef.current) {
                    emailInputRef.current.style.borderColor = '#E0E0E0';
                  }
                }}
                style={{ ...S.input }}
              />
              <span className="field-check" style={{
                position: 'absolute',
                right: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                fontSize: '18px',
                opacity: emailValid ? '1' : '0',
                transition: 'opacity 0.3s ease',
                color: '#14532d',
                pointerEvents: 'none'
              }}>✓</span>
            </div>
            <p style={S.hint}>For hair growth information</p>

            <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: 16, padding: '12px 8px', background: '#fff', borderRadius: 12, border: '1px solid #E5E7EB' }}>
              {[['💳','Pay on Delivery'],['🚚','Free Delivery on Paid Orders'],['🇳🇬','Nationwide Shipping'],['📞','Support Active']].map(([icon, text]) => (
                <div key={text} style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 16 }}>{icon}</div>
                  <div style={{ fontSize: 10, color: '#6B7280', fontWeight: 600, marginTop: 2, whiteSpace: 'nowrap' }}>{text}</div>
                </div>
              ))}
            </div>

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
                📍 STEP 2: Tell us your delivery address (Step 2 of 2)
              </p>
                          </div>

            {/* Continue button */}
            <button
              style={{
                ...S.btn,
                ...(form.pkg ? {
                  background: 'linear-gradient(135deg, #1a7a4a, #16a34a)',
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
              {nigerianStates.map(s => <option key={s} value={s}>{s === 'FCT' ? 'Abuja FCT' : s}</option>)}
            </select>

            {/* LGA */}
            <label style={S.label}>
              {form.state === 'FCT' ? 'AREA COUNCIL' : 'LOCAL GOVERNMENT AREA (LGA)'} <span style={S.req}>*</span>
            </label>
            <select
              style={S.input}
              value={form.lga || ''}
              onChange={e => setForm({ ...form, lga: e.target.value })}
              aria-label={form.state === 'FCT' ? "Select area council" : "Select local government area"}
              disabled={!form.state}
            >
              <option value="">{form.state === 'FCT' ? 'Select Area Council...' : 'Select LGA...'}</option>
              {form.state && nigeriaLGAs[form.state as keyof typeof nigeriaLGAs]?.map(lga => (
                <option key={lga} value={lga}>{lga}</option>
              ))}
            </select>

            {/* Payment method */}
            <label style={S.label}>PAYMENT METHOD</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 10 }}>
              {['Pay on Delivery', 'Pay Before Delivery'].map(opt => (
                <label key={opt} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', color: '#1a1a1a', fontWeight: opt === 'Pay Before Delivery' ? '800' : '400' }}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={opt}
                    checked={form.paymentMethod === opt}
                    onChange={e => setForm({ ...form, paymentMethod: e.target.value })}
                  />
                  <span style={{ fontSize: opt === 'Pay Before Delivery' ? 15 : 13, fontWeight: opt === 'Pay Before Delivery' ? 800 : 700, color: '#1a1a1a' }}>{opt}</span>
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
              <p style={{ color: '#38A169', fontWeight: 800, fontSize: 16, marginBottom: 12 }}>
                ✅ Coupon applied! You get **FREE** delivery.
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
              onClick={(e) => {
                const target = e.target as HTMLInputElement;
                if (target.showPicker) {
                  target.showPicker();
                }
              }}
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

            {/* Comment */}
            <label style={S.label}>COMMENT OR MESSAGE</label>
            <textarea
              style={{ ...S.input, minHeight: 100, resize: 'vertical' as const }}
              placeholder="Comment or message (optional)"
              aria-label="Comment or message"
              value={form.comment}
              onChange={e => setForm({ ...form, comment: e.target.value })}
            />

            
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
                    <div style={{ padding: '10px 12px', background: '#fff', borderRadius: 12, border: '1px solid #EDEDED' }}>
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
                          <div key={line} style={{ fontSize: 13, fontWeight: 800, color: '#1a1a1a' }}>{line.replace(/^(\d+)\s/, '$1 x ')}</div>
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
                  // Removed delivery time validation - no longer required
                  // Removed terms agreement validation - checkbox deleted

                  if (!phoneOk || !emailOk || !addressOk || !stateOk || !dateOk) {
                    const missing = [];
                    if (!addressOk) missing.push('Address');
                    if (!stateOk) missing.push('State');
                    if (!dateOk) missing.push('Delivery date');
                    // Removed 'Delivery time' and 'Terms agreement' from missing fields
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
