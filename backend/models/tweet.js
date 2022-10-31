import mongoose, {Schema} from 'mongoose'

const tweetSchema = new Schema({
    tweetMessage: {
        type:String,
        required:true
    },
    tweetPublishedDate:{
        type:Date,
        default:Date.now()
    },
    tagDetail:{
        type:String,
        required:true
    },
    usersLikeTweet:{
        type:Number,
        default:0
    },
    parentTweet:{
        type:Boolean,
        default:false
    },
    photoAttachedWithTweet:{
        data:Buffer,
        contentType:String
    },
    replyOnTweet:[
        {
            type:mongoose.Types.ObjectId,
            default:[],
            ref:'Tweets'
        }
    ],
    userId:{
        type:mongoose.Types.ObjectId,
        ref:'Users'
    }
})

export default mongoose.model('Tweets',tweetSchema);