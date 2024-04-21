const mongoose = require("mongoose");
const {isEmail} = require('validator')
const bcyrpt = require('bcrypt')
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true,'Please enter a valid email address'],
    unique: true,
    lowercase: true,
    validate : [isEmail, 'Please enter a valid email address']
  },
  password: {
    type: String,
    required: [true,'Please enter a valid password'],
    minlength: [6, 'Password must contain more than 6 characters'],
  },
});
userSchema.pre('save', async function(next){
  //this keyword insided this function refers to the current user instance
  //current instances in the sense that the user.create() funciton is triggered that time we are considering the instances rfor the mongoose hooks that the instance we are intrested in as of now.
console.log('Just before saving the user to the DB.', this)
//Encrypting the password
//For encryption you just install bcrypt and generate the salt string and combine the hashing algo and viola! you have your encrypted password.
const salt = await bcyrpt.genSalt()
this.password = await bcyrpt.hash(this.password, salt)
console.log('Encrypted Password: ',this.password)
next()
})
userSchema.post('save', function(doc, next) {
  console.log('New user created and saved', doc)
  next()
})
const User = mongoose.model("user", userSchema);
module.exports = User;
