
import {Apierror} from "../utils/ApiError.js"
import {Apiresponse} from "../utils/ApiResponse.js"
import {asyncHandler1} from "../utils/asyncHandler1.js"


const healthcheck = asyncHandler1(async (req, res) => {
    //TODO: build a healthcheck response that simply returns the OK status as json with a message

    return res.status(200).json(new Apiresponse(200, "", "All is ok.."))
})

export {
    healthcheck
    }
    
