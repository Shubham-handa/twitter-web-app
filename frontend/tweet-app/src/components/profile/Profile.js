import React, { useEffect, useState } from "react";
import "./Profile.css";
import { useSelector } from "react-redux";
import { serviceWorkers } from "../../serviceRegistry";
import { useDispatch } from "react-redux";
import { actionCreators } from "../../store";
import { Avatar } from "@mui/material";
import VerifiedIcon from "@mui/icons-material/Verified";
import AttachEmailIcon from '@mui/icons-material/AttachEmail';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import ContactPhoneIcon from '@mui/icons-material/ContactPhone';
import PersonPinIcon from '@mui/icons-material/PersonPin';
import ManIcon from '@mui/icons-material/Man';
import FemaleIcon from '@mui/icons-material/Female';
import { Button } from '@mui/material';
import {useNavigate} from 'react-router-dom';
import {useAlert} from 'react-alert';

const Profile = () => {
  let token = useSelector((state) => state.saveToken.state);
  let username = useSelector((state) => state.setUserName.state);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const alert = useAlert();


  const goToHome = () => {
    alert.success("You'r redirecting to Home Page");
    navigate('/home',{ replace: true });
  }

  const logout = () => {
    token = null;
    dispatch(actionCreators.saveToken(token));
    alert.success("You'r redirecting to login Page");
    navigate('/',{ replace: true });
  }

  const [userInfo, setUserInfo] = useState({
    loginId: "",
    firstName: "",
    lastName: "",
    dob: "",
    gender: "",
    email: "",
    contactNumber: "",
    verified: false,
    avatar: "",
    avatarType: "",
    allTweets: [],
    accountCreationDate: "",
  });

  useEffect(() => {
    // console.log("Token ", token);
    // console.log("User ", username);
    // userData = JSON.parse(user);
    // console.log("User Data ", userData);
    const response = serviceWorkers.getUserDetail(token, username);

    response.then((result) => {
      const user = result.data.responseInformation;

      //console.log("User inProfile ", user);

      let profilePictureData;
      let profilePictureDataType;
      if (user.profilePicture.data !== null) {

        const base64String = btoa(
          new Uint8Array(user.profilePicture.data.data)
          .reduce((data,byte)=>data+String.fromCharCode(byte),'')
        );

        profilePictureData = base64String;
        //console.log(profilePictureData);
        profilePictureDataType = user.profilePicture.contentType
        // console.log(
        //   "UserProfile picture type in tweetbox ",
        //   profilePictureDataType
        // );
      }

      setUserInfo({
        avatar: profilePictureData,
        avatarType: profilePictureDataType,
        loginId: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        dob: user.dateOfBirth,
        gender: user.gender,
        email: user.email,
        contactNumber: user.phoneNumber,
        verified: user.verified,
        allTweets: user.tweetsPosted,
        accountCreationDate: user.accountCreationDate,
      });
    });
  }, [token, username]);

  return (
    <div className="profile d-flex mt-5 mx-5">
      
      <Avatar
          className="profile__avatar mt-5 mx-5"
          sx={{ width: 250, height: 250 }}
          src={`data:${userInfo.avatarType};base64,${userInfo.avatar}`}
        />
      
      <div className="profile__inner mt-5 mx-5">
        <h2 className="profile__header mt-4">
          {userInfo.firstName + " " + userInfo.lastName}
          <span className="profile__headerSpecial mx-3">
            {userInfo.verified && <VerifiedIcon  className="profile__badge" />}
          </span>
        </h2>

        <h3 className="profile__detailHeader mt-4">
          {userInfo.email}
          <span className="profile__detailHeaderSpecial mx-3">
            <AttachEmailIcon  className="profile__detailBadge" />
          </span>
        </h3>

        <h3 className="profile__detailHeader mt-4">
          {userInfo.gender}
          <span className="profile__detailHeaderSpecial mx-3">
            {userInfo.gender.startsWith('M') ? 
            <ManIcon className="profile__detailBadge" />
            :
            <FemaleIcon className="profile__detailBadge" />
          }
          </span>
        </h3>

        <h3 className="profile__detailHeader mt-4">
          {userInfo.dob}
          <span className="profile__detailHeaderSpecial mx-3">
            <CalendarMonthIcon  className="profile__detailBadge" />
          </span>
        </h3>

        <Button variant="contained" className="profile__logoutButton mt-3" color="error" onClick={()=>logout()}>Logout</Button>
        <br/>
        <Button variant="text" className="profile__homePageButton mt-3" onClick={()=>goToHome()} >Go To Home</Button>




      </div>
    </div>
  );
};

export default Profile;
