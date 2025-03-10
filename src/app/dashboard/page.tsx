"use client";

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface UrlRecord {
  id: number;
  shortCode: string;
  originalUrl: string;
  isCustom: number;
  createdAt: string;
}

export default function DashboardPage() {
  const { status } = useSession();
  const [urls, setUrls] = useState<UrlRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();
  const [baseUrl, setBaseUrl] = useState('');

  useEffect(() => {
    setBaseUrl(process.env.NEXT_PUBLIC_BASE_URL || window.location.origin);
  }, []);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  useEffect(() => {
    if (status === 'authenticated') {
      fetchUserUrls();
    }
  }, [status]);

  const fetchUserUrls = async () => {
    try {
      const response = await fetch('/api/user/urls');
      
      if (!response.ok) {
        throw new Error('Failed to fetch URLs');
      }
      
      const data = await response.json();
      setUrls(data);
    } catch (e) {
      setError('Failed to load your URLs');
    } finally {
      setIsLoading(false);
    }
  };

  if (status === 'loading' || isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (status === 'unauthenticated') {
    return null; // Will redirect
  }

  return (
    <div className="min-h-screen p-4 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Your URLs</h1>
          <Link 
            href="/"
            className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
          >
            Create New URL
          </Link>
        </div>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}
        
        {urls.length === 0 ? (
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <p className="text-gray-600">You haven&apos;t created any shortened URLs yet.</p>
            <Link 
              href="/"
              className="mt-4 inline-block bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
            >
              Create Your First URL
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md overflow-auto">
            <table className="min-w-full divide-y divide-gray-200 overflow-x-scroll w-auto">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Short URL
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Original URL
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {urls.map((url) => (
                  <tr key={url.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      {baseUrl && (
                        <a 
                          href={`${baseUrl}/${url.shortCode}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:text-blue-700"
                        >
                          {baseUrl}/{url.shortCode}
                        </a>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="max-w-xs truncate">
                        {url.originalUrl}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {new Date(url.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {url.isCustom ? (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800">
                          Custom
                        </span>
                      ) : (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          Auto
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Link 
                        href={`/stats/${url.shortCode}`}
                        className="text-blue-500 hover:text-blue-700 mr-4"
                      >
                        Stats
                      </Link>
                      {baseUrl && (
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(`${baseUrl}/${url.shortCode}`);
                            alert('URL copied to clipboard!');
                          }}
                          className="text-gray-500 hover:text-gray-700"
                        >
                          Copy
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
} 