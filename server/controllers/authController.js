import userModel from "../models/usermodel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import transporter from "../config/nodemailer.js";


export const registerUSer = async (req, res) => {
    const {name,userId, email, password} = req.body;
    if(!name || !userId || !password || !email) {
        return res.json({success: false, message: 'Missing required fields'})
    }
    try{

        const existingUser = await userModel.findOne({email: email});
    
        if(existingUser){
            return res.json({success: false, message: 'User already exists'
            });
        }


        const hashedPassword = await bcrypt.hash(password, 10)

        const user = new userModel({name, userId, email, password: hashedPassword})

        await user.save();

        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: '10d'});

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        //sendin confrimation email

        const sendEmail = {
            from: process.env.SENDER_EMAIL,
            to: email,
            subject: "Confirmation",
            text: "Registration confirmed"
        }


        await transporter.sendMail(sendEmail);



        return res.json({success: true});




    }catch(error){
        return res.json({success: false, message: error.message})
    }
}

export const LoginUser = async (req, res) => {
    const {userId, email, password} = req.body;

    if(!email || !password || !userId){
        res.json({success: false, message: 'UserId, Email and Password are required'});
    }

    try{

        const user = await userModel.findOne({email: email, userId: userId});
        if(!user){
            return res.json({success: false, message: 'invalid email or userId'})
        }
    
        const isMatch = await bcrypt.compare(password,user.password);

        if(!isMatch){
            return res.json({success: false, message: 'invalid password'});
        }
        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: '10d'});

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });
    
        return res.json({success: true, message: 'Login successfull!!!'});

    }catch(error){
        
        res.json({success:false, message: error.message});
    }

} 

export const logoutUser = async (req, res) =>{

    try{

        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict'
        })

        return res.json({success: true,message: 'User logged out'});

    }catch(error){
        return res.json({success: true, message: error.message});
    }
}

export const sendVerfyOtp = async (req, res) => {
    
    
    try{

        //send verification otp to user email
        const {email} = req.body || {};

        const user = await userModel.findById(email);

        if(user.isAccountVerified){
            return res.json({success: false, message: "Account already verified"});
        }

        const otp = String(Math.floor((Math.random()*900000)+100000));
        

        user.verifyOtp = otp;

        user.verifyOtpExpireAt = Date.now()+ 24 * 60*60*1000;

        await user.save();

        const mailOption = {
            from: "priyasnhu.23bora@gmail.com",
            to:     user.email,
            subject: "Account Verification OTP",
            text: `Your OTP is ${otp}. Verify your account using this otp.`
        }

        await transporter.sendMail(mailOption);

        res.json({success: true, message: "Verification otp sent on email."})

    }catch(error){
        res.json({success: false, message: error.message});
    }
}

export const verifyEmail  = async (req, res) => {
    try{
        const {email, otp} = req.body;
        if(!email || !otp){
            res.json({success: false, message: "Missing required info"})
        }

        try{
            const user = await userModel.findById(email);
            if(!user){
                return res.json({success: false, message: "no user found"})
            }

            if(user.verifyOtp === '' || user.verifyOtp !== otp){
                return res.json({success: false, message: "Invalid otp"});
            }

            if(user.verifyOtpExpireAt < Date.now()){
                return res.json({success: false, message: "OTP expired"})
            }

            user.isAccountVerified = true;

            user.verifyOtp = '';
            user.verifyOtpExpireAt = 0;

            await user.save()

            return res.json({success: true, message: "Email verified successfully!!!"})
        }catch(error){
            res.json({success: false, message: error.message})
        }

    }catch(error){
        res.json({success: false, message: error.message})
    }
}

export const isAuthenticated = async(req, res) =>{
    //check if user is authenticatred

    try{
        return res.json({success: true});
    }catch(error){
        res.json({success: true, message: error.message})
    }


}


export const sendResetOtp = async(req,res) => {
    const {email} = req.body;
    if(!email){
        return res.json({success: false, message: 'Please enter email and try again!!!'});
    }
    try{

        const user = await userModel.findOne({email: email});
        if(!user){
            return res.json({success: false, message: "user not found!!!"})
        }

        const otp = String(Math.floor((Math.random()*900000)+100000));
        

        user.resetOtp = otp;

        user.resetOtpExpireAt = Date.now()+ 15 *60*1000;

        await user.save();

        const mailOption = {
            from: "priyasnhu.23bora@gmail.com",
            to:     user.email,
            subject: "Password reset OTP received",
            text: `Your OTP is ${otp}. Reset your password using this otp.`
        }

        await transporter.sendMail(mailOption);
        return res.json({success: true, message: "OTP sent to your email!!"})

    }catch(error){
        return res.json({success: false, message: error.message});
    }

}


export const resetPassword = async (req, res) => {
    const {email,otp, newPassword} = req.body;
    if(!otp || !email || !newPassword){
        return res.json({success: false, message: "Enter Email, OTP and New Password."});
    }
    try{
        const user = await userModel.findOne({email: email});
        if(!user){
            return res.json({success: false, message: "User not exist"});
        }
          if(user.resetOtp === '' || user.resetOtp !== otp){
        return res.json({success: false, message: "Invalid OTP"});
        }
        if(user.resetOtpExpireAt < Date.now()){
                return res.json({success: false, message: "OTP Expired, try again!!!"});
        }
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        user.resetOtp = "";
        user.resetOtpExpireAt = 0;

        await user.save();
        return res.json({success: true, message: "Password reset successfully!!!"})




    }catch(error){
        return res.json({success: false, message: error.message});
    }

}