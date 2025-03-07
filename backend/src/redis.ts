import { createClient } from 'redis';
import * as dotenv from 'dotenv';

dotenv.config();


const client = createClient({
  socket: {
    host: process.env.REDIS_HOST || 'localhost',
    port: Number(process.env.REDIS_PORT) || 6379,
    timeout: 10000,
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