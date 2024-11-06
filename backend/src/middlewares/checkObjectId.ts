import { Request, Response, NextFunction } from 'express';
import { isValidObjectId } from 'mongoose';

function checkObjectId(req: Request, res: Response, next: NextFunction) {
  if (!isValidObjectId(req.params.id)) {
    res.status(404);
    throw new Error(`Invalid ObjectId of:  ${req.params.id}`);
  }
  next();
}

export default checkObjectId;
//to check if its an objectId