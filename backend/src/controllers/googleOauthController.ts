// import { Request, Response } from 'express';
// import User, { IUser } from '../models/userModel';
// import { getTokens } from '../utils/jwtFunctions';
// import redisClient from '../redis';
// import { getRedisWithId, getRedisAll, getSafeUserRedisWithId } from '../utils/redisFunctions';

// declare module 'express' {
//   interface Request {
//     user?: IUser;
//   }
// };

// const redis_expiry = 86400 //24hours in seconds

// // @desc to either login or register a user with google OAuth
// // @route GET /api/google-authenticate
// // @access Public
// const googleAuthenticate = async (req: Request, res: Response) => {
//   try {
//     if (!req.user) {
//       return res.status(401).json({ message: 'Unauthorized' });
//     }

//     const { email, firstName, lastName } = req.user as IUser;
    
//     // Check if user exists
//     let user = await User.findOne({ email });

//     // If user does not exist, create a new one
//     if (!user) {
//       user = new User({
//         firstName,
//         lastName,
//         fullName: `${firstName} ${lastName}`,
//         email,
//         password: '', // Google users won't have a password
//         isEmployee: false,
//         inEmailList: true,
//       });

//       await user.save();
//     }

//     if (user) {
//       const userId = user._id + '';
//       const { accessToken, refreshToken } = getTokens(res, userId);
  
//       user.refreshToken = refreshToken;
//       await user.save();
  
//       await redisClient.set(`user:${userId}`, JSON.stringify(user), { EX: redis_expiry });
  
//       return res.status(201).json({
//         _id: user._id,
//         firstName: user.firstName,
//         lastName: user.lastName,
//         fullName: user.fullName,
//         email: user.email,
//         isEmployee: user.isEmployee,
//         isAdmin: user.isAdmin,
//         isSuperAdmin: user.isSuperAdmin,
//         inEmailList: user.inEmailList,
//         accessToken,
//         refreshToken,
//       });
//     } else {
//       return res.status(400).json({ message: 'Invalid user data' });
//     }
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Internal Server Error' });
//   }
// };

// export { googleAuthenticate };

import { Request, Response } from 'express';
import { OAuth2Client } from 'google-auth-library';
import User, { IUser } from '../models/userModel';
import { getTokens } from '../utils/jwtFunctions';
import redisClient from '../redis';


declare module 'express' {
  interface Request {
    user?: IUser;
  }
};

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const redis_expiry = 86400; // 24 hours

// @desc Authenticate user with Google OAuth
// @route POST /api/google-authenticate
// @access Public
const googleAuthenticate = async (req: Request, res: Response) => {
  try {
    const { credential } = req.body; // Frontend should send { credential }
    if (!credential) {
      return res.status(400).json({ message: 'No credential provided' });
    }

    // Verify Google token
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload || !payload.email) {
      return res.status(401).json({ message: 'Invalid Google token' });
    }

    const { email, given_name: firstName, family_name: lastName } = payload;

    // Check if user exists in the database
    let user = await User.findOne({ email });

    // If user doesn't exist, create a new one
    if (!user) {
      user = new User({
        firstName,
        lastName,
        fullName: `${firstName} ${lastName}`,
        email,
        password: '', // Google users won't have a password
        isEmployee: false,
        inEmailList: true,
      });

      await user.save();
    }

    // Generate access & refresh tokens
    const userId = user._id.toString();
    const { accessToken, refreshToken } = getTokens(res, userId);

    user.refreshToken = refreshToken;
    await user.save();

    // Store user data in Redis
    await redisClient.set(`user:${userId}`, JSON.stringify(user), { EX: redis_expiry });

    // Send response
    return res.status(200).json({
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      fullName: user.fullName,
      email: user.email,
      isEmployee: user.isEmployee,
      isAdmin: user.isAdmin,
      isSuperAdmin: user.isSuperAdmin,
      inEmailList: user.inEmailList,
      accessToken,
      refreshToken,
    });
  } catch (error) {
    console.error('Google authentication error:', error);
    return res.status(500).json({ message: 'Failed to authenticate' });
  }
};

export { googleAuthenticate };

