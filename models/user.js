const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const User = sequelize.define('User', {
  email: {
    type: DataTypes.STRING,
    allowNull: false, 
    unique: true, 
    validate: {
      isEmail: {
        msg: 'Must be a valid email address',
      },
    },
    get() {
      const rawValue = this.getDataValue('email');
      return rawValue ? rawValue.toLowerCase() : null;
    },
    set(value) {
      this.setDataValue('email', value.trim());
    }
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false, 
    validate: {
      len: {
        args: [4, 20],
        msg: 'Username must be between 4 and 20 characters',
      },
    },
    get() {
      const rawValue = this.getDataValue('username');
      return rawValue ? rawValue.charAt(0).toUpperCase() + rawValue.slice(1) : null;
    },
    set(value) {
      this.setDataValue('username', value.trim());
    }
  },
  age: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      isInt: true, 
      min: {
        args: [18],
        msg: 'Age must be at least 18',
      },
    },
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'active', 
    validate: {
      isIn: {
        args: [['active', 'inactive', 'pending']], 
        msg: 'Status must be either active, inactive, or pending',
      },
    },
    get() {
      const rawValue = this.getDataValue('status');
      return rawValue ? rawValue.toUpperCase() : null;
    },
    set(value) {
      this.setDataValue('status', value.toLowerCase());
    }
  }
});

sequelize.sync()
  .then(() => console.log('User model synced'))
  .catch((err) => console.error('Error syncing model:', err));

module.exports = User;
