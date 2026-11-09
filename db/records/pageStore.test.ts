import { afterAll } from "vite-plus/test";
import { convertV4MiniflareOptions, Miniflare } from "miniflare";
import { pageStoreContract } from "../../src/application/records/pageStore.contract";
import { r2PageStore } from "./pageStore";

// A local, in-memory R2 bucket. Each test gets an empty one.
const mf = new Miniflare(convertV4MiniflareOptions({ modules: true, script: "export default {}", r2Buckets: ["STORAGE"] }));
afterAll(() => mf.dispose());

pageStoreContract("R2 on Miniflare", async () => {
  const bucket = (await mf.getR2Bucket("STORAGE")) as unknown as R2Bucket;
  for (let listed = await bucket.list(); listed.objects.length > 0; listed = await bucket.list())
    await bucket.delete(listed.objects.map((o) => o.key));
  return r2PageStore(bucket);
});
