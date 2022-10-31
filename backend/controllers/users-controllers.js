import HttpError from "../models/http-error.js";
import ResponseDTO from "../models/responseDTO.js";
import Tweet from '../models/tweet.js'
import User from '../models/user.js'
import logger from "../util/logger.js";
import fs from 'fs'
import { validationResult } from "express-validator";
import bcrypt from 'bcryptjs'
import user from "../models/user.js";
import jwt from 'jsonwebtoken'



//Get All User 
const getAllUser = async(req,res,next) => {
    let response;
    try{
        response = await User.find();
    }catch(err){
        return next(new HttpError('Failed',500))
    }

    if(response!==null || response?.length!==0){
        const responseDTO = new ResponseDTO(response,200);
        res.status(responseDTO.responseCode).send(responseDTO.sendInfo());
    }
}

//Create New User
const createNewUser = async(req,res,next) => {

    //Handling constraint erros using express validator

    const errors = validationResult(req);
    if(!errors.isEmpty()){
        const errorArray = errors.array();

        //logger.error(errorArray[0].param);

        const error = {
            message: errorArray[0].msg,
            param: errorArray[0].param
        }

        return next(new HttpError(error.message,400))
    }

    //Email Checking If Exist or Not
    const emailExist = await User.findOne({
        email:req.body.email
    }).exec();

    if(emailExist!==null){
        return next(new HttpError('Email Already Exist', 409))
    }

    //Username Check If Exist or Not
    const userNameExist = await User.findOne({
        username:req.body.username
    });

    if(userNameExist!==null){
        return next(new HttpError('Uername Already Exist', 409))
    }

    //Phone number Check If Exist or Not
    const phoneNumberExist = await User.findOne({
        phoneNumber:req.body.phoneNumber
    });

    if(phoneNumberExist!==null){
        return next(new HttpError('Phone Number Already Exist', 409))
    }

    //Set profile picture variable
    const profilePicture = {
        data: fs.readFileSync('uploads/' + req.file.filename),
        contentType: req.file.mimetype
    }

    //Object destructuring
    const {
        username,
        email,
        gender,
        firstName,
        lastName,
        password,
        confirmPassword,
        verified,
        phoneNumber,
        dateOfBirth
    } = req.body;


    //Password encryption using hashing
    let hashedPassword;
    try{
        hashedPassword = await bcrypt.hash(password,12);
    }catch(err){
        return next(new HttpError(`Password does'nt Encrypt`,500));
    }

    

    let response;
    try{
        response = await User.create({
            username,
            firstName,
            lastName,
            dateOfBirth,
            email,
            profilePicture,
            password:hashedPassword,
            confirmPassword:hashedPassword,
            gender,
            verified,
            phoneNumber
        });


    }catch(err){
        return next(new HttpError('Failed',500))
    }

    if(response!==null || response?.length!==0){
        const responseDTO = new ResponseDTO(response,201);
        res.status(responseDTO.responseCode).send(responseDTO.sendInfo());
    }
}

//Get all tweet by userID
const getTweetsByUserId = async(req,res,next) => {

    const userId = req.params.userId;

    let response;
    try{
        response = await Tweet.find({
            'userId':{$in:userId}
        })

    }catch(err){
        return next(new HttpError('Failed',500))
    }

    if(response!==null || response?.length!==0){
        const responseDTO = new ResponseDTO(response,200);
        res.status(responseDTO.responseCode).send(responseDTO.sendInfo());
    }else{
        const responseDTO = new ResponseDTO(response,200);
        res.status(responseDTO.responseCode).send(responseDTO.sendInfo());
    }
}

//Sign In 
const login = async(req,res,next) => {

    const username = req.body.username;
    const password = req.body.password;


   //find User 
    let userExist;
    try{
        userExist = await User.findOne({
            username:username
        })
    }catch(err){
        return next(new HttpError(`Failed`,500));
    }

    //user exist or not
    if(!userExist){
        return next(new HttpError(`Invalid Credentials`,401));
    }

    //Check password same
    let isValidPassword = false
    try{
        isValidPassword = await bcrypt.compare(password,userExist.password);
    }catch(err){
        return next(new HttpError(`Failed`,500));
    }

    if(!isValidPassword){
        return next(new HttpError(`Invalid Credentials`,401));
    }

    //Generating token
    let token;
    try{
        token = jwt.sign({username: userExist.username},
            'LaughingBuddhaJutsu',
            {expiresIn: '5h'})
    }catch(err){
        return next(new HttpError('Failed',500))
    }


    logger.info(`Token ${token}`);

    const response = {
        userDetail: userExist,
        token: token
    }

    if(token!==null || token?.length!==0){
        const responseDTO = new ResponseDTO(response,200);
        res.status(responseDTO.responseCode).send(responseDTO.sendInfo());
    }
}


//Change User Password
const changePassword = async(req,res,next) => {

    let username = req.params.username;

    //Handling constraint erros using express validator

    const errors = validationResult(req);
    if(!errors.isEmpty()){
        const errorArray = errors.array();

        //logger.error(errorArray[0].param);

        const error = {
            message: errorArray[0].msg,
            param: errorArray[0].param
        }

        return next(new HttpError(error.message,400))
    }

    const {password} = req.body;


    //Password encryption using hashing
    let hashedPassword;
    try{
        hashedPassword = await bcrypt.hash(password,12);
    }catch(err){
        return next(new HttpError(`Password does'nt Encrypt`,500));
    }

    let response;
    try{
        let user = await User.findOne({
            username:username
        })

        user.password = hashedPassword
        user.confirmPassword = hashedPassword

        response = await user.save();

    }catch(err){
        return next(new HttpError('Failed',500))
    }

    if(response!==null || response?.length!==0){
        const responseDTO = new ResponseDTO('Success!!!',200);
        res.status(responseDTO.responseCode).send(responseDTO.sendInfo());
    }
}


//Get User Detail By User Name
const getUserDetailByUsername = async(req,res,next) => {

    const username = req.params.username;

    let response;
    try{
        response = await User.findOne({
            username:username
        })
    }catch(err){
        return next(new HttpError('Failed',500))
    }

    if(response!==null || response?.length!==0){
        const responseDTO = new ResponseDTO(response,200);
        res.status(responseDTO.responseCode).send(responseDTO.sendInfo());
    }
}


//Get user detail by user Id
const getUserDetailById = async(req,res,next) => {

    const userId = req.params.userId;

    let response;
    try{
        response = await User.findById(userId);
    }catch(err){
        return next(new HttpError('Failed',500))
    }

    if(response!==null || response?.length!==0){
        const responseDTO = new ResponseDTO(response,200);
        res.status(responseDTO.responseCode).send(responseDTO.sendInfo());
    }
}

export {createNewUser,getAllUser,getTweetsByUserId,getUserDetailById,getUserDetailByUsername,login,changePassword};


