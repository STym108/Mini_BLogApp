import { blogCollection } from "../models/users.js";
import { randomBytes, createHmac } from "crypto"; // Missing imports
import mongoose from "mongoose";
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
    req.user=payload._id
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
  const user = await blogCollection.findOne({ Email });
  if (!user) return res.send("user not found/email is wrong ");
  const salt = user.Salt;
  const hashedDBpassword = user.Password;
  const hasheduserPassword = createHmac("sha256", salt)
    .update(userpassword)
    .digest("hex");
  if (hasheduserPassword != hashedDBpassword) return res.send("Wrong Password");
  //jwt creation
  const i = user._id;
  const e = user.Email;
  const n = user.Name;

  const token = jwt.sign(
    { Name: n, _id: i, Email: e },
    process.env.JWT_SECRET,
    { expiresIn: "20m" }
  );

  res.cookie("token", token, { httpOnly: true, secure: false });
  // res.locals.isauthenticated=true;
  // res.locals.username=body.Name
  req.session.isauthenticated = true;
  req.session.username = user.Name;
  console.log(`token is ${token} and name is ${user.Name}`);
  res.redirect("/addblog");
}

async function logoutcontroller(req, res) {
  console.log("logoutcontroller controller")
  req.session.isauthenticated = false;
  req.session.username = "user";
  res.clearCookie("token");
  res.redirect("/");
}

export { logincontroller, logoutcontroller, alwayscheck };
