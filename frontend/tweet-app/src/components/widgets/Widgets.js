import React from 'react'
import './Widgets.css'
import {
  TwitterTimelineEmbed,
  TwitterShareButton,
  TwitterTweetEmbed
} from 'react-twitter-embed';
import SearchIcon from '@mui/icons-material/Search';

const Widgets = () => {
  return (
    <div className="widgets mx-5">
      <div className="widgets__input">
        <SearchIcon className="widgets__searchIcon"/>
        <input placeholder="Search Twitter" type="text"/>
      </div>
      <div className="widgets__widgetContainer">
        <h2>What's happening</h2>
        <TwitterTweetEmbed tweetId={"1566167120706260993"}/> 
        <TwitterTimelineEmbed 
        sourceType = "profile"
        screenName="FCBarcelona"
        options={{height:400}}
        />
        <TwitterShareButton
        url = {"https://www.facebook.com/shubham.handa.3388"}
        options={{text: "#reactjs is awesome", via: "shubham"}}
        />
      </div>
    </div>
  )
}

export default Widgets