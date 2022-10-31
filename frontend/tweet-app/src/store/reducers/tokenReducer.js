const tokenReducer = (state=null,action) => {
    switch(action.type){
        case 'setToken':return{
            state:action.payload
        }
        default:
            return state
    }
}


export default tokenReducer;