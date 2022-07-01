require("dotenv/config");

const express = require("express");
const fileUpload = require("express-fileupload");
const app = express();

app.use(fileUpload());
const AWS = require("aws-sdk");
const port = 3000;

const BUCKET_NAME = process.env.AWS_BUCKET_NAME;

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ID,
  secretAccessKey: process.env.AWS_SECRET,
  region: process.env.REGION,
});

app.post("/upload", function (req, res) {

  const { coachingName } = req.body;

  const paramss = {
    Bucket: BUCKET_NAME,
  };
  s3.createBucket(paramss, function (err, data) {
    if (err && err.statusCode == 409) {
      console.log("Bucket has been created already");
    } else {
      console.log("Bucket Created Successfully", data.Location);
    }
  });

  console.log(req.files["file"]);

  if (!req.files) {
    res.send("File was not found");
    return;
  }

  const params = {
    Body: req.files["file"].data,
    Key: `${coachingName}/${req.files["file"].name}`, //locate object in a folder
    // ACL: "public-read",
    Bucket: BUCKET_NAME,
  };

  s3.upload(params, (error, data) => {
    if (error) {
      res.status(500).send(error);
      console.log("error define");
    }

    res.status(200).send({ download_Link: data.Location });
  });
});

//download route
app.get("/download/:filename", async (req, res) => {
  const { coachingName } = req.body;
  const filename = req.params.filename;
  let download_file = await s3.getObject({ Bucket: BUCKET_NAME, Key: `${coachingName}/${filename}` }).promise();
  res.send(download_file.Body)
});

//delete route
app.delete("/delete/:filename", async (req, res) => {
  const { coachingName } = req.body;
  const filename = req.params.filename;
  await s3.deleteObject({ Bucket: BUCKET_NAME, Key: `${coachingName}/${filename}` }).promise();
  res.send("File Deleted Successfully");
});

app.listen(port, () => {
  console.log(`Server is up at ${port}`);
});