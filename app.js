const express = require("express");
const app = express();
const fileUpload = require("express-fileupload");
app.use(fileUpload());
const port = 3000;
const { s3file } = require('./route')
//upload route

app.post("/upload", s3file);

app.listen(port, () => {
    console.log(`Server is up at ${port}`);
});