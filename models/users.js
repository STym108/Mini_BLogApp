import mongoose from 'mongoose'
import { randomBytes, createHmac } from 'crypto'; // Missing imports
import { type } from 'os';

const userschema=mongoose.Schema({
    Name:{
        type:String,
        required:true,
    },
    Email:{
        type:String,
        required:true,
        unique:true
    },
    Phone:{
        type:Number,
        required:true,
        unique:true
    },
    Password:{
        type:String,
        required:true,
    },
    ProfileImageurl:{
        type:String,
        default:'/public/profileavatar.avif',
    },
    Salt:{
        type:String
    }
},{timestamps:true})

userschema.pre("save",function (next){
    const user=this
    if(!user.isModified('Password')) return ;

    const Salt=randomBytes(16).toString();
    const hashedpassword=createHmac("sha256",Salt)
    .update(user.Password)
    .digest("hex")

    this.Salt=Salt
    this.Password=hashedpassword

    next()
});

const blogCollection=mongoose.model("blogCollection",userschema)
export{blogCollection};

