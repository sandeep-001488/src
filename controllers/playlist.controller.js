import mongoose,{isValidObjectId} from "mongoose";
import { Playlist } from "../models/playlist.models";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/asyncHandler";

const createPlaylist=asyncHandler(async(req,res)=>{
    const {name,description}=req.body

    //TODO create playlist
})

const getUserPlaylists =asyncHandler(async(req,res)=>{
    const {userId}=req.params
    // TODO : get user playlist
})

const getPlaylistById=asyncHandler(async(req,res)=>{
    const {playlistId,videoId}=req.params

})
const addVideoToPlaylist=asyncHandler(async(req,res)=>{
    const {playlistId,videoId}=req.params
})

const removeVideoFromPlaylist=asyncHandler(async(req,res)=>{
    const {playlistId,videoId}=req.params
    //TODO : remove video from playlist
})

const deletePlaylist=asyncHandler(async(req,res)=>{
    const {playlistId}=req.params
    //TODO:delete playlist
})

const updatePlaylist=asyncHandler(async(req,res)=>{
    const {playlistId}=req.params
    const{name,description}=req.body
    // TODO :update playlist
})

export {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist
}