import redis from "redis";
const client = redis.createClient(+process.env.REDIS_PORT, process.env.REDIS_HOST);

export default client;