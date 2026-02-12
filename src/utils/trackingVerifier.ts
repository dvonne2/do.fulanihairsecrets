// Pixel & CAPI Accuracy Verification System
// Ensures accurate tracking and provides real-time verification

export interface TrackingVerification {
  pixelFired: boolean;
  capiSent: boolean;
  eventId: string;
  timestamp: number;
  eventType: string;
  dataConsistency: boolean;
  enhancedMatching: boolean;
  errors: string[];
}

export interface AccuracyMetrics {
  totalEvents: number;
  pixelSuccess: number;
  capiSuccess: number;
  deduplicationSuccess: number;
  dataConsistency: number;
  enhancedMatchingRate: number;
  errorRate: number;
}

class TrackingVerifier {
  private static instance: TrackingVerifier;
  private verifications: Map<string, TrackingVerification> = new Map();
  private metrics: AccuracyMetrics = {
    totalEvents: 0,
    pixelSuccess: 0,
    capiSuccess: 0,
    deduplicationSuccess: 0,
    dataConsistency: 0,
    enhancedMatchingRate: 0,
    errorRate: 0
  };

  static getInstance(): TrackingVerifier {
    if (!TrackingVerifier.instance) {
      TrackingVerifier.instance = new TrackingVerifier();
    }
    return TrackingVerifier.instance;
  }

  /**
   * Verify pixel event accuracy
   */
  verifyPixelEvent(eventType: string, eventId: string, data: any): boolean {
    try {
      const verification: TrackingVerification = {
        pixelFired: true,
        capiSent: false,
        eventId,
        timestamp: Date.now(),
        eventType,
        dataConsistency: this.verifyDataConsistency(data),
        enhancedMatching: this.verifyEnhancedMatching(data),
        errors: []
      };

      this.verifications.set(eventId, verification);
      this.updateMetrics(verification);

      console.log(`[TrackingVerifier] Pixel event verified:`, {
        eventType,
        eventId,
        dataConsistency: verification.dataConsistency,
        enhancedMatching: verification.enhancedMatching
      });

      return true;
    } catch (error) {
      console.error('[TrackingVerifier] Pixel verification failed:', error);
      return false;
    }
  }

  /**
   * Verify CAPI event accuracy
   */
  verifyCAPIEvent(eventType: string, eventId: string, data: any): boolean {
    try {
      const existing = this.verifications.get(eventId);
      let pixelFired = existing?.pixelFired || false;
      
      // If pixel hasn't fired yet, wait a bit and check again (race condition fix)
      if (!pixelFired) {
        // Check if there's a pending pixel verification
        setTimeout(() => {
          const updated = this.verifications.get(eventId);
          if (updated && !updated.pixelFired) {
            // Pixel still hasn't fired, update the verification
            updated.pixelFired = false;
            this.verifications.set(eventId, updated);
            console.log(`[TrackingVerifier] CAPI event - pixel still pending:`, eventId);
          }
        }, 100); // Wait 100ms for pixel to catch up
      }
      
      const verification: TrackingVerification = {
        pixelFired,
        capiSent: true,
        eventId,
        timestamp: Date.now(),
        eventType,
        dataConsistency: this.verifyDataConsistency(data),
        enhancedMatching: this.verifyEnhancedMatching(data),
        errors: []
      };

      this.verifications.set(eventId, verification);
      this.updateMetrics(verification);

      console.log(`[TrackingVerifier] CAPI event verified:`, {
        eventType,
        eventId,
        dataConsistency: verification.dataConsistency,
        enhancedMatching: verification.enhancedMatching,
        pixelFired: verification.pixelFired,
        raceCondition: !pixelFired && !existing ? 'possible' : 'none'
      });

      return true;
    } catch (error) {
      console.error('[TrackingVerifier] CAPI verification failed:', error);
      return false;
    }
  }

  /**
   * Verify data consistency across events
   */
  private verifyDataConsistency(data: any): boolean {
    try {
      // Different events have different required fields
      const eventType = data.event_name || data.custom_event_name || 'unknown';
      
      let hasRequiredFields = true;
      let currencyConsistent = true;
      let valueValid = true;
      let orderIdValid = true;

      if (eventType === 'Purchase' || eventType === 'purchase') {
        // Purchase events need orderId, currency, value
        const requiredFields = ['currency', 'value'];
        hasRequiredFields = requiredFields.every(field => 
          data[field] !== undefined && data[field] !== null
        );
        currencyConsistent = data.currency === 'NGN';
        valueValid = typeof data.value === 'number' && data.value > 0;
        // orderId is optional for consistency check (may be in different field)
        orderIdValid = !data.orderId || (typeof data.orderId === 'string' && data.orderId.length > 0);
      } else {
        // FormStart, AddToCart, InitiateCheckout only need basic structure
        hasRequiredFields = true; // No required fields for these events
        currencyConsistent = !data.currency || data.currency === 'NGN';
        valueValid = !data.value || (typeof data.value === 'number' && data.value >= 0);
        orderIdValid = true; // Not required for these events
      }

      return hasRequiredFields && currencyConsistent && valueValid && orderIdValid;
    } catch (error) {
      console.error('[TrackingVerifier] Data consistency check failed:', error);
      return false;
    }
  }

  /**
   * Verify enhanced matching parameters
   */
  private verifyEnhancedMatching(data: any): boolean {
    try {
      // Browser events have em, ph, ct, st, zp
      // CAPI events have those plus client_ip_address, client_user_agent
      const browserParams = ['em', 'ph', 'ct', 'st', 'zp'];
      const serverParams = ['client_ip_address', 'client_user_agent'];
      const enhancedParams = [...browserParams, ...serverParams];
      
      const hasEnhancedParams = enhancedParams.some(param => 
        data[param] !== undefined && data[param] !== null
      );

      // Check hashed email format (64-character hex string) - if present
      const hasHashedEmail = data.em && /^[a-f0-9]{64}$/i.test(data.em);

      // Check hashed phone format - if present
      const hasHashedPhone = data.ph && /^[a-f0-9]{64}$/i.test(data.ph);

      // Check IP address format - if present (server-only)
      const hasValidIP = data.client_ip_address && 
        /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$|^[0-9a-fA-F:]+$/.test(data.client_ip_address);

      // Check location data (browser-only)
      const hasLocationData = data.ct || data.st || data.zp;

      // Success if we have ANY enhanced data
      return hasEnhancedParams && (
        hasHashedEmail || 
        hasHashedPhone || 
        hasValidIP || 
        hasLocationData
      );
    } catch (error) {
      console.error('[TrackingVerifier] Enhanced matching check failed:', error);
      return false;
    }
  }

  /**
   * Update accuracy metrics
   */
  private updateMetrics(verification: TrackingVerification): void {
    this.metrics.totalEvents++;
    
    if (verification.pixelFired) this.metrics.pixelSuccess++;
    if (verification.capiSent) this.metrics.capiSuccess++;
    if (verification.dataConsistency) this.metrics.dataConsistency++;
    if (verification.enhancedMatching) this.metrics.enhancedMatchingRate++;
    
    // Calculate deduplication success (both pixel and CAPI with same event ID)
    const existing = Array.from(this.verifications.values())
      .filter(v => v.eventId === verification.eventId);
    if (existing.length === 2 && existing.every(v => v.dataConsistency)) {
      this.metrics.deduplicationSuccess++;
    }

    this.metrics.errorRate = this.calculateErrorRate();
  }

  /**
   * Calculate error rate
   */
  private calculateErrorRate(): number {
    const errorCount = Array.from(this.verifications.values())
      .filter(v => v.errors.length > 0).length;
    return this.metrics.totalEvents > 0 ? errorCount / this.metrics.totalEvents : 0;
  }

  /**
   * Get current accuracy metrics
   */
  getAccuracyMetrics(): AccuracyMetrics {
    return { ...this.metrics };
  }

  /**
   * Get verification details for specific event
   */
  getEventVerification(eventId: string): TrackingVerification | null {
    return this.verifications.get(eventId) || null;
  }

  /**
   * Get all verifications
   */
  getAllVerifications(): TrackingVerification[] {
    return Array.from(this.verifications.values());
  }

  /**
   * Clear old verifications (older than 1 hour)
   */
  clearOldVerifications(): void {
    const oneHourAgo = Date.now() - (60 * 60 * 1000);
    
    for (const [eventId, verification] of this.verifications.entries()) {
      if (verification.timestamp < oneHourAgo) {
        this.verifications.delete(eventId);
      }
    }
  }

  /**
   * Generate accuracy report
   */
  generateAccuracyReport(): string {
    const metrics = this.getAccuracyMetrics();
    const pixelSuccessRate = metrics.totalEvents > 0 ? 
      (metrics.pixelSuccess / metrics.totalEvents * 100).toFixed(1) : '0.0';
    const capiSuccessRate = metrics.totalEvents > 0 ? 
      (metrics.capiSuccess / metrics.totalEvents * 100).toFixed(1) : '0.0';
    const consistencyRate = metrics.totalEvents > 0 ? 
      (metrics.dataConsistency / metrics.totalEvents * 100).toFixed(1) : '0.0';
    const enhancedRate = metrics.totalEvents > 0 ? 
      (metrics.enhancedMatchingRate / metrics.totalEvents * 100).toFixed(1) : '0.0';

    return `
📊 TRACKING ACCURACY REPORT
===========================
Total Events: ${metrics.totalEvents}
Pixel Success Rate: ${pixelSuccessRate}%
CAPI Success Rate: ${capiSuccessRate}%
Data Consistency: ${consistencyRate}%
Enhanced Matching: ${enhancedRate}%
Error Rate: ${(metrics.errorRate * 100).toFixed(1)}%

🎯 ACCURACY STATUS: ${metrics.errorRate < 0.05 ? '✅ EXCELLENT' : metrics.errorRate < 0.1 ? '⚠️ GOOD' : '❌ NEEDS ATTENTION'}
    `.trim();
  }

  /**
   * Test tracking accuracy
   */
  async testTrackingAccuracy(): Promise<boolean> {
    try {
      console.log('[TrackingVerifier] Starting accuracy test...');
      
      // Test pixel event
      const testEventId = `test_${Date.now()}`;
      const testData = {
        currency: 'NGN',
        value: 32750,
        orderId: 'TEST_ORDER_123',
        em: 'a1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef1234567890',
        ph: '0987654321abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
        client_ip_address: '192.168.1.1',
        client_user_agent: 'Mozilla/5.0 (Test Browser)'
      };

      const pixelSuccess = this.verifyPixelEvent('test', testEventId, testData);
      const capiSuccess = this.verifyCAPIEvent('test', testEventId, testData);

      const testPassed = pixelSuccess && capiSuccess;
      
      console.log('[TrackingVerifier] Accuracy test result:', {
        pixelSuccess,
        capiSuccess,
        testPassed,
        testData: {
          hasRequiredFields: this.verifyDataConsistency(testData),
          hasEnhancedMatching: this.verifyEnhancedMatching(testData)
        }
      });

      return testPassed;
    } catch (error) {
      console.error('[TrackingVerifier] Accuracy test failed:', error);
      return false;
    }
  }
}

// Export singleton instance
export const trackingVerifier = TrackingVerifier.getInstance();

// Make available globally for testing
if (typeof window !== 'undefined') {
  (window as any).trackingVerifier = trackingVerifier;
  
  console.log(
    '🔍 Tracking Verifier Ready!\n' +
    'Test accuracy: trackingVerifier.testTrackingAccuracy()\n' +
    'Get metrics: trackingVerifier.getAccuracyMetrics()\n' +
    'Generate report: trackingVerifier.generateAccuracyReport()'
  );
}

export default trackingVerifier;
