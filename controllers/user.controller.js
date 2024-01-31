import { asyncHandler } from '../utils/asyncHandler.js'
import {ApiError} from '../utils/ApiError.js'
import { User } from '../models/user.models.js'
import {uploadOnCloudinary} from '../utils/cloudinary.js'
import { ApiResponse } from '../utils/ApiResponse.js'
import jwt from "jsonwebtoken"


const generateAccessAndRefreshToken=async(userId)=>{ 
  try{
      const user=await User.findById(userId);
      const accessToken=user.generateAccessToken();
      const refreshToken=user.generateRefreshToken() ;
                                                   
      // user.accessToken=accessToken;
      user.refreshToken=refreshToken;
      
      await user.save({validateBeforeSave:false}) ;

      return {accessToken,refreshToken} ;
    
  } catch(error){
       throw new ApiError(500,"something went wrong while generating access and refresh token");
  } 
};   


const registerUser = asyncHandler(async (req, res) => {
  // get user details from frontend
  // validation -not empty
  // check if user already exists
  // check for images , check for avatar
  // upload them to cloudinary
  // create user object -create entry in db
  // remove password and refresh tokwn field from response
  // check for user-creation 
  // return response

  const {fullName,email,username,password}=req.body
  console.log(req.body)
   /*  
  if(fullName===""){
    throw new ApiError(400,"full name is required")
  }
  */ // but doing one by one is not a good practice
  if(
    [fullName,email,username,password].some((field)=>
    field?.trim()==="")
  ){
     throw new ApiError(400,"all fields are required")
  }

 const existedUser= await User.findOne({
    $or:[{username},{email}]
  })
  if(existedUser){
    throw new ApiError(409,"user with email or username already exists") 
  }
   console.log(req.files)
  const avatarLocalPath= req.files?.avatar[0]?.path;


  //const coverImageLocalPath= req.files?.coverImage[0]?.path;  // -> we should avoid using such segment when something is not necessary
  let coverImageLocalPath;
  if (req.files && Array.isArray(req.files.
    coverImage) && req.files.coverImage.length>0) {
    
      coverImageLocalPath= req.files.coverImage[0]?.path;
  }
  if(!avatarLocalPath){
    throw new ApiError (400,"Avatar file is required")
  }
  // coverImageLocalPath is not much required

  const avatar=await uploadOnCloudinary(avatarLocalPath)
  const coverImage=await uploadOnCloudinary(coverImageLocalPath)

  if (!avatar) {
    throw new ApiError (400,"Avatar upload is required")
  }

  const user= await User.create({
    fullName,
    avatar:avatar.url,
    coverImage:coverImage?.url || "",
    email,
    password,
    username:username
  })   
  const createdUser=await User.findById(user._id).select(
    "-password  -refreshToken" // which data we don't want
  ) 
 
  if(!createdUser) {
    throw new ApiError(500,"something went wrong while registering the user")
  }

  return res.status(200).json(
    new ApiResponse(200,createdUser,"user registered successfullly")
  )

})

const loginUser=asyncHandler(async(req,res)=>{
  //req body-> data
  // username or email
  //find the user
  //password  check
  // access and refresh token
  // send cookies      

  const { email,username,password}=req.body
    
  if(!(username|| email)){
     throw new ApiError(400,"username or email is required")
  } 
  
  const user=await User.findOne({
    $or:[{username},{email}]
  })
  if (!user) {
    throw new ApiError(404,"User doesn't exist");
  }
  const isPasswordValid=await user.isPasswordCorrect(password) 

     
  if(!isPasswordValid){
    throw new ApiError(401,"invalid user credentials")
  }


  const {accessToken,refreshToken} = await generateAccessAndRefreshToken(user._id)
      
  const loggedInUser=await User.findById(user._id)
  .select("-password -refreshToken") 

  const options = 
  {
    httpOnly:true,
    secure:true
  } 
  return res.status(200) 
   .cookie("accessToken",accessToken,options)
   .cookie("refreshToken",refreshToken,options)
  .json(
    new ApiResponse(200,
    {
     user:loggedInUser,accessToken,refreshToken
    },"user logged in successfully after the token"
    ))
  
})  

const logoutUser=asyncHandler(async(req,res)=>{
 await User.findByIdAndUpdate(req.user._id,{
    $unset:{
      refreshToken:1
    }
  },
  {
    new:true
  })

  const options={
    httpOnly:true,
    secure:true
  }
  return res.status(200)
          .clearCookie("accessToken",options)
          .clearCookie("refreshToken",options)
          .json(new ApiResponse(200,{},"user logged out successfully"))
         

})

const refreshAccessToken = asyncHandler(async(req,res)=>{
 try{
  const incomingRefreshToken=req.cookies.refreshToken || req.body.refreshToken

  if(!incomingRefreshToken){
    throw new ApiError(401,"unauthorized request in refreshAccessToken")
  }
  const decodedToken=jwt.verify(
    incomingRefreshToken,process.env.REFRESH_TOKEN_SECRET
  )
  const user=await User.findById(decodedToken?._id)
  if(!user){
    throw new ApiError(401,"invalid refresh token")
  }

  if(incomingRefreshToken!==user?.refreshToken){
    throw new ApiError(401,"refresh token is expired or used");
  }
  const options={
    httpOnly:true,
    secure:true
  }

 const {accessToken,newRefreshToken}= await generateAccessAndRefreshToken(user._id);

 return res
  .status(200)
  .cookie("accessToken",accessToken,options)
  .cookie("refreshToken",newRefreshToken,options)
  .json(
    new ApiResponse(
      200,
      {accessToken,refreshToken:newRefreshToken},
      "ACcess token refreshed successfully"
    )
  )
 }catch(error){
  throw new ApiError(401,error?.message || "invalid refresh token at last")
 }
})

export {registerUser,loginUser,logoutUser,refreshAccessToken}   