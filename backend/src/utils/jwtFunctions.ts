import { Request, Response } from 'express';
import jwt from "jsonwebtoken";

//storing token in Most Safest - indexedDB > Cookie > Local storage - Least Safest

//expiryTime in seconds
export const generateToken = (res: Response, userId: string, expiryTime: number, tokenName: string, secret: string) => {
    const jwtSecret = process.env[secret] || secret;
    const jwtTokenName = process.env[tokenName] || tokenName;

    if (!jwtSecret) {
        throw new Error('JWT_SECRET is not defined in the environment variables');
    }

    const expiresIn = Math.floor(Date.now()/1000) * expiryTime

    const token = jwt.sign({ userId }, jwtSecret, {
        expiresIn
    });

    // Set JWT as HTTP-Only cookie (optional)
    res.cookie(jwtTokenName, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'development',
        sameSite: 'strict',
        maxAge: expiryTime * 1000, // 30 days in milliseconds
    });

    return token;
};
//this is access token - access data on same session
//good to make a refresh token for long periods if program stops the user will be login when access the site again (store in db)

export const getTokens = (res: Response, userId: string) =>{
    const accessToken = generateToken(res, userId, (15 * 60), 'ACCESS_TOKEN_NAME', 'JWT_SECRET_ACCESS'); //(15 * 60) 15min
    const refreshToken = generateToken(res, userId, (3* 24 * 60 * 60), 'REFRESH_TOKEN_NAME', 'JWT_SECRET_REFRESH'); //(3* 24 * 60 * 60) 3 days

    return {
     accessToken,
     refreshToken   
    };
};