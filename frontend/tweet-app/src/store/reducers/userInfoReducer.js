const initialState = {
    writingType: "saveUser",
    user: {
        firstName:"",
        lastName:"",
        avatar:"",
        avatarType:"",
        gender:"",
        email:"",
        contactNumber:"",
        dob:"",
        allTweets:[],
        accountCreationDate:"",
        verified:false,
        loginId:""
      }
}

const userInfoReducer = (state=initialState,action) => {
    switch(action.type){
        case 'saveUser':return{
            ...state,
            user:action.payload
        }
        default:
            return state
    }
}


export default userInfoReducer;