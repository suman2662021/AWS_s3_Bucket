
require("dotenv/config");
const { uploadFileToS3 } = require('./s3_upload');
const BUCKET_NAME = process.env.AWS_BUCKET_NAME;
exports.s3file = async (req, res) => {
    const { coachingName } = req.body;

    console.log(req.files["file"]);

    if (!req.files) {
        res.send("File was not found");
        return;
    }

    let params = {
        Body: req.files["file"].data,
        Key: `${coachingName}/${req.files["file"].name}`, //locate object in a folder
        ACL: "public-read",
        Bucket: BUCKET_NAME,
    };

    await uploadFileToS3(params);
}