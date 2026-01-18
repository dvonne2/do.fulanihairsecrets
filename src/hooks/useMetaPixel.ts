import { useCallback } from 'react';
import {
  SESSION_KEYS,
  hasEventFired,
  markEventFired,
  canFireEvent,
  generateEventId,
  firePixelEvent,
  sendToCAPI,
  getPackagePrice,
  getProductContentIds,
  getProductContentName,
  getProductNumItems,
  META_CONTENT_CATEGORY,
  UserData
} from '@/utils/pixelUtils';

export type MetaFormData = UserData & {
  packageName?: string;
  packagePrice?: number;
  orderId?: string;
  deliveryFee?: number;
  totalAmount?: number;
};

type UseMetaPixelReturn = {
  trackPageView: () => void;
  trackAddToCart: (formData: MetaFormData) => void;
  trackInitiateCheckout: (formData: MetaFormData) => void;
  trackPurchase: (formData: MetaFormData) => void;
  isEventFired: (eventKey: string) => boolean;
};

export function useMetaPixel(): UseMetaPixelReturn {
  const trackPageView = useCallback(() => {
    const eventId = generateEventId('pv');
    firePixelEvent('PageView', {}, eventId);
    markEventFired(SESSION_KEYS.PAGE_VIEW);
  }, []);

  const trackAddToCart = useCallback((formData: MetaFormData) => {
    if (hasEventFired(SESSION_KEYS.ADD_TO_CART)) return;
    if (!canFireEvent(SESSION_KEYS.ADD_TO_CART)) return;

    const eventId = generateEventId('atc');

    const packageName = formData.packageName || 'Fulani Hair Gro';
    const packagePrice = formData.packagePrice ?? getPackagePrice(packageName);

    const contentIds = getProductContentIds(packageName);
    const contentName = getProductContentName(packageName);
    const numItems = getProductNumItems(packageName);

    firePixelEvent(
      'AddToCart',
      {
        content_name: contentName,
        content_ids: contentIds,
        content_category: META_CONTENT_CATEGORY,
        content_type: 'product',
        value: packagePrice,
        currency: 'NGN',
        num_items: numItems
      },
      eventId
    );

    void sendToCAPI(
      'addtocart',
      eventId,
      {
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        state: formData.state
      },
      {
        packageName,
        packagePrice,
        sessionId: eventId,
        content_ids: JSON.stringify(contentIds),
        content_name: contentName,
        content_category: META_CONTENT_CATEGORY,
        content_type: 'product',
        num_items: numItems
      }
    );

    markEventFired(SESSION_KEYS.ADD_TO_CART);
  }, []);

  const trackInitiateCheckout = useCallback((formData: MetaFormData) => {
    if (hasEventFired(SESSION_KEYS.INITIATE_CHECKOUT)) return;
    if (!canFireEvent(SESSION_KEYS.INITIATE_CHECKOUT)) return;

    const eventId = generateEventId('ic');

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

    void sendToCAPI(
      'initiatecheckout',
      eventId,
      {
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        state: formData.state
      },
      {
        packageName,
        packagePrice: value,
        sessionId: eventId,
        content_ids: JSON.stringify(contentIds),
        content_name: contentName,
        content_category: META_CONTENT_CATEGORY,
        content_type: 'product',
        num_items: numItems
      }
    );

    markEventFired(SESSION_KEYS.INITIATE_CHECKOUT);
  }, []);

  const trackPurchase = useCallback((formData: MetaFormData) => {
    if (hasEventFired(SESSION_KEYS.PURCHASE)) return;

    if (!canFireEvent(SESSION_KEYS.PURCHASE)) return;

    const stableOrderId = (formData.orderId || '').trim();
    const safeOrderId = stableOrderId.replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 64);
    const eventId = safeOrderId ? `pur_${safeOrderId}` : generateEventId('pur');

    const packageName = formData.packageName || 'Fulani Hair Gro';
    const packageAmount = formData.packagePrice ?? getPackagePrice(packageName);
    const deliveryFee = formData.deliveryFee ?? 3000;
    const totalAmount = formData.totalAmount ?? packageAmount + deliveryFee;

    const contentIds = getProductContentIds(packageName);
    const contentName = getProductContentName(packageName);
    const numItems = getProductNumItems(packageName);

    firePixelEvent(
      'Purchase',
      {
        value: totalAmount,
        currency: 'NGN',
        content_name: contentName,
        content_ids: contentIds,
        content_category: META_CONTENT_CATEGORY,
        content_type: 'product',
        num_items: numItems,
        order_id: formData.orderId
      },
      eventId
    );

    void sendToCAPI(
      'purchase',
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
        packageName,
        packageAmount,
        deliveryFee,
        totalAmount,
        content_ids: JSON.stringify(contentIds),
        content_name: contentName,
        content_category: META_CONTENT_CATEGORY,
        content_type: 'product',
        num_items: numItems
      }
    );

    markEventFired(SESSION_KEYS.PURCHASE);
  }, []);

  const isEventFired = useCallback((eventKey: string) => {
    return hasEventFired(eventKey);
  }, []);

  return {
    trackPageView,
    trackAddToCart,
    trackInitiateCheckout,
    trackPurchase,
    isEventFired
  };
}
