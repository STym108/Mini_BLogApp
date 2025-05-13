import otpgenerator from 'otp-generator'
import nodemailer from 'nodemailer'
import dotenv from "dotenv"
import {blogCollection} from '../models/users.js'
dotenv.config();
console.log(`${process.env.Email_id}`)
console.log(`${process.env.App_password}`)
const temp={};

async function otpVhandler(req,res){
const {Email}=req.body;
const finduser = await blogCollection.findOne({ Email });

if(!Email||!finduser)  return res.render('ForgotPswrd',{EmailExists:false})

const otp=otpgenerator.generate(6,{digits:true,alphabets:false,specialChars:false})
temp[Email]=otp

const transporter =nodemailer.createTransport({
service:'gmail',
auth:{
user:process.env.Email_id,
pass:process.env.App_password
}

})

const sendinginfo={
from:process.env.Email_id,
to:Email,
subject:'your verification code',
text:`this is your one time email verification code : ${otp}`
}

try{
    await transporter.sendMail(sendinginfo);
  
    return res.render('ForgotPswrd',{EmailExists:true,verificationresult:'undefined'})
}
catch(err){
    res.json(`the error : ${err}`)
}

}

//verification code 

async function Vhandler(req,res){
const {Email,otp}=req.body
if(!Email||!otp) return res.render("both fields are required buddy")

    if(temp[Email]==otp){
        delete temp[Email];
        return res.render('ForgotPswrd',{verificationresult:true,Email,EmailExists:true})
    }
    else res.json("Wrong verification code")
}


export{
    otpVhandler,Vhandler
}