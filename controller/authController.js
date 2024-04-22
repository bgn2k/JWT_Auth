const jwt = require("jsonwebtoken");
const User = require("../model/User");
const cookieParser = require("cookie-parser");

const handleError = (err) => {
  console.log(err.message, err.code)
  let errors = {email : '', password : ''}
  if(err.code === 11000){
      errors.email = 'User already exists! Please try again'
    return errors
  }
  if(err.message.includes('user validation failed')){
    Object.values(err.errors).forEach(({properties}) => {
      errors[properties.path] = properties.message
    })
  }
  return errors
}
//days * hours * mins * secs
const maxExpiryLimit = 3 * 60 * 60
const createToken = (id) => {
  return jwt.sign({id}, 'life sucks', {
    expiresIn : maxExpiryLimit
  })
}

const signup_get = async (req, res) => {
  res.render("signup");
};

const signup_post = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.create({ email, password });
    const token = createToken(user._id)
    res.cookie('jwt', token, {httpOnly : true,maxAge : maxExpiryLimit * 1000})
    res.status(201).json({user : user._id});
  } catch (err) {
    const errBody = handleError(err)
    res.status(500).json({errBody});
  }
};

const login_get = async (req, res) => {
  res.render("login");
};

const login_post = async (req, res) => {
  const { email, password } = req.body;  
  console.log('Email & Password form UI in here = ', email, password)
  try {
    const user = await User.login(email, password)
    console.log({user : user._id})
    res.status(200).json({user : user._id})
  } catch (error) {
    console.log('Something wrong here')
    res.status(400).json({message : error.message})
  }
};

module.exports = {
  signup_get,
  signup_post,
  login_get,
  login_post,
};
