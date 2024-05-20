interface CacheData {
  data: any
  ttl: number
}

export class Cache {
  private static cache: Map<string, CacheData> = new Map()

  public static get(key: string): any {
    const data = this.cache.get(key)
    if (!data) return null
    if (data.ttl < Date.now()) {
      this.cache.delete(key)
      return null
    }
    return data.data
  }

  public static set(key: string, value: any, ttl: number): void {
    this.cache.set(key, { data: value, ttl: Date.now() + ttl })
  }

  public static has(key: string): boolean {
    const data = this.cache.get(key)
    return !!data && data.ttl >= Date.now()
  }
}

export function cache(ttl: number) {
  return function (_: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value

    descriptor.value = async function (...args: any[]) {
      const cacheKey = `${propertyKey}_${JSON.stringify(args)}`
      if (Cache.has(cacheKey)) {
        return Cache.get(cacheKey)
      }
      const result = await originalMethod.apply(this, args)
      Cache.set(cacheKey, result, ttl)
      return result
    }

    return descriptor
  }
}
