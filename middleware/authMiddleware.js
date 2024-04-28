const jwt = require("jsonwebtoken");
const User = require("../model/User");

const requireAuth = (req, res, next) => {
  const token = req.cookies.jwt;
  //We need to check if the json web token is present and valid
  if(token){
    jwt.verify(token, 'life sucks', (err, decodedToken) => {
        if(err){
            console.log(err.message)
            res.redirect('/login')
        }
        console.log(decodedToken)
        next();

    })
  }
  else{
    res.redirect('/login')
  }
};
// In request there will COOKIES and in Response there will be COOKIE without an "S"
//Check User
const checkUser = (req, res, next) => {
const token = req.cookies.jwt
  //We need to check if the json web token is present and valid
  if(token){
    jwt.verify(token, 'life sucks',async (err, decodedToken) => {
        if(err){
            console.log(err.message)
            res.locals.user = null
            next()
        }else{
        console.log(decodedToken)
        let user = await User.findById(decodedToken.id)//Here you should note that the id is not _id as per the MongoDB its id.
        res.locals.user = user
        next();            
        }

    })
  }
  else{
    res.locals.user = null
    next()
  }
}
module.exports = {requireAuth, checkUser}