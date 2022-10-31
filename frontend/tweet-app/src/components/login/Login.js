import React, {useEffect, useState} from 'react'
import './Login.css'
import ImageIcon from '@mui/icons-material/Image';
import TwitterIcon from '@mui/icons-material/Twitter';
import { Button } from '@mui/material';
import {useNavigate} from 'react-router-dom';
import PersonIcon from '@mui/icons-material/Person';
import PasswordIcon from '@mui/icons-material/Password';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import PhoneIcon from '@mui/icons-material/Phone';
import WcIcon from '@mui/icons-material/Wc';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import {useAlert} from 'react-alert';
import signIn from '../../service/service'
import { useDispatch } from 'react-redux';
import { serviceWorkers } from '../../serviceRegistry'
import { actionCreators } from '../../store';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import axios from 'axios';


const Login = () => {

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const alert = useAlert();

  const [accountHave,setAccountHave] = useState(true);
  const [birthDate, setBirthDate] = useState();
  // const [userName,setUserName] = useState("");
  // const [password,setPassword] = useState("");

  const [loginData,setLoginData] = useState({
    username: "",
    password: ""
  })


  const [tweetPhoto,setTweetPhoto] = useState(null);

  const [signUpData,setSignUpData] = useState({
    signUpFirstName: "",
    lastName:"",
    signUpPassword:"",
    confirmPassword:"",
    userGender:"",
    userDOB:"",
    userEmail:"",
    userPhoneNumber:0,
    signUpUserName:"",
    verified:""
  });


  const [forgotPasswordStatus,setForgotPasswordStatus] = useState(false);
  const [status,setStatus] = useState(false);
  const [buttonText,setButtonText] = useState("Sign In");
  // const [userInf,o,setUserInfo] = useState({
  //   firstName:"",
  //   lastName:"",
  //   avatar:"",
  //   avatarType:"",
  //   gender:"",
  //   email:"",
  //   contactNumber:"",
  //   dob:"",
  //   allTweets:[],
  //   accountCreationDate:"",
  //   verified:false,
  //   loginId:""
  // });


  const handleChange = (e) => {
    
    const newData = {...loginData};
    newData[e.target.id] = e.target.value;
    setLoginData(newData);
   
  }

  const handeChangeForSignUp = (e) => {
    const newData = {...signUpData};
    newData[e.target.id] = e.target.value;
    setSignUpData(newData);
  }

 

  const changeStatusOfAccountHave = () => {
    if(accountHave===true){
      setAccountHave(false);
    }else{
      setAccountHave(true);
    }
  }


  const changePassword = () => {
    
    setStatus(true);
    setButtonText("Change Password");

  }

  const goToHome = (e) => {

    e.preventDefault();
    let userName = loginData.username;
    let password = loginData.password;
    //console.log(loginData.username);
    if(userName==="" || password===""){
      alert.error("Fields shouldn't be null");
    }else{
      

      if(status===true){
        const response = serviceWorkers.forgotPassword(userName,password);

        response.then((result)=>{
          console.log('Inside the forgot password Method ' + result);
          if(result.data.responseCode===200){
            //console.log("Forgot Password result ",result);
            setButtonText("Sign In");
            setForgotPasswordStatus(false);
            setStatus(false);
            alert.success("Password Changed Successfully!!!");
          }
          
        })

      }else{
        const response = signIn(userName,password);
      response.then((result)=>{

        let data;
        // const token=result.data.data.jwtToken;
      
        let str = "Invalid";
        let invalidStatus = false

        if(result===str){
          invalidStatus=true;
        }else{
          data=result.data.responseInformation
        }

        if(invalidStatus){
          //console.log("Data ",data);
          setForgotPasswordStatus(true);
          alert.error("Enter the Correct Credentials!!");
        }else{
          const token=data?.token;
          //console.log("Token ",data);
          alert.success("Successfully login!!");
          dispatch(actionCreators.saveToken(token));
          if(token!==null){
              dispatch(actionCreators.saveUserName(userName));
              navigate('/home',{ replace: true });
            }
        }
      });
      }
    }


    // navigate('/home',{ replace: true });
  }

  const fileSelectedHandler = (e) => {
    //console.log(e.target.files[0]);
    setTweetPhoto(e.target.files[0])
  }


  const createAccount = async(accountData,image) => {
    try{
  
      const fd = new FormData();

      let statusVerified = false;
      if(accountData.verified==='yes'){
        statusVerified=true;
      }
  
    //   let user = `{
    //     "confirmPassword": "${accountData.confirmPassword}",
    //     "contactNumber": "+91 ${accountData.userPhoneNumber}",
    //     "dob": "${accountData.userDOB}",
    //     "email": "${accountData.userEmail}",
    //     "firstName": "${accountData.signUpFirstName}",
    //     "gender": "${accountData.userGender}",
    //     "lastName": "${accountData.lastName}",
    //     "loginId": "${accountData.signUpUserName}",
    //     "verified":"${statusVerified}",    
    //     "password": "${accountData.signUpPassword}"
    // }`
  
       console.log("UserData ", accountData);
  

      fd.append('username',accountData.signUpUserName);
      fd.append('firstName',accountData.signUpFirstName);
      fd.append('lastName',accountData.lastName);
      fd.append('dateOfBirth',accountData.userDOB);
      fd.append('email',accountData.userEmail);
      fd.append('password',accountData.signUpPassword);
      fd.append('confirmPassword',accountData.confirmPassword);
      fd.append('gender',accountData.userGender);
      fd.append('phoneNumber',accountData.userPhoneNumber);
      fd.append('verified',statusVerified);
      fd.append('profilePicture',image);
      
  
      const config = {
          headers: {
      "Content-Type": "multipart/form-data"}
      };
      const response = await axios.post(`http://localhost:9093/api/users/signup`,
      fd,
      config)
  
      return response;
  }catch(error){
      console.error("Error occured",error.message);
      
        return error.response.data;
  }
  }
  

  const onSignUp = (e) => {
    e.preventDefault();

    const response = createAccount(signUpData,tweetPhoto);
    
    response.then((result)=>{
      console.log(result);
      if(result?.data?.responseCode===201){
        alert.success("Account Created Successfully!!");
        setAccountHave(true);
      }else{ 
        alert.error(`Error action cannot be done because ${result}`);
      }
    });
  }
  // useEffect = () => {

  // }

  return (
    <div className="login d-flex justify-content-center align-items-center">
        <div className="login__header d-flex mx-4">
        <h2>Welcome to Twitter</h2>
        <TwitterIcon className="login__twitterIcon mx-4"/>
        </div>
        {
          accountHave ?
          <div className="login__signPage mx-5">
            <h3 className="mb-5">Sign In to your twitter account!!</h3>
            <form onSubmit={goToHome}>
    
            <div className="d-flex mb-4">
    <label htmlFor="username" className="form-label"><PersonIcon sx={{ fontSize: 30 }}/></label>
    <input type="text" value={loginData.username} className="form-control mx-3" onChange={handleChange} placeholder="Enter the username" id="username" aria-describedby="usernameHelp"/>
  </div>
  <div className="d-flex mt-3 mb-4">
    <label htmlFor="password" className="form-label"><PasswordIcon sx={{ fontSize: 30 }}/></label>
    <input type="password" value={loginData.password} className="form-control mx-3" onChange={handleChange} placeholder="Enter the password" id="password"/>
  </div>
  {
    forgotPasswordStatus === true ?
    <Button variant="text" color="error" className="login__forgotPasswordButton mt-3" onClick={changePassword} fullWidth>Forgot Password</Button>
    :
    <p></p>
  }
  <Button variant="outlined" type="submit" className="signIn__button" fullWidth>{buttonText}</Button>
  <Button variant="text" className="login__notAccountButton mt-3" onClick={changeStatusOfAccountHave} fullWidth>Don't have an account</Button>
            </form>
          </div>
          :
          <div className="login__signUpPage mx-5">
             <h3 className="mb-4">Create your twitter account!!</h3>
            <form onSubmit={onSignUp}>
            <div className="d-flex mb-1">
                <label htmlFor="signUpFirstName" className="form-label"><AssignmentIndIcon sx={{ fontSize: 30 }}/></label>
                <input type="text" value={signUpData.signUpFirstName} onChange={handeChangeForSignUp} className="form-control mx-3" placeholder="Enter the firstname" id="signUpFirstName" aria-describedby="firstnameHelp"/>
              </div>
              <div className="d-flex mb-1">
                <label htmlFor="lastName" className="form-label"><AssignmentIndIcon sx={{ fontSize: 30 }}/></label>
                <input type="text" value={signUpData.lastName}  onChange={handeChangeForSignUp} className="form-control mx-3" placeholder="Enter the lastname" id="lastName" aria-describedby="lastnameHelp"/>
              </div>
              <div className="d-flex mb-1">
                <label htmlFor="signUpUserName" className="form-label"><PersonIcon sx={{ fontSize: 30 }}/></label>
                <input type="text" value={signUpData.signUpUserName}  onChange={handeChangeForSignUp} className="form-control mx-3" placeholder="Enter the username" id="signUpUserName" aria-describedby="usernameHelp"/>
              </div>
              <div className="d-flex mb-1">
                <label htmlFor="userEmail" className="form-label"><MailOutlineIcon sx={{ fontSize: 30 }}/></label>
                <input type="email" value={signUpData.userEmail}  onChange={handeChangeForSignUp} className="form-control mx-3" placeholder="Enter the email" id="userEmail" aria-describedby="useremailHelp"/>
              </div>
              <div className="d-flex mb-1">
                <label htmlFor="signUpPassword" className="form-label"><PasswordIcon sx={{ fontSize: 30 }}/></label>
                <input type="password" value={signUpData.signUpPassword}  onChange={handeChangeForSignUp} className="form-control mx-3" placeholder="Enter the password" id="signUpPassword"/>
              </div>
              <div className="d-flex mb-1">
                <label htmlFor="confirmPassword" className="form-label"><PasswordIcon sx={{ fontSize: 30 }}/></label>
                <input type="password" value={signUpData.confirmPassword}  onChange={handeChangeForSignUp} className="form-control mx-3" placeholder="Enter the confirm password" id="confirmPassword"/>
              </div>
              <div className="d-flex mb-1">
                <label htmlFor="userPhoneNumber" className="form-label"><PhoneIcon sx={{ fontSize: 30 }}/></label>
                <input type="number" value={signUpData.userPhoneNumber}  onChange={handeChangeForSignUp} className="form-control mx-3" placeholder="Enter the phone number" id="userPhoneNumber" aria-describedby="usePhoneNumberHelp"/>
              </div>
              <div className="d-flex mb-1">
                <label htmlFor="userDOB" className="form-label"><CalendarMonthIcon sx={{ fontSize: 30 }}/></label>
            
                <input type="date" value={signUpData.userDOB}  onChange={handeChangeForSignUp} className="form-control mx-3" placeholder="Enter date of birth in format yyyy-MM-dd" id="userDOB" aria-describedby="useDOBHelp"/>
                
                
              </div>
              <div className="d-flex mb-1">
                <label htmlFor="userGender" className="form-label"><WcIcon sx={{ fontSize: 30 }}/></label>
                <input type="text" value={signUpData.userGender}  onChange={handeChangeForSignUp} className="form-control mx-3" placeholder="Male or Female or Other" id="userGender" aria-describedby="useGenderHelp"/>
              </div>

              <div className="d-flex mb-1">
              <label htmlFor="imageButton" className="form-label"> <ImageIcon sx={{ fontSize: 30 }} className="imageButtonIcon"/> 
              <span className="imageuploader__header ms-3">Upload Profile Picture</span>
           </label>
          <input id="imageButton" value={signUpData.image}  onChange={fileSelectedHandler} className="tweetBox__inputImage" type="file" />
          
              </div>
              <div className="d-flex mb-2">
                <label htmlFor="verified" className="form-label"><VerifiedUserIcon sx={{ fontSize: 30 }}/></label>
                <input type="text" value={signUpData.verified}  onChange={handeChangeForSignUp} className="form-control mx-3" placeholder="yes or no" id="verified"/>
              </div>
              <Button variant="outlined" type="submit" className="signUp__button" fullWidth>Create Account</Button>
  <Button variant="text" className="login__notAccountButton mt-1" onClick={changeStatusOfAccountHave} fullWidth>Already have an account</Button>
            </form>
          </div>
        }
        
        
    </div>
  )
}

export default Login