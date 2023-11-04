const express = require("express");
const router = express.Router();
const mysql = require("mysql2");
const jwt = require(JsonWebToken);

const Comment = require("../schemas/comment.js");

const pool = mysql.createPool({
    host: 'localhost',
    user: 'scott',
    database: 'tigerdb',
    password: 'tiger',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

const connection = pool.promise();

//댓글 조회 API

//댓글 작성 API

//댓글 수정 API

//댓글 삭제 API