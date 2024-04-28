const jwt = require("jsonwebtoken");
const User = require("../model/User");
const cookieParser = require("cookie-parser");

const handleError = (err) => {
  console.log(err.message, err.code)
  let errors = {email : '', password : ''}

  //incorrect email : 
if(err.message === 'incorrect email')
{
  errors.email = 'User is not registered. Kindly sign in'
}
if(err.message === 'incorrect password')
{
  errors.password = 'Invalid credentials! Kindly check again'
}

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
    const token = createToken(user._id)
    res.cookie('jwt', token, {httpOnly : true, maxExpiryLimit})
    res.status(200).json({user : user._id})
  } catch (error) {
    console.log('Something wrong here when clicked on the login button')
    const errors = handleError(error)
    res.status(400).json({errors})
  }
};

const logout_get = async (req, res) => {
  res.cookie('jwt', '', {maxExpiryLimit : 1})
  res.redirect('/login')
}

module.exports = {
  signup_get,
  signup_post,
  login_get,
  login_post,
  logout_get
};
