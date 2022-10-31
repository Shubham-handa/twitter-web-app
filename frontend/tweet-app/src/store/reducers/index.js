import {combineReducers} from "redux";
import tokenReducer from "./tokenReducer";
import tweetsReducer from "./tweetsReducer";
import userNameReducer from "./userNameReducer";
import userInfoReducer from "./userInfoReducer";
import triggerReducer from "./triggerReducer";



export const reducers = combineReducers({
    saveToken: tokenReducer,
    savePostData: tweetsReducer,
    setUserName:userNameReducer,
    saveUser:userInfoReducer,
    triggerValue:triggerReducer
})