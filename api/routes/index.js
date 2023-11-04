const express = require("express");
const router = express.Router();
const mysql = require("mysql2");
const bcrypt = require("bcrypt");
const jwt = require(JsonWebToken);

const Index = require("../schemas/index.js");

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

//회원가입 API
router.post("/index/join", async(req, res) => {

    const nickname = req.body.nickname;
    const password = req.body.password;
    const passwordCheck = req.body.passwordCheck;
    
    //닉네임 중복 검사
    //이런 구문들을 schemas의 sequelize로 수정해야 할듯
    const [rowsNicknameCheck] = await connection.execute(`SELECT NICKNAME FROM USER WHERE NICKNAME = ?`, [nickname]);

    if (rowsNicknameCheck.length) {
        res.json({
            success: false,
            error: "중복된 닉네임입니다."
        });
    }

    //닉네임 조건 확인
    const nickname_pattern = /^[a-zA-Z0-9]{3,}$/;
    if (!nickname_pattern.test(nickname)) {
        res.json({
            success: false,
            error: "닉네임은 최소 3자 이상, 영문 소문자 또는 대문자, 숫자로만 이루어져야 합니다."
        })
    }

    //비밀번호 조건 확인
    if (password.length < 4) {
        res.json({
            success: false,
            error: "비밀번호는 4자 이상이어야 합니다."
        })
    }

    if (password === nickname) {
        res.json({
            success: false,
            error: "비밀번호와 닉네임은 달라야 합니다."
        })
    }

    if (password !== passwordCheck) {
        res.json({
            success: false,
            error: "비밀번호와 비밀번호 확인이 일치하지 않습니다."
        })
    }

    //비밀번호 hashing
    const hash = bcrypt.hashSync(password, 10);
    
    //DB에 삽입
    //이런 구문들을 schemas의 sequelize로 수정해야 할듯
    const [rowsUser] = await connection.execute(`INSERT INTO USER(NICKNAME, PASSWORD) VALUES(?, ?)`, [nickname, hash]);

    res.json({
        success: true,
        message: "회원가입이 완료되었습니다."
    });

});

//login API
router.post('/index/login', async(req, res) => {
    const nickname = req.body.nickname;
    const password = req.body.password;
    
    //이런 구문들을 schemas의 sequelize로 수정해야 할듯
    const [rows] = await connection.execute(`SELECT PASSWORD, NICKNAME FROM USER WHERE NICKNAME = ?`, [nickname]);
    
    //회원정보 없음
    if (!rows.length) {
        res.json({
            success: false,
            error: "닉네임 또는 패스워드를 확인해주세요."
        });
        return;
    }

    const hash = rows[0].password;

    //비밀번호 틀림
    if (!bcrypt.compareSync(password, hash)) {
        res.json({
            success: false,
            error: "닉네임 또는 패스워드를 확인해주세요."
        });
        return;
    }
    //token 발급
    const token = jwt.sign({
        "nickname": nickname,
    }, 'swJungle', {expiresIn: '7d'});

    res.json({
        success: true,
        token: token
    });

});

module.exports = router;