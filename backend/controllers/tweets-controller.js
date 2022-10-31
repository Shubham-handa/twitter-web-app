import HttpError from "../models/http-error.js";
import ResponseDTO from "../models/responseDTO.js";
import Tweet from '../models/tweet.js'
import User from '../models/user.js'
import logger from "../util/logger.js";
import fs from 'fs'
import { validationResult } from "express-validator";

//Get All Tweets
const getAllTweets = async(req,res,next) => {
    let response;
    try{
        response = await Tweet.find({
            parentTweet:false
        });
    }catch(err){
        return next(new HttpError('Failed',500))
    }

    if(response!==null || response?.length!==0){
        const responseDTO = new ResponseDTO(response,200);
        res.status(responseDTO.responseCode).send(responseDTO.sendInfo());
    }
}

//Post New Tweet
const postNewTweet = async(req,res,next) => {

    const username = req.params.username;
    //const tweetId = req.params.tweetId;

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

    //set photoAttachedWithTweet variable
    let photoAttachedWithTweet;
    //logger.info(`photo attached with tweet ${req.file}`);
    if(req.file===undefined){
        photoAttachedWithTweet = {
            data:'',
            contentType:'image/jpeg'
        }
    }else{
        photoAttachedWithTweet = {
            data:fs.readFileSync('uploads/'+req.file.filename),
            contentType:req.file.mimetype
        }
    }

    //Store body data coming from request in variable
    const {tweetMessage,tagDetail} = req.body;

    //Find User Detail By Name
    let userId;

    try{
        const user = await User.findOne({
            username:username
        })
        userId = user._id;
    }catch(err){
        return next(new HttpError('Failed',500))
    }


    let response;
    try{
        response = await Tweet.create({
            tweetMessage,
            tagDetail,
            photoAttachedWithTweet,
            userId
        });
    }catch(err){
        return next(new HttpError('Failed',500))
    }

    

    //Pushed this replied tweet into user tweets list
    let tweetId = response._id;

    try{
        let user = await User.findById(userId);
        user.tweetsPosted.push(tweetId);
        await user.save();
    }catch(err){
        return next(new HttpError('Failed',500))
    }

    if(response!==null || response?.length!==0){
        const responseDTO = new ResponseDTO(response,201);
        res.status(responseDTO.responseCode).send(responseDTO.sendInfo());
    }
}

//Update Like of Tweet By Id
const updateLikesOfTweetById = async(req,res,next) => {

    const username = req.params.username;
    const tweetId = req.params.tweetId;

    let response;
    try{
        let tweet = await Tweet.findById(tweetId);
        tweet.usersLikeTweet += 1;
        response = await tweet.save();
    }catch(err){
        return next(new HttpError('Failed',500))
    }

    if(response!==null || response?.length!==0){
        const responseDTO = new ResponseDTO('Success!!!',200);
        res.status(responseDTO.responseCode).send(responseDTO.sendInfo());
    }
}

//Reply to the Tweet By Id
const replyToTweetById = async(req,res,next) => {

    const username = req.params.username;
    const tweetId = req.params.tweetId;

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

    //set photoAttachedWithTweet variable
    let photoAttachedWithTweet;
    //logger.info(`photo attached with tweet ${req.file}`);
    if(req.file===undefined){
        photoAttachedWithTweet = {
            data:'',
            contentType:'image/jpeg'
        }
    }else{
        photoAttachedWithTweet = {
            data:fs.readFileSync('uploads/'+req.file.filename),
            contentType:req.file.mimetype
        }
    }

    //Store body data coming from request in variable
    const {tweetMessage,tagDetail} = req.body;


    //Find User Detail By Name
    let userId;

    try{
        const user = await User.findOne({
            username:username
        })
        userId = user._id;
    }catch(err){
        return next(new HttpError('Failed',500))
    }


    //Creating Replied Tweet
    let repliedTweet;
    
    try{
        repliedTweet = await Tweet.create({
            tweetMessage,
            tagDetail,
            photoAttachedWithTweet,
            userId,
            parentTweet: true
        });
    }catch(err){
        return next(new HttpError('Failed',500))
    }


    //Pushed this replied tweet into user tweets list
    let repliedTweetId = repliedTweet._id

    try{
        let user = await User.findById(userId);
        user.tweetsPosted.push(repliedTweetId);
        await user.save();
    }catch(err){
        return next(new HttpError('Failed',500))
    }

    //Pushed this replied tweet into Parent Tweet list

    let response;
    try{
        let tweet = await Tweet.findById(tweetId);
        tweet.replyOnTweet.push(repliedTweetId);
        await tweet.save();
    }catch(err){
        return next(new HttpError('Failed',500))
    }

    if(response!==null || response?.length!==0){
        const responseDTO = new ResponseDTO('Success!!!',200);
        res.status(responseDTO.responseCode).send(responseDTO.sendInfo());
    }
}

//Get Tweet Detail By Id
const getTweetDetailById = async(req,res,next) => {

    const tweetId = req.params.tweetId;

    let response;
    try{
        response = await Tweet.findById(tweetId);
    }catch(err){
        return next(new HttpError('Failed',500))
    }

    if(response!==null || response?.length!==0){
        const responseDTO = new ResponseDTO(response,200);
        res.status(responseDTO.responseCode).send(responseDTO.sendInfo());
    }
}

export {getAllTweets,getTweetDetailById,postNewTweet,replyToTweetById,updateLikesOfTweetById};