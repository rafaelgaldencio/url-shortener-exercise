"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

interface UrlStats {
  url: {
    id: number;
    shortCode: string;
    originalUrl: string;
    userId: number | null;
    isCustom: number;
    createdAt: string;
  };
  visitCount: number;
  lastVisit: string | null;
  topReferrers: { referrer: string; count: number }[];
}

export default function StatsPage() {
  const params = useParams();
  const shortCode = params.shortCode as string;
  
  const [stats, setStats] = useState<UrlStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [baseUrl, setBaseUrl] = useState('');
  
  useEffect(() => {
    setBaseUrl(process.env.NEXT_PUBLIC_BASE_URL || window.location.origin);
    
    async function fetchStats() {
      try {
        const response = await fetch(`/api/stats/${shortCode}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch URL stats');
        }
        
        const data = await response.json();
        setStats(data);
      } catch (e) {
        setError(e instanceof Error ? e.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    }
    
    fetchStats();
  }, [shortCode]);
  
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }
  
  if (error || !stats) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-red-100 text-red-700 p-4 rounded-md">
          {error || 'URL not found'}
        </div>
      </div>
    );
  }

  const fullShortUrl = `${baseUrl}/${stats.url.shortCode}`;
  
  return (
    <div className="min-h-screen p-4 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Link href="/dashboard" className="text-blue-500 hover:text-blue-700">
            ← Back to Dashboard
          </Link>
        </div>
        
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h1 className="text-2xl font-bold mb-2">URL Statistics</h1>
            <div className="flex items-center">
              <span className="text-gray-600 mr-2">Short URL:</span>
              <a 
                href={fullShortUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:text-blue-700"
              >
                {fullShortUrl}
              </a>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(fullShortUrl);
                  alert('URL copied to clipboard!');
                }}
                className="ml-2 text-gray-500 hover:text-gray-700"
              >
                Copy
              </button>
            </div>
          </div>
          
          <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h2 className="text-lg font-medium mb-2">Total Visits</h2>
              <p className="text-3xl font-bold text-blue-600">{stats.visitCount}</p>
            </div>
            
            <div className="bg-green-50 p-4 rounded-lg">
              <h2 className="text-lg font-medium mb-2">Created</h2>
              <p className="text-xl font-medium">
                {new Date(stats.url.createdAt).toLocaleDateString()}
              </p>
              <p className="text-sm text-gray-500">
                {new Date(stats.url.createdAt).toLocaleTimeString()}
              </p>
            </div>
            
            <div className="bg-purple-50 p-4 rounded-lg">
              <h2 className="text-lg font-medium mb-2">Last Visit</h2>
              {stats.lastVisit ? (
                <>
                  <p className="text-xl font-medium">
                    {new Date(stats.lastVisit).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-gray-500">
                    {new Date(stats.lastVisit).toLocaleTimeString()}
                  </p>
                </>
              ) : (
                <p className="text-gray-500">No visits yet</p>
              )}
            </div>
          </div>
          
          <div className="p-6 border-t border-gray-200">
            <h2 className="text-lg font-medium mb-4">Original URL</h2>
            <div className="bg-gray-50 p-3 rounded break-all">
              <a 
                href={stats.url.originalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:text-blue-700"
              >
                {stats.url.originalUrl}
              </a>
            </div>
          </div>
          
          {stats.topReferrers.length > 0 && (
            <div className="p-6 border-t border-gray-200">
              <h2 className="text-lg font-medium mb-4">Top Referrers</h2>
              <div className="overflow-hidden bg-gray-50 rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Referrer
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Visits
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {stats.topReferrers.map((referrer, index) => (
                      <tr key={index} className="hover:bg-gray-100">
                        <td className="px-6 py-4 whitespace-nowrap">
                          {referrer.referrer || '(Direct)'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {referrer.count}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 