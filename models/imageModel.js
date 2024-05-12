import { DataTypes } from 'sequelize';
import { sequelize } from '../database/dbConfig.js';

const Image = sequelize.define('Image', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  path: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  annotations: {
    type: DataTypes.JSONB,
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM('pending', 'rejected', 'approved'),
    defaultValue: 'pending',
    comment: 'status of the image ->pending, rejected, approved',
  },
});
export default Image;
