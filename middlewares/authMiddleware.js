import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';
import dotenv from 'dotenv';
dotenv.config();

//start region securing resources for each user by authentication
const authenticate = async (req, res, next) => {
  const token = req.header('Authorization');
  try {
    const { userId } = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const user = await User.findByPk(userId);
    if (user) {
      req.user = user;
      next();
    } else {
      res.status(401).send({ type: 'error', message: 'Authorization Failed!' });
    }
  } catch (error) {
    console.log('error', error);
    res.status(401).send({ type: 'error', message: 'Authorizetion Failed!' });
  }
};
//#endregion

//start region check request from admin or not in an api
const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    // User is an admin, proceed with the request
    next();
  } else {
    // User is not authorized to perform this action
    res.status(403).send({ message: 'Access forbidden.' });
  }
};
//#endregion

export default { authenticate, isAdmin };
