
import mongoose, { isValidObjectId } from "mongoose"
import { Tweet } from "../models/tweet.js"
import { User } from "../models/user.js"
import { Apierror } from "../utils/ApiError.js"
import { Apiresponse } from "../utils/ApiResponse.js"
import { asyncHandler1 } from "../utils/asyncHandler1.js"

const createTweet = asyncHandler1(async (req, res) => {
    //TODO: create tweet
    const { content } = req.body;

    const user = await User.findById(req.user?._id);

    if (!user) {
        throw new Apierror(400, "User is not exist..")
    }

    if (!content || content.trim() === "") {
        throw new Apierror(400, "Content is require...")
    }

    const tweet = await Tweet.create(
        {
            content,
            owner: req.user?._id
        }
    )

    if (!tweet) {
        throw new Apierror(400, "Somting went wrong while creating tweet.")
    }

    const createTweet = await Tweet.findById(tweet?._id);

    if (!createTweet) {
        throw new Apierror(400, "Somting went wrong while creating models")
    }

    return res.status(200).json(new Apiresponse(200, createTweet, "Tewwt is creating successfully.."))


})

const getUserTweets = asyncHandler1(async (req, res) => {
    const { userId } = req.params;

    if (!userId) {
        throw new Apierror(400, "User ID is required.");
    }

    const user = await User.findById(userId);
    if (!user) {
        throw new Apierror(404, "User does not exist.");
    }

    const getTweetsOfTheUser = await Tweet.find({ owner: userId }).sort({ createdAt: -1 });

    if (getTweetsOfTheUser.length === 0) {
        throw new Apierror(404, "User has no tweets.");
    }

    return res.status(200).json(
        new Apiresponse(200, getTweetsOfTheUser, "User tweets fetched successfully.")
    );
});

const updateTweet = asyncHandler1(async (req, res) => {
    //TODO: update tweet
    const { tweetId } = req.params;

    const { content } = req.body;

    if (!content) {
        throw new Apierror(400, "Content is require...")
    }

    const user = await User.findById(req.user?._id);

    if (!user) {
        throw new Apierror(400, "User is not exist...")
    }

    if (!tweetId) {
        throw new Apierror(400, "Tweet id is require...")
    }

    const TweetOwner = await Tweet.findById(tweetId);

    if (TweetOwner.owner.toString() !== req.user._id.toString()) {
        throw new Apierror(403, "You are not allowed to update this tweet.");
    }

    const updateTweet = await Tweet.findByIdAndUpdate(
        tweetId,
        {
            $set: {
                content
            }

        },
        {
            new: true
        }
    )

    if (!updateTweet) {
        throw new Apierror(400, "Updates is not successfully of the user Tweeter...")
    }

    return res.status(200).json(new Apiresponse(200, updateTweet, "Update the tweet successfully..."))

})

const deleteTweet = asyncHandler1(async (req, res) => {
    //TODO: delete tweet
    const {tweetId} = req.params;
    
    const user = await User.findById(req.user?._id);

    if (!user) {
        throw new Apierror(400, "User is not exist...")
    }

    if (!tweetId) {
        throw new Apierror(400, "Tweet id is require");
    }

    const OwnerTweet = await Tweet.findById(tweetId);

    if (!OwnerTweet) {
        throw new Apierror(404, "Tweet not found.");
    }

    if (OwnerTweet.owner.toString() !== req.user._id.toString()) {
        throw new Apierror(403, "You are not allowed to deleting this tweet.");
    }

    const deleteTweet = await Tweet.findByIdAndDelete(
        tweetId
    )

    
    if (!deleteTweet) {
        throw new Apierror(400, "Tweet is not delete successfully...")
    }

    return res.status(200).json(new Apiresponse(200, deleteTweet, "Deleting the Tweet of the user..."))
    
})

export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
}
