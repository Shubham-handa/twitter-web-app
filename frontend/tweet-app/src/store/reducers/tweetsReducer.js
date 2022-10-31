const tweetReducer = (state=null,action) => {
    switch(action.type){
        case 'savePosts':return{
            state:action.payload
        }
        default:
            return state
    }
}


export default tweetReducer;