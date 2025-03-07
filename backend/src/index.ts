import express from 'express';
import session from 'express-session';
import cors from 'cors';
import connectDB from './config/db';
import * as dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import passport from './utils/googleStrategy';
import userRoutes from './routes/userRoutes';
import twoFaRoutes from './routes/2faRoutes';
import googleOAuthRoutes from './routes/googleOAuthRoutes';
import productRoutes from './routes/productRoutes';
import uploadRoutes from './routes/uploadRoutes';
import jobRoutes from './routes/jobRoutes';
import analyticsRoutes from './routes/analyticsRoutes';
import comapanyInfoRoutes from './routes/companyInfoRoutes';
import serviceRoutes from './routes/serviceRoutes';


dotenv.config();

connectDB(); //to connect to MongoDB

const app = express();
const port = process.env.PORT

app.use(express.json())
app.use(express.urlencoded({ extended: true })); //for form data

app.use(
  session({
    secret: process.env.SESSION_SECRET!,
    resave: false,
    saveUninitialized: true,
  })
);

//Cookie parser middleware
app.use(cookieParser()); //can save in express session also 


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

//Cors
app.use(cors({
  origin: 'http://localhost:5173', // Allow frontend
  credentials: true, // Allow cookies/sessions
  methods: ['GET', 'POST'], // Allow the necessary HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
//allow domains from the frontend

//User routes
app.use('/api/users', userRoutes);

//2Fa routes
app.use('/api/2fa', twoFaRoutes);

//Google OAuth routes
app.use('/api/google', googleOAuthRoutes);

// product routes
app.use('/api/products', productRoutes);

//upload routes
app.use('/api/upload', uploadRoutes);

//job routes
app.use('/api/jobs', jobRoutes);

//applicants routes ??

//companyInfo routes
app.use('/api/companyInfo', comapanyInfoRoutes);

//services routes
app.use('/api/services', serviceRoutes);


//employee tasks routes

//Analytics routes
app.use('/api/analytics', analyticsRoutes);


//log for user actions


//For Google OAuth
app.use(passport.initialize());
app.use(passport.session());
