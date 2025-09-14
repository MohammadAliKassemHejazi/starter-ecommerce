import { Request, Response, NextFunction } from 'express';

// Simple in-memory cache (in production, use Redis)
const cache = new Map<string, { data: any; timestamp: number; ttl: number }>();

export const cacheMiddleware = (ttl: number = 300) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // Only cache GET requests
    if (req.method !== 'GET') {
      return next();
    }

    const key = `${req.originalUrl}`;
    const cached = cache.get(key);

    if (cached) {
      const now = Date.now();
      if (now - cached.timestamp < cached.ttl * 1000) {
        return res.json(cached.data);
      } else {
        cache.delete(key);
      }
    }

    // Store original res.json
    const originalJson = res.json.bind(res);
    
    // Override res.json to cache the response
    res.json = (body: any) => {
      cache.set(key, {
        data: body,
        timestamp: Date.now(),
        ttl
      });
      return originalJson(body);
    };

    next();
  };
};

export const clearCache = (pattern?: string) => {
  if (pattern) {
    const regex = new RegExp(pattern);
    for (const key of cache.keys()) {
      if (regex.test(key)) {
        cache.delete(key);
      }
    }
  } else {
    cache.clear();
  }
};
