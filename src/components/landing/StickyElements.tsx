import { AlertTriangle } from 'lucide-react';

interface StickyElementsProps {
  showStickyBar: boolean;
  viewerCount: number;
  stockCount: number;
  showPurchaseNotif: boolean;
  currentNotif: { name: string; location: string; product: string; time: string };
  scrollProgress: number;
}

export const StickyElements = ({ 
  showStickyBar, 
  stockCount, 
  showPurchaseNotif, 
  currentNotif,
  scrollProgress 
}: StickyElementsProps) => {
  const scrollToOrderForm = () => {
    const el = document.getElementById('order-form');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <>
      {/* Progress Bar */}
      <div 
        className="progress-bar" 
        style={{ width: `${scrollProgress}%` }}
      />

      {/* Purchase notification popup */}
      {showPurchaseNotif && currentNotif && (
        <div className="fixed top-20 right-4 z-[9999] bg-white rounded-lg shadow-xl border border-gray-200 p-4 max-w-sm animate-pulse md:top-20 md:right-4 top-4 right-2 md:max-w-sm max-w-[280px]">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <div>
              <div className="font-semibold text-sm">{currentNotif.name || 'A Customer'}</div>
              <div className="text-xs text-gray-600">{currentNotif.name} from {currentNotif.location} just ordered {currentNotif.product} • {currentNotif.time}</div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
