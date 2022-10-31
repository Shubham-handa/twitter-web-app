import axios from "axios";

//http://localhost:9093/api/v1.0/tweets/login?username=mokeyKing01&password=monkey001
const signIn = async(username,password) => {
    try{
    
   const url = 'http://localhost:9093/api/users/signin';

   const data = {
    username: `${username}`,
    password: `${password}`
   }

    const response = await axios.post(url,data);
    return response;
    }catch(error){
        console.error("Error occured",error.message);
        return error.response.data;
    }
};

export default signIn;

