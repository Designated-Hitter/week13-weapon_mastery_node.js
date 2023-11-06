// //sequelize로 연결해야 할 거 같음
const Sequelize = require('sequelize');
const sequelize = new Sequelize('tigerdb', 'scott', 'tiger', {
    host: 'localhost',
    dialect: 'mysql'
});

const User = require('./models/user');
const Post = require('./models/post');
const Comment = require('./models/comment');
const Like = require('./models/like')

module.exports = connect;