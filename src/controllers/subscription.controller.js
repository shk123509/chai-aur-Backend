
// import mongoose, {isValidObjectId} from "mongoose"
import {User} from "../models/user.js"
import { Subscription } from "../models/subscription.model.js"
import {Apierror} from "../utils/ApiError.js"
import {Apiresponse} from "../utils/ApiResponse.js"
import {asyncHandler1} from "../utils/asyncHandler1.js"
// import { use } from "react"


const toggleSubscription = asyncHandler1(async (req, res) => {
    // TODO: toggle subscription
    const {channelId} = req.params

    if (!channelId) {
        throw new Apierror(400, "Channel id is require...")
    }

    const userId = req.user._id;


    const chkSubscribed = await Subscription.findOne(
        {
           subscription: userId,
           channel: channelId
        }
    )

    const SubscribedTo = chkSubscribed ? true : false
    //   const SubscribedTo = !!chkSubscribed


    return res.status(200).json(new Apiresponse(200, SubscribedTo, "Fetch the isSubscriber..."))
    


    
})

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler1(async (req, res) => {
    const {channelId} = req.params

    const user = await User.findById(req.user?._id);

    if (!user) {
        throw new Apierror(400, "User can not exist...")
    }

    if (!channelId) {
        throw new Apierror(400, "Channel id is require...")
    }

    const channelfind = await Subscription.findById(channelId);

// if (!channelfind || channelfind.length === 0) {
//     throw new Apierror(404, "No subscribers found for this channel");
//   }

    return res.status(200).json(new Apiresponse(200, channelfind, "successfully fetch the user channel"))

})

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler1(async (req, res) => {
    const { subscriberId } = req.params

    const user = await User.findById(req.user?._id);

    if (!user) {
        throw new Apierror(400, "User can not exist...")
    }

    if (!subscriberId) {
        throw new Apierror(400, "Sucscriber id is require...")
    }

    const subscribed = await Subscription.findById(subscriberId);

    return res.status(200).json(new Apiresponse(200, subscribed, "Successfully fetch the subscribed user.."))
})

export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
}
