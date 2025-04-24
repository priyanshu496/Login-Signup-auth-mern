import express from 'express';
import { isAuthenticated, LoginUser, logoutUser, registerUSer, resetPassword, sendResetOtp, sendVerfyOtp, verifyEmail } from '../controllers/authController.js';
import userAuth from '../middleware/userAuth.js';

 const authRouter = express.Router();

authRouter.post('/register', registerUSer);
authRouter.post('/login', LoginUser);
authRouter.post('/logout', logoutUser);
authRouter.post('/send-verify-otp', userAuth, sendVerfyOtp);
authRouter.post('/verify-account', userAuth, verifyEmail);
authRouter.get('/is-auth', userAuth, isAuthenticated);
authRouter.post('/send-reset-otp', sendResetOtp);
authRouter.post('/reset-password', resetPassword);


export default authRouter;