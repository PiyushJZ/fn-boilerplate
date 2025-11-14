import { Queue, Worker, QueueEvents } from "bullmq";
import Redis from "ioredis";
import Config from "@/config";

export default class BackgroundJobs {
  private static redis: Redis | null = null;
  private static queues: Map<string, Queue> = new Map();
  private static workers: Map<string, Worker> = new Map();
  private static queueEvents: Map<string, QueueEvents> = new Map();
  private static isClosing = false;
  private static isShutdownHookAdded: boolean = false;

  private static getRedis(): Redis {
    if (this.redis) {
      return this.redis;
    }

    this.redis = new Redis(Config.REDIS_JOBS, {
      lazyConnect: true,
    });
    this.addShutdownHook();
    return this.redis;
  }

  private static getQueue(name: string) {
    if (!this.queues.has(name)) {
      const queue = new Queue(name, {
        connection: this.getRedis(),
      });
      this.queues.set(name, queue);
    }
    return this.queues.get(name)!;
  }

  public static createWorker<T = any>(name: string, processor: (job: any) => Promise<any>) {
    if (this.workers.has(name)) {
      return;
    }
    const worker = new Worker(name, processor, {
      connection: this.getRedis(),
    });
    const events = new QueueEvents(name, { connection: this.getRedis() });

    worker.on("completed", (job) => console.log(`Job ${job.id} in ${name} completed`));
    worker.on("failed", (job, err) => console.error(`Job ${job?.id} in ${name} failed:`, err));

    this.workers.set(name, worker);
    this.queueEvents.set(name, events);
  }

  public static async addJob<T = any>(name: string, payload: T, opts: any = {}) {
    const queue = this.getQueue(name);
    return queue.add(name, payload, opts);
  }

  public static async getJob(name: string, id: string) {
    const queue = this.getQueue(name);
    return queue.getJob(id);
  }

  static async disconnect(): Promise<void> {
    if (this.redis && !this.isClosing) {
      this.isClosing = true;
      await this.redis.quit();
      this.redis = null;
      console.log("Cache redis connection closed");
    }
  }

  private static addShutdownHook() {
    if (this.isShutdownHookAdded) return;
    this.isShutdownHookAdded = true;

    const shutdown = async () => {
      console.log("Shutting down BullMQ...");
      for (const w of this.workers.values()) {
        await w.close();
      }
      for (const e of this.queueEvents.values()) {
        await e.close();
      }
      for (const q of this.queues.values()) {
        await q.close();
      }
      if (this.redis) {
        await this.redis.quit();
        this.redis = null;
      }
      console.log("BullMQ shutdown complete");
    };

    process.on("SIGINT", shutdown);
    process.on("SIGTERM", shutdown);
    process.on("beforeExit", shutdown);
    process.on("uncaughtException", async (err) => {
      console.error("Uncaught exception:", err);
      await shutdown();
      process.exit(1);
    });
  }
}
