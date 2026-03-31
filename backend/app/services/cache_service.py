from cachetools import TTLCache
import threading

class CacheService:
    def __init__(self):
        self._caches = {
            "weather": TTLCache(maxsize=100, ttl=600),
            "entertainment": TTLCache(maxsize=200, ttl=900),
            "sports": TTLCache(maxsize=50, ttl=60),
            "food": TTLCache(maxsize=200, ttl=1800),
            "travel": TTLCache(maxsize=100, ttl=3600),
            "news": TTLCache(maxsize=100, ttl=900),
            "default": TTLCache(maxsize=500, ttl=300),
        }
        self._lock = threading.Lock()

    def get(self, key: str, domain: str = "default"):
        cache = self._caches.get(domain, self._caches["default"])
        with self._lock:
            return cache.get(key)

    def set(self, key: str, value, domain: str = "default"):
        cache = self._caches.get(domain, self._caches["default"])
        with self._lock:
            cache[key] = value

    def invalidate(self, key: str, domain: str = "default"):
        cache = self._caches.get(domain, self._caches["default"])
        with self._lock:
            cache.pop(key, None)

cache = CacheService()
