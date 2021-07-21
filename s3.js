require('dotenv').config();
const fs = require('fs');
const S3 = require('aws-sdk/clients/s3');

const name = process.env.AWS_BUCKET_NAME;
const region = process.env.AWS_BUCKET_REGION;
const accessKey = process.env.AWS_ACCESS_KEY_ID;
const secret = process.env.AWS_SECRET_ACCESS_KEY;

const s3 = new S3({
	region,
	accessKey,
	secret,
});

function upload(file) {
	const fileStream = fs.createReadStream(file.path);

	const uploadParams = {
		Bucket: name,
		Body: fileStream,
		Key: file.filename,
	};

	return s3.upload(uploadParams).promise();
}

exports.uploadFile = upload;

function deleteFile(key) {
	const deleteParams = {
		Bucket: name,
		Key: key,
	};

	return s3.deleteObject(deleteParams).promise();
}

exports.deleteFile = deleteFile;
