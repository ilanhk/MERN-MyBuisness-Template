import { Request, Response, NextFunction  } from 'express';
import { IUser} from '../models/userModel';
import verifyAccessOrRefreshToken from '../utils/verifyAccessOrRefreshToken';

declare module 'express' {
    interface Request {
      user?: IUser
    }
};

//Protect routes for registered users
const protect = async (req: Request, res: Response, next: NextFunction) => {
    const accessTokenName = process.env.ACCESS_TOKEN_NAME!;
    const accessToken = req.cookies[accessTokenName];
    const jwtSecretAccess = process.env.JWT_SECRET_ACCESS!;
  
    // console.log('Access token from cookie:', accessToken); 
  
    if (!accessToken) {
      return res.status(401).json({ message: 'Access token missing' });
    }
  
    verifyAccessOrRefreshToken(req, res, next, accessToken, jwtSecretAccess);
    console.log('access token from cookie 2', accessToken);
  };
  


//for refresh access for registered users - so they will stay login for many days
const refresh = async (req: Request, res: Response, next: NextFunction) => {

    const refreshTokenName = process.env.REFRESH_TOKEN_NAME!

    //Read the JWT from the cookie
    const refreshToken = req.cookies[refreshTokenName];
    const jwtSecretRefresh = process.env.JWT_SECRET_REFRESH!

    // console.log('refreshToken backend', refreshToken)

    verifyAccessOrRefreshToken(req, res, next, refreshToken, jwtSecretRefresh);
   
};


const employee = (req: Request, res: Response, next: NextFunction) => {
    if(req.user && req.user.isEmployee) {
       return next();
    } else {
        return res.status(401).json({ message: 'Not authorized as employee'});
    };
};

const admin = (req: Request, res: Response, next: NextFunction) => {
    if(req.user && req.user.isAdmin) {
        return next();
    } else {
        return res.status(401).json({ message: 'Not authorized as admin'});
    };
};

const superAdmin = (req: Request, res: Response, next: NextFunction) => {
    if(req.user && req.user.isSuperAdmin) {
        return next();
    } else {
        return res.status(401).json({ message: 'Not authorized as super admin'});
    };
};


export{
    protect,
    refresh,
    employee,
    admin,
    superAdmin
};