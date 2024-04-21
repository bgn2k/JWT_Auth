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
const maxExpiryLimit = 2 * 24 * 60 * 60
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
    res.status(201).json({user});
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
  res.send(`Welcome ${data.username}!\nYou are successfully logged in!`);
};

module.exports = {
  signup_get,
  signup_post,
  login_get,
  login_post,
};
