
import dotenv from 'dotenv'
dotenv.config()
import jwt from 'jsonwebtoken'

async function alwayscheckblog(req,res,next){
  const token=req.cookies.token
  if(!token||token==="null"||token==="undefined") return res.render('login')
  try{
    const payload=jwt.verify(token,process.env.JWT_SECRET)
    req.user=payload //this req.user have all the payload details (the details filled in the jwt token while making it)
    //this req.user will be used while creating any blog (when the blog creation form would be open firstly this middleware would be called so we will 
    //get req.user in the post request processing of the form details )
    console.log("inside alwayscheckblog", req.user)
       res.locals.isauthenticated=true;
       next()
  }
  catch(err){

    console.log("alwayscheckblog :token not verified");
    res.locals.isauthenticated=false;
    res.redirect('/user/login')
  }
  }
  export{alwayscheckblog}