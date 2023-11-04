//sequelize로 연결해야 할 거 같음
const { sequelize } = require('sequelize');
import { Sequelize, Datatypes, DataTypes } from 'sequelize';


const sequelize = new Sequelize('tigerdb', 'scott', 'tiger', {
    host: 'localhost',
    dialect: 'mysql'
});

const connect = sequelize.define('USER', {
    NICKNAME: DataTypes.STRING,
    PASSWORD: DataTypes.STRING,
});

module.exports = connect;