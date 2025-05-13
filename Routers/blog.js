import express from 'express'

import multer from 'multer'
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'
import {blogdata} from '../models/blog.js'
import {commentcollection} from '../models/comment.js'
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
blogrouter.get('/:blogId',async (req,res)=>{
try{
    const id=req.params.blogId;
    const blog=await blogdata.findById(id).populate('createdby')

    const comments=await commentcollection.find({}).populate('createdby');
    if(!blog) return res.render("no blog found ")
        console.log(blog.coverimage)
    res.render('blogcontent',{blog,comments})
}
catch(err){
    console.error(err);
    res.status(500).send('Server error');
}
})
//commment section router 

blogrouter.post('/:blogId/comment',async (req,res)=>{
    const body=req.body
    const blogid=req.params.blogId
try{
    if(!body.content) return res.status(400).json({ error: "❌ Missing required fields.." })
const user_name=await blogCollection.findById(req.user._id)
  const newcomment=await commentcollection.create({
content:body.content,
createdby:req.user._id,
blogId:blogid,
})
return res.redirect(`/addblog/${blogid}`)}

catch(err){
    console.error("❌ Error while saving comment:", err)
    return res.status(400).json({ error: "error occured while making a new comment" })
}
}
)

export{blogrouter}