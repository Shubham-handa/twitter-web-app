import express from 'express';
import cors from 'cors'
import errorHandler from './util/anyErrorHandler.js'
import mongoose from 'mongoose';
import tweetRoutes from './routes/tweets-routes.js';
import userRoutes from './routes/users-routes.js';




//app config
const app = express();

const port = 9093 || process.env.PORT

//middleware
app.use(express.json());
app.use(cors());

app.use('/api/tweets',tweetRoutes);
app.use('/api/users',userRoutes);

app.use(errorHandler);

//db config

mongoose.connect('mongodb://localhost:27017/twitter-database')
.then(()=>{
    app.listen(port,()=>console.log(`Listening on port ${port}`))
}).catch(err=>{
    console.log(err);
})
