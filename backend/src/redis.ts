import { createClient } from 'redis';
import * as dotenv from 'dotenv';

dotenv.config();


const client = createClient({
  password: process.env.REDIS_PASSWORD,
  socket: {
      host: 'redis-14403.c92.us-east-1-3.ec2.redns.redis-cloud.com',
      port: 14403,
      timeout: 10000, // 10 seconds
  }
});

client.on('error', (err) => {
  console.error('Redis Client Error', err);
});

client.connect().then(() => {
  console.log('Connected to Redis');
});

export default client;




// await client.set('foo', 'bar');
// const result = await client.get('foo');
// console.log(result)  // >>> bar