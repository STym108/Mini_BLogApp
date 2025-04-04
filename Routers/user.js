import express from 'express'
import mongoose from 'mongoose'
import {blogCollection} from '../models/users.js'
import {logincontroller,logoutcontroller,alwayscheck} from '../controllers/user.js'
const router=express.Router()


router.get('/signup',(req,res)=>{
    res.render('signup')
})
router.post('/signup',async(req,res)=>{
    const user=req.body;
   await blogCollection.create({
   Name:user.Name,
   Email:user.Email,
   Phone:user.Phone,
   Password:user.Password
   });
  res.render('homepage')
})
router.get('/login',(req,res)=>{
    res.render('login')
})

router.get('/logout',logoutcontroller)


router.post('/login',logincontroller)// login verification done in controller

export{router}