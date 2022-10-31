const triggerReducer = (state=1,action) => {
    switch(action.type){
        case 'trigger':return{
            state:action.payload
        }
        default:
            return state
    }
}


export default triggerReducer;