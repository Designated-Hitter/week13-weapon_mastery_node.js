const express = require("express");
const router = express.Router();
const mysql = require("mysql2");
const jwt = require('jsonwebtoken');

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
router.get("/posts/", async (req, res) => {
    const [rowsGetAllPost] = await connection.execute(`SELECT * FROM POSTS`);

    res.json({
        success: true,
        result: rowsGetAllPost
    })
})

//게시글 조회 API
router.get("/posts/post", async (req, res) => {
    const postId = req.query.post_id;
    const [rowsPost] = await connection.execute(`SELECT POST.TITLE, POST.POST_CONTENT, POST.POST_NICKNAME, POST.POST_LIKE, POST.POST_TIME FROM POST WHERE POST_ID = ?`, [postId]);

    res.json({
        success: true,
        result: rowsPost
    });
})

//게시글 작성 API
router.post("/posts/write", async(req, res) => {
    const title = req.body.title;
    const content = req.body.content;

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

    const [rowPostData] = await connection.execute(`INSERT INTO POST(TITLE, POST_CONTENT, POST_NICKNAME) VALUES (?, ?, ?)`, [title, content, nickname]);

    res.json({
        success: true,
        message: "게시글이 등록되었습니다."
    })

})


//게시글 수정 API
router.put("/posts/update", async(req, res) => {
    const postId = req.body.post_id;
    const newTitle = req.body.new_title;
    const newPost = req.body.new_post;

    const token = req.headers.authorization;
    const decoded = jwt.verify(token, "swJungle");

    if (!token) {
        res.json({
            success: false,
            error: "로그인이 필요합니다."
        })
        return;
    }

    const nickname = decoded.nickname;

    const [rowsPostCheck] = await connection.execute(`SELECT POST_NICKNAME FROM POST WHERE POST_ID = ?`, [postId]);

    if (rowsPostCheck[0] !== nickname) {
        res.json({
            success: false,
            error: "게시글을 수정할 수 없습니다."
        })
        return;
    } 

    const [rowsPostUpdate] = await connection.execute(`UPDATE POST SET TITLE = ?, POST_CONTENT = ? WHERE POST_ID = ?`, [newTitle, newPost, postId]);

    if(rowsPostUpdate.affectedRows) {
        res.json({
            success: true,
            message: "게시글 수정이 완료되었습니다."
        })
    }

})

//게시글 삭제 API
router.delete("/posts/delete", async(req, res) => {
    const postId = req.body.post_id;

    const token = req.headers.authorization;
    const decoded = jwt.verify(token, "swJungle");

    if (!token) {
        res.json({
            success: false,
            error: "로그인이 필요합니다."
        })
        return;
    }

    const nickname = decoded.nickname;

    const [rowsPostCheck] = await connection.execute(`SELECT POST_NICKNAME FROM POST WHERE POST_ID = ?`, [postId]);

    if (rowsPostCheck[0] !== nickname) {
        res.json({
            success: false,
            error: "게시글을 삭제할 수 없습니다."
        })
        return;
    }

    const [rowsPostDelete] = await connection.execute(`DELETE FROM POST WHERE POST_ID = ?`, [postId]);

    res.json({
        success: true,
        message: "게시글 삭제가 완료되었습니다."
    })
}) 

module.exports = router;