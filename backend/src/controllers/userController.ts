import { Request, Response } from 'express';
import { verifyToken } from '../utils/GoogleAuthenticatorUtils';
const nodemailer = require('nodemailer');
const crypto = require('crypto');
import User, { IUser } from '../models/userModel';
import { getTokens } from '../utils/jwtFunctions';
import { verifyPassword } from '../utils/constants';
import redisClient from '../redis';
import { getRedisWithId, getRedisAll, getSafeUserRedisWithId } from '../utils/redisFunctions';

const redis_expiry = 86400 //24hours in seconds

declare module 'express' {
  interface Request {
    user?: IUser;
  }
};

// @desc Authenticate/login user & get token
// @route POST /api/users/login
// @access Public
const loginUser = async (req: Request, res: Response) => {
  const { email, password, twoFaCode } = req.body;

  const user = await User.findOne({ email }); // Find the user in the DB

  if (user && (await user.matchPassword(password))) {
    // Check if 2FA is enabled
    if (user.twoFaSecret) {
      // Ensure twoFaToken is provided
      if (!twoFaCode) {
        return res.status(400).json({ success: false, message: '2FA code required' });
      };

      // Verify the 2FA token
      const isVerified = verifyToken(twoFaCode, user.twoFaSecret);
      if (!isVerified) {
        return res.status(400).json({ message: 'Invalid 2FA' });
      };
    };

    const userId = user._id + '';
    const { accessToken, refreshToken } = getTokens(res, userId);

    user.refreshToken = refreshToken;
    await user.save();

    await redisClient.set(`user:${userId}`, JSON.stringify(user), { EX: redis_expiry }); 

    res.status(200).json({
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
  } else {
    return res.status(401).json({ message:'Invalid Email or Password' });
  }
};

// @desc Refresh users
// @route GET /api/users
// @access Private/Admin
const refreshUser = (req: Request, res: Response) => {
  const user = req.user;
  if (user) {

    const userId = user._id + '';
    const { accessToken, refreshToken } = getTokens(res, userId);
    res.status(200).json({
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
  } else{
    res.status(401).json({ message: 'No user, Not authorized'});
  }
};

// @desc Register user
// @route POST /api/users
// @access Public
const registerUser = async (req: Request, res: Response) => {
  const { firstName, lastName, email, password, isEmployee, inEmailList } =
    req.body;

  if (!firstName && !lastName) {
    return res.status(400).json({ message: 'Please add first and last names' }); //400 is client error, they did something wrong
  }

  const isPasswordVerified = verifyPassword(password);
  if (!isPasswordVerified) {
    return res.status(400).json({
      message: `
            The Password does not match these requirements:
                
            1. It exists (not empty or undefined)
            2. It has a length of at least 12 characters
            3. It contains at least one uppercase letter
            4. It contains at least one lowercase letter
            5. It contains at least one number (0-9)
            6. It contains at least one special character
        `,
    });
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(400).json({ message: 'User already exists' });
  }

  const fullName = `${firstName} ${lastName}`;

  const user = await User.create({
    firstName,
    lastName,
    fullName,
    email,
    password,
    isEmployee,
    inEmailList,
  });

  if (user) {
    const userId = user._id + '';
    const { accessToken, refreshToken } = getTokens(res, userId);

    user.refreshToken = refreshToken;
    await user.save();

    await redisClient.set(`user:${userId}`, JSON.stringify(user), { EX: redis_expiry });
    await redisClient.del('users');

    return res.status(201).json({
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
  } else {
    return res.status(400).json({ message: 'Invalid user data' });
  }
};

// @desc Logout User / clear cookie - bc we will be storing the token in a cookie on a server, not about clearing localStorage in the frontend
// @route POST /api/users/logout
// @access Private
const logoutUser = async (req: Request, res: Response) => {
  const userId = req.user?._id

  // Optionally blacklist the refresh token
  if (userId) {
    const keysToDelete: string[] = [`user:${userId}`, `userSafe:${userId}`, 'users'];
    await redisClient.del(keysToDelete); 
  }

  res.clearCookie(process.env.ACCESS_TOKEN_NAME!);
  res.clearCookie(process.env.REFRESH_TOKEN_NAME!);
  req.user = undefined;
  console.log('logging out!!')
  //to clear the cookie

  return res.status(200).json({ message: 'Logged out successfully' });
};



// @desc Get User Profile
// @route GET /api/users/profile
// @access Private
const getUserProfile = async (req: Request, res: Response) => {
  const userId = req.user?._id + '';
  const user = await getRedisWithId('user', userId, User, redis_expiry)

  
  if (user) {
    res.status(200).json({
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      fullName: user.fullName,
      email: user.email,
      isEmployee: user.isEmployee,
      inEmailList: user.inEmailList,
      twoFaSecret: user.twoFaSecret,
    });
  } else {
    return res.status(404).json({ message: 'User not found' });
  }
};

// @desc Update User Profile
// @route PUT /api/users/profile
// @access Private
const updateUserProfile = async (req: Request, res: Response) => {
  const userId = req.user?._id + '';
  const user = await User.findById(userId);

  if (user) {
    user.firstName = req.body.firstName || user.firstName; //either new name or same as in the db
    user.lastName = req.body.lastName || user.lastName;
    user.fullName = req.body.fullName || user.fullName;
    user.email = req.body.email || user.email;
    user.inEmailList = req.body.inEmailList || user.inEmailList;
  

    if (req.body.password) {
      user.password = req.body.password;
    }
    //bc password is hashed we only want to change it if its being updated.

    if ('twoFaSecret' in req.body) {
      user.twoFaSecret = req.body.twoFaSecret;
    }
    //change secret if need to change
    //this will allow a null value in req.body.twoFaSecret

    const updatedUser = await user.save();

    await redisClient.set(`user:${req.user?._id}`, JSON.stringify(updatedUser), { EX: redis_expiry });
    await redisClient.del('users');

    return res.status(200).json({
      _id: updatedUser._id,
      firstName: updatedUser.firstName,
      lastName: updatedUser.lastName,
      fullName: updatedUser.fullName,
      email: updatedUser.email,
      inEmailList: updatedUser.inEmailList,
      twoFaSecret: updatedUser.twoFaSecret,
    });
  } else {
    return res.status(404).json({ message: 'User not found' });
  }
};

// @desc Create new user (without login)
// @route POST /api/users/create
// @access Public
const createNewUser = async (req: Request, res: Response) => {
  const { firstName, lastName, email, password, isEmployee, inEmailList } =
    req.body;

  if (!firstName && !lastName) {
    return res.status(400).json({ message: 'Please add first and last names' }); //400 is client error, they did something wrong
  }

  const isPasswordVerified = verifyPassword(password);
  if (!isPasswordVerified) {
    return res.status(400).json({
      message: `
            The Password does not match these requirements:
                
            1. It exists (not empty or undefined)
            2. It has a length of at least 12 characters
            3. It contains at least one uppercase letter
            4. It contains at least one lowercase letter
            5. It contains at least one number (0-9)
            6. It contains at least one special character
        `,
    });
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(400).json({ message: 'User already exists' });
  }

  const fullName = `${firstName} ${lastName}`;

  const user = await User.create({
    firstName,
    lastName,
    fullName,
    email,
    password,
    isEmployee,
    inEmailList,
  });

  if (user) {
    const userId = user._id + '';
    await user.save();

    await redisClient.set(`user:${userId}`, JSON.stringify(user), { EX: redis_expiry });
    await redisClient.del('users');

    return res.status(201).json({
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      fullName: user.fullName,
      email: user.email,
      isEmployee: user.isEmployee,
      isAdmin: user.isAdmin,
      isSuperAdmin: user.isSuperAdmin,
      inEmailList: user.inEmailList,
    });
  } else {
    return res.status(400).json({ message: 'Invalid user data' });
  }
};

// @desc Get users
// @route GET /api/users
// @access Private/Admin
const getUsers = async (req: Request, res: Response) => {
  const users = await getRedisAll('users', User, redis_expiry)
  
  return res.status(200).json(users);
};



// @desc Get user by id
// @route GET /api/users/:id
// @access Private/Admin
const getUserById = async (req: Request, res: Response) => {
  const userId = req.params.id;
  const user = await getSafeUserRedisWithId('userSafe', userId, User, redis_expiry)

  if (user) {
    return res.status(200).json(user);
  } else {
    return res.status(404).json({ message: 'User not found' });
  }
};

// @desc Update user
// @route PUT /api/users/:id
// @access Private/Admin
const updateUser = async (req: Request, res: Response) => {
  const userId = req.params.id;
  const user = await User.findById(userId);

  if (user) {
    user.firstName = req.body.firstName || user.firstName;
    user.lastName = req.body.lastName || user.lastName;
    user.fullName = req.body.fullName || user.fullName;
    user.email = req.body.email || user.email;
    user.isEmployee = Boolean(req.body.isEmployee);
    user.isAdmin = Boolean(req.body.isAdmin);
    user.isSuperAdmin = Boolean(req.body.isSuperAdmin);
    user.inEmailList = Boolean(req.body.inEmailList);

    if (req.body.twoFaSecret) {
      user.twoFaSecret = req.body.twoFaSecret || user.twoFaSecret;
    }

    const updatedUser = await user.save();
    await redisClient.set(`user:${userId}`, JSON.stringify(updatedUser), { EX: redis_expiry });
    await redisClient.del('users');

    return res.status(200).json({
      _id: updatedUser._id,
      firstName: updatedUser.firstName,
      lastName: updatedUser.lastName,
      fullName: updatedUser.fullName,
      email: updatedUser.email,
      isEmployee: updatedUser.isEmployee,
      isAdmin: updatedUser.isAdmin,
      isSuperAdmin: updatedUser.isSuperAdmin,
      inEmailList: updatedUser.inEmailList,
    });
  } else {
    return res.status(404).json({ message: 'User not found' });
  }
};

// @desc Send email to user if they forget password
// @route POST /api/users/forgot-password
// @access Private
const forgotPassword = async (req: Request, res: Response) => {
  const { email } = req.body;

  try {
    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    // Generate and hash a reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');
    user.resetPasswordExpires = Date.now() + 3600000; // Token expires in 1 hour
    await user.save();

    // Construct the reset URL
    const resetUrl = `${process.env.BASE_URL}/reset-password/${resetToken}`;

    // Set up nodemailer transporter securely
    const transporter = nodemailer.createTransport({
      host: 'smtp.office365.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.OUTLOOK_EMAIL,
        pass: process.env.OUTLOOK_PASSWORD,
      },
      tls: {
        rejectUnauthorized: true,
      },
    });

    // Define the email options
    const mailOptions = {
      to: user.email,
      from: process.env.OUTLOOK_EMAIL, // Using the verified sender address
      subject: 'Password Reset Request',
      text: `You are receiving this email because a password reset request was made for your account.\n\n
             Please click on the following link, or paste it into your browser to complete the reset process:\n\n
             ${resetUrl}\n\n
             If you did not request this, you can ignore this email and your password will remain unchanged.`,
    };

    // Send the email and respond with success
    await transporter.sendMail(mailOptions);
    return res.status(200).json({ message: 'Password reset link sent to your email address' });
  } catch (error) {
    console.error("Error in forgotPassword controller:", error);
    return res.status(500).json({ message: 'Error sending reset email' });
  }
};

// @desc reset password
// @route PUT /api/users/reset-password
// @access Private
const resetPassword = async (req: Request, res: Response) => {
  const { resetToken } = req.params;
  const { newPassword } = req.body;
  try {
    const hashedToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');

    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() }, // Only find if token hasn't expired
    });

    if (user) {
      user.password = newPassword;
      await user.save();

      return res.send('Password has been reset successfully.');
    }
  } catch (err) {
    return res.status(400).send('Invalid or expired token');
  }
};

// @desc Delete user
// @route DELETE /api/users/:id
// @access Private/Admin
const deleteUser = async (req: Request, res: Response) => {
  const user = await User.findById(req.params.id);


  if (user) {
    if (user.isSuperAdmin) {
      return res.status(400).json({ message: 'Cannot delete admin user' });
    }
    
    const keysToDelete: string[] = [`user:${user._id}`, `userSafe:${user._id}`, 'users'];
    await redisClient.del(keysToDelete);

    await user.deleteOne({ _id: user._id });
    
    return res.status(200).json({ message: 'User deleted successfuly' });
  } else {
    return res.status(400).json({ message: 'User not found' });
  }
};

export {
  loginUser,
  registerUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  createNewUser,
  getUsers,
  getUserById,
  updateUser,
  forgotPassword,
  resetPassword,
  deleteUser,
  refreshUser,
};
