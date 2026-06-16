import RedisMock from "ioredis-mock"
import type { ConnectionOptions } from "bullmq"

const globalForRedis = globalThis as unknown as { redis: ReturnType<typeof createRedis> | undefined }

function createRedis() {
  return new RedisMock({
    data: {},
    lazyConnect: true,
  })
}

const _redis = globalForRedis.redis ?? createRedis() as InstanceType<typeof RedisMock>
if (process.env.NODE_ENV !== "production") globalForRedis.redis = _redis as ReturnType<typeof createRedis>

export const redis = _redis as ConnectionOptions

export async function ensureConnected() {
  const r = redis as unknown as InstanceType<typeof RedisMock>
  if (r.status === "end" || r.status === "close") {
    await r.connect()
  }
}
