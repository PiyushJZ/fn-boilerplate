import { Queue, Worker, QueueEvents, Processor, JobsOptions } from "bullmq";
import Redis from "ioredis";
import Config from "@/config";

type JobsObject = {
  name: string;
  data: any;
  opts: JobsOptions;
};

type BulkJobObject = Array<JobsObject>;

export default class JobsManager {
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
      maxRetriesPerRequest: null,
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

  public static createWorker<T>(name: string, processor: Processor<T>) {
    if (this.workers.has(name)) {
      return;
    }
    const worker = new Worker<T>(name, processor, {
      connection: this.getRedis(),
    });
    const events = new QueueEvents(name, { connection: this.getRedis() });

    worker.on("completed", (job) => console.log(`Job: ${job.id} in queue: ${name} completed`));
    worker.on("failed", (job, err) =>
      console.error(`Job: ${job?.id} in queue: ${name} failed:`, err),
    );

    this.workers.set(name, worker);
    this.queueEvents.set(name, events);
  }

  public static async addJob<T = any>(name: string, payload: T, opts: JobsOptions = {}) {
    const queue = this.getQueue(name);
    return queue.add(name, payload, { removeOnComplete: true, removeOnFail: false, ...opts });
  }

  public static async addBulkJobs(name: string, jobs: BulkJobObject) {
    const queue = this.getQueue(name);
    return queue.addBulk(jobs);
  }

  public static async getJob(name: string, jobId: string) {
    const queue = this.getQueue(name);
    return queue.getJob(jobId);
  }

  public static async getJobEta(name: string, jobId: string, avgTime: number = 2 * 1000) {
    const job = await JobsManager.getJob(name, jobId);
    if (!job) {
      return { state: "not_found" };
    }
    const state = await job.getState();
    switch (state) {
      case "completed":
        return { state, eta: 0 };
      case "failed":
        return { state, eta: 0 };
      case "active":
        const startTime = job.processedOn!;
        const elapsedTime = Date.now() - startTime;
        return { state, eta: Math.max(avgTime - elapsedTime, 0) };
      default:
        const queue = this.getQueue(name);
        const waitingJobs = await queue.getJobCountByTypes("waiting");
        return { state, eta: waitingJobs * avgTime };
    }
  }

  public static getQueueEvent(name: string) {
    return this.queueEvents.get(name);
  }

  public static async drain(name: string) {
    const queue = this.getQueue(name);
    await queue.drain();
  }

  public static async flush() {
    for (const [_, worker] of this.workers.entries()) {
      await worker.close();
    }
    for (const [_, events] of this.queueEvents.entries()) {
      await events.close();
    }
    for (const [_, queue] of this.queues.entries()) {
      await queue.close();
    }
    this.workers.clear();
    this.queueEvents.clear();
    this.queues.clear();
    const redis = this.getRedis();
    await redis.flushdb();
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
