const jwt = require('jsonwebtoken');
const UserModel = require('../models/userModel');

const isAuntheticated = async(req, res, next) => {
    try{
        const authHeader = req.headers.authorization;

        if(!authHeader || !authHeader.startsWith("Bearer ")){
            return res.status(401).json({
                success: false,
                message: "Access tokn is missing or invalid"
            })
        }

        const token = authHeader.split(" ")[1];

        jwt.verify(token, process.env.SECRET_KEY, async(err, decoded) => {
            if(err){
                if(err.name === "TokenExpiredError"){
                    return res.status(400).json({
                        success: false,
                        message: "Access Token has expired, use Refresh Token to generate again"
                    })
                }
                return res.status(400).json({
                    success: false,
                    message: "Access Token is missing or invalid"
                })
            }
            const {userId} = decoded;

            const user = await UserModel.findById(userId);

            if(!user){
                return res.status(404).json({
                    success: false,
                    message: "user not found"
                })
            }

            req.userId = user._id;

            next();

        })


    }
    catch(err){
        return res.status(500).json({
            success: false,
            message: err.message
        })
    }
}


module.exports = isAuntheticated;