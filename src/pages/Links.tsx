import { useEffect, useState } from 'react';
import { apiCall } from '@/lib/api';
import { Loader2, Link2, Copy, CheckCircle2, Megaphone, Share2 } from 'lucide-react';

interface LinkData {
  base_url: string;
  affiliate_id: string;
  default_link: string;
  campaigns: { name: string; url: string }[];
}

export default function Links() {
  const [data, setData] = useState<LinkData | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const result = await apiCall<LinkData>(
        'vitalvida.api.media_buyer.get_mb_links',
        undefined,
        { httpMethod: 'GET' }
      );
      if (result.ok && result.data) setData(result.data);
    })();
  }, []);

  const copy = (url: string, label: string) => {
    navigator.clipboard.writeText(url);
    setCopied(label);
    setTimeout(() => setCopied(null), 2000);
  };

  if (!data) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center text-gold">
        <Loader2 className="w-12 h-12 animate-spin mb-4" />
        <p className="font-cinzel tracking-widest uppercase text-sm">Generating Links...</p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-8 animate-in fade-in duration-700 text-white">
      
      <div className="mb-8 border-b border-white/10 pb-6">
        <h1 className="text-3xl md:text-4xl font-cinzel text-transparent bg-clip-text bg-gradient-to-r from-gold-light via-gold to-gold-dark font-bold tracking-wider mb-2 flex items-center gap-4">
          <Share2 className="w-8 h-8 text-gold" />
          Marketing Links
        </h1>
        <p className="text-gray-400 font-sans text-sm max-w-2xl">
          Use these links in your ad campaigns and social media. The affiliate ID guarantees you receive full credit for every order.
        </p>
      </div>

      {/* Default Link Section */}
      <div className="bg-black/40 backdrop-blur-xl border border-gold/30 rounded-3xl p-8 relative overflow-hidden shadow-[0_0_40px_rgba(212,175,55,0.05)]">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gold/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        
        <h2 className="font-cinzel text-2xl text-white mb-6 flex items-center gap-3">
          <Link2 className="text-gold w-6 h-6" />
          Master Link
        </h2>
        <p className="text-gray-400 font-sans text-sm mb-6 max-w-2xl">
          This is your primary link. It routes customers to the main store homepage and tracks their entire session.
        </p>

        <div className="flex flex-col md:flex-row items-center gap-4">
          <div className="flex-1 bg-black/80 border border-white/10 rounded-2xl p-5 font-mono text-gold-light break-all flex items-center shadow-inner w-full">
            {data.default_link}
          </div>
          <button 
            onClick={() => copy(data.default_link, 'default')} 
            className="w-full md:w-auto bg-gradient-to-r from-gold-dark via-gold to-gold-light text-black px-8 py-5 rounded-2xl font-bold font-sans uppercase tracking-widest hover:animate-glow-pulse transition-all duration-300 flex items-center justify-center gap-2 group"
          >
            {copied === 'default' ? <CheckCircle2 className="w-5 h-5" /> : <Copy className="w-5 h-5 group-hover:scale-110 transition-transform" />}
            {copied === 'default' ? 'Copied!' : 'Copy Link'}
          </button>
        </div>
      </div>

      {/* Campaign Links Section */}
      {data.campaigns && data.campaigns.length > 0 && (
        <div className="mt-12">
          <h2 className="font-cinzel text-2xl text-white mb-6 flex items-center gap-3">
            <Megaphone className="text-gold w-6 h-6" />
            Active Campaigns
          </h2>
          <p className="text-gray-400 font-sans text-sm mb-6">
            Direct your traffic to specific high-converting landing pages for active promotions.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {data.campaigns.map((c) => (
              <div key={c.name} className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-6 hover:border-gold/30 transition-all duration-300 group flex flex-col justify-between">
                <div className="mb-6">
                  <div className="font-cinzel text-xl text-white mb-3 group-hover:text-gold-light transition-colors">{c.name}</div>
                  <div className="bg-black/60 border border-white/5 rounded-xl p-4 font-mono text-sm text-gray-400 break-all">
                    {c.url}
                  </div>
                </div>
                <button 
                  onClick={() => copy(c.url, c.name)} 
                  className="w-full bg-white/5 hover:bg-gold/10 text-gold border border-white/10 hover:border-gold/30 px-6 py-4 rounded-xl font-bold font-sans uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2"
                >
                  {copied === c.name ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {copied === c.name ? 'Copied!' : 'Copy'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
