import express from 'express'
import {otpVhandler,Vhandler} from '../controllers/ForgotPassword.js'
import {blogCollection} from '../models/users.js'
import {logincontroller,logoutcontroller,alwayscheck} from '../controllers/user.js'
import multer from 'multer'
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'
import { randomBytes, createHmac } from 'crypto'; // for password updation , hashing the new password

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
const router=express.Router()

router.get('/signup',(req,res)=>{
    res.render('signup')
})
router.post('/signup',upload.single('ProfileImageurl'),async(req,res)=>{
    const user=req.body;
    if (!req.file) {
        return res.status(400).send("❌ No profile image uploaded.");
      }
  if(req.body.Password!=req.body.Confirm_Password) return res.render('signup',{confirmpassword:false})
    const checkduplicate = await blogCollection.findOne({ Email:user.Email });
    if(checkduplicate) return res.render('signup',{dupliresult:false})
   await blogCollection.create({
   Name:user.Name,
   Email:user.Email,
   Phone:user.Phone,
   ProfileImageurl:`/uploads/${req.file.filename}`,
      Password:user.Password
   });
  res.redirect('/')
})
router.get('/login',(req,res)=>{
    res.render('login')
})
router.get('/logout',logoutcontroller)
router.post('/login',logincontroller)// login verification done in controller
//account update 
router.get('/Account',alwayscheck,async (req,res)=>{
    res.render('AccountDetails', { user: req.user })
})

router.post('/Account/update', alwayscheck, upload.single('ProfileImageurl'), async (req, res) => {
    try {
        console.log("Inside update handler");
        console.log("Uploaded file:", req.file);
        console.log("Form body:", req.body);

        const { Name, Email, Phone } = req.body;

        if (!Name || !Email || !Phone || !req.user) {
            return res.status(400).json({ error: "❌ Missing required fields" });
        }

        // Prepare update object
        const updateFields = { Name, Email, Phone };

        // Add profile image only if file was uploaded
        if (req.file) {
            updateFields.ProfileImageurl = `/uploads/${req.file.filename}`;
        }

        await blogCollection.findByIdAndUpdate(req.user._id, updateFields);


         // ✅ Fetch updated user
       const updatedUser = await blogCollection.findById(req.user._id);

       // Render page with updated info
       res.render('AccountDetails', { user: updatedUser });
    } catch (err) {
        console.error("Error during account update:", err);
        res.status(500).json({ error: "Internal server error while updation" });
    }
});
//below rendering the forgot password page after clicking forgot password in the login section 
 router.get('/emailV',(req,res)=>{
    return res.render('ForgotPswrd',{ EmailExists: undefined })

 })
 

//Forgot password route
router.post('/emailV',otpVhandler)

router.post('/verification',Vhandler)
//below new password making after email verification
router.post('/passwordupdate', async (req,res)=>{
    try{const {Email,newpass,confirmnewpass}=req.body
    if(!Email||!newpass||!confirmnewpass) return res.render('ForgotPswrd',{allfieldsPresent:false})
    const finduser=await blogCollection.findOne({Email});
    const salt=finduser.Salt

    const new_hashedpassword=createHmac("sha256",salt)
    .update(newpass)
    .digest("hex")
   await blogCollection.findByIdAndUpdate(finduser._id,{Password:new_hashedpassword})
   return res.render('login')
    }
    catch(error){
        console.log(`the error is : ${error}`)
        return res.render(error)
    }
})
export{router}