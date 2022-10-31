import React, {useEffect, useState} from 'react'
import { Avatar, Button } from '@mui/material'
import './TweetBox.css'
import ImageIcon from '@mui/icons-material/Image';
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAlt';
import EmojiPicker from 'emoji-picker-react';
import { useSelector } from 'react-redux'
import { serviceWorkers } from '../../serviceRegistry'
import { useDispatch } from 'react-redux';
import { actionCreators } from '../../store';
import {useAlert} from 'react-alert';
import axios from "axios"


const TweetBox = ({tweetId}) => {

const [chosenEmoji, setChosenEmoji] = useState(null);
const dispatch = useDispatch();
const alert = useAlert();

const [postsData,setPostsData] = useState({
  tagDetail: '',
  tagMessage: '',
  image:null
});

const [tweetDescription,setTweetDescription] = useState("");
const [tweetPhoto,setTweetPhoto] = useState(null);

const [stateOfEmojiBox, setStateOfEmojiBox] = useState(false);

const [userInfo,setUserInfo] = useState({
  avatar:"",
  avatarType:"",
});

const tweetMessageHandler = (e) => {
  //console.log(e.target.value);
  setTweetDescription(e.target.value);
}

const fileSelectedHandler = (e) => {
  //console.log(e.target.files[0]);
  setTweetPhoto(e.target.files[0])
}

// const separateTagAndMessage = (tweetMessage,tweetPhoto) => {
//   let startIndex = tweetMessage.indexOf("#");
//   let message = tweetMessage.substring(0,startIndex);
//   let tag = tweetMessage.substring(startIndex, tweetMessage.length);


//   setPostsData({
//     tagDetail: tag,
//     tagMessage: message,
//     image:tweetPhoto
//   })
// }

let triggerValue = useSelector((state)=>state.triggerValue?.state);
let token = useSelector((state)=>state.saveToken.state);
let username = useSelector((state)=>state.setUserName.state);
// let user = useSelector((state)=>state.saveUser);
// let userData = null;


// const postTheTweet = async(tweetData,username,token) => {
//   try{

//     const fd = new FormData();

//     let tweet = `{
//         "tagDetail": "${tweetData.tagDetail}",
// "tweetMessage": "${tweetData.tagMessage}"
//     }`

//     console.log("Tweet Description in postThe Tweet method ",tweet);

//     fd.append('tweet',tweet);
//     fd.append('image',tweetData.image);
    

//     const config = {
//         headers: {"Authorization": `Bearer ${token}`,
//     "Content-Type": "multipart/form-data"}
//     };
//     const response = await axios.post(`http://localhost:9093/api/v1.0/tweets/${username}/add`,
//     fd,
//     config)

//     return response;
// }catch(error){
//     console.error("Error occured",error.message);
// }
// }

const postTweet = (e) => {
   e.preventDefault();

   console.log("Trigger Value ", triggerValue)

  //  console.log("Tweet Id ",tweetId);
  //  console.log("Emoji object ",chosenEmoji);
  
  //separateTagAndMessage(tweetDescription,tweetPhoto);
  let startIndex = tweetDescription.indexOf("#");
  //console.log("StartIndex ",startIndex);
  let message = tweetDescription.substring(0,startIndex);
  //console.log("message ",message);
  let tag = tweetDescription.substring(startIndex, tweetDescription.length);
 
  if(tag!=='' && message!==''){
    //console.log("tweet id in tweetbox ",tweetId);
    
    if(tweetId===null){
      //console.log("tweet id in tweetbox firs tif condition",tweetId);
      const response = serviceWorkers.postTheTweet(tag,message,tweetPhoto,username,token);
  

      response.then((result)=>{
        //console.log(result.data);
    
        if(result.data.responseCode===201){
          if(triggerValue===undefined){
            dispatch(actionCreators.triggerValue(1));
          }else{
            dispatch(actionCreators.triggerValue(triggerValue+1));
          }
          
          
          alert.success("Post Successfully!!");

        }else{
          alert.error("Error action cannot be done");
        }
      })
      //console.log("tweet id in tweetbox ",tweetId);
      
    }else{
      const response = serviceWorkers.replyTheTweet(tag,message,tweetPhoto,username,token,tweetId);
  

      response.then((result)=>{
        console.log("Replied tweet response ",result.data);
    
        if(result.data.responseCode===200){
          if(triggerValue===undefined){
            dispatch(actionCreators.triggerValue(1));
          }else{
            dispatch(actionCreators.triggerValue(triggerValue+1));
          }
          
          
          alert.success("Replied Successfully!!");
        }else{
          alert.error("Error action cannot be done");
        }
      })
    }
   
  }else{
    alert.error("Please enter Tweet message and Tag which starts with ' # '");
  } 
  
  
}


useEffect(()=>{

  // console.log("Token ", token);
  // console.log("User ",username);
  // userData = JSON.parse(user);
  // console.log("User Data ", userData);

  const response = serviceWorkers.getUserDetail(token, username);

        response.then((result)=>{
          const user = result.data.responseInformation;
      
          //console.log("User " ,user);
          
      
          let profilePictureData;
          let profilePictureDataType;
               if(user.profilePicture.data!==null){
                const base64String = btoa(
                  new Uint8Array(user.profilePicture.data.data)
                  .reduce((data,byte)=>data+String.fromCharCode(byte),'')
                );
                  profilePictureData = base64String;
                  //console.log(profilePictureData);
                  profilePictureDataType = user.profilePicture.contentType;
                  //console.log("UserProfile picture type in tweetbox ",profilePictureDataType);
               }
      
          setUserInfo({
            avatar:profilePictureData,
            avatarType:profilePictureDataType
          })
        });



},[token,username])

const onEmojiclick = (event,emojiObject) => {
  setChosenEmoji(emojiObject);
};


const changeStateOfEmojiBox = () => {
 if(stateOfEmojiBox===false){
   setStateOfEmojiBox(true);
 }else{
  setStateOfEmojiBox(false);
 }
}

  return (
    <div className="tweetBox">
      <form onSubmit={postTweet}>
          <div className="tweetBox__input">
            {/* {src={`data:image/${userData.avatarType};base64,${userData.avatar}`}} */}
            <Avatar src={`data:${userInfo.avatarType};base64,${userInfo.avatar}`}/>
            <input onChange={tweetMessageHandler} placeholder="What's happening?" type="text"/>
          </div>
          <div className="tweetBox__iconInput">
           <label htmlFor="imageButton" className="tweetBox__label"> <ImageIcon sx={{ fontSize: 50 }} className="tweetBox__icon" /> 
           </label>
          <input id="imageButton" onChange={fileSelectedHandler} className="tweetBox__inputImage" type="file" />
          <SentimentSatisfiedAltIcon onClick={()=>changeStateOfEmojiBox()} sx={{ fontSize: 50 }} className="tweetBox__icon"/>
          {
            stateOfEmojiBox ?
            <EmojiPicker onEmojiClick={()=>onEmojiclick()}/>
            :
            <p></p>
          }
          
          </div>
          
 <Button className="tweetBox__tweetButton" type="submit">Tweet</Button>
        </form>
    </div>
  )
}

export default TweetBox