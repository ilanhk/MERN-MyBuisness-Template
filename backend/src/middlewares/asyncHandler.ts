import { Request, Response, NextFunction, RequestHandler  } from 'express';

// middleware to remove try and catch fron async functions to make code smoother
const asyncHandler = (fn: RequestHandler ) => (req: Request, res: Response, next: NextFunction) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
// a function that takes in request, response and next. It will resolve a promise. If it resolves it will call next which then calls the next piece of middleware

export default asyncHandler;
//express has its own asyncHandler but its easy to make our own
// use this function on async await functions