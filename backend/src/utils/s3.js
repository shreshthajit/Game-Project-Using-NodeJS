const projectConfig = require('../config');
const AWS = require('aws-sdk');
const crypto = require('crypto');

const s3 = new AWS.S3({
    // apiVersion: projectConfig.aws.,
    accessKeyId: projectConfig.aws.accessKey,
    secretAccessKey: projectConfig.aws.secretKey,
    region: projectConfig.aws.region,
    signatureVersion: projectConfig.aws.signatureVersion,
})

async function getPresignedUrl(key) {
    const presignedParam = {
        Bucket: projectConfig.aws.bucketName,
        Key: key,
        // Expires: this.presignedExpireTime,
    };
    return await s3.getSignedUrlPromise(
        'getObject',
        presignedParam,
    );
}

async function uploadImage(key, file) {
    try {
        const params = {
            Bucket: projectConfig.aws.bucketName,
            Key: key,
            Body: file.buffer,
            ContentType: file.mimetype,
        };
        return await s3.upload(params).promise();
    } catch (error) {
        console.log(error);
    }
}

const randomImageName = (bytes = 16) => crypto.randomBytes(bytes).toString('hex');
module.exports = { getPresignedUrl, uploadImage, randomImageName }