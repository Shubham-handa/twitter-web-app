import axios from "axios"

export const getAllTweets = async() => {
    try{
        const response = await axios.get("http://localhost:9093/api/tweets/all");
        return response;
    }catch(error){
        console.error("Error occured",error.message);
    }
}

export const getUserDetailById = async (token, userId) => {
    try{

        // const requestOptions = {
        //     method: 'GET',
        //     headers: {'Authorization': `Bearer ${token}`,
        //     'Content-Type': 'application/json'
        // }
        // };

        const config = {
            headers: {Authorization: `Bearer ${token}`}
        };
        const response = await axios.get(
            `http://localhost:9093/api/users/search/${userId}`,
            config
        )

        // const response = await fetch(
        //     `http://localhost:9093/api/users/search/${userId}`,
        //     requestOptions
        // )

        
        //console.log(response);
        return response;
    }catch(error){
        console.error("Error occured",error.message);
    }
}


export const getUserDetail = async (token, username) => {
    try{

        const config = {
            headers: {Authorization: `Bearer ${token}`}
        };
        const response = await axios.get(
            `http://localhost:9093/api/users/search/username/${username}`,
            config
        )

        
        //console.log(response);
        return response;
    }catch(error){
        console.error("Error occured",error.message);
    }
}

export const replyTheTweet = async(tagDetail,tweetMessage,photoAttachedWithTweet,username,token,id) => {
    try{

        const fd = new FormData();

        let tweetDescription = `{
            "tagDetail": "${tagDetail}",
  "tweetMessage": "${tweetMessage}"
        }`

        console.log("Tweet Description in Reply The Tweet method ",tweetDescription);

        fd.append('tagDetail',tagDetail);
        fd.append('tweetMessage',tweetMessage);
        fd.append('photoAttachedWithTweet',photoAttachedWithTweet);
        

        const config = {
            headers: {"Authorization": `Bearer ${token}`,
        "Content-Type": "multipart/form-data"}
        };
        const response = await axios.post(`http://localhost:9093/api/tweets/${username}/reply/${id}`,
        fd,
        config)

        return response;
    }catch(error){
        console.error("Error occured",error.message);
    }
}



export const postTheTweet = async(tagDetail,tweetMessage,photoAttachedWithTweet,username,token) => {
    try{

        const fd = new FormData();

        let tweetDescription = `{
            "tagDetail": "${tagDetail}",
  "tweetMessage": "${tweetMessage}"
        }`

        console.log("Tweet Description in postThe Tweet method ",tweetDescription);

        fd.append('tagDetail',tagDetail);
        fd.append('tweetMessage',tweetMessage);
        fd.append('photoAttachedWithTweet',photoAttachedWithTweet);
        

        const config = {
            headers: {"Authorization": `Bearer ${token}`,
        "Content-Type": "multipart/form-data"}
        };
        const response = await axios.post(`http://localhost:9093/api/tweets/${username}/add`,
        fd,
        config)

        return response;
    }catch(error){
        console.error("Error occured",error.message);
    }
}

export const updateLikesOfTweetByID = async(username,tweetId,token,like) => {
    try{
        

        const requestOptions = {
            method: 'PATCH',
            headers: {"Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"}
        }

        const response = await fetch(`http://localhost:9093/api/tweets/${username}/like/${tweetId}`,
        requestOptions);
            return response;
       
       
    }catch(error){
        console.error("Error occured",error.message);
    }
}

export const getTweetDetailById = async(tweetId,token) => {
    try{
    
        const config = {
            headers: {"Authorization": `Bearer ${token}`}
        };
        const url = `http://localhost:9093/api/tweets/id/${tweetId}`;
     
     
         const response = await axios.get(url,config);
         return response;
         }catch(error){
             console.error("Error occured",error.message);
         }
}



export const forgotPassword = async(username,password) => {
    try{
    
        const url = `http://localhost:9093/api/users/${username}/forgot`;
     
        const data = {
            password: password
        }
     
         const response = await axios.put(url);
         return response;
         }catch(error){
             console.error("Error occured",error.message);
         }
}


export const findType = (data) => {
    let length = data.length;
    length-=1;
    let dotfind = "";
    let str = "";
    while(dotfind!=='.'){
        let value = data[length];
        dotfind = value;
        if(value!=="."){
            str = str + value;
        }
        length--;
    }
    let splitString = str.split("");
    var reverseArray = splitString.reverse();
    var joinArray = reverseArray.join("");
    return joinArray;
}