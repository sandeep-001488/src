// import dotenv from 'dotenv';
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import  jwt  from "jsonwebtoken";
import { User } from "../models/user.models.js";

// dotenv.config();
// console.log(process.env.ACCESS_TOKEN_SECRET);

export const verifyJWT = asyncHandler(async(req,_,next)=>{   // since 'res' is not used so we used '_'
   try{
    const token=req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ","")

    if(!token){
        throw new ApiError(401,"Unauthorized request")
    }
    const decodedToken=jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)

    const user= await User.findById(decodedToken?._id) 
    .select("-password -refreshToken") 
    
    if(!user){
        // todo discussion about frontend
        throw new ApiError(401,"Invalid Access Token in try method")
    }
    req.user=user;
    next();
   }catch(error){
          throw new ApiError(401,error?.message || "invalid access token")
   }
})