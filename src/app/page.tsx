"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";

export default function Home() {
  const { data: session } = useSession();
  const [url, setUrl] = useState("");
  const [customShortCode, setCustomShortCode] = useState("");
  const [shortenedUrl, setShortenedUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    
    try {
      const payload: { originalUrl: string; customShortCode?: string } = {
        originalUrl: url
      };
      
      if (session && customShortCode.trim()) {
        payload.customShortCode = customShortCode.trim();
      }
      
      const response = await fetch('/api/shorten', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to shorten URL');
      }
      
      const data = await response.json();
      setShortenedUrl(data.shortenedUrl);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-6 text-center">URL Shortener</h1>
        
        {!session && (
          <div className="mb-6 p-3 bg-blue-50 text-blue-700 rounded-md text-center">
            <p>
              <Link href="/login" className="font-medium hover:underline">
                Log in
              </Link>
              {' or '}
              <Link href="/register" className="font-medium hover:underline">
                register
              </Link>
              {' to create custom short URLs and track statistics.'}
            </p>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-1">
              Enter a URL to shorten
            </label>
            <input 
              id="url"
              type="url" 
              value={url} 
              onChange={(e) => setUrl(e.target.value)} 
              placeholder="https://example.com/long-url" 
              required 
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            />
          </div>
          
          {session && (
            <div>
              <label htmlFor="customCode" className="block text-sm font-medium text-gray-700 mb-1">
                Custom short code (optional)
              </label>
              <input 
                id="customCode"
                type="text" 
                value={customShortCode} 
                onChange={(e) => setCustomShortCode(e.target.value)} 
                placeholder="e.g., my-link" 
                pattern="[a-zA-Z0-9-_]+"
                title="Only letters, numbers, hyphens, and underscores are allowed"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              />
              <p className="mt-1 text-xs text-gray-500">
                Only letters, numbers, hyphens, and underscores are allowed
              </p>
            </div>
          )}
          
          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {isLoading ? 'Shortening...' : 'Shorten URL'}
          </button>
        </form>
        
        {error && (
          <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}
        
        {shortenedUrl && (
          <div className="mt-6">
            <h2 className="text-lg font-medium mb-2">Your shortened URL:</h2>
            <div className="flex items-center">
              <input 
                type="text" 
                value={shortenedUrl} 
                readOnly 
                className="flex-1 p-2 border border-gray-300 rounded-l-md bg-gray-50"
              />
              <button 
                onClick={() => {
                  navigator.clipboard.writeText(shortenedUrl);
                  alert('URL copied to clipboard!');
                }}
                className="bg-gray-200 px-4 py-2 rounded-r-md hover:bg-gray-300 text-gray-700"
              >
                Copy
              </button>
            </div>
            
            <div className="mt-2 text-right">
              <a 
                href={`/stats/${shortenedUrl.split('/').pop()}`}
                className="text-blue-500 hover:text-blue-700 text-sm"
                target="_blank"
                rel="noopener noreferrer"
              >
                View stats
              </a>
            </div>
          </div>
        )}
        
        {session && (
          <div className="mt-6 text-center">
            <Link 
              href="/dashboard"
              className="text-blue-500 hover:text-blue-700"
            >
              View your dashboard
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
