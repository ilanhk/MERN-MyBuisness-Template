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

    const accessTokenName = process.env.ACCESS_TOKEN_NAME!

    //Read the JWT from the cookie
    const accessToken = req.cookies[accessTokenName];
    const jwtSecretAccess = process.env.JWT_SECRET_ACCESS!

    verifyAccessOrRefreshToken(req, res, next, accessToken, jwtSecretAccess);
};


//for refresh access for registered users - so they will stay login for many days
const refresh = async (req: Request, res: Response, next: NextFunction) => {

    const refreshTokenName = process.env.REFRESH_TOKEN_NAME!

    //Read the JWT from the cookie
    const refreshToken = req.cookies[refreshTokenName];
    const jwtSecretRefresh = process.env.JWT_SECRET_REFRESH!

    console.log('refreshToken backend', refreshToken)

    verifyAccessOrRefreshToken(req, res, next, refreshToken, jwtSecretRefresh);
   
};


const employee = (req: Request, res: Response, next: NextFunction) => {
    if(req.user && req.user.isEmployee) {
        next();
    } else {
        res.status(401);
        throw new Error('Not authorized as admin');
    };
};

const admin = (req: Request, res: Response, next: NextFunction) => {
    if(req.user && req.user.isAdmin) {
        next();
    } else {
        res.status(401);
        throw new Error('Not authorized as admin');
    };
};

const superAdmin = (req: Request, res: Response, next: NextFunction) => {
    if(req.user && req.user.isSuperAdmin) {
        next();
    } else {
        res.status(401);
        throw new Error('Not authorized as admin');
    };
};


export{
    protect,
    refresh,
    employee,
    admin,
    superAdmin
};