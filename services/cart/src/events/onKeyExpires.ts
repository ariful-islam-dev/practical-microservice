import { REDIS_HOST, REDIS_PORT } from "@/config";
import { clearCart } from "@/services";
import { Redis } from "ioredis";

const redis = new Redis({
  host: REDIS_HOST,
  port: REDIS_PORT,
});

const CHANNEL_KEY = "_keyevent@0__:expired";
redis.config("SET", "notify-keyspace-events", "Ex");
redis.subscribe(CHANNEL_KEY);

redis.on("message", async (channel, message) => {
  if (channel === CHANNEL_KEY) {
    console.log("key expired", message);

    const cartKey = message.split(":").pop();
    if (!cartKey) return;
    clearCart(cartKey);
  }
});

export default redis;
