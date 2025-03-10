// Environment variables with fallbacks
const config = {
  // Server
  port: process.env.PORT || '3000',
  nodeEnv: process.env.NODE_ENV || 'development',
  
  // URLs
  baseUrl: process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000',
  
  // Authentication
  nextAuthUrl: process.env.NEXTAUTH_URL || 'http://localhost:3000',
  nextAuthSecret: process.env.NEXTAUTH_SECRET || 'development-secret-key',
  
  // URL Shortener
  shortCodeLength: parseInt(process.env.SHORT_CODE_LENGTH || '6', 10),
  
  // CORS
  corsAllowedOrigins: (process.env.CORS_ALLOWED_ORIGINS || 'http://localhost:3000').split(','),
  
  // Rate Limiting
  rateLimitMax: parseInt(process.env.RATE_LIMIT_MAX || '60', 10),
  rateLimitWindowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '60000', 10),
  
  // Computed values
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
};

export default config; 