import { createContext, useContext, useRef, useCallback } from 'react'

const DataCacheContext = createContext()

export function DataCacheProvider({ children }) {
  const cache = useRef({})

  const getCached = useCallback((key) => {
    const entry = cache.current[key]
    if (!entry) return null
    // Cache for 2 minutes
    if (Date.now() - entry.timestamp > 120000) {
      delete cache.current[key]
      return null
    }
    return entry.data
  }, [])

  const setCached = useCallback((key, data) => {
    cache.current[key] = { data, timestamp: Date.now() }
  }, [])

  return (
    <DataCacheContext.Provider value={{ getCached, setCached }}>
      {children}
    </DataCacheContext.Provider>
  )
}

export function useDataCache() {
  return useContext(DataCacheContext)
}
