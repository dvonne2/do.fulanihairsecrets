import { useEffect, useState } from 'react';
import { apiCall } from '@/lib/api';

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

  if (!data) return <div className="p-8">Loading...</div>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Your Links</h1>

      <div className="mb-8">
        <h2 className="font-semibold mb-2">Default Link</h2>
        <div className="bg-gray-100 p-4 rounded flex items-center justify-between">
          <code className="break-all">{data.default_link}</code>
          <button onClick={() => copy(data.default_link, 'default')} className="ml-4 bg-gold text-black px-4 py-2 rounded whitespace-nowrap">
            {copied === 'default' ? 'Copied!' : 'Copy'}
          </button>
        </div>
      </div>

      {data.campaigns && data.campaigns.length > 0 && (
        <div>
          <h2 className="font-semibold mb-2">Campaign-Specific Links</h2>
          <div className="space-y-2">
            {data.campaigns.map((c) => (
              <div key={c.name} className="bg-gray-100 p-4 rounded flex items-center justify-between">
                <div>
                  <div className="font-semibold">{c.name}</div>
                  <code className="text-sm break-all">{c.url}</code>
                </div>
                <button onClick={() => copy(c.url, c.name)} className="ml-4 bg-gold text-black px-4 py-2 rounded whitespace-nowrap">
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
