const express = require("express");
const router = express.Router();
const mysql = require("mysql2");
const jwt = require('jsonwebtoken');

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
router.get("/comments:post_id", async(req, res) => {
    const postId = req.params.post_id;

    const [rowsGetComments] = await connection.execute(`SELECT COMMENT_NICKNAME, COMMENT_CONTENT, COMMENT_TIME, COMMENT_LIKE FROM COMMENT WHERE POST_ID = ?`, [postId]);
    
    res.json({
        success: true,
        result: rowsGetComments
    })
})

//댓글 작성 API
router.post("/comments/write", async(req, res) => {
    const commentContent = req.body.comment_content;
    const postId = req.body.post_id;

    const token = req.headers.authorization;
    const decoded = jwt.verify(token, 'swJuingle');

    if (!token) {
        res.json({
            success: false,
            error: "로그인이 필요합니다."
        });
        return;
    }

    const nickname = decoded.nickname;

    const [rowsPostComment] = await connection.execute(`INSERT INTO COMMENT(COMMENT_NICKNAME, POST_ID, COMMENT_CONTENT) VALUES(?, ?, ?)`, [nickname, postId, commentContent]);

    res.json({
        success: true,
        message: "댓글이 등록되었습니다."
    })
})

//댓글 수정 API
router.put("/comments/update", async(req, res) => {
    const commentId = req.body.comment_id;
    const newCommentContent = req.body.new_comment_content;

    const token = req.headers.authorization;
    const decoded = jwt.verify(token, 'swJuingle');

    if (!token) {
        res.json({
            success: false,
            error: "로그인이 필요합니다."
        });
        return;
    }

    const nickname = decoded.nickname;

    const [rowsCommentCheck] = await connection.execute(`SELECT COMMENT_NICKNAME FROM COMMENT WHERE COMMENT_ID = ?`, [commentId]);

    if (rowsCommentCheck[0] !== nickname) {
        res.json({
            success: false,
            error: "댓글을 수정할 수 없습니다."
        })
        return;
    } 
    
    const [rowsCommentUpdate] = await connection.execute(`UPDATE COMMENT SET COMMENT_CONTENT = ? WHERE COMMENT_ID = ?`, [newCommentContent, commentId]);

    if(rowsCommentUpdate.affectedRows) {
        res.json({
            success: true,
            message: "댓글 수정이 완료되었습니다."
        })
    }
})


//댓글 삭제 API
router.delete("/comment/delete", async(req, res) => {
    const commentId = req.body.comment_id;

    const token = req.headers.authorization;
    const decoded = jwt.verify(token, 'swJuingle');

    if (!token) {
        res.json({
            success: false,
            error: "로그인이 필요합니다."
        });
        return;
    }

    const nickname = decoded.nickname;

    const [rowsCommentCheck] = await connection.execute(`SELECT COMMENT_NICKNAME FROM COMMENT WHERE COMMENT_ID = ?`, [commentId]);

    if (rowsCommentCheck[0] !== nickname) {
        res.json({
            success: false,
            error: "댓글을 삭제할 수 없습니다."
        })
        return;
    } 

    const [rowsCommentDelete] = await connection.execute(`DELETE FROM COMMENT WHERE COMMENT_ID = ?`, [commentId]);

    res.json({
        success: true,
        message: "댓글 삭제가 완료되었습니다."
    })
}) 

module.exports = router;