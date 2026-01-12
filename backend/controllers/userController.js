const UserModel = require('../models/userModel');
const bcrypt = require('bcryptjs');
const verifyMail = require('../emailVerify/verifyMail');
// const { sign, verify } = require('jsonwebtoken');
const jwt = require('jsonwebtoken');
const SessionModel = require('../models/sessionModel');
const sendOtpMail = require('../emailVerify/sendOtpMail');


// creating a new user
const registerUser = async(req, res) => {
    try{
        const {username, email, password} = req.body;

        if(!username || !email || !password){
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            })
        }

        const existingUsername = await UserModel.findOne( {username} );
        const existingEmail = await UserModel.findOne( {email} );

        if(existingUsername && existingEmail){
            return res.status(400).json({
                success: false,
                message: "username & email already exists"
            })
        }
        if(existingUsername){
            return res.status(400).json({
                success: false,
                message: "username already exists"
            })
        }
        if(existingEmail){
            return res.status(400).json({
                success: false,
                message: "email already exists"
            })
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new UserModel({ 
            username,
            email,
            password: hashedPassword
        });
        await newUser.save();

        const token = jwt.sign({id: newUser._id}, process.env.SECRET_KEY, {expiresIn:"10m"});
        verifyMail(token, email);
        newUser.token = token;

        await newUser.save();

        // status will be 201 whenever something is created
        return res.status(201).json({
            success:true,
            message: "User registered successfully",
            data: newUser
        })
    }
    catch(err){
        res.status(500).json({
            success: false,
            message: err.message
        })
    }
}


// verifying a user
const verification = async(req, res) => {
    try{
        const authHeader = req.headers.authorization;
        if(!authHeader || !authHeader.startsWith("Bearer ")){
            return res.status(401).json({
                success: false,
                message: "Authorization token is missing or invalid"
            })
        }

        const token = authHeader.split(" ")[1];

        let decoded;
        try{
            decoded = jwt.verify(token, process.env.SECRET_KEY);
        }
        catch(err){
            if(err.name === "TokenExpiredError"){
                return res.status(400).json({
                    success: false,
                    message: "The registration token has expired"
                })
            }
            return res.status(400).json({
                success: false,
                message: "Token verification failed"
            })
        }

        const user = await UserModel.findById(decoded.id)
        if(!user){
            return res.status(404).json({
                success: false,
                message: "User not found"
            })
        }

        user.token = null;
        user.isVerified = true;
        await user.save();

        return res.status(200).json({
            success: true,
            message: "Email Verified successfully"
        })
    }
    catch(err){
        res.status(500).json({
            success: false,
            message: err.message
        })
    }
}


// login
const loginUser = async(req, res) => {
    try{
        const {email, password} = req.body;
        if(!email || !password){
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            })
        }

        const user = await UserModel.findOne({email});
        if(!user){
            return res.status(401).json({
                success: false,
                message: "Unauthorized access"
            })
        }
        const passwordCheck = await bcrypt.compare(password, user.password);
        if(!passwordCheck){
            return res.status(402).json({
                success: false,
                message: "Incorrect password"
            })
        }

        // check if user is verified
        if(user.isVerified !== true){
            return res.status(403).json({
                success: false,
                message: "Verify your account then login"
            })
        }

        // check for existing session and delete it
        const existingSession = await SessionModel.findOne({userId: user._id});
        if(existingSession){
            await SessionModel.deleteOne({userId: user._id});
        }

        // create a new session
        await SessionModel.create({userId: user._id});

        // generate tokens
        const accessToken = jwt.sign({userId: user._id}, process.env.SECRET_KEY, {expiresIn: "10m"});

        const refreshToken = jwt.sign({userId: user._id}, process.env.SECRET_KEY, {expiresIn: "30d"});

        user.isLoggedIn = true;
        await user.save();

        return res.status(200).json({
            success: true,
            message: `Welcome back! ${user.username}`,
            accessToken,
            refreshToken,
            user
        })

    }
    catch(err){
        res.status(500).json({
            success: false,
            message: err.message
        })
    }
}


// logout
const logoutUser = async(req, res) => {
    try{
        const userId = req.userId;
        await SessionModel.deleteMany({userId});
        await UserModel.findByIdAndUpdate(userId, {isLoggedIn: false});

        return res.status(200).json({
            success: true,
            message: "Logged out successfully"
        })
    }
    catch(err){
        return res.status(500).json({
            success: false,
            message: err.message
        })
    }
}


const forgotPassword = async(req, res) => {
    try{
        const {email} = req.body;
        const user = await UserModel.findOne({email})

        if(!user){
            return res.status(404).json({
                success: false,
                message: "user not found"
            })
        }

        const otp = Math.floor(1000 + Math.random()*9000).toString();
        const expiry = new Date(Date.now() + 10*60*1000);

        user.otp = otp;
        user.otpExp = expiry;
        await user.save();
        await sendOtpMail(email, otp);

        return res.status(200).json({
            success: true,
            message: "OTP sent successfully"
        })

    }
    catch(err){
        return res.status(500).json({
            success: false,
            message: err.message
        })
    }
}


const verifyOtp = async(req, res) => {
        const {otp} = req.body;
        const email = req.params.email;

        if(!otp){
            return res.status(400).json({
                success: false,
                message: "OTP is required"
            })
        }

        try {
            const user = await UserModel.findOne({email});
            if(!user){
                return res.status(404).json({
                    success: false,
                    message: "user not found"
                })
            }
            if(!user.otp || !user.otpExp){
                return res.status(400).json({
                    success: false,
                    message: "OTP not generated or already verified"
                })
            }
            if(user.otpExp < new Date()){
                return res.status(400).json({
                    success: false,
                    message: "OTP has expired. Please generate a new one"
                })
            }
            if(otp !== user.otp){
                return res.status(400).json({
                    success: false,
                    message: "Invalid OTP"
                })
            }

            user.otp = null;
            user.otpExp = null;
            await user.save();

            return res.status(200).json({
                success: true,
                message: "OTP verified successfully"
            })

        }
        catch(err){
            return res.status(500).json({
                success: false,
                message: err.message
            })
        }
}


const changePassword = async(req, res) => {
    const {newPassword, confirmPassword} = req.body;
    const email = req.params.email;

    if(!newPassword ||!confirmPassword){
        return res.status(400).json({
            success: false,
            message: "All fields are required"
        })
    }
    if(newPassword !== confirmPassword){
        return res.status(400).json({
            success: false,
            message: "Password do not match"
        })
    }

    try {
        const user = await UserModel.findOne({email});
        if(!user){
            return res.status(404).json({
                success: false,
                message: "user not found"
            })
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();

        return res.status(200).json({
            success: true,
            message: "password changed successfully"
        })

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message
        })
    }
}


module.exports = { registerUser, verification, loginUser, logoutUser, forgotPassword, verifyOtp, changePassword }