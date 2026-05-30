import { useEffect, useState } from 'react';
import { apiCall } from '@/lib/api';
import { Loader2, Link2, Copy, CheckCircle2, Megaphone, Share2, ExternalLink } from 'lucide-react';
import PortalLayout from '@/components/PortalLayout';

interface LinkData {
  base_url: string;
  affiliate_id: string;
  full_link: string;
  bundles: { name: string; contents: string; price: string; commission: string }[];
}

export default function Links() {
  const [data, setData] = useState<LinkData | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const result = await apiCall<LinkData>(
        'vitalvida.api.media_buyer.get_mb_links',
        undefined,
        { httpMethod: 'GET' }
      );
      if (result.ok && result.data) setData(result.data);
      setLoading(false);
    })();
  }, []);

  const copy = (url: string, label: string) => {
    navigator.clipboard.writeText(url);
    setCopied(label);
    setTimeout(() => setCopied(null), 2000);
  };

  if (loading || !data) {
    return (
      <PortalLayout>
        <div className="min-h-[80vh] flex flex-col items-center justify-center">
          <div className="relative w-16 h-16 mb-4">
            <div className="absolute inset-0 rounded-full border-2 border-[#d4af37]/20" />
            <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-[#d4af37] animate-spin" />
          </div>
          <p className="font-cinzel tracking-[0.2em] uppercase text-[11px] text-white/40">Generating Links</p>
        </div>
      </PortalLayout>
    );
  }

  return (
    <PortalLayout>
      <div className="p-5 md:p-8 lg:p-10 max-w-5xl mx-auto space-y-8">

        {/* Header */}
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 rounded-lg bg-[#d4af37]/10 flex items-center justify-center">
              <Share2 className="w-4.5 h-4.5 text-[#d4af37]" />
            </div>
            <h1 className="text-2xl md:text-3xl font-cinzel text-white font-bold tracking-wider">
              Marketing Links
            </h1>
          </div>
          <p className="text-white/30 font-sans text-sm ml-12">
            Your affiliate ID guarantees full credit for every order.
          </p>
        </div>

        {/* ═══ Master Link ═══ */}
        <div className="relative rounded-2xl bg-white/[0.02] border border-[#d4af37]/15 p-6 md:p-8 overflow-hidden group">
          <div className="absolute top-0 right-0 w-48 h-48 bg-[radial-gradient(circle,rgba(212,175,55,0.04)_0%,transparent_70%)] pointer-events-none" />
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#d4af37]/15 to-transparent" />

          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-2">
              <Link2 className="w-5 h-5 text-[#d4af37]" />
              <h2 className="font-cinzel text-lg text-white">Master Link</h2>
            </div>
            <p className="text-white/25 font-sans text-xs mb-5 ml-8">
              Primary link — routes to homepage and tracks the full session.
            </p>

            <div className="flex flex-col md:flex-row items-stretch gap-3">
              <div className="flex-1 bg-black/40 border border-white/[0.06] rounded-xl px-4 py-3.5 font-mono text-[#d4af37]/70 text-sm break-all flex items-center gap-2">
                <span className="flex-1">{data.full_link}</span>
                <a href={data.full_link} target="_blank" rel="noopener noreferrer" className="text-white/15 hover:text-white/40 transition-colors flex-shrink-0">
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
              <button
                onClick={() => copy(data.full_link, 'default')}
                className="relative overflow-hidden bg-gradient-to-r from-[#b8860b] via-[#d4af37] to-[#f0d060] text-black px-7 py-3.5 rounded-xl font-bold font-sans text-xs uppercase tracking-[0.15em] transition-all duration-300 flex items-center justify-center gap-2 group/btn md:w-auto w-full"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700" />
                <span className="relative flex items-center gap-2">
                  {copied === 'default' ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {copied === 'default' ? 'Copied!' : 'Copy Link'}
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* ═══ Direct Bundles ═══ */}
        {data.bundles && data.bundles.length > 0 && (
          <div>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-8 h-8 rounded-lg bg-[#d4af37]/10 flex items-center justify-center">
                <Megaphone className="w-4 h-4 text-[#d4af37]" />
              </div>
              <div>
                <h2 className="font-cinzel text-lg text-white">Direct Bundles</h2>
                <p className="text-white/20 font-sans text-[11px]">Direct traffic to specific packages (appending bundle to your link)</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {data.bundles.map((b) => {
                // Generate a custom URL for the bundle
                const bundleUrl = `${data.base_url}?aff_id=${data.affiliate_id}&bundle=${encodeURIComponent(b.name)}`;
                return (
                  <div key={b.name} className="rounded-2xl bg-white/[0.02] border border-white/[0.06] p-5 hover:border-white/[0.1] transition-all duration-300 group flex flex-col justify-between">
                    <div className="mb-5">
                      <div className="font-cinzel text-base text-white mb-1 group-hover:text-[#d4af37]/80 transition-colors duration-300">
                        {b.name}
                      </div>
                      <div className="text-white/30 text-xs mb-3 font-sans">
                        {b.price} • {b.commission} Commission
                      </div>
                      <div className="bg-black/40 border border-white/[0.04] rounded-lg p-3 font-mono text-xs text-white/30 break-all flex items-center gap-2">
                        <span className="flex-1">{bundleUrl}</span>
                        <a href={bundleUrl} target="_blank" rel="noopener noreferrer" className="text-white/10 hover:text-white/30 transition-colors flex-shrink-0">
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                    <button
                      onClick={() => copy(bundleUrl, b.name)}
                      className="w-full bg-white/[0.03] hover:bg-[#d4af37]/8 text-white/40 hover:text-[#d4af37] border border-white/[0.06] hover:border-[#d4af37]/20 px-5 py-3 rounded-xl font-bold font-sans text-[10px] uppercase tracking-[0.15em] transition-all duration-300 flex items-center justify-center gap-2"
                    >
                      {copied === b.name ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      {copied === b.name ? 'Copied!' : 'Copy Link'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </PortalLayout>
  );
}
