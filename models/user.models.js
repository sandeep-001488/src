// import dotenv from 'dotenv';
import mongoose,{Schema} from 'mongoose'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'


// dotenv.config();

const userSchema=new mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true,
        
    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true,
        index:true
    },
    fullName:{
        type:String,
        required:true,
        trim:true,
        index:true
    },
    avatar:{
        type:String, // cloudinary url
        required:true,
    },
    coverImage:{
        type:String, // cloudinary url
    },
    watchHistory:{
        type:Schema.Types.ObjectId,
        ref:"Video"
    },
    password:{
        type:String,
        required:[true,"password required"],
    },
    refreshToken:{
        type:String
    }

},{timestamps:true}) ;

userSchema.pre("save", async function(next){
     if(!this.isModified("password")) return next();

     this.password=await bcrypt.hash(this.password,10)
     next()
})
userSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password,this.password)
}
console.log("hello ",process.env.ACCESS_TOKEN_SECRET);

userSchema.methods.generateAccessToken= function (){
   return  jwt.sign({
        _id:this._id,
        email:this.email,
        username:this.username,
        fullName:this.fullName   // changed fullname to fullName
    },process.env.ACCESS_TOKEN_SECRET, // ERROR FOUND IN 10 DAYS
    {
        expiresIn:process.env.ACCESS_TOKEN_EXPIRY
    })
}
userSchema.methods.generateRefreshToken=function (){
    return  jwt.sign({
        _id:this._id,
    },process.env.REFRESH_TOKEN_SECRET, // ERROR FOUND IN 10 DAYS
    {
        expiresIn:process.env.REFRESH_TOKEN_EXPIRY
    })
}
export const User= mongoose.model("User",userSchema)

// note:- if export is default then we import User from address
//          otherwise we import {User} from address