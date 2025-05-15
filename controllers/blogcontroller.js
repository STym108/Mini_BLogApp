import dotenv from 'dotenv'
dotenv.config()
import jwt from 'jsonwebtoken'

async function alwayscheckblog(req, res, next) {
  const token = req.cookies.token;

  // Case 1: No token
  if (!token || token === "null" || token === "undefined") {
    console.log("No token found. Redirecting with authPopup=true");
    return res.redirect(req.originalUrl + (req.originalUrl.includes('?') ? '&' : '?') + 'authPopup=true');
  }

  // Case 2: Token exists but invalid
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload;
    res.locals.isauthenticated = true;
    console.log("inside alwayscheckblog", req.user);
    next();
  } catch (err) {
    console.log("alwayscheckblog: token not verified");
    res.locals.isauthenticated = false;
    return res.redirect(req.originalUrl + (req.originalUrl.includes('?') ? '&' : '?') + 'authPopup=true');
  }
}

export { alwayscheckblog }