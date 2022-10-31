class ResponseDTO {
    constructor(responseInformation, responseCode) {
        this.responseInformation = responseInformation,
        this.responseCode = responseCode
    }


    sendInfo = () => {
        const response = {
            responseInformation: this.responseInformation,
            responseCode: this.responseCode
        }
        return response
    }

}

export default ResponseDTO;