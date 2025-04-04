import express from 'express'
import mongoose from 'mongoose'
import multer from 'multer'
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'
import {blogdata} from '../models/blog.js'
import { blogCollection } from '../models/users.js'
// Get current directory path
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '../public/uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true })
}
const storage=multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,uploadsDir)
    },
    filename:function(req,file,cb){
        cb(null,`${Date.now()}-${file.originalname}`)
    }
});
const upload=multer({storage})
const blogrouter=express.Router()
blogrouter.get('/',(req,res)=>{
        res.render('addblog')
})
blogrouter.post('/',upload.single('coverimage'),async (req,res)=>{
   try{ console.log(req.file)
    console.log(req.body)
    const {title,body}=req.body
    if (!title || !body || !req.file || !req.user) {
        return res.status(400).json({ error: "❌ Missing required fields" });
    }
   const x= await blogdata.create({
     title,body,
     coverimage:`/uploads/${req.file.filename}`,
     createdby:req.user._id
     })
   res.redirect('/')}
     catch(err){
        console.error("Error creating blog:", err);
        res.status(500).json({ error: "Internal server error" }); 
     }
})
blogrouter.get('/:id',async (req,res)=>{
try{
    const id=req.params.id;
    const blog=await blogdata.findById(id).populate('createdby')

    if(!blog) res.render("no blog found ")
        console.log(blog.coverimage)
    res.render('blogcontent',{blog})
}
catch(err){
    console.error(err);
    res.status(500).send('Server error');
}
})
export{blogrouter}