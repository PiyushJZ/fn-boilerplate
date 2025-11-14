import Redis from "ioredis";
import Config from "@/config";

const redis = new Redis(Config.REDIS_CACHE);

export default class RedisCache {
  static async get(key: string) {
    const val = await redis.get(key);
    return val;
  }

  static async set(key: string, value: any) {}
}
