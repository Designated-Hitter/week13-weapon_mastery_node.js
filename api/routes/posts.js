const express = require("express");
const router = express.Router();
const mysql = require("mysql2");
const jwt = require(JsonWebToken);

const Post = require("../schemas/post.js");

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

//전체 게시글 조회 API

//게시글 조회 API

//게시글 작성 API

//게시글 수정 API

//게시글 삭제 API