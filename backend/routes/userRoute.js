const express = require('express');
const userRouter = express.Router();
const isAuthenticated = require('../middleware/isAuntheticated');
const { registerUser, verification, loginUser, logoutUser, forgotPassword, verifyOtp, changePassword } = require('../controllers/userController');
const { validateUser, userSchema } = require('../validators/userValidate');


userRouter.post('/register', validateUser(userSchema), registerUser);
userRouter.post('/verify', verification);
userRouter.post('/login', loginUser);
userRouter.post('/logout', isAuthenticated,  logoutUser);
userRouter.post('/forgot-password', forgotPassword);
userRouter.post('/verify-otp/:email', verifyOtp);
userRouter.post('/change-password/:email', changePassword);

module.exports = userRouter;