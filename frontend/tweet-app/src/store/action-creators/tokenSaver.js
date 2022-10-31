export const saveToken = (data) => {
    return {
        type: 'setToken',
        payload: data
    }
}

export const saveTweets = (data) => {
    return {
        type:'savePosts',
        payload: data
    }
}


export const triggerValue = (data) => {
    return {
        type: 'trigger',
        payload: data
    }
}


export const saveUserName = (data) => {
    return {
        type:'setUserName',
        payload:data
    }
}


export const saveUserInfo = (data) => {
    return {
        type:'saveUser',
        payload:data
    }
}