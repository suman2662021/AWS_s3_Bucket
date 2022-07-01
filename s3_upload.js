require("dotenv/config");
const { s3 } = require('./s3');

const BUCKET_NAME = process.env.AWS_BUCKET_NAME;

exports.uploadFileToS3 = async (params) => {
    try {
        const param = {
            Bucket: BUCKET_NAME,
        };

        s3.createBucket(param, function (err, data) {
            if (err && err.statusCode == 409) {
                console.log("Bucket has been created already");
            } else {
                console.log("Bucket Created Successfully", data.Location);
            }
        });

        const file = await s3.upload(params).promise();

        if (!file) {
            // return res.status(500).json({ message: "failed to upload file" });
            console.log("failed to upload image")
        }
        console.log(file.Location)
        // return res.status(200).json({ download_Link: file.location, message: "file uploaded successfully" });
    } catch (error) {
        console.log(error);
        // return res.status(500).json({ error: error.message });
    }
}