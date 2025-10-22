
import mongoose, { isValidObjectId } from "mongoose"
import { Video } from "../models/Video.js"
import { User } from "../models/user.js"
import { Apierror } from "../utils/ApiError.js"
import { Apiresponse } from "../utils/ApiResponse.js"
import { asyncHandler1 } from "../utils/asyncHandler1.js"
import { uplodecloudinaryFile } from "../utils/cloudniary.js"
import jwt from "jsonwebtoken"


const getAllVideos = asyncHandler1(async (req, res) => {
    const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query
    //TODO: get all videos based on query, sort, pagination
})

const publishAVideo = asyncHandler1(async (req, res) => {
    const { title, description } = req.body
    // TODO: get video, upload to cloudinary, create video
    const user = await User.findById(req.user?._id);
    if (!user) {
        throw new Apierror(400, "User is not exist ")
    }
    if (!title) {
        throw new Apierror(400, "Title is empty")
    }

    if (!description) {
        throw new Apierror(400, "Description is empty")
    }

    const videoFileLOcalpath = req.files?.videoFile?.[0]?.path
    const thumbnailLocalpath = req.files?.thumbnail?.[0]?.path

    if (!videoFileLOcalpath) {
        throw new Apierror(400, "Video local path is not exist")
    }

    if (!thumbnailLocalpath) {
        throw new Apierror(400, "Thuminal local path is not existing")
    }

    const videoFile = await uplodecloudinaryFile(videoFileLOcalpath)
    const thumbnail = await uplodecloudinaryFile(thumbnailLocalpath)

    if (!videoFile?.url) {
        throw new Apierror(400, "Video File is not exist")
    }

    if (!thumbnail?.url) {
        throw new Apierror(400, "Thuminal file is not exist")
    }

    const video = await Video.create({
        title,
        description,
        videoFile: videoFile.url,
        thumbnail: thumbnail.url,
        duration: videoFile?.duration || 0,
        owner: req.user?._id
    })


    if (!video) throw new Apierror(500, "Something went wrong while creating video");

    console.log(video);


    const createVideo = await Video.findById(video._id);

    if (!createVideo) {
        throw new Apierror(400, "Somthing went wrong to create the video modal")
    }

    if (!video) {
        throw new Apierror(400,)
    }

    return res.status(200).json(new Apiresponse(200, createVideo, "Video create successfully "))



})

const getVideoById = asyncHandler1(async (req, res) => {
    const { videoId } = req.params
    //TODO: get video by id
    const user = await User.findById(req.user?._id);
    if (!user) {
        throw new Apierror(404, "User is not found")
    }
    if (!videoId) {
        throw new Apierror(400, "VideoId is not found")
    }

    const videoidfind = await Video.findById(videoId)
    if (!videoidfind) {
        throw new Apierror(404, "Video is not found..")
    }

    return res.status(200).json(new Apiresponse(200, videoidfind, "Get the video base on id.."))
})

const updateVideo = asyncHandler1(async (req, res) => {
    const { videoId } = req.params;
    const { title, description } = req.body;
    //TODO: update video details like title, description, thumbnail

    const user = await User.findById(req.user?._id);
    if (!user) {
        throw new Apierror(400, "User is not found")
    }

    if (!videoId) {
        throw new Apierror(400, "VideoId is not exist")

    }
    const video = await Video.findById(videoId);

    if (!video) {
        throw new Apierror(404, "NOT FOUND..")
    }

    if (!title) {
        throw new Apierror(400, "Titlt is require..")
    }

    if (!description) {
        throw new Apierror(400, "Description is requires..")
    }

    const thumbnailLocalpath = req.file?.path;

    if (!thumbnailLocalpath) {
        throw new Apierror(400, "Thuminal Loclapath is not exist")
    }

    const thumbnail = await uplodecloudinaryFile(thumbnailLocalpath);

    if (!thumbnail?.url) {
        throw new Apierror(400, "Thuminal url is not exist...")
    }

    const videoUpdate = await Video.findByIdAndUpdate(
        video,
        {
            $set: {
                title,
                description,
                thumbnail: thumbnail?.url

            }
        },
        {
            new: true
        }
    )

    console.log(videoUpdate);


    if (!videoUpdate) {
        throw new Apierror(400, "Update is not successfully..")
    }

    return res.status(200).json(new Apiresponse(200, videoUpdate, "Video is Update successfully.."))

})

const deleteVideo = asyncHandler1(async (req, res) => {
    const { videoId } = req.params
    //TODO: delete video

    const user = await User.findById(req.user?._id);

    if (!user) {
        throw new Apierror(400, "User is not exist..")
    }
    if (!videoId) {
        throw new Apierror(400, "VideoId is not found")
    }

    const videoidfind = await Video.findById(videoId)
    if (!videoidfind) {
        throw new Apierror(404, "Video is not found..")
    }

    const deleteVideo = await Video.findByIdAndDelete(
        videoidfind
    )

    if (!deleteVideo) {
        throw new Apierror(400, "Delete is not successfully..")
    }

    return res.status(200).json(new Apiresponse(200, deleteVideo, "Delete videos is successfully"))

})

const togglePublishStatus = asyncHandler1(async (req, res) => {
    const { videoId } = req.params

    const user = await User.findById(req.user?._id);

    if (!user) {
        throw new Apierror(400, "User is not exist..")
    }

    if (!videoId) {
        throw new Apierror(400, "VideoId is not found")
    }

    const video = await Video.findById(videoId);

    if (!video) {
        throw new Apierror(400, "Video id is not exist..")
    }

    video.isPublished = !video.isPublished;

    const updatePublishedVideo = await video.save();

    if (!updatePublishedVideo) {
        throw new Apierror(400, "Somthing went wrong because Published error...")
    }

    return res.status(200).json(new Apiresponse(200, updatePublishedVideo, "Published is successfully..."))
})

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
}
