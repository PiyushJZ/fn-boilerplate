import JobManager from "@/jobs";
import Cache from "@/cache";

// Testing background jobs utility functions
describe("Background Jobs Utilities", () => {
  interface JobData {
    key: string;
    value: string;
  }

  const jobName = "cache-item";

  afterAll(async () => {
    await JobManager.flush();
    await JobManager.disconnect();
    await Cache.flush();
    await Cache.disconnect();
  });

  describe("Worker creation", () => {
    it("should create a worker", () => {
      JobManager.createWorker<JobData>(jobName, async (job) => {
        await Cache.set(job.data.key, job.data.value, 10);
      });
    });
  });

  describe("Adding jobs", () => {
    it("should add a new job to the queue", async () => {
      const jobData: JobData = {
        key: "test",
        value: "test",
      };
      const jobId = "cache-test";

      await JobManager.addJob(jobName, jobData, { jobId });
      const avgTime = 50;
      const eta = await JobManager.getJobEta(jobName, jobId, avgTime);

      expect(eta.eta).toBeGreaterThanOrEqual(0);
      expect(eta.eta).toBeLessThanOrEqual(avgTime);

      let job = await JobManager.getJob(jobName, jobId);
      expect(job).toBeDefined();

      let state = await job?.getState();
      expect(state).toBe("active");

      const queueEvents = JobManager.getQueueEvent(jobName);
      expect(queueEvents).toBeDefined();
      if (queueEvents) {
        await job?.waitUntilFinished(queueEvents);
        const cachedValue = await Cache.get("test");
        expect(cachedValue).toBe("test");
      }
    });

    it("should should add multiple jobs with priorities to the queue", async () => {
      const jobData = [
        {
          name: jobName,
          data: {
            key: "test1",
            value: "test1",
          },
          opts: { jobId: "test1", priority: 1 },
        },
        {
          name: jobName,
          data: {
            key: "test2",
            value: "test2",
          },
          opts: { jobId: "test2", priority: 2 },
        },
        {
          name: jobName,
          data: {
            key: "test3",
            value: "test3",
          },
          opts: { jobId: "test3", priority: 3 },
        },
      ];
      await JobManager.addBulkJobs(jobName, jobData);

      const job1 = await JobManager.getJob(jobName, "test1");
      const job2 = await JobManager.getJob(jobName, "test2");
      const job3 = await JobManager.getJob(jobName, "test3");
      expect(job1).toBeDefined();
      expect(job2).toBeDefined();
      expect(job3).toBeDefined();

      const queueEvents = JobManager.getQueueEvent(jobName);
      expect(queueEvents).toBeDefined();
      if (queueEvents) {
        await job1?.waitUntilFinished(queueEvents);
        await job2?.waitUntilFinished(queueEvents);
        await job3?.waitUntilFinished(queueEvents);
        const cachedValue1 = await Cache.get("test1");
        const cachedValue2 = await Cache.get("test2");
        const cachedValue3 = await Cache.get("test3");
        expect(cachedValue1).toBe("test1");
        expect(cachedValue2).toBe("test2");
        expect(cachedValue3).toBe("test3");
      }
    });
  });
});
