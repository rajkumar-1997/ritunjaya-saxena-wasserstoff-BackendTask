import AWS from 'aws-sdk';
import fs from 'fs';

const uploadImageToS3 = async (filePath, fileName) => {
  try {
    const BUCKET_NAME = process.env.BUCKET_NAME;
    const IAM_ACCESS_KEY = process.env.IAM_ACCESS_KEY;
    const IAM_SECRET_KEY = process.env.IAM_SECRET_KEY;

    // creating an instance of the S3 service object
    const s3 = new AWS.S3({
      accessKeyId: IAM_ACCESS_KEY,
      secretAccessKey: IAM_SECRET_KEY,
    });
    const fileStream = fs.createReadStream(filePath);
    const uploadParams = {
      Bucket: BUCKET_NAME,
      Key: fileName,
      Body: fileStream,
      ACL: 'public-read',
    };

    // Upload the image to S3
    const data = await s3.upload(uploadParams).promise();
    return data.Location;
  } catch (error) {
    console.error('Error uploading file to S3:', error);
    throw error;
  }
};

export default { uploadImageToS3 };
