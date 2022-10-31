import React, {useEffect, useState} from 'react'
import VerifiedIcon from '@mui/icons-material/Verified';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import RepeatIcon from '@mui/icons-material/Repeat';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import PublishIcon from '@mui/icons-material/Publish';
import { Avatar } from '@mui/material'
import './Post.css'
import { useSelector } from 'react-redux'
import { serviceWorkers } from '../../serviceRegistry'
import {useAlert} from 'react-alert';
import CustomizedDialogs from '../dialog';
import { actionCreators } from '../../store';
import { useDispatch } from 'react-redux';

const Post = ({
    tweet
}) => {

    const alert = useAlert();
    const dispatch = useDispatch();

    const [postData,setPostData] = useState({
        id:"",
        avatar:"",
        avatarType:"",
        verified:false,
        tweetMessage:"",
        userName:"",
        displayName:"",
        image:"",
        imageType:"",
        replysOnTweet:[],
        parentTweet:false,
        usersLikeTweet:0
    });


    //const [tweetDataReplyList,setTweetDataReplyList] = useState([]);


    //const [userData, setUserData] = useState()


    let token = useSelector((state)=>state.saveToken.state);
    let triggerValue = useSelector((state)=>state.triggerValue?.state);

    // let posts = useSelector((state)=>state.savePostData.state);


    const likeButton = (e) => {
        //console.log(postData);
        e.preventDefault();
        alert.success("You like the tweet 😀");
        const response = serviceWorkers.updateLikesOfTweetByID(postData.userName,postData.id,token,true);
        response.then((result)=>{

            if(triggerValue===undefined){
                dispatch(actionCreators.triggerValue(1));
              }else{
                dispatch(actionCreators.triggerValue(triggerValue+1));
              }

            //console.log(result);
        })
    }

    // const findType = (data) => {
    //     let length = data.length;
    //     length-=1;
    //     let dotfind = "";
    //     let str = "";
    //     while(dotfind!=='.'){
    //         let value = data[length];
    //         dotfind = value;
    //         if(value!=="."){
    //             str = str + value;
    //         }
    //         length--;
    //     }
    //     let splitString = str.split("");
    //     var reverseArray = splitString.reverse();
    //     var joinArray = reverseArray.join("");
    //     return joinArray;
    // }
    
    

    useEffect(() =>{
        //console.log(props?.tweet);
        // console.log(token);

        
        const setData = (tweetData) => {
            let userId = tweetData?.userId;
                 
       const response = serviceWorkers.getUserDetailById(token, userId);
       response.then((result)=>{
         console.log(result.data);
         const posts = result.data.responseInformation;
         //console.log(posts);
        
         let profilePictureData;
         let profilePictureDataType;
         if(posts.profilePicture.data!==null){

            const base64String = btoa(
                new Uint8Array(posts.profilePicture.data.data)
                .reduce((data,byte)=>data+String.fromCharCode(byte),'')
              );

            profilePictureData = base64String;
            //console.log(profilePictureData);
            profilePictureDataType = posts.profilePicture.contentType;
         }


         //console.log("Tweet Detail ",tweet);
         let tweetImageData;
         let tweetImageDataType;
         //console.log(tweet);
         if(tweetData?.photoAttachedWithTweet!==""){
            const base64String = btoa(
                new Uint8Array(tweetData?.photoAttachedWithTweet.data.data)
                .reduce((data,byte)=>data+String.fromCharCode(byte),'')
              );
             tweetImageData = base64String;
             tweetImageDataType = tweetData?.photoAttachedWithTweet.contentType;
         }else{
            tweetImageData='';
            tweetImageDataType='';
         }
         


        
        setPostData({
            id:tweetData?._id,
            avatar:profilePictureData,
            avatarType:profilePictureDataType,
            verified:posts.verified,
            tweetMessage: `${tweetData.tweetMessage} ${tweetData.tagDetail}`,
            userName:posts.username,
            displayName:`${posts.firstName} ${posts.lastName}`,   
            parentTweet:tweetData?.parentTweet,
            replysOnTweet:tweetData?.replyOnTweet,   
            image:tweetImageData,
            imageType:tweetImageDataType,
            usersLikeTweet:tweetData?.usersLikeTweet
         })  
       })
        }

        console.log('Tweet ' + tweet?.userId)

        if(tweet?.userId===null || tweet?.userId===undefined){
            const response = serviceWorkers.getTweetDetailById(tweet,token);
            response.then((result)=>{
                const tweet = result.data.responseInformation;
                setData(tweet);
            })
        }else{
            setData(tweet);
        }
       

      

        
    },[token,tweet]);


  return (
    <div className="post">
      <div className="post_avatar">
            <Avatar src={`data:${postData.avatarType};base64,${postData.avatar}`}/>

        </div>
        <div className="post__body">
            <div className="post__header">
                <div className="post__headerText">
                    <h3>
                        {postData.displayName}{" "}
                        <span className="post__headerSpecial">
                            {postData.verified && <VerifiedIcon className="post__badge" />} @
                            {postData.userName}
                        </span>
                    </h3>
                </div>
                <div className="post__headerDescription">
                    <p>
                        {postData.tweetMessage}
                    </p>
                </div>
            </div>
            {
                postData.image !== '' ?
                <img src={`data:${postData.imageType};base64,${postData.image}`} alt=""/>
                :
                <p></p>
            }
            
            <div className="post__footer">
                <CustomizedDialogs id={postData?.id} />
            {/* <button type="submit" className="post__replyButton"><ChatBubbleOutlineIcon fontSize="small"/></button> */}
            <button type="submit" className="post__replyButton"><RepeatIcon fontSize="small"/></button>
                <div className="post__likeIconDiv d-flex">
                <form onSubmit={likeButton}>
                <button type="submit" className="post__likeButton"><FavoriteBorderIcon fontSize="small"/></button>
                </form>
                <h5>{postData.usersLikeTweet}</h5>
                </div>
                <button type="submit" className="post__replyButton"><PublishIcon fontSize="small"/></button>
            </div>
            <div className="post__tweetReplies">
              {
                postData.replysOnTweet && postData.replysOnTweet?.map(currTweet => (
                <Post key={currTweet} tweet = {currTweet}/>
                ))
                }
            </div>
        </div>
    </div>
  )
}

export default Post