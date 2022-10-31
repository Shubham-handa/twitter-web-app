import mongoose, {Schema} from 'mongoose'

const userSchema = new Schema({
    username:{
        type:String,
        require:true,
    },
    firstName:{
        type:String,
        require:true,
    },
    lastName:{
        type:String,
        require:true,
    },
    dateOfBirth:{
        type:String,
        required:true
    },
    email:{
        type:String,
        require:true,
    },
    gender:{
        type:String,
        require:true,
    },
    profilePicture:{
        data:Buffer,
        contentType:String,
    },
    password:{
        type:String,
        require:true,
    },
    confirmPassword:{
        type:String,
        require:true,
    },
    phoneNumber:{
        type:String,
        require:true,
    },
    verified:{
        type:Boolean,
        require:true,
    },
    tweetsPosted: [
        {
            type:mongoose.Types.ObjectId,
            default:[],
            ref:'Tweets',
        }
    ],
    accountCreationDate:{
        type:Date,
        default:Date.now()
    }
})


export default mongoose.model('Users',userSchema);