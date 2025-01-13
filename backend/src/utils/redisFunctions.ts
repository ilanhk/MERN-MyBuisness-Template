import redisClient from '../redis';
import  { Model } from 'mongoose';


export const getRedisAll = async (redisName: string, db: Model<any>, redis_expiry: number)=>{
  let listOfSomething;
  const listOfSomething_from_redis_string = await redisClient.get(redisName);

  if(listOfSomething_from_redis_string){
    const listOfSomething_from_redis = JSON.parse(listOfSomething_from_redis_string)
    listOfSomething = listOfSomething_from_redis
    console.log('Cache Hit!!')
  } else{
    console.log('Cache miss!!')
    listOfSomething = await db.find({});
    await redisClient.set(redisName, JSON.stringify(listOfSomething), { EX: redis_expiry });
  };

  return listOfSomething;
};


export const getRedisWithId = async (redisName: string, id: string, db: Model<any>, redis_expiry: number)=>{
  let something;
  const something_from_redis_string = await redisClient.get(`${redisName}:${id}`);

  if(something_from_redis_string){
    const user_from_redis = JSON.parse(something_from_redis_string)
    something = user_from_redis
    console.log('Cache Hit!!')
  } else{
    console.log('Cache miss!!')
    something = await db.findById(id);
    await redisClient.set(`${redisName}:${id}`, JSON.stringify(something), { EX: redis_expiry });
  };

  return something;
};


export const getSafeUserRedisWithId = async (redisName: string, id: string, db: Model<any>, redis_expiry: number)=>{
  let something;
  const something_from_redis_string = await redisClient.get(`${redisName}:${id}`);
  console.log('checking redis name: ', `${redisName}:${id}`)

  if(something_from_redis_string){
    const user_from_redis = JSON.parse(something_from_redis_string)
    something = user_from_redis
    console.log('Cache Hit!!')
  } else{
    console.log('Cache miss!!')
    something = await db.findById(id).select(
      '-password'
    );
    await redisClient.set(`${redisName}:${id}`, JSON.stringify(something), { EX: redis_expiry });
  };

  return something;
};
