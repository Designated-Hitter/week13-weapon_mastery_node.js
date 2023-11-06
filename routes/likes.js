const express = require('express');
const router = express.Router();
// const Like = require('../schemas/likes');
const jwt = require('jsonwebtoken');
const mysql = require("mysql2");
// const { Sequelize } = require('sequelize');
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


//like 개수 반환 API
router.get('/likes/number:post_id', async(req, res) => {
    const postId = req.params.post_id;

    const [rowsLikeNumber] = await connection.excute(`SELECT LIKE_NUMBER FROM POST_LIKE WHERE POST_ID = ?`, [postId]);

    if (rowsLikeNumber) {
        res.json({
            result: rowsLikeNumber
        });
    } else {
        res.json({
            result: 0
        });
    }
})

//like 반영 API
router.post('/likes', async (req, res) => {
    const postId = req.body.post_id;

    const token = req.headers.authorization;
    const decoded = jwt.verify(token, "swJungle");
    
    //토큰 확인
    if (!token) {
        res.json({
            success: false,
            error: "로그인이 필요합니다."
        })
        return;
    }

    const nickname = decoded.nickname;

    //현재 유저가 좋아요를 이미 눌렀는지 확인
    const [rowsLike] = await connection.excute(`SELECT * FROM POST_LIKE WHERE POST_ID = ? and POST_LIKE_NICKNAME = ?`, [postId, nickname]);

    if (rowsLike) {
        //이미 좋아요를 누른 경우 좋아요를 취소
        await connection.excute(`DELETE * FROM POST_LIKE WHERE POST_ID =? and POST_LIKE_NICKNAME = ?`, [postId, nickname]);
        //좋아요 개수 - 1
        await connection.excute(`UPDATE POST_LIKE SET LIKE_NUMBER = LIKE_NUMBER - 1 WHERE POST_ID = ?` [postId]);

        res.json({
            success: true,
            message: "좋아요를 취소했습니다."
        });

    } else {
        //좋아요를 처음 누른 경우 좋아요 추가
        await connection.excute(`INSERT INTO POST_LIKE (POST_ID, POST_LIKE_NICKNAME) VALUES (?, ?)`, [postId, nickname]);

        //좋아요 개수 + 1
        await connection.excute(`UPDATE POST_LIKE SET LIKE_NUMBER = LIKE_NUMBER + 1 WHERE POST_ID = ?` [postId]);

        res.json({
            success: true,
            message: "좋아요를 눌렀습니다."
        });
    }
});

module.exports = router;