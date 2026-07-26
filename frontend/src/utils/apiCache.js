// Simple in-memory API response cache
const cache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export function getCachedData(key) {
  const cached = cache.get(key);
  if (!cached) return null;
  
  const { data, timestamp } = cached;
  const now = Date.now();
  
  if (now - timestamp > CACHE_DURATION) {
    cache.delete(key);
    return null;
  }
  
  return data;
}

export function setCachedData(key, data) {
  cache.set(key, {
    data,
    timestamp: Date.now()
  });
}

export function clearCache() {
  cache.clear();
}

export function clearCachePattern(pattern) {
  for (const key of cache.keys()) {
    if (key.includes(pattern)) {
      cache.delete(key);
    }
  }
}
