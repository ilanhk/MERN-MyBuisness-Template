import { createClient } from 'redis';
import * as dotenv from 'dotenv';

dotenv.config();

const client = createClient({
  socket: {
    host: process.env.REDIS_HOST || 'redis',
    port: Number(process.env.REDIS_PORT) || 6379,
    timeout: 10000,
  },
  password: process.env.REDIS_PASSWORD, 
});

client.on('error', (err) => {
  console.error('Redis Client Error', err);
});

client.connect().then(() => {
  console.log('Connected to Redis');
});

export default client;