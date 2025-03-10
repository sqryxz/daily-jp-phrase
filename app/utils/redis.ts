// Temporary in-memory cache until Redis is properly set up
const memoryCache = new Map<string, { value: string; expiry: number }>();

// Cache TTL in seconds (24 hours)
const CACHE_TTL = 24 * 60 * 60;

export async function getCachedValue(key: string): Promise<string | null> {
  try {
    const item = memoryCache.get(key);
    if (!item) return null;
    
    if (Date.now() > item.expiry) {
      memoryCache.delete(key);
      return null;
    }
    
    return item.value;
  } catch (error) {
    console.error('Cache get error:', error);
    return null;
  }
}

export async function setCachedValue(key: string, value: string): Promise<void> {
  try {
    memoryCache.set(key, {
      value,
      expiry: Date.now() + (CACHE_TTL * 1000)
    });
  } catch (error) {
    console.error('Cache set error:', error);
  }
}

// Function to generate cache keys
export function generateCacheKey(type: 'translation' | 'reading', text: string): string {
  return `jp:${type}:${text}`;
}

// Function to check if we should use cache for this request
export function shouldUseCache(text: string): boolean {
  // Don't cache very short texts as they're likely to be common words
  if (text.length <= 2) return false;
  
  // Don't cache very long texts as they're likely to be unique
  if (text.length > 1000) return false;
  
  return true;
} 