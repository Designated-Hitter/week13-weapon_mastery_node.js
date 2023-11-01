const { default: mongoose } = require("mongoose");
const moongoose = require("mongoose");

const connect = () => {
    mongoose
        .connect("mongodb://localhost:27017/local_mongo")
        .catch(err => console.log(err));
};

mongoose.connection.on("error", err => {
    console.error("몽고디비 연결 에러", err);
});

module.exports = connect;