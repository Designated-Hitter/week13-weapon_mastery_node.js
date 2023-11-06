const express = require('express');

const commentRouter = require("../routes/comments");
const postsRouter = require("../routes/posts");
const indexRouter = require("../routes/index");
const likeRouter = require("../routes/likes");

const app = express();
const port = 3000;

app.get('/', (req, res) => {
    res.send('Hello, World!');
});

app.listen(port, () => {
    console.log('3000 포트로 서버가 열렸습니다.');
});

const connect = require("./schemas");
connect();

app.use(express.json);
app.use("/api", [commentRouter, postsRouter, indexRouter, likeRouter]);
app.use(express.static("static"));
