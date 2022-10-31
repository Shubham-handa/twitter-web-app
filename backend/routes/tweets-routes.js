import { Router } from "express";
import upload from '../util/multerConfig.js'
import {check} from 'express-validator'
import requireAuth from '../middleware/authMiddleware.js'
import {postNewTweet, getAllTweets, getTweetDetailById, updateLikesOfTweetById,replyToTweetById} from '../controllers/tweets-controller.js'


const tweetRouter = Router();

const constraints = [
    check('tweetMessage','Tweet Message must be less than of size 144').isLength({min:1,max:144}),
    check('tagDetail','Tag Detail should be less than of size 50').isLength({min:1,max:50})
]

//Get All Tweets
tweetRouter.get('/all',getAllTweets);

//Get Tweet Detail By Id
tweetRouter.get('/id/:tweetId',requireAuth, getTweetDetailById);

//Post the New Tweet
tweetRouter.post('/:username/add',
upload.single('photoAttachedWithTweet'),
requireAuth,
constraints,
postNewTweet);

//Like the Tweet
tweetRouter.patch('/:username/like/:tweetId',requireAuth,updateLikesOfTweetById);

//Reply to the Tweet
tweetRouter.post('/:username/reply/:tweetId',
upload.single('photoAttachedWithTweet'),
requireAuth,
constraints,
replyToTweetById);

export default tweetRouter;
