import db from './db';
import crypto from 'crypto';
import config from './config';
import { getUserByEmail } from './user-service';

export interface UrlRecord {
  id: number;
  shortCode: string;
  originalUrl: string;
  userId: number | null;
  isCustom: number;
  createdAt: string;
}

export interface UrlStats {
  url: UrlRecord;
  visitCount: number;
  lastVisit: string | null;
  topReferrers: { referrer: string; count: number }[];
}

export function generateShortCode(length = config.shortCodeLength): string {
  return crypto.randomBytes(length).toString('base64url').slice(0, length);
}

export function createShortUrl(
  originalUrl: string, 
  userId: number | null = null, 
  customShortCode: string | null = null
): UrlRecord {
  let shortCode: string = '';
  let isCustom = 0;
  
  if (customShortCode && userId) {
    const existing = getUrlByShortCode(customShortCode);
    if (existing) {
      throw new Error('This short code is already in use');
    }
    shortCode = customShortCode;
    isCustom = 1;
  } else {
    let exists = true;  
    while (exists) {
      shortCode = generateShortCode();
      const existing = getUrlByShortCode(shortCode);
      exists = !!existing;
    }
  }
  
  const stmt = db.prepare(
    'INSERT INTO urls (shortCode, originalUrl, userId, isCustom) VALUES (?, ?, ?, ?)'
  );
  const info = stmt.run(shortCode, originalUrl, userId, isCustom);
  
  return db.prepare('SELECT * FROM urls WHERE id = ?').get(info.lastInsertRowid) as UrlRecord;
}

export function getOriginalUrl(shortCode: string): string | null {
  const record = db.prepare('SELECT originalUrl FROM urls WHERE shortCode = ?').get(shortCode);
  return record ? (record as { originalUrl: string }).originalUrl : null;
}

export function getUrlByShortCode(shortCode: string): UrlRecord | null {
  return db.prepare('SELECT * FROM urls WHERE shortCode = ?').get(shortCode) as UrlRecord | null;
}

export function recordVisit(urlId: number, referrer: string | null = null, userAgent: string | null = null): void {
  const stmt = db.prepare(
    'INSERT INTO visits (urlId, referrer, userAgent) VALUES (?, ?, ?)'
  );
  stmt.run(urlId, referrer, userAgent);
}

export function getUrlStats(shortCode: string): UrlStats | null {
  const url = getUrlByShortCode(shortCode);
  if (!url) return null;

  const visitCount = db.prepare('SELECT COUNT(*) as count FROM visits WHERE urlId = ?')
    .get(url.id) as { count: number };

  const lastVisit = db.prepare('SELECT timestamp FROM visits WHERE urlId = ? ORDER BY timestamp DESC LIMIT 1')
    .get(url.id) as { timestamp: string } | undefined;

  const topReferrers = db.prepare(`
    SELECT referrer, COUNT(*) as count 
    FROM visits 
    WHERE urlId = ? AND referrer IS NOT NULL 
    GROUP BY referrer 
    ORDER BY count DESC 
    LIMIT 5
  `).all(url.id) as { referrer: string; count: number }[];

  return {
    url,
    visitCount: visitCount.count,
    lastVisit: lastVisit?.timestamp || null,
    topReferrers
  };
}

export function getUserUrls(userEmail: string): UrlRecord[] {
  const user = getUserByEmail(userEmail);
  return db.prepare('SELECT * FROM urls WHERE userId = ? ORDER BY createdAt DESC').all(user?.id) as UrlRecord[];
} 