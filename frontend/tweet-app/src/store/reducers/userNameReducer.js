const userNameReducer = (state=null,action) => {
    switch(action.type){
        case 'setUserName':return{
            state:action.payload
        }
        default:
            return state
    }
}


export default userNameReducer;