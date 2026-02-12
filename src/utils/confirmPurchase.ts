// Utility function for telesales agents to confirm COD orders
// This can be called from an admin panel, API endpoint, or directly in browser console

/**
 * Confirm a COD order and trigger Purchase event via CAPI only
 * Call this function when a telesales agent confirms a Cash on Delivery order
 * 
 * @param orderId - The order ID to confirm
 * 
 * Usage:
 * 1. From browser console: confirmCODPurchase('2601130556')
 * 2. From admin panel: import and call confirmCODPurchase(orderId)
 * 3. From API endpoint: POST /api/confirm-order with orderId
 */
export function confirmCODPurchase(orderId: string): void {
  console.log('[COD Confirmation] Confirming order:', orderId);
  
  // Validate orderId
  if (!orderId || typeof orderId !== 'string' || orderId.trim().length === 0) {
    console.error('[COD Confirmation] Invalid orderId provided:', orderId);
    return;
  }

  // Use the new secure order data storage system
  void confirmCODPurchaseWithStorage(orderId.trim());
}

// Enhanced confirmation using secure storage
async function confirmCODPurchaseWithStorage(orderId: string): Promise<void> {
  try {
    // Import the secure storage system
    const { retrieveOrderData, updateOrderStatus } = await import('../api/storeOrderData');
    
    // Retrieve complete order data from secure storage
    const orderData = await retrieveOrderData(orderId);
    
    if (!orderData) {
      console.error('[COD Confirmation] No order data found for confirmed purchase:', orderId);
      // Fallback to sessionStorage for backward compatibility
      await fallbackConfirmation(orderId);
      return;
    }

    console.log('[COD Confirmation] Retrieved complete order data:', {
      orderId: orderData.orderId,
      customer: orderData.customerFullName,
      total: orderData.totalAmount,
      phone: orderData.phoneNumber
    });
    
    // Generate consistent event ID for deduplication
    const safeOrderId = orderId.replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 64);
    const eventId = safeOrderId || `pur_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Send CAPI Purchase event with complete data
    await sendCAPIPurchaseEvent(eventId, orderId, orderData);
    
    // Update order status to confirmed
    const statusUpdated = await updateOrderStatus(orderId, 'confirmed');
    
    if (statusUpdated) {
      console.log('[COD Confirmation] Order status updated to confirmed:', orderId);
    } else {
      console.warn('[COD Confirmation] Failed to update order status:', orderId);
    }
    
    console.log('[COD Confirmation] Purchase event sent via CAPI with complete data:', orderId);
  } catch (error) {
    console.error('[COD Confirmation] Error confirming purchase:', error);
  }
}

// Fallback to original sessionStorage method for backward compatibility
async function fallbackConfirmation(orderId: string): Promise<void> {
  try {
    console.log('[COD Confirmation] Using fallback sessionStorage method');
    
    const stored = sessionStorage.getItem('fhg_order_data');
    if (!stored) {
      console.error('[COD Confirmation] No fallback order data found:', orderId);
      return;
    }

    const orderData = JSON.parse(stored);
    
    // Generate consistent event ID for deduplication
    const safeOrderId = orderId.replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 64);
    const eventId = safeOrderId || `pur_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Send CAPI Purchase event directly
    await sendCAPIPurchaseEvent(eventId, orderId, orderData);
    
    console.log('[COD Confirmation] Fallback Purchase event sent via CAPI for order:', orderId);
  } catch (error) {
    console.error('[COD Confirmation] Fallback failed:', error);
  }
}

// Direct CAPI function to avoid circular imports
async function sendCAPIPurchaseEvent(eventId: string, orderId: string, orderData: any): Promise<void> {
  try {
    // Import dynamically to avoid circular dependency
    const { sendToCAPI } = await import('./pixelUtils');
    
    // Handle both new storage format and fallback format
    const totalAmount = orderData.totalAmount || orderData.totalAmount || 0;
    const packageName = orderData.packageName || orderData.packageName || 'Fulani Hair Gro';
    const packagePrice = orderData.packagePrice || orderData.packageAmount || 0;
    const deliveryFee = orderData.deliveryFee || orderData.deliveryFee || 3000;
    const customerName = orderData.customerFullName || orderData.fullName || '';
    const customerPhone = orderData.phoneNumber || orderData.phone || '';
    const customerEmail = orderData.email || '';
    
    console.log('[CAPI] Sending Purchase event with complete data:', {
      eventId,
      orderId,
      customerName,
      customerPhone,
      totalAmount,
      packageName
    });
    
    // Send Purchase event only via CAPI with complete data
    await sendToCAPI(
      'purchase',
      eventId,
      {
        fullName: customerName,
        email: customerEmail,
        phone: customerPhone,
        state: orderData.state || '',
        lga: orderData.lga || '',
        address: orderData.address || ''
      },
      {
        orderId,
        packageName,
        packageAmount: packagePrice,
        deliveryFee,
        totalAmount,
        currency: 'NGN', // Explicitly set currency for CAPI
        content_ids: JSON.stringify([packageName]), // Simple content ID
        content_name: packageName,
        content_category: 'Hair Care, Hair Product',
        content_type: 'product',
        num_items: 1
      }
    );
    
    console.log('[CAPI] Purchase event sent successfully for confirmed order:', orderId);
  } catch (error) {
    console.error('[CAPI] Failed to send Purchase event for confirmed order:', error);
  }
}

// Make function available globally for easy console access
if (typeof window !== 'undefined') {
  (window as any).confirmCODPurchase = confirmCODPurchase;
  
  console.log(
    '🛒 COD Purchase Confirmation Ready!\n' +
    'To confirm a COD order, run: confirmCODPurchase("ORDER_ID")\n' +
    'Example: confirmCODPurchase("2601130556")\n' +
    'This will send a Purchase event via CAPI only (no browser pixel).'
  );
}

export default confirmCODPurchase;
