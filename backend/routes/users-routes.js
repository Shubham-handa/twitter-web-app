import { Router } from "express";
import upload from '../util/multerConfig.js'
import {check} from 'express-validator'
import requireAuth from '../middleware/authMiddleware.js'
import {createNewUser, getUserDetailById, login, getUserDetailByUsername,getAllUser, getTweetsByUserId, changePassword} from '../controllers/users-controllers.js'
import user from "../models/user.js";

const passwordConstraint = check('password','Enter a password of minimum length 6').isLength({min:6})

const constraint = [
    check('email','Enter a valid email').isEmail(),
    passwordConstraint
]

const userRouter = Router();

//Get all user
userRouter.get('/all',getAllUser)

//Get user detail by id
userRouter.get('/search/:userId',requireAuth,getUserDetailById);

//Get user detail by username
userRouter.get('/search/username/:username',requireAuth,getUserDetailByUsername);

//Get all tweets by user
userRouter.get('/all/tweets/:userId',getTweetsByUserId);

//Creating new account
userRouter.post('/signup',
upload.single('profilePicture'),
constraint,
createNewUser);

//Sign in
userRouter.post('/signin',login)

//chnage password
userRouter.put('/:username/forgot',
[
    passwordConstraint
],
changePassword
)


export default userRouter;