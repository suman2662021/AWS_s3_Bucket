require("dotenv/config");
const { uploadFileToS3 } = require('./s3_upload');

exports.s3file = async (req, res) => {
    try {
        const { coachingName } = req.body;
        const document = req.files["file"];
        console.log(req.files["file"]);

        if (!req.files) {
            res.send("File was not found");
            return;
        }

        const download_url = await uploadFileToS3(coachingName, document);

        return res.status(200).json({
            download_url: download_url,
            message: "This is your download link"
        })
    } catch (error) {
        return res.status(200).json({
            message: message.error || "Failed to get download Link"
        })
    }
}