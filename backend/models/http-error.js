class HttpError extends Error{
    constructor(message, errorCode){
        super(message);
        this.code = errorCode;
    }

    displayInfo = () => {
        const error = {
            message: this.message,
            code: this.code
        }
        return error;
    }
}

export default HttpError;