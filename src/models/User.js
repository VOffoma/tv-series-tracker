import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();


const userSchema = mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Please provide username'],
    match: [/^[a-zA-Z0-9._-]+$/, 'A valid username is made of letters, numbers and special characters like ., _, -'],
    minlength: [6, 'Your username should be atleast 6 characters'],
  },
  email: {
    type: String,
    required: [true, 'Please provide email'],
    match: [/\S+@\S+\.\S+/, 'An example of a valid email is abc@def.com'],
  },
  password: {
    type: String,
    required: [true, 'Please provide password'],
    minlength: [6, 'Your password should be atleast 6 characters'],
  },
}, { timestamps: { createdAt: 'created_at' } });


userSchema.pre('save', async function (next) {
  // hash password
  const user = this;
  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 10);
  }
  next();
});

userSchema.methods.comparePasswords = async function (newPassword) {
  const { password } = this;
  const match = await bcrypt.compare(newPassword, password);
  return match;
};

userSchema.methods.generateToken = function () {
  const { _id, username } = this;
  return jwt.sign({
    sub: _id, username,
  }, process.env.SECRETKEY, { expiresIn: '5 days' });
};

userSchema.methods.getAuthenticationInfo = function () {
  const { username, email } = this;
  return {
    username, email, token: this.generateToken(),
  };
};

userSchema.statics.findByCredentials = async function (email, password) {
  const user = await this.findOne({ email });
  if (!user) {
    throw new Error('Invalid login credentials');
  }
  const isPasswordMatch = await user.comparePasswords(password, user.password);
  if (!isPasswordMatch) {
    throw new Error('Invalid login credentials');
  }
  return user;
};

export default mongoose.model('User', userSchema);
