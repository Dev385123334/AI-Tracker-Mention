import { Redis } from "ioredis"
import RedisMock from "ioredis-mock"
import type { ConnectionOptions } from "bullmq"

type RedisInstance = Redis | InstanceType<typeof RedisMock>

const globalForRedis = globalThis as unknown as { redis: RedisInstance | undefined }

function createRedis(): RedisInstance {
  const url = process.env.REDIS_URL
  if (url) {
    return new Redis(url, {
      lazyConnect: true,
      maxRetriesPerRequest: null,
    })
  }
  return new RedisMock({
    data: {},
    lazyConnect: true,
  })
}

const _redis = globalForRedis.redis ?? createRedis()
if (process.env.NODE_ENV !== "production") globalForRedis.redis = _redis

export const redis = _redis as ConnectionOptions

export async function ensureConnected() {
  const r = _redis
  if (r.status === "end" || r.status === "close") {
    await r.connect()
  }
}
