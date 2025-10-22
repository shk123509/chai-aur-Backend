const option = {
  httpOnly: true,
  secure: true
}
// import { asyncHandler1 } from "../utils/asyncHandler1.js";
// import { Apierror } from "../utils/ApiError.js";
// import { User } from "../models/user.js";
// import { uplodecloudinaryFile } from "../utils/cloudniary.js"
// import { Apiresponse } from "../utils/ApiResponse.js";

// const registerUser = asyncHandler1(async (req, res) => {
//    //    const {fullname, username, email, password } = req.body;

//    //    if(fullname === ""){
//    //     throw new Apierror(400, "Fullname is required")
//    //    }
//    //    if(username === ""){
//    //     throw new Apierror(400, "Fullname is required")
//    //    }
//    //    if(email === ""){
//    //     throw new Apierror(400, "Fullname is required")
//    //    }

//    //    if(password === ""){
//    //     throw new Apierror(400, "Fullname is required")
//    //    }

//    //    const existUser = User.findOne({
//    //       $or : [{username}, {email}]
//    //    })

//    //    if(existUser){
//    //       throw new Apierror(401, "User already exist !")
//    //    }

//    //    const avatarLocalpath = req.files?.avatar[0]?.path;
//    //    const coverImagelocalpath = req.files?.coverImage[0]?.path;

//    //    if(!avatarLocalpath){
//    //       throw new Apierror(400, "Avatar is required !")
//    //    }

//    //   const avatar =  await uplodecloudinaryFile(avatarLocalpath);
//    //   const image = await uplodecloudinaryFile(coverImagelocalpath);

//    //   const user = await User.create({
//    //    fullname,
//    //    email,
//    //    password,
//    //    username,
//    //    avatar : avatar.url,
//    //    image : image?.url || ""
//    //   })
//    //   const createUser = await User.findById("_id").select(
//    //    "-password -refreshToken"
//    //   )

//    //   if(!createUser){
//    //    throw new Apierror(500, "Internal error !")
//    //   }
//    //   return res.status(201).json(
//    //    new Apiresponse(200, createUser, "User is register successfully !")
//    //   )


//    // Get user details from forntend 

//    const { fullName, username, password, emial } = req.body;

//    // Validation check

//    if (fullName === "") {
//       throw new Apierror(400, "Fulll name is require ")
//    }
//    if (emial === "") {
//       throw new Apierror(400, "email is require ")
//    }
//    if (password === "") {
//       throw new Apierror(400, "passwoed is require ")
//    }
//    if (username === "") {
//       throw new Apierror(400, "username is require ")
//    }
//    //   Check if user already exist
//    const existUser = await  User.findOne({
//       $or: [{ emial }, { username }]
//    })

//    if (existUser) {
//       throw new Apierror(400, "User already exist")
//    }
//    // Check for image and avatar
//    const avatarlocalpath = req.files?.avatar[0]?.path;
//    const coverImagelocalpath = req.files?.coverImage[0]?.path;
//    //   Check avatar
//    if (!avatarlocalpath) {
//       throw new Apierror(400, "Somthing went wrong ")

//    }
//    //   Uplode the cloudinary 
//    const avatar = await uplodecloudinaryFile(avatarlocalpath);
//    const coverImage = await uplodecloudinaryFile(coverImagelocalpath);
//    // Check if avatar is exist
//    if (!avatar) {
//       throw new Apierror(400, "Avatar is require")
//    }
//    // Create the user of db
//    const user = await User.create({
//       username,
//       password,
//       fullName,
//       emial,
//       avatar: avatar.url,
//       coverImage : Image?.url || ""
//    })
//    // Remove the password and refershToken
//    const createUser = User.findById(user._id).select(
//       "-password -refreshToken"
//    )
//    // Check for user create 
//    if (!createUser) {
//       throw new Apierror(500, "Some time server is not work")
//    }
//    // Return the res of the User
//    return res.status(201).json(
//      new  Apiresponse(200, createUser, "User is register successfully !")
//    )



// })

// export { registerUser }


import { asyncHandler1 } from "../utils/asyncHandler1.js";
import { Apierror } from "../utils/ApiError.js";
import { User } from "../models/user.js";
import { uplodecloudinaryFile } from "../utils/cloudniary.js";
import { Apiresponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

const generateAccessandRefreshtoken = async (userid) => {
  try {
    const user = await User.findById(userid);
    const accesstoken = user.generateAccessToken();
    const refreshtoken = user.generateRefreshToken();
    user.refreshtoken = refreshtoken;
    await user.save({ validatedBeforeSave: false })
    return { accesstoken, refreshtoken }


  } catch (error) {

  }
}
const registerUser = asyncHandler1(async (req, res) => {
  const { fullName, username, password, email } = req.body;
  console.log(req.body);


  // ✅ Validate fields
  if (!fullName) throw new Apierror(400, "Full name is required");
  if (!email) throw new Apierror(400, "Email is required");
  if (!password) throw new Apierror(400, "Password is required");
  if (!username) throw new Apierror(400, "Username is required");

  // ✅ Check if user already exists
  const existUser = await User.findOne({
    $or: [{ email }, { username }]
  });
  console.log(existUser);


  if (existUser) {
    throw new Apierror(400, "User already exists!");
  }

  // ✅ Check uploaded files
  console.log("FILES:", req.files); // <-- Add this line temporarily to debug

  const avatarLocalPath = req.files?.avatar?.[0]?.path;
  const coverImageLocalPath = req.files?.coverImage?.[0]?.path;

  if (!avatarLocalPath) {
    throw new Apierror(400, "Avatar is required!");
  }

  // ✅ Upload to Cloudinary
  const avatar = await uplodecloudinaryFile(avatarLocalPath);
  const coverImage = coverImageLocalPath
    ? await uplodecloudinaryFile(coverImageLocalPath)
    : null;
  //   let coverImageLocalPath;
  //   if(req.files && Array.isArray(coverImage) && req.files.coverImage.length > 0){
  //    coverImageLocalPath = req.files.coverImage[0].path;
  //   }

  if (!avatar?.url) {
    throw new Apierror(400, "Avatar upload failed");
  }

  // ✅ Create user
  const user = await User.create({
    fullName,
    username,
    email,
    password,
    avatar: avatar.url,
    coverImage: coverImage?.url || ""
  });
  console.log(user);


  // ✅ Exclude sensitive info
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );
  console.log(createdUser);


  if (!createdUser) {
    throw new Apierror(500, "Something went wrong while creating user");
  }

  // ✅ Send response
  return res
    .status(201)
    .json(new Apiresponse(200, createdUser, "User registered successfully!"));
});

const loginUser = asyncHandler1(async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email) {
    throw new Apierror(400, "Username and password give me otherwise not login")
  }
  const user = await User.findOne({
    $or: [{ username }, { email }]
  })

  if (!user) {
    throw new Apierror(400, "User is not exist please check")
  }

  const ispasswordValid = await user.isPasswordCorrect(password);

  if (!ispasswordValid) {
    throw new Apierror(400, "Password is not corrects ")
  }
  const { refreshtoken, accesstoken } = await generateAccessandRefreshtoken(user._id);

  const loggedInuser = await User.findById(user._id).select("-password -refreshToken")

  const option = {
    httpOnly: true,
    secure: true
  }

  return res.status(200).cookie("refreshtoken", refreshtoken, option).cookie("accesstoken", accesstoken, option).json(
    new Apiresponse(200,
      {
        user: loggedInuser,
        accesstoken,
        refreshtoken,


      },
      "User logged In Succesfullly"
    )
  )


})

const logutUser = asyncHandler1(async (req, res) => {
  await User.findOneAndUpdate(
    req.user._id,
    {
      $unset: {
        refreshToken: undefined
      }
    },
    {
      new: true
    }
  )

  const option = {
    httpOnly: true,
    secure: true
  }
  return res.status(200).clearCookie("refreshtoken", option)
    .clearCookie("accesstoken", option).json(new Apiresponse(200, {}, "User logged out successfully"))

})

const refreshAccessToken = asyncHandler1(async (req, res) => {
  const IncomingrefreshToken = req.cookie.refreshToken || req.body.refreshToken
  if (!IncomingrefreshToken) {
    throw new Apierror(401, "unauthroized request")
  }
  try {
    const decodedRefreshToken = jwt.verify(
      IncomingrefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    )
    const user = await User.findById(decodedRefreshToken?._id);

    if (!user) {
      throw new Apierror(401, "Invilid refresh token !")
    }

    if (IncomingrefreshToken !== user?.refreshToken) {
      throw new Apierror(401, "Invilid refresh token ")
    }

    const { accesstoken, newRefreshtoken } = await generateAccessandRefreshtoken(user._id);
    return res.status(200)
      .cookie("accessToken", accesstoken, option)
      .cookie("refreshToken", newRefreshtoken, option)
      .json(
        200,
        {
          newRefreshtoken,
          accesstoken
        },
        "Successfully generate accessToken"

      )
  } catch (error) {
    throw new Apierror(401, error?.message || "Invilid refresh token"
    )
  }


})

const getcurrentUser = asyncHandler1(async (req, res) => {
  return res.status(200).json(200, req.user, "Current user Fetch successfully ")
})

const currentUserCurrentPasswordChange = asyncHandler1(async (req, res) => {
  const { oldpassword, newpassword, conformPassword } = req.body;
  const user = await User.findById(req.user?._id);
  if (!(newpassword === conformPassword)) {
    throw new Apierror(400, "Conform password is not currect")
  }
  if (!user) {
    throw new Apierror(401, "User is not login")
  }
  const isPASSWORDCURRECT = await user.isPasswordCorrect(oldpassword)
  if (!isPASSWORDCURRECT) {
    throw new Apierror(401, "oldpassword is not currect please check and try again")
  }
  //  newpassword = user.password;
  user.password = newpassword
  await user.save({ validatedBeforeSave: false })


  return res.status(200)
    .json(
      new Apiresponse(200, user, "password is changed successfully ")
    )
})

const UpdateAccountUser = asyncHandler1(async (req, res) => {
  const { fullName, username, email } = req.body;
  if (!fullName) {
    throw new Apierror(400, "Fullname is required")
  }
  if (!email) {
    throw new Apierror(400, "Email is required")
  }
  if (!username) {
    throw new Apierror(400, "Username is required")
  }
  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        fullName, username, email
      }
    },
    {
      new: true
    }
  ).select("-password")
  return res.status(200)
    .json(new Apiresponse(200, user, "All fildes is Update Successfully !"))
})

const changeAvatarofUser = asyncHandler1(async (req, res) => {
  const avatarLocalpath = req.file?.path;
  if (!avatarLocalpath) {
    throw new Apierror(400, "Locla path is not exist")
  }

  const avatar = await uplodecloudinaryFile(avatarLocalpath);
  if (!avatar?.url) {
    throw new Apierror(400, "Url is not exist")
  }

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        avatar: avatar?.url
      }
    },
    {
      new: true
    }
  ).select("-password")

  return res.status(200)
    .json(new Apiresponse(200, user, "Avatar is Updated successfully "))
})

const changedCoverImages = asyncHandler1(async (req, res) => {
  const localCoverImages = req.file?.path;

  if (!localCoverImages) {
    throw new Apierror(400, "Loclapath is not exist of the coverImages")
  }

  const coverImage = await uplodecloudinaryFile(localCoverImages);

  if (!coverImage?.url) {
    throw new Apierror(400, "Url is not exist please Check and try again")
  }

  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        coverImage: coverImage.url
      }
    },
    {
      new: true
    }
  ).select("-password")

  return res.status(200)
    .json(
      new Apiresponse(200, user, "CoverImage is update successfully ")
    )
})

const getcurrentuserchannel = asyncHandler1(async (req, res) => {
  const { username } = req.params;

  if (!username?.trim()) {
    throw new Apierror(400, "User cna not exist ")
  }

  const channel = await User.aggregate([
    {
      $match: {
        username
      }
    },
    {
      $lookup: {
        from: "subscriptions",
        localField: "_id",
        foreignField: "channel",
        as: "subscribers" 
      }
    },
    {
      $lookup: {
        from: "subscriptions",
        localField: "_id",
        foreignField: "subscription",
        as: "subscribersTO"
      }
    },
    {
      $addFields: {
        subcriberCount: {
          $size: "$subscribers"
        },
        channelsSubscriberdTOCount: {
          $size: "$subscribersTO"
        },
        isSubscribed: {
          $cond: {
            if: { $in: [req.user?._id, "$subscribers.subscription"] },
            then: true,
            else: false
          }
        }
      }
    },
    {
      $project: {
        fullName: 1,
        email: 1,
        username: 1,
        subcriberCount: 1,
        channelsSubscriberdTOCount: 1,
        isSubscribed: 1,
        avatar: 1,
        coverImage: 1
      }
    }

  ])



  if (!channel?.length) {
    throw new Apierror(404, "NOT FOUND")
  } 

  console.log(channel);
  

  return res.status(200).json(
    new Apiresponse(200, channel[0], "User profiles featch successfully ")
  )
})

const getCurrentUserHistory = asyncHandler1(async(req, res) =>{
  const user = await User.aggregate([
    {
      $match : {
        _id : new mongoose.Types.ObjectId(req.user?._id)
      }
    },
    {
      $lookup : {
        from : "videos",
        localField : "watchHistory",
        foreignField : "_id",
        as : "WahtchsHistory",
        pipeline : [
          {
            $lookup : {
              from : "users",
              localField : "owner",
              foreignField : "_id",
              as : "owner",
              pipeline: [
                {
                  $project : {
                    fullName : 1,
                    avatar : 1, 
                    coverImage : 1
                  }
                }
              ]
            }
          },
          {
            $addFields : {
              owner : {
                $first :"$owner"
              }
            }
          }
        ]
      }
    }
  ])

  if (!user?.length) {
    throw new Apierror(404, "NOt FOUND")
  }

  console.log(user);

  return res.status(200)
  .json(new Apiresponse(200, user[0].watchHistory, "User History fetch successful"))
  
})


export {
  registerUser,
  loginUser,
  logutUser,
  refreshAccessToken,
  getcurrentUser,
  currentUserCurrentPasswordChange,
  UpdateAccountUser,
  changeAvatarofUser,
  changedCoverImages,
  getcurrentuserchannel,
  getCurrentUserHistory
};
