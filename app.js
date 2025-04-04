import express from 'express'
import dotenv from 'dotenv'
dotenv.config();
import { connectwithmongo } from './connection.js';
import cookieParser from 'cookie-parser'
import session from 'express-session'
import {router} from './Routers/user.js'
import { blogrouter } from './Routers/blog.js';
import { alwayscheck } from './controllers/user.js';
import {alwayscheckblog} from './controllers/blogcontroller.js'
import {blogdata} from './models/blog.js'
import { blogCollection } from './models/users.js';
import path from 'path';
const app=express()

// Serve the uploads folder as static
app.set("view engine",'ejs');
 app.use(cookieParser()) 
app.use(express.json())
app.use(express.static('public')); 
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.resolve('./public')))
const mongourl=process.env.url;
connectwithmongo(mongourl);

///niche vale 2 middlewares bas isauthenticated ke liye hai taki jab signin kar jau to navbar me logout dikhe or jab logut kar jau to login dikhe 

app.use(session({
    secret: process.env.SESSION_SECRET || 'your_secret_key',  // Ensure SECRET is set
    resave: false,
    saveUninitialized: true
}));
app.use((req, res, next) => {
    res.locals.isauthenticated = req.session.isauthenticated || false; 
    res.locals.username=req.session.username||'user'
    next();
});
app.use('/user',router)
app.use('/addblog',alwayscheckblog,blogrouter)

app.get('/',async (req,res)=>{
    const blogs=await blogdata.find({})
 
    res.render('homepage',{blogs})
})

app.listen(process.env.port||5002,()=>{
console.log(`listening on the port ${process.env.port}....`)
})