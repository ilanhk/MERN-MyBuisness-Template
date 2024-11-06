import { Request, Response, NextFunction  } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import User, { IUser} from '../models/userModel';

declare module 'express' {
    interface Request {
      user?: IUser
    }
};

const verifyAccessOrRefreshToken = async (req: Request, res: Response, next: NextFunction, token: string, secret: string)=>{
  if(token){
    try {
        const decoded_token = jwt.verify(token, secret) as JwtPayload;
        console.log('decoded token: ', decoded_token)
        req.user = await User.findById(decoded_token.userId).select('-password'); 
        // .select('-password') to get the obj without the password attribute
        // req.user - gets user for all our routes

        //make new refesh and access
        // edit user with new refresh and access

        next(); // for next middleware or to continue
    } catch (error) {
        console.log(error);
        res.sendStatus(401);
    };

  } else {
      res.sendStatus(401);
  };
};

export default verifyAccessOrRefreshToken;