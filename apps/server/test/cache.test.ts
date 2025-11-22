import Cache from "@/cache";

// Testing the cache utility functions
describe("Cache Utilities", () => {
  const inputKey = "test";
  const inputValueText = "test";
  const inputValueObj = { name: "test" };
  const inputValueNum = 1;
  const TTL = 5000;

  afterAll(async () => {
    await Cache.flush();
    await Cache.disconnect();
  });

  it("should set key and string value", async () => {
    await Cache.set(inputKey, inputValueText, TTL);
    const value = await Cache.get(inputKey);
    expect(value).toBe(inputValueText);
  });

  it("should delete the string value", async () => {
    await Cache.del(inputKey);
    const value = await Cache.get(inputKey);
    expect(value).toBeNull();
  });

  it("should set key and object value", async () => {
    await Cache.set(inputKey, inputValueObj, TTL);
    const value = await Cache.get(inputKey);
    expect(value).toEqual(inputValueObj);
  });

  it("should delete the object value", async () => {
    await Cache.del(inputKey);
    const value = await Cache.get(inputKey);
    expect(value).toBeNull();
  });

  it("should set key and number value", async () => {
    await Cache.set(inputKey, inputValueNum, TTL);
    const value = await Cache.get(inputKey);
    expect(value).toBe(inputValueNum);
  });

  it("should increment the value", async () => {
    const incr = 10;
    await Cache.increment(inputKey, incr);
    const value = await Cache.get(inputKey);
    expect(value).toBe(inputValueNum + incr);
  });

  it("should decrement the value", async () => {
    const decr = 10;
    await Cache.decrement(inputKey, decr);
    const value = await Cache.get(inputKey);
    expect(value).toBe(inputValueNum);
  });

  it("should delete the number value", async () => {
    await Cache.del(inputKey);
    const value = await Cache.get(inputKey);
    expect(value).toBeNull();
  });
});
