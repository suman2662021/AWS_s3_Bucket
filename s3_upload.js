require("dotenv/config");
const { s3 } = require('./s3');

const BUCKET_NAME = process.env.AWS_BUCKET_NAME;

exports.uploadFileToS3 = async (coachingName, document) => {
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

        let params = {
            Body: document.data,
            Key: `${coachingName}/${document.name}`, //locate object in a folder
            ACL: "public-read",
            Bucket: BUCKET_NAME,
        };

        const file = await s3.upload(params).promise();

        if (!file) {
            console.log("Failed to upload File")
            throw new Error("Failed to upload File");
        }

        return file.Location;

    } catch (error) {
        console.log(error);
        throw new Error("Failed to upload File");
    }
}