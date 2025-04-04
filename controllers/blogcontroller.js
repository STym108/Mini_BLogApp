import { blogdata } from "../models/blog.js";
import { randomBytes, createHmac } from 'crypto'; // Missing imports
import mongoose from "mongoose";
import dotenv from 'dotenv'
dotenv.config()
import jwt from 'jsonwebtoken'

async function alwayscheckblog(req,res,next){
  const token=req.cookies.token
  if(!token||token==="null"||token==="undefined") return res.render('login')
  try{
    const decoder=jwt.verify(token,process.env.JWT_SECRET)
    req.user=decoder
       res.locals.isauthenticated=true;
       next()
  }
  catch(err){

    console.log("blogcheck :token not verified");
    res.locals.isauthenticated=false;
    res.redirect('/user/login')
  }
  }
  export{alwayscheckblog}