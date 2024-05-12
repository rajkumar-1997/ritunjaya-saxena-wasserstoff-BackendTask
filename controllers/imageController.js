import Image from '../models/imageModel.js';
import AWSServices from '../services/awsS3Service.js';
import cloudVisionService from '../services/cloudVisionService.js';
import fs from 'fs';

// start region upload immage and get annotation
const uploadImage = async (req, res, next) => {
  try {
    const userId = req?.user?.dataValues?.id;
    const uploadedFile = req?.file;
    if (!uploadedFile) {
      return res.status(400).send({ message: 'No file uploaded' });
    }

    // Check if uploaded file is  image
    if (!uploadedFile.mimetype.startsWith('image')) {
      return res.status(400).send({ message: 'Only image files are allowed' });
    }

    const fileName = uploadedFile.originalname;
    const path = uploadedFile.path;

    const s3FileUrl = await AWSServices.uploadImageToS3(path, fileName);
    const createdImgData = await Image.create({
      userId,
      path: s3FileUrl,
    });
    fs.unlinkSync(path);
    const annotations = await cloudVisionService.automaticAnnotation(s3FileUrl);
    res.status(200).send({ imageId: createdImgData.id, annotations });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Internal server error' });
  }
};
//#endregion

// start region submit annotation by user
const submitAnnotations = async (req, res, next) => {
  try {
    const imageId = req.body.imageId;
    const annotations = req.body.annotations;
    if (!imageId || !annotations) {
      return res.status(400).send({ message: 'Required details missing' });
    }
    // Find the image by ID
    const image = await Image.findOne({ where: { id: imageId } });
    if (!image) {
      return res.status(404).send({ error: 'Image not found' });
    }
    // Update annotations for the image
    image.annotations = annotations;
    await image.save();
    res
      .status(200)
      .send({ message: 'Annotations updated successfully', image });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Internal server error' });
  }
};
//#endregion

export default { uploadImage, submitAnnotations };
