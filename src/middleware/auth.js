import dotenv from 'dotenv';
import JWT from 'jsonwebtoken';
import UserModel from '../models/User';

dotenv.config();


const auth = async (req, res, next) => {
  try {
    const token = req.headers['x-access-token'];
    if (!token) {
      throw new Error('Request token missing');
    }
    const data = JWT.verify(token, process.env.SECRETKEY);
    const user = await UserModel.findOne({ _id: data.sub });
    req.user = user;
    next();
  } catch (error) {
    res.status(401).send(error.message || 'Not authorized to access this resource');
  }
};

export default auth;
