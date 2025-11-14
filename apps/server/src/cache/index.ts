import Redis from "ioredis";
import Config from "@/config";

export default class RedisCache {
  private static client: Redis | null = null;
  private static isClosing: boolean = false;

  private static getClient(): Redis {
    if (this.client) {
      return this.client;
    }

    this.client = new Redis(Config.REDIS_CACHE, {
      lazyConnect: true,
    });
    this.shutdownSetup();
    return this.client;
  }

  private static async disconnect(): Promise<void> {
    if (this.client && !this.isClosing) {
      this.isClosing = true;
      await this.client.quit();
      this.client = null;
      console.log("Cache redis connection closed");
    }
  }

  private static shutdownSetup() {
    if ((process as any)._cacheShutdownHookAdded) {
      return;
    }
    (process as any)._cacheShutdownHookAdded = true;

    const cleanup = async () => {
      await RedisCache.disconnect();
      process.exit(0);
    };

    process.on("SIGINT", cleanup);
    process.on("SIGTERM", cleanup);

    process.on("uncaughtException", async (err) => {
      console.error("Uncaught exception:", err);
      await RedisCache.disconnect();
      process.exit(1);
    });

    process.on("unhandledRejection", async (err) => {
      console.error("Unhandled rejection:", err);
      await RedisCache.disconnect();
      process.exit(1);
    });
  }

  // Cache usage methods

  /**
   * Get string value for a key
   */
  static async getText(key: string): Promise<String | null> {
    const client = this.getClient();
    return client.get(key);
  }

  /**
   * Get object value for a key
   */
  static async getObject<T>(key: string): Promise<T | null> {
    const client = this.getClient();
    const val = await client.get(key);
    return val ? JSON.parse(val) : null;
  }

  /**
   * Set value and TTL for a key
   */
  static async set(key: string, val: string | object | number, ttlSeconds: number): Promise<void> {
    const client = this.getClient();
    if (typeof val === "string" || typeof val === "number") {
      await client.setex(key, ttlSeconds, val);
      return;
    }
    await client.setex(key, ttlSeconds, JSON.stringify(val));
  }

  /**
   * Set a value for a key indefinitely (without TTL)
   */
  static async setIndefinitely(key: string, val: string | object | number): Promise<void> {
    const client = this.getClient();
    if (typeof val === "string" || typeof val === "number") {
      await client.set(key, val);
      return;
    }
    await client.set(key, JSON.stringify(val));
  }

  /**
   * Delete a key-value
   */
  static async del(key: string) {
    const client = this.getClient();
    await client.del(key);
  }

  /**
   * Increment value of a key by a certain value
   */
  static async increment(key: string, by: number) {
    const client = this.getClient();
    await client.incrby(key, by);
  }

  /**
   * Decrement value of a key by a certain value
   */
  static async decrement(key: string, by: number) {
    const client = this.getClient();
    await client.decrby(key, by);
  }
}
