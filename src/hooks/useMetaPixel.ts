import { useCallback, useEffect, useState, useRef } from 'react';
import {
  SESSION_KEYS,
  hasEventFired,
  markEventFired,
  canFireEvent,
  generateEventId,
  firePixelEvent,
  fireCustomPixelEvent,
  sendToCAPI,
  updatePixelWithAdvancedMatching,
  getPackagePrice,
  getProductContentIds,
  getProductContentName,
  getProductNumItems,
  META_CONTENT_CATEGORY,
  UserData,
  waitForPixel,
  isPixelReady
} from '@/utils/pixelUtils';
import { classifyWealthLevel, createEnhancedMatchingData } from '@/utils/enhancedMatching';
import { initializeOneDayAttribution } from '@/utils/oneDayAttribution';
import { initializeExternalIdSystem } from '@/utils/externalIdMirroring';
import { initializeInvisibleBridge } from '@/utils/invisibleBridge';

// Helper function to calculate delivery urgency
const calculateDeliveryUrgency = (deliveryDate: string): string => {
  if (!deliveryDate) return 'unknown';
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const delivery = new Date(deliveryDate);
  delivery.setHours(0, 0, 0, 0);
  
  const daysDiff = Math.ceil((delivery.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  
  if (daysDiff === 0) return 'immediate';
  if (daysDiff === 1) return 'next_day';
  if (daysDiff === 2) return 'standard';
  return 'scheduled';
};

export interface MetaFormData {
  orderId?: string;
  fullName?: string;
  email?: string;
  phone?: string;
  state?: string;
  lga?: string;
  address?: string;
  zipCode?: string;
  packageName?: string;
  packagePrice?: number;
  deliveryFee?: number;
  totalAmount?: number;
  paymentMethod?: string;
  heardAboutUs?: string;
  deliveryDate?: string;
  deliveryTimeWindow?: string;
};

// Aggressive Identity Capturing State
interface CapturedIdentity {
  email?: string;
  phone?: string;
  external_id?: string;
  timestamp: number;
}

type UseMetaPixelReturn = {
  trackPageView: () => void;
  trackViewContent: (contentData?: any) => void;
  trackFormStart: (formData?: MetaFormData) => Promise<void>;
  trackAddToCart: (formData: MetaFormData) => Promise<void>;
  trackInitiateCheckout: (formData: MetaFormData) => Promise<void>;
  trackPurchase: (formData: MetaFormData) => Promise<void>;
  trackHighValuePurchase: (formData: MetaFormData) => Promise<void>;
  trackCompleteRegistration: (formData: MetaFormData) => Promise<void>;
  isEventFired: (eventKey: string) => boolean;
  // Aggressive identity capturing
  captureIdentity: (email?: string, phone?: string, externalId?: string) => void;
  getCapturedIdentity: () => CapturedIdentity | null;
  setupIdentityListeners: () => void;
};

export function useMetaPixel(): UseMetaPixelReturn {
  const trackPageView = useCallback(async () => {
    if (hasEventFired(SESSION_KEYS.PAGE_VIEW)) return;
    
    // CRITICAL FIX: Fire PageView immediately without timeout to fix 99.2% drop-off
    const eventId = generateEventId('pv');
    
    // Try to fire immediately, fallback if Pixel not ready
    if (!isPixelReady()) {
      console.warn('[Pixel] fbq not ready, firing PageView anyway to fix drop-off');
      // Don't return - fire anyway to fix the critical tracking issue
    }
    
    firePixelEvent('PageView', {}, eventId);
    markEventFired(SESSION_KEYS.PAGE_VIEW);
    console.log('[Pixel] 🚨 PageView fired immediately to fix tracking drop-off');
  }, []);

  const trackViewContent = useCallback((packageName?: string, price?: number) => {
    console.log('[ViewContent] Starting trackViewContent...');
    
    // CRITICAL FIX: Dynamic pricing for whale hunting - capture $215k+ packages
    const eventId = generateEventId('vc');
    
    if (!isPixelReady()) {
      console.warn('[ViewContent] fbq not ready, firing anyway to fix tracking');
      // Don't return - fire anyway to fix the critical tracking issue
    }
    
    // Dynamic pricing - default to baseline but capture whale packages
    const actualPrice = price ?? getPackagePrice(packageName ?? 'Fulani Hair Gro');
    const actualPackageName = packageName ?? 'Fulani Hair Gro';
    
    const viewContentData = {
      content_name: actualPackageName,
      content_category: META_CONTENT_CATEGORY,
      content_ids: [actualPackageName.toLowerCase().replace(/\s+/g, '-')],
      content_type: 'product',
      value: actualPrice,
      currency: 'NGN',
      // Add whale hunting flags for high-value packages
      ...(actualPrice >= 66750 && {
        content_ids: [`${actualPackageName.toLowerCase().replace(/\s+/g, '-')}-whale`],
        custom_data: {
          whale_tier: actualPrice >= 215000 ? 'family_saves' : 'b2gof_plus',
          value_tier: actualPrice >= 215000 ? 'ultra_premium' : 'premium'
        }
      })
    };
    
    firePixelEvent('ViewContent', viewContentData, eventId);
    console.log('[ViewContent] � WHALE HUNTING - Dynamic ViewContent fired:', {
      packageName: actualPackageName,
      value: actualPrice,
      whaleTier: actualPrice >= 66750 ? (actualPrice >= 215000 ? 'FAMILY SAVES' : 'B2GOF PLUS') : 'Standard',
      ...viewContentData
    });
  }, []);

  const trackFormStart = useCallback(async (formData?: MetaFormData) => {
    console.log('[FormStart] Starting trackFormStart...');
    
    if (hasEventFired(SESSION_KEYS.FORM_START)) {
      console.log('[FormStart] Already fired, skipping');
      return;
    }
    
    if (!canFireEvent(SESSION_KEYS.FORM_START)) {
      console.log('[FormStart] Cannot fire event, skipping');
      return;
    }

    console.log('[FormStart] Pixel is ready, generating event ID...');
    const eventId = generateEventId('fs');
    console.log('[FormStart] Event ID:', eventId);

    console.log('[FormStart] Firing custom FormStart event');
    firePixelEvent('trackCustom', { eventName: 'FormStart' }, eventId);

    console.log('[FormStart] Pixel event fired:', true);

    console.log('[FormStart] Sending CAPI event...');
    await sendToCAPI(
      'custom',
      eventId,
      formData || {}, // Use formData if provided
      {
        custom_event_name: 'FormStart',
        content_category: 'checkout',
        page: 'Step 1',
        sessionId: eventId
      },
    );

    markEventFired(SESSION_KEYS.FORM_START);
    console.log('[FormStart] Completed successfully');
  }, []);

  const trackAddToCart = useCallback(async (formData: MetaFormData) => {
    console.log('[AddToCart] Starting trackAddToCart...');
    
    // STRICT: Only fire once
    if (hasEventFired(SESSION_KEYS.ADD_TO_CART)) {
      console.log('[AddToCart] Already fired, skipping');
      return;
    }
    
    if (!canFireEvent(SESSION_KEYS.ADD_TO_CART)) {
      console.log('[AddToCart] Cannot fire event, skipping');
      return;
    }

    console.log('[AddToCart] Firing on Step 1 — email + phone valid');

    // Update pixel with advanced matching data (email + phone + name available at this point)
    updatePixelWithAdvancedMatching({
      email: formData.email,
      phone: formData.phone,
      fullName: formData.fullName,
    });

    // Browser Pixel
    const pixelData = {
      content_type: 'product',
      currency: 'NGN',
      // Include package if selected, but don't require it
      ...(formData.packageName && formData.packagePrice && {
        content_ids: [formData.packageName],
        content_name: formData.packageName,
        value: formData.packagePrice,
      }),
    };

    const eventId = generateEventId('atc');

    console.log('[AddToCart] Browser Pixel data:', pixelData);
    firePixelEvent('AddToCart', pixelData, eventId);

    // CAPI — send user data for matching (same eventId for deduplication)
    await sendToCAPI(
      'addtocart',
      eventId,
      {
        email: formData.email?.trim().toLowerCase() || '',
        phone: formData.phone?.replace(/\D/g, '') || '',
        fullName: formData.fullName || '',
      },
      {
        content_type: 'product',
        currency: 'NGN',
        // Include package data if available
        ...(formData.packageName && formData.packagePrice && {
          content_ids: [formData.packageName],
          content_name: formData.packageName,
          value: formData.packagePrice,
        }),
      },
    );

    // Mark as fired in session storage
    markEventFired(SESSION_KEYS.ADD_TO_CART);
    console.log('[AddToCart] Completed successfully');
  }, []);

  
  const trackInitiateCheckout = useCallback(async (formData: MetaFormData) => {
    if (hasEventFired(SESSION_KEYS.INITIATE_CHECKOUT)) return;
    if (!canFireEvent(SESSION_KEYS.INITIATE_CHECKOUT)) return;

    const eventId = generateEventId();

    // Update pixel with advanced matching data
    await updatePixelWithAdvancedMatching({
      fullName: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      state: formData.state,
      lga: formData.lga,
      address: formData.address,
      orderId: formData.orderId
    });

    const packageName = formData.packageName || 'Fulani Hair Gro';
    const value = formData.packagePrice ?? getPackagePrice(packageName);

    const contentIds = getProductContentIds(packageName);
    const contentName = getProductContentName(packageName);
    const numItems = getProductNumItems(packageName);

    firePixelEvent(
      'InitiateCheckout',
      {
        content_name: contentName,
        content_ids: contentIds,
        content_category: META_CONTENT_CATEGORY,
        content_type: 'product',
        value,
        currency: 'NGN',
        num_items: numItems
      },
      eventId
    );

    await sendToCAPI(
      'initiatecheckout',
      eventId,
      {
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        state: formData.state,
        lga: formData.lga,
        address: formData.address
      },
      {
        packageName,
        packagePrice: value,
        sessionId: eventId,
        content_ids: JSON.stringify(contentIds),
        content_name: contentName,
        content_category: META_CONTENT_CATEGORY,
        content_type: 'product',
        num_items: numItems,
        
        // NEW: Payment method data 💳
        payment_method: formData.paymentMethod || 'Pay on Delivery',
        is_prepaid_customer: (formData.paymentMethod || 'Pay on Delivery') === 'Pay Before Delivery',
        
        // NEW: Acquisition channel data 📢
        acquisition_channel: formData.heardAboutUs || '',
        is_facebook_channel: (formData.heardAboutUs || '').includes('Facebook'),
        is_instagram_channel: (formData.heardAboutUs || '').includes('Instagram'),
        is_tiktok_channel: (formData.heardAboutUs || '').includes('TikTok'),
        is_referral_channel: (formData.heardAboutUs || '').includes('Referral'),
        
        // NEW: Delivery preferences data ⏰
        delivery_speed_preference: formData.deliveryFee || 0,
        preferred_delivery_date: formData.deliveryDate || '',
        delivery_time_window: formData.deliveryTimeWindow || '',
        delivery_urgency: calculateDeliveryUrgency(formData.deliveryDate || ''),
        price_sensitivity: (formData.deliveryFee || 0) === 5000 ? 'premium' : 'standard'
      },
    );

    markEventFired(SESSION_KEYS.INITIATE_CHECKOUT);
  }, []);

  const trackPurchase = useCallback(async (formData: MetaFormData) => {
    //  BULLETPROOF DEDUPLICATION LAYER 1: Session storage check
    if (hasEventFired(SESSION_KEYS.PURCHASE)) {
      console.log('[Purchase] Already fired in session - skipping');
      return;
    }

    //  BULLETPROOF DEDUPLICATION LAYER 2: Event flow check
    if (!canFireEvent(SESSION_KEYS.PURCHASE)) {
      console.log('[Purchase] Cannot fire event - flow check failed');
      return;
    }

    //  BULLETPROOF DEDUPLICATION LAYER 3: Order ID localStorage check
    const orderId = formData.orderId?.trim();
    if (orderId) {
      const purchaseKey = `purchase_${orderId}`;
      const alreadyPurchased = localStorage.getItem(purchaseKey);
      if (alreadyPurchased) {
        console.log('[Purchase] Order already processed - skipping:', orderId);
        return;
      }
    }

    // Generate stable event ID for Facebook deduplication
    const stableOrderId = (orderId || '').trim();
    const safeOrderId = stableOrderId.replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 64);
    const eventId = safeOrderId || generateEventId();

    // Update pixel with advanced matching data
    await updatePixelWithAdvancedMatching({
      fullName: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      state: formData.state,
      lga: formData.lga,
      address: formData.address,
      orderId: formData.orderId
    });

    const packageName = formData.packageName || 'Fulani Hair Gro';
    const packageAmount = formData.packagePrice ?? getPackagePrice(packageName);
    const deliveryFee = formData.deliveryFee ?? 3000;
    const totalAmount = formData.totalAmount ?? packageAmount + deliveryFee;

    // 🎯 PBD SIGNAL: Determine payment type for optimization
    const paymentMethod = formData.paymentMethod || 'Pay on Delivery';
    const paymentType = paymentMethod === 'Pay Before Delivery' ? 'PBD' : 'POD';

    // 🎯 VALUE-BASED EVENT NAMING: Clean, readable event names
    const paymentPrefix = paymentType === 'PBD' ? 'pbd' : 'pod';
    const valueBasedEventName = `${paymentPrefix}${packageAmount}`;
    
    console.log('[Whale Hunting] 🚀 Event fired:', valueBasedEventName, {
      packageAmount,
      paymentType,
      paymentMethod,
      packageName,
      totalAmount
    });

    const contentIds = getProductContentIds(packageName);
    const contentName = getProductContentName(packageName);
    const numItems = getProductNumItems(packageName);

    console.log('[Purchase] Firing bulletproof Purchase event:', {
      orderId: formData.orderId,
      eventId,
      totalAmount,
      packageName
    });

    //  BULLETPROOF DEDUPLICATION LAYER 4: Facebook event_id for server-side deduplication
    // Send browser-side Purchase event via firePixelEvent (single source of truth)
    const purchaseData = {
      value: totalAmount, // Amount is already in Naira (discounted for PBD, full for POD)
      currency: 'NGN',
      content_ids: contentIds,
      content_name: `${paymentType}_${contentName}`, // PBD_Package vs POD_Package
      content_type: 'product',
      num_items: numItems
    };
    
    // Fire Purchase event (single fbq call)
    firePixelEvent('Purchase', purchaseData, eventId);
    console.log('[Purchase] 🎯 PBD SIGNAL - Browser Purchase event sent:', {
      paymentType,
      payment_method: paymentMethod,
      totalAmount,
      contentName: `${paymentType}_${contentName}`,
      eventId
    });
    
    // Fire value-based custom event (separate from Purchase)
    fireCustomPixelEvent(valueBasedEventName, {
      value: packageAmount, // Package amount (without delivery)
      currency: 'NGN',
      content_name: `${packageName}_${paymentPrefix}`,
      content_type: 'product',
      payment_type: paymentType,
      payment_method: paymentMethod,
      package_amount: packageAmount,
      delivery_fee: deliveryFee,
      total_amount: totalAmount,
      event_id: eventId
    });
    console.log('[Whale Hunting] 🚀 Value-based custom event sent:', {
      eventName: valueBasedEventName,
      packageAmount,
      paymentType,
      totalAmount,
      eventId
    });

    //  BULLETPROOF DEDUPLICATION LAYER 5: CAPI with same event_id
    await sendToCAPI(
      'purchase',
      eventId, // Same event_id for perfect deduplication
      {
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        state: formData.state,
        lga: formData.lga,
        address: formData.address
      },
      {
        orderId: formData.orderId,
        packageName,
        packageAmount,
        deliveryFee,
        totalAmount, // Use the same totalAmount for consistency
        currency: 'NGN', // Explicitly set currency for CAPI
        content_ids: JSON.stringify(contentIds),
        content_name: contentName,
        content_category: META_CONTENT_CATEGORY,
        content_type: 'product',
        num_items: numItems,
        event_id: eventId, //  CRITICAL: Same event_id for CAPI deduplication
        
        // NEW: Payment method data 
        payment_method: formData.paymentMethod || 'Pay on Delivery',
        is_prepaid_customer: (formData.paymentMethod || 'Pay on Delivery') === 'Pay Before Delivery',
        
        // NEW: Acquisition channel data 
        acquisition_channel: formData.heardAboutUs || '',
        is_facebook_channel: (formData.heardAboutUs || '').includes('Facebook'),
        is_instagram_channel: (formData.heardAboutUs || '').includes('Instagram'),
        is_tiktok_channel: (formData.heardAboutUs || '').includes('TikTok'),
        is_referral_channel: (formData.heardAboutUs || '').includes('Referral'),
        
        // NEW: Delivery preferences data 
        delivery_speed_preference: formData.deliveryFee || 0,
        preferred_delivery_date: formData.deliveryDate || '',
        delivery_time_window: formData.deliveryTimeWindow || '',
        delivery_urgency: calculateDeliveryUrgency(formData.deliveryDate || ''),
        price_sensitivity: (formData.deliveryFee || 0) === 5000 ? 'premium' : 'standard',
        
        // 🐋 WHALE HUNTING: High-value customer identification
        whale_tier: packageAmount >= 215000 ? 'family_saves' : 
                   packageAmount >= 66750 ? 'b2gof_plus' : 'standard',
        value_tier: packageAmount >= 215000 ? 'ultra_premium' : 
                   packageAmount >= 66750 ? 'premium' : 'standard',
        is_whale_customer: packageAmount >= 66750,
        is_ultra_whale: packageAmount >= 215000,
        
        // 🎯 PBD SIGNAL: Payment type optimization for high-trust buyers
        payment_type: paymentType,
        is_cod_customer: paymentType === 'POD',
        trust_score: paymentType === 'PBD' ? 'high_trust' : 'standard_trust'
      },
    );

    await new Promise((resolve) => setTimeout(resolve, 500));

    // 🎯 VALUE-BASED CUSTOM EVENT CAPI: Clean, readable event name for Ads Manager
    await sendToCAPI(
      'custom',
      eventId, // Same event_id for perfect deduplication
      {
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        state: formData.state,
        lga: formData.lga,
        address: formData.address
      },
      {
        custom_event_name: valueBasedEventName, // Dynamic value-based event name
        orderId: formData.orderId,
        packageName,
        packageAmount,
        deliveryFee,
        totalAmount,
        currency: 'NGN',
        content_name: `${packageName}_${paymentPrefix}`,
        content_category: 'Value-Based Purchase',
        content_type: 'product',
        event_id: eventId,
        
        // Payment type data
        payment_type: paymentType,
        is_cod_customer: paymentType === 'POD',
        trust_score: paymentType === 'PBD' ? 'high_trust' : 'standard_trust',
        
        // Value-based classification
        value_event_name: valueBasedEventName,
        payment_prefix: paymentPrefix,
        package_value: packageAmount,
        value_tier: packageAmount >= 215000 ? 'ultra_premium' : 
                   packageAmount >= 66750 ? 'premium' : 'standard',
        
        // Whale hunting data
        whale_tier: packageAmount >= 215000 ? 'family_saves' : 
                   packageAmount >= 66750 ? 'b2gof_plus' : 'standard',
        is_whale_customer: packageAmount >= 66750,
        is_ultra_whale: packageAmount >= 215000
      }
    );

    //  BULLETPROOF DEDUPLICATION LAYER 6: Mark in multiple places
    markEventFired(SESSION_KEYS.PURCHASE);
    
    // Mark order as processed in localStorage
    if (orderId) {
      const purchaseKey = `purchase_${orderId}`;
      localStorage.setItem(purchaseKey, 'true');
      console.log('[Purchase] Marked order as processed:', orderId);
    }

    console.log('[Purchase] Bulletproof Purchase event completed successfully');
  }, []);

  const trackHighValuePurchase = useCallback(async (formData: MetaFormData) => {
    // 🏆 HIGH VALUE PURCHASE - Only for ultra-premium targeting
    // Check if this qualifies as a high-value purchase
    const packageName = formData.packageName || 'Fulani Hair Gro';
    const packageAmount = formData.packagePrice ?? getPackagePrice(packageName);
    const deliveryFee = formData.deliveryFee ?? 3000;
    const totalAmount = formData.totalAmount ?? packageAmount + deliveryFee;
    
    // Get wealth classification
    const wealthInfo = classifyWealthLevel(
      formData.state,
      formData.lga,
      formData.address,
      formData.zipCode
    );
    
    // 🏆 QUALIFICATION CHECK: Ultra-premium area + High-value package
    const isUltraPremium = wealthInfo.areaTier === 'ultra_premium';
    const isHighValuePackage = totalAmount >= 60000; // ₦60k+ threshold
    const isPrepaidCustomer = (formData.paymentMethod || 'Pay on Delivery') === 'Pay Before Delivery';
    
    // 🏆 TRUST SCORE: Wealth + Prepaid = Maximum Trust Signal
    let trustScore = 0;
    if (isUltraPremium) trustScore += 50;  // Area wealth
    if (isHighValuePackage) trustScore += 30;  // Package value
    if (isPrepaidCustomer) trustScore += 20;  // Prepaid trust
    
    // Elite combination: Ultra-premium area + Prepaid = 100% trust
    if (isUltraPremium && isPrepaidCustomer) {
      trustScore = 100;
    }
    
    // 🏆 CONVENIENCE PREFERENCE: Express delivery = convenience seeker
    let userPreference = 'standard';
    if ((formData.deliveryFee || 0) > 3000) {
      userPreference = 'convenience'; // Paid for express delivery
    }
    if (formData.deliveryDate && calculateDeliveryUrgency(formData.deliveryDate) === 'immediate') {
      userPreference = 'convenience'; // Urgent delivery requested
    }
    
    if (!isUltraPremium || !isHighValuePackage) {
      console.log('[HighValuePurchase] Does not qualify:', {
        isUltraPremium,
        isHighValuePackage,
        areaTier: wealthInfo.areaTier,
        totalAmount,
        packageName
      });
      return;
    }
    
    console.log('[HighValuePurchase] 🏆 QUALIFIED - Ultra-premium customer detected:', {
      areaTier: wealthInfo.areaTier,
      totalAmount,
      packageName,
      paymentMethod: formData.paymentMethod,
      isPrepaidCustomer,
      trustScore
    });
    
    // Generate unique event ID for high-value tracking
    const orderId = formData.orderId?.trim();
    const stableOrderId = (orderId || '').trim();
    const safeOrderId = stableOrderId.replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 64);
    const eventId = `hvp_${safeOrderId || generateEventId()}`;
    
    // Update pixel with advanced matching data
    await updatePixelWithAdvancedMatching({
      fullName: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      state: formData.state,
      lga: formData.lga,
      address: formData.address,
      orderId: formData.orderId
    });
    
    const contentIds = getProductContentIds(packageName);
    const contentName = getProductContentName(packageName);
    const numItems = getProductNumItems(packageName);
    
    // 🏆 Send High Value Purchase custom event via fireCustomPixelEvent (global dedup guard)
    fireCustomPixelEvent('HighValuePurchase', {
      value: totalAmount,
      currency: 'NGN',
      content_ids: contentIds,
      content_name: contentName,
      content_type: 'product',
      num_items: numItems,
      event_id: eventId,
      
      // 🏆 Ultra-premium indicators for Facebook AI
      area_tier: wealthInfo.areaTier,
      is_wealthy_area: wealthInfo.isWealthyArea,
      is_lagos_island: wealthInfo.isLagosIsland,
      is_abuja: wealthInfo.isAbuja,
      payment_method: formData.paymentMethod,
      is_prepaid_customer: isPrepaidCustomer,
      acquisition_channel: formData.heardAboutUs,
      
      // 🏆 Predictive LTV indicators
      predicted_ltv: 'high',
      customer_segment: 'ultra_premium',
      delivery_speed_preference: formData.deliveryFee || 0,
      price_sensitivity: 'premium',
      
      // 🏆 TRUST SCORE: Elite customer trust signal
      trust_score: trustScore,
      is_elite_customer: trustScore === 100,
      trust_indicators: {
        area_wealth: isUltraPremium,
        prepaid_trust: isPrepaidCustomer,
        high_value_intent: isHighValuePackage
      },
      
      // 🏆 CONVENIENCE PREFERENCE: Time-saving behavior
      user_preference: userPreference,
      is_convenience_seeker: userPreference === 'convenience',
      convenience_indicators: {
        paid_express_delivery: (formData.deliveryFee || 0) > 3000,
        urgent_delivery_requested: formData.deliveryDate && calculateDeliveryUrgency(formData.deliveryDate) === 'immediate'
      }
    }, eventId);
    console.log('[HighValuePurchase] 🏆 Ultra-premium event sent to Facebook:', eventId);
    
    // 🏆 Send to CAPI with enhanced high-value data
    await sendToCAPI(
      'custom', // Custom event type
      eventId,
      {
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        state: formData.state,
        lga: formData.lga,
        address: formData.address
      },
      {
        orderId: formData.orderId,
        eventName: 'HighValuePurchase', // Custom event name for CAPI
        packageName,
        packageAmount,
        deliveryFee,
        totalAmount,
        currency: 'NGN',
        content_ids: JSON.stringify(contentIds),
        content_name: contentName,
        content_category: META_CONTENT_CATEGORY,
        content_type: 'product',
        num_items: numItems,
        event_id: eventId,
        
        // 🏆 Ultra-premium classification
        area_tier: wealthInfo.areaTier,
        is_wealthy_area: wealthInfo.isWealthyArea,
        is_lagos_island: wealthInfo.isLagosIsland,
        is_lagos_mainland: wealthInfo.isLagosMainland,
        is_abuja: wealthInfo.isAbuja,
        
        // 🏆 High-value indicators
        payment_method: formData.paymentMethod,
        is_prepaid_customer: isPrepaidCustomer,
        acquisition_channel: formData.heardAboutUs,
        predicted_ltv: 'high',
        customer_segment: 'ultra_premium',
        
        // 🏆 Behavioral indicators
        delivery_speed_preference: formData.deliveryFee || 0,
        preferred_delivery_date: formData.deliveryDate || '',
        delivery_time_window: formData.deliveryTimeWindow || '',
        delivery_urgency: calculateDeliveryUrgency(formData.deliveryDate || ''),
        price_sensitivity: 'premium',
        
        // 🏆 TRUST SCORE: Elite customer trust signal for CAPI
        trust_score: trustScore, // 100 = Ultra-premium + Prepaid (maximum trust)
        is_elite_customer: trustScore === 100, // Boolean for Facebook AI
        trust_indicators: {
          area_wealth: isUltraPremium,
          prepaid_trust: isPrepaidCustomer,
          high_value_intent: isHighValuePackage
        },
        
        // 🏆 CONVENIENCE PREFERENCE: Time-saving behavior for CAPI
        user_preference: userPreference, // 'convenience' = pays for speed
        is_convenience_seeker: userPreference === 'convenience',
        convenience_indicators: {
          paid_express_delivery: (formData.deliveryFee || 0) > 3000,
          urgent_delivery_requested: formData.deliveryDate && calculateDeliveryUrgency(formData.deliveryDate) === 'immediate'
        }
      },
    );
    
    console.log('[HighValuePurchase] 🏆 Ultra-premium tracking completed successfully');
  }, []);

  
  
  // Aggressive Identity Capturing Implementation
  const [capturedIdentity, setCapturedIdentity] = useState<CapturedIdentity | null>(null);
  const debounceTimers = useRef<Map<string, NodeJS.Timeout>>(new Map());
  const identitySyncSent = useRef<Set<string>>(new Set());

  // Load persisted identity from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('fulani_captured_identity');
        if (stored) {
          const identity = JSON.parse(stored);
          // Only use if less than 30 days old
          const thirtyDaysInMs = 30 * 24 * 60 * 60 * 1000;
          if (Date.now() - identity.timestamp < thirtyDaysInMs) {
            setCapturedIdentity(identity);
            console.log('[Identity Capturing] Loaded persisted identity (30-day expiry):', { 
              hasEmail: !!identity.email, 
              hasPhone: !!identity.phone,
              hasExternalId: !!identity.external_id,
              daysRemaining: Math.round((thirtyDaysInMs - (Date.now() - identity.timestamp)) / (24 * 60 * 60 * 1000))
            });
          } else {
            // Clean up expired identity
            localStorage.removeItem('fulani_captured_identity');
            console.log('[Identity Capturing] Cleaned up expired identity (older than 30 days)');
          }
        }
      } catch (error) {
        console.warn('[Identity Capturing] Failed to load persisted identity:', error);
      }
    }
  }, []);

  // Debounced identity capture with validation
  const captureIdentity = useCallback((email?: string, phone?: string, externalId?: string) => {
    // Validate email format
    const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    
    // Validate phone format (basic check for Nigerian numbers)
    const isValidPhone = (phone: string) => {
      const clean = phone.replace(/\D/g, '');
      return clean.length >= 10 && clean.length <= 15;
    };

    // Clear existing timers
    debounceTimers.current.forEach(timer => clearTimeout(timer));
    debounceTimers.current.clear();

    const processCapture = () => {
      const newIdentity: CapturedIdentity = {
        timestamp: Date.now()
      };

      // Process email
      if (email && isValidEmail(email)) {
        newIdentity.email = email.toLowerCase().trim();
        console.log('[Identity Capturing] Email validated:', newIdentity.email);
      }

      // Process phone (will be standardized and hashed later)
      if (phone && isValidPhone(phone)) {
        newIdentity.phone = phone.replace(/\D/g, '');
        console.log('[Identity Capturing] Phone validated:', newIdentity.phone);
      }

      // Process external ID
      if (externalId && externalId.trim()) {
        newIdentity.external_id = externalId.trim();
        console.log('[Identity Capturing] External ID captured:', newIdentity.external_id);
      }

      // Only update if we have new data
      if (newIdentity.email || newIdentity.phone || newIdentity.external_id) {
        setCapturedIdentity(prev => {
          const merged = { ...prev, ...newIdentity };
          
          // Check if this is a new identity (overwrite protection)
          const isNewIdentity = 
            (newIdentity.email && newIdentity.email !== prev?.email) ||
            (newIdentity.phone && newIdentity.phone !== prev?.phone) ||
            (newIdentity.external_id && newIdentity.external_id !== prev?.external_id);
          
          if (isNewIdentity) {
            // Reset the 30-day timer for new identity
            merged.timestamp = Date.now();
            
            // Clear sync tracking for new external_id
            if (newIdentity.external_id && newIdentity.external_id !== prev?.external_id) {
              identitySyncSent.current.delete(prev?.external_id || 'anonymous');
              console.log('[Identity Capturing] 🔄 New external_id detected, reset sync tracking:', newIdentity.external_id);
            }
            
            console.log('[Identity Capturing] 🔄 New identity detected, resetting 30-day timer:', {
              newEmail: !!newIdentity.email,
              newPhone: !!newIdentity.phone,
              newExternalId: !!newIdentity.external_id
            });
          }
          
          // Persist to localStorage with 30-day expiry
          if (typeof window !== 'undefined') {
            try {
              localStorage.setItem('fulani_captured_identity', JSON.stringify(merged));
              console.log('[Identity Capturing] 💾 Identity persisted (30-day expiry):', {
                hasEmail: !!merged.email,
                hasPhone: !!merged.phone,
                hasExternalId: !!merged.external_id,
                isNewIdentity
              });
            } catch (error) {
              console.warn('[Identity Capturing] Failed to persist identity:', error);
            }
          }

          // Trigger LeadSync event if we have new identity data and haven't sent for this external_id
          if ((newIdentity.email || newIdentity.phone) && !identitySyncSent.current.has(merged.external_id || 'anonymous')) {
            triggerLeadSync(merged);
            identitySyncSent.current.add(merged.external_id || 'anonymous');
          }

          return merged;
        });
      }
    };

    // Debounce the capture
    const timer = setTimeout(processCapture, 500);
    debounceTimers.current.set('main', timer);
  }, []);

  // Trigger LeadSync CAPI event when identity is captured
  const triggerLeadSync = useCallback(async (identity: CapturedIdentity) => {
    try {
      console.log('[Identity Capturing] 🎯 Triggering LeadSync event...');

      // 🎯 10/10 EMQ: Create enhanced matching data with granular location
      const { createGranularCityData, createWealthFlags, createEnhancedMatchingData } = await import('@/utils/enhancedMatching');
      const { createLocationWealthData } = await import('@/utils/locationWealthTiering');
      
      // Use stored location data if available (from previous sessions)
      const granularCity = createGranularCityData('', '', 'Nigeria'); // Basic fallback
      const wealthFlags = createWealthFlags(); // Basic flags for LeadSync
      const locationWealthData = createLocationWealthData(); // Basic location flags

      const enhancedData = await createEnhancedMatchingData(
        identity.email || '',
        identity.phone || '',
        '',
        '',
        granularCity, // Use granular city data
        '',
        '',
        'NG',
        undefined,
        identity.external_id,
        'female'
      );

      // Map to UserData interface for sendToCAPI
      const userData = {
        email: identity.email,
        phone: identity.phone,
        state: '',
        lga: '',
        address: ''
      };

      const eventId = generateEventId('lead');
      
      await sendToCAPI(
        'custom',
        eventId,
        userData,
        {
          // Lead-specific data
          custom_event_name: 'LeadSync',
          lead_type: 'identity_capture',
          capture_method: 'real_time',
          // external_id removed from custom_data - only in user_data for consistency
          capture_timestamp: identity.timestamp,
          
          // Identity indicators
          has_email: !!identity.email,
          has_phone: !!identity.phone,
          has_external_id: !!identity.external_id,
          
          // 🎯 10/10 EMQ: Location-Based Wealth Tiering for immediate Meta training
          is_prime_location: locationWealthData.is_prime_location,
          area_wealth_tier: locationWealthData.area_wealth_tier,
          location_priority: locationWealthData.location_priority,
          tier_name: locationWealthData.tier_name,
          
          // 🎯 Additional location metadata for advanced targeting
          is_lagos: locationWealthData.is_lagos,
          is_abuja: locationWealthData.is_abuja,
          is_port_harcourt: locationWealthData.is_ph,
          is_kano: locationWealthData.is_kano,
          is_oyo: locationWealthData.is_oyo,
          
          // Legacy wealth flagging
          is_high_net_worth_area: wealthFlags.is_high_net_worth_area,
          
          // Metadata
          content_category: META_CONTENT_CATEGORY,
          page: 'Identity Capture'
        }
      );

      console.log('[Identity Capturing] ✅ LeadSync sent successfully:', {
        eventId,
        hasEmail: !!identity.email,
        hasPhone: !!identity.phone,
        externalId: identity.external_id
      });

    } catch (error) {
      console.error('[Identity Capturing] ❌ LeadSync failed:', error);
    }
  }, []);

  // Get current captured identity
  const getCapturedIdentity = useCallback(() => {
    return capturedIdentity;
  }, [capturedIdentity]);

  // Setup real-time listeners for form inputs
  const setupIdentityListeners = useCallback(() => {
    if (typeof window === 'undefined') return;

    const setupListener = (selector: string, type: 'email' | 'phone') => {
      const elements = document.querySelectorAll(selector);
      
      elements.forEach(element => {
        const input = element as HTMLInputElement;
        
        const handleInput = () => {
          const value = input.value.trim();
          if (value) {
            if (type === 'email') {
              captureIdentity(value, capturedIdentity?.phone, capturedIdentity?.external_id);
            } else {
              captureIdentity(capturedIdentity?.email, value, capturedIdentity?.external_id);
            }
          }
        };

        // Add debounced input listener
        input.addEventListener('input', handleInput);
        
        // Also listen for blur (when user leaves the field)
        input.addEventListener('blur', handleInput);
        
        console.log(`[Identity Capturing] 🎯 Setup listener for ${type} input:`, selector);
      });
    };

    // Setup listeners for common email and phone input selectors
    setTimeout(() => {
      setupListener('input[type="email"]', 'email');
      setupListener('input[name*="email"]', 'email');
      setupListener('input[id*="email"]', 'email');
      setupListener('input[type="tel"]', 'phone');
      setupListener('input[name*="phone"]', 'phone');
      setupListener('input[name*="phone"]', 'phone');
      setupListener('input[id*="phone"]', 'phone');
    }, 1000); // Delay to ensure DOM is ready
  }, [captureIdentity, capturedIdentity]);

  // Auto-setup listeners on mount with complete attribution system
  useEffect(() => {
    // 🎯 Deterministic Identity Mirroring: Initialize external_id system
    const externalId = initializeExternalIdSystem();
    
    // 🌉 Invisible Bridge: Initialize automatic cross-device stitching
    initializeInvisibleBridge();
    
    // Setup identity listeners
    setupIdentityListeners();
    
    console.log('[Attribution System] 🎯 Complete system initialized:', {
      externalId,
      invisibleBridge: 'active',
      deterministicMirroring: 'active',
      timestamp: new Date().toISOString()
    });
    
    // Final system verification
    setTimeout(() => {
      console.log('🚀 SYSTEM GREEN: Identity Engine operational, console clean, ready for scaling');
    }, 1000);
  }, [setupIdentityListeners]);

  const trackCompleteRegistration = useCallback(async (formData: MetaFormData) => {
    console.log('[CompleteRegistration] Starting trackCompleteRegistration...');
    
    const eventId = generateEventId('cr');
    
    if (!isPixelReady()) {
      console.warn('[CompleteRegistration] fbq not ready, firing anyway');
    }
    
    // Fire CompleteRegistration pixel event
    firePixelEvent('CompleteRegistration', {
      content_name: 'Fulani Hair Gro Order',
      content_category: META_CONTENT_CATEGORY,
      currency: 'NGN',
      value: formData.totalAmount || 0,
      status: 'completed'
    }, eventId);
    
    // Send CompleteRegistration via CAPI
    await sendToCAPI('custom', eventId, formData, {
      event_name: 'CompleteRegistration',
      content_name: 'Fulani Hair Gro Order',
      content_category: META_CONTENT_CATEGORY,
      currency: 'NGN',
      value: formData.totalAmount || 0,
      status: 'completed',
      totalAmount: formData.totalAmount || 0
    });
    
    console.log('[CompleteRegistration] ✅ CompleteRegistration event fired successfully');
  }, []);

  const isEventFired = useCallback((eventKey: string) => {
    return hasEventFired(eventKey);
  }, []);

  return {
    trackPageView,
    trackViewContent,
    trackFormStart,
    trackAddToCart,
    trackInitiateCheckout,
    trackPurchase,
    trackHighValuePurchase,
    trackCompleteRegistration,
    isEventFired,
    // Aggressive identity capturing
    captureIdentity,
    getCapturedIdentity,
    setupIdentityListeners
  };
}
