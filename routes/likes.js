const express = require('express');
const router = express.Router();
const Like = require('../schemas/likes');
const jwt = require('jsonwebtoken');
const { Sequelize } = require('sequelize');


//like 개수 반환 API
router.get('/likes/number:post_id', async(req, res) => {
    const postId = req.params.post_id;

    const likeNumber = await Like.findOne({
        attributes: ['LIKE_NUMBER'],
        where: { postId },
    });

    if (likeNumber) {
        res.json({
            LIKE_NUMBER: likeNumber.LIKE_NUMBER
        });
    } else {
        res.json({
            LIKE_NUMBER: 0
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
    const like = await Like.findOne({ where: postId, nickname });

    if (like) {
        //이미 좋아요를 누른 경우 좋아요를 취소
        await Like.destroy({ where: {postId, nickname}});
        //좋아요 개수 - 1
        await Like.update(
            { LIKE_NUMBER: Sequelize.literal('LIKE_NUMBER - 1')},
            { where: { postId } }
        );
        res.json({
            success: true,
            message: "좋아요를 취소했습니다."
        });
    } else {
        //좋아요를 처음 누른 경우 좋아요 추가
        await Like.create({ postId, nickname });

        //좋아요 개수 + 1
        await Like.update(
            { LIKE_NUMBER: sequelize.literal('LIKE_NUMBER + 1') },
            { where: { postId } }
        );
        res.json({
            success: true,
            message: "좋아요를 눌렀습니다."
        });
    }
});

module.exports = router;