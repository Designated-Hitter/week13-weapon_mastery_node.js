//chatGPT generated this code
const { DataTypes } = require('sequelize');
const sequelize = require('../db'); // Sequelize 인스턴스 가져오기

const Like = sequelize.define('Like', {
  POST_ID: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  LIKE_NUMBER: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  LIKE_NICKNAME: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = Like;