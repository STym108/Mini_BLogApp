import { blogCollection } from "../models/users.js";
import { randomBytes, createHmac } from "crypto"; // Missing imports

import dotenv from "dotenv";
dotenv.config();
import jwt from "jsonwebtoken";
async function alwayscheck(req, res,next) {
  const token = req.cookies.token;
  if (!token || token === "null" || token === "undefined")
    return res
      .status(408)
      .json("no token found you cant get into the restricted page");
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    console.log("token verified in alwayscheck middleware")
    req.user=payload
    res.locals.isauthenticated = true;
 next();
  } catch (err) {
    console.log("usercheck :token not verified");
    res.locals.isauthenticated = false;
    res.send({ " alwayscheck :gadbad hai dost": err });
  }
}
async function logincontroller(req, res) {
  const body = req.body;
  const Email = body.Email;
  const userpassword = body.Password;
  if (!Email || !userpassword)
    return res.send("both email or password are required");
  //below getting entire object of user by its email id or first checking ki ye email registered bhi h ya nahi
  const user = await blogCollection.findOne({ Email });
  //rendering wrong password below login form if wrong credentials entered
  if (!user){ return res.render('login',{loginresult:false})}

  const salt = user.Salt;
  const hashedDBpassword = user.Password;
  const hasheduserPassword = createHmac("sha256", salt)
    .update(userpassword)
    .digest("hex");
    //below password vairfication
  if (hasheduserPassword != hashedDBpassword) { return res.render('login',{loginresult:false})}
  //jwt creation
  const i = user._id;
  const e = user.Email;
  const n = user.Name;
  const p=user.Phone;
  const pi=user.ProfileImageurl;
  //below token formation (payload+secret key kept in .env+session expiry)
  const token = jwt.sign(
    { Name: n, _id: i, Email: e ,Phone:p,ProfileImageurl:pi},
    process.env.JWT_SECRET,
    { expiresIn: "20m" }
  );
  res.cookie("token", token, { httpOnly: true, secure: false });
//below: req.session.any_variable =value 
  req.session.isauthenticated = true;
  req.session.username = user.Name;
  req.session.profile=user.ProfileImageurl
  console.log(`token is ${token} and name is ${user.Name}`);
  res.redirect("/");
}

async function logoutcontroller(req, res) {
  console.log("logoutcontroller controller")
  req.session.isauthenticated = false;
  req.session.username = "user";
  req.session.profile="null"
  res.clearCookie("token");
  res.redirect("/");
}

export { logincontroller, logoutcontroller, alwayscheck };


