import React, { useState, useEffect } from 'react';
import { trackingVerifier, AccuracyMetrics } from '../utils/trackingVerifier';

interface TrackingAccuracyDashboardProps {
  isVisible: boolean;
  onClose: () => void;
}

export const TrackingAccuracyDashboard: React.FC<TrackingAccuracyDashboardProps> = ({
  isVisible,
  onClose
}) => {
  const [metrics, setMetrics] = useState<AccuracyMetrics | null>(null);
  const [report, setReport] = useState<string>('');
  const [testResult, setTestResult] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isVisible) {
      refreshMetrics();
    }
  }, [isVisible]);

  const refreshMetrics = () => {
    const currentMetrics = trackingVerifier.getAccuracyMetrics();
    setMetrics(currentMetrics);
    setReport(trackingVerifier.generateAccuracyReport());
  };

  const runAccuracyTest = async () => {
    setIsLoading(true);
    try {
      const result = await trackingVerifier.testTrackingAccuracy();
      setTestResult(result);
      refreshMetrics();
    } catch (error) {
      console.error('Accuracy test failed:', error);
      setTestResult(false);
    } finally {
      setIsLoading(false);
    }
  };

  const clearOldData = () => {
    trackingVerifier.clearOldVerifications();
    refreshMetrics();
  };

  const getSuccessRate = (success: number, total: number): string => {
    if (total === 0) return '0.0';
    return ((success / total) * 100).toFixed(1);
  };

  const getStatusColor = (rate: number): string => {
    if (rate >= 95) return 'text-green-600';
    if (rate >= 85) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getOverallStatus = (): string => {
    if (!metrics) return 'Unknown';
    
    const pixelRate = parseFloat(getSuccessRate(metrics.pixelSuccess, metrics.totalEvents));
    const capiRate = parseFloat(getSuccessRate(metrics.capiSuccess, metrics.totalEvents));
    const consistencyRate = parseFloat(getSuccessRate(metrics.dataConsistency, metrics.totalEvents));
    
    if (pixelRate >= 95 && capiRate >= 95 && consistencyRate >= 95) return 'Excellent';
    if (pixelRate >= 85 && capiRate >= 85 && consistencyRate >= 85) return 'Good';
    return 'Needs Attention';
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">🔍 Tracking Accuracy Dashboard</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>

        {/* Overall Status */}
        <div className="mb-6 p-4 bg-blue-50 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Overall Status: {getOverallStatus()}</h3>
          <p className="text-sm text-gray-600">
            Last updated: {new Date().toLocaleString()}
          </p>
        </div>

        {/* Metrics Grid */}
        {metrics && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white border rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-600">Total Events</h4>
              <p className="text-2xl font-bold text-gray-800">{metrics.totalEvents}</p>
            </div>
            
            <div className="bg-white border rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-600">Pixel Success</h4>
              <p className={`text-2xl font-bold ${getStatusColor(parseFloat(getSuccessRate(metrics.pixelSuccess, metrics.totalEvents)))}`}>
                {getSuccessRate(metrics.pixelSuccess, metrics.totalEvents)}%
              </p>
              <p className="text-xs text-gray-500">{metrics.pixelSuccess}/{metrics.totalEvents}</p>
            </div>
            
            <div className="bg-white border rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-600">CAPI Success</h4>
              <p className={`text-2xl font-bold ${getStatusColor(parseFloat(getSuccessRate(metrics.capiSuccess, metrics.totalEvents)))}`}>
                {getSuccessRate(metrics.capiSuccess, metrics.totalEvents)}%
              </p>
              <p className="text-xs text-gray-500">{metrics.capiSuccess}/{metrics.totalEvents}</p>
            </div>
            
            <div className="bg-white border rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-600">Data Consistency</h4>
              <p className={`text-2xl font-bold ${getStatusColor(parseFloat(getSuccessRate(metrics.dataConsistency, metrics.totalEvents)))}`}>
                {getSuccessRate(metrics.dataConsistency, metrics.totalEvents)}%
              </p>
              <p className="text-xs text-gray-500">{metrics.dataConsistency}/{metrics.totalEvents}</p>
            </div>
          </div>
        )}

        {/* Enhanced Matching */}
        {metrics && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white border rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-600">Enhanced Matching</h4>
              <p className={`text-2xl font-bold ${getStatusColor(parseFloat(getSuccessRate(metrics.enhancedMatchingRate, metrics.totalEvents)))}`}>
                {getSuccessRate(metrics.enhancedMatchingRate, metrics.totalEvents)}%
              </p>
              <p className="text-xs text-gray-500">Events with enhanced parameters</p>
            </div>
            
            <div className="bg-white border rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-600">Deduplication</h4>
              <p className={`text-2xl font-bold ${getStatusColor(parseFloat(getSuccessRate(metrics.deduplicationSuccess, metrics.totalEvents)))}`}>
                {getSuccessRate(metrics.deduplicationSuccess, metrics.totalEvents)}%
              </p>
              <p className="text-xs text-gray-500">Properly deduplicated events</p>
            </div>
            
            <div className="bg-white border rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-600">Error Rate</h4>
              <p className={`text-2xl font-bold ${getStatusColor(100 - (metrics.errorRate * 100))}`}>
                {(metrics.errorRate * 100).toFixed(1)}%
              </p>
              <p className="text-xs text-gray-500">Events with errors</p>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={refreshMetrics}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            🔄 Refresh Metrics
          </button>
          
          <button
            onClick={runAccuracyTest}
            disabled={isLoading}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
          >
            {isLoading ? '⏳ Testing...' : '🧪 Run Accuracy Test'}
          </button>
          
          <button
            onClick={clearOldData}
            className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700"
          >
            🗑️ Clear Old Data
          </button>
        </div>

        {/* Test Result */}
        {testResult !== null && (
          <div className={`mb-6 p-4 rounded-lg ${testResult ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            <h4 className="font-semibold">
              {testResult ? '✅ Accuracy Test Passed' : '❌ Accuracy Test Failed'}
            </h4>
            <p className="text-sm mt-1">
              {testResult 
                ? 'All tracking systems are functioning correctly.'
                : 'Some tracking issues detected. Check console for details.'}
            </p>
          </div>
        )}

        {/* Detailed Report */}
        {report && (
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-2">📊 Detailed Report</h3>
            <pre className="text-sm text-gray-700 whitespace-pre-wrap font-mono">
              {report}
            </pre>
          </div>
        )}

        {/* Instructions */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h3 className="text-sm font-semibold mb-2">📋 How to Use</h3>
          <ul className="text-xs text-gray-600 space-y-1">
            <li>• <strong>Refresh Metrics:</strong> Updates the dashboard with latest tracking data</li>
            <li>• <strong>Run Accuracy Test:</strong> Tests pixel and CAPI tracking with sample data</li>
            <li>• <strong>Clear Old Data:</strong> Removes verification data older than 1 hour</li>
            <li>• <strong>Console Access:</strong> Use <code>trackingVerifier.getAccuracyMetrics()</code> in console</li>
            <li>• <strong>Real-time Monitoring:</strong> Check browser console for live tracking logs</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TrackingAccuracyDashboard;
