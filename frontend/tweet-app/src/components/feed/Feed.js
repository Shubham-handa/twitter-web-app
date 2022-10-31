import React, {useEffect, useState} from 'react'
import './Feed.css'
import TweetBox from '../tweetbox/TweetBox'
import Post from '../post/Post'
import { serviceWorkers } from '../../serviceRegistry'
import { useDispatch } from 'react-redux';
import { actionCreators } from '../../store';
import { useSelector } from 'react-redux'

const Feed = () => {
  const [tweetData,setTweetData] = useState([]);
  //const dispatch = useDispatch();

  // console.log("Feed compo")
 
  //const dispatch = useDispatch();
  let triggerValue = useSelector((state)=>state.triggerValue?.state);

  useEffect(() =>{
  
    //console.log("Inside Post tweet Trigger value ",triggerValue);
    const response = fetch('http://localhost:9093/api/tweets/all');
    response.then((result)=>{
      const data = result.json();
      //console.log('Message ', data);
      return data;
  
    }).then((posts)=>{
      //console.log('Post Data',posts.responseInformation);
      setTweetData(posts.responseInformation);
    })

    //console.log(tweetData);

  },[triggerValue]);




  return (

    <div className='feed'>
    <div className='feed_header'>
    <h2>Home</h2>
    </div>
    <TweetBox tweetId={null}/>
    {
      tweetData && tweetData?.map(currTweet=>(
        <Post key={currTweet._id} tweet={currTweet}/>
      ))
    }
    </div>
  )
}

export default Feed