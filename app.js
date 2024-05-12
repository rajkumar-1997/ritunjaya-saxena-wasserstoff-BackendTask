import express from 'express';
import { sequelize } from './database/dbConfig.js';
import cors from 'cors';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import User from './models/userModel.js';
import Image from './models/imageModel.js';
import userRoutes from './routes/userRoutes.js';
import imageRoutes from './routes/imageRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
dotenv.config();
const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
const PORT = process.env.PORT;

app.use('/user', userRoutes);
app.use('/image', imageRoutes);
app.use('/admin', adminRoutes);
//table relations
User.hasMany(Image, { foreignKey: 'userId' });
Image.belongsTo(User, { foreignKey: 'userId' });

try {
  await sequelize.sync();
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
} catch (error) {
  console.error('Unable to connect to the database:', error);
}
