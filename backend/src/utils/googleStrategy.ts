import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../models/userModel';
import dotenv from "dotenv";
dotenv.config();

console.log('back googleclient id: ', process.env.GOOGLE_CLIENT_ID)

// Configure Google Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: '/api/google/callback',
      scope: ['email', 'profile']  // Requesting profile and email data
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Extract user details from Google profile
        const email = profile.emails?.[0]?.value;
        const firstName = profile.name?.givenName || 'Unknown';
        const lastName = profile.name?.familyName || 'Unknown';

        if (!email) {
          return done(new Error('Email is missing from Google profile'), false);
        }

        // Look for existing user
        let user = await User.findOne({ email });

        // Create user if not found
        if (!user) {
          user = new User({
            firstName,
            lastName,
            fullName: profile.displayName || `${firstName} ${lastName}`,
            email,
            password: null, // No password needed for Google-auth users
            isEmployee: false,
            inEmailList: false,
            twoFaSecret: null,
            googleId: profile.id, // Store Google ID for easier future lookup
          });

          await user.save();
        }

        // Pass user to Passport
        return done(null, user);
      } catch (error) {
        console.error('Error in Google OAuth strategy:', error);
        return done(error, false);
      }
    }
  )
);

// Serialize user to session
passport.serializeUser((user: any, done) => {
  done(null, user.id); // Store only the user ID in session
});

// Deserialize user from session
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    if (!user) {
      throw new Error(`User with ID ${id} not found`);
    }
    done(null, user); // Attach the user object to the request
  } catch (error) {
    console.error('Error in deserializing user:', error);
    done(error, null); // Return error if user not found
  }
});

export default passport;

