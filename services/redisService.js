import Redis from 'ioredis';
const redis = new Redis();

redis.on("connect", () => console.log("Connected to Redis"));
redis.on("error", (err) => console.error("Redis Error:", err));

export default { redis };
