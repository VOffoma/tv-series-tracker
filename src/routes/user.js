import express from 'express';
import expresJoi from 'express-joi-validator';
import UserModel from '../models/User';
import auth from '../middleware/auth';
import { userSchema, userCredentialsSchema } from '../validation/user';


const router = express.Router();

router.post('/', expresJoi(userSchema), async (req, res) => {
  try {
    const user = new UserModel(req.body);
    await user.save();
    res.status(201).send({ user });
  } catch (error) {
    res.status(400).send(error.message);
  }
});

router.post('/login', expresJoi(userCredentialsSchema), async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await UserModel.findByCredentials(email, password);
    if (!user) {
      res.status(401).send({ error: 'Login failed! Check authentication credentials' });
    }
    const authInfo = await user.getAuthenticationInfo();
    res.status(200).send({ authInfo });
  } catch (error) {
    res.status(400).send(error.message);
  }
});

router.get('/me', auth, (req, res) => res.status(200).send(req.user));

export default router;
