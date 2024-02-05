import mongoose from "mongoose";
import { Comment } from "../models/comment.models";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/asyncHandler";

const getVideoComments= asyncHandler(async(req,res)=>{
    // TODO get all comments for a video
    const {videoId}=req.body
    const {page=1,limit=10}=req.query
})

const addComment=asyncHandler(async(req,res)=>{
    // TODO : add a comment for a video
    
})

const updateComment=asyncHandler(async(req,res)=>{
    // update a comment
})

const deleteComment=asyncHandler(async(req,res)=>{
    // delete a comment
})

export {
    getVideoComments,
    addComment,
    updateComment,
    deleteComment
}