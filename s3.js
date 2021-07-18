require('dotenv').config();
const fs = require('fs');
const S3 = require('aws-sdk/clients/s3');

const name = process.env.AWS_NAME;
const region = process.env.AWS_REGION;
const accessKey = process.env.AWS_ACCESS_KEY;
const secret = process.env.AWS_SECRET;

const s3 = new S3({
	region,
	accessKey,
	secret,
});

export function upload(file) {}
