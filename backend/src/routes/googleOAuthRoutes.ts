import express from 'express';
const router = express.Router();
// import passport from '../utils/googleStrategy';
import {
  googleAuthenticate
} from '../controllers/googleOauthController';


// Google OAuth Callback
// router.get(
//   '/callback',
//   passport.authenticate('google', { session: false }), // Using Passport strategy to validate the idToken
//   googleAuthenticate
// );

router.post('/authenticate', googleAuthenticate);


export default router;