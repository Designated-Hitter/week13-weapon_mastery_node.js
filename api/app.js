// const mysql = require('mysql2');
const express = require('express');
// const axios = require('axios');
const cors = require('cors');
// const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');

const app = express();

app.get('/', (req, res) => {
    res.send('Hello, World!');
});

app.listen(3000, () => {
    console.log('3000 포트로 서버가 열렸습니다.');
});

const connect = require("./schemas");
// connect();

const router = require("./routes");

app.use(cors());
app.use(express.json);
