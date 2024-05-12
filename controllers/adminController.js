import Image from '../models/imageModel.js';
import converter from '../utils/converter.js';

// start region  get pending image status list
const getPendingList = async (req, res, next) => {
  try {
    const pendingImgList = await Image.findAll({
      where: { status: 'pending' },
    });
    res.status(200).send({ pendingImgList });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: 'Internal server error' });
  }
};
//#endregion

// start region update image status
const updateImageStatus = async (req, res, next) => {
  try {
    const imageId = req.body.imageId;
    const status = req.body.status;
    if (!imageId || !status) {
      return res.status(400).send({ message: 'Required details missing' });
    }
    const image = await Image.findOne({ where: { id: imageId } });
    if (!image) {
      return res.status(404).send({ error: 'Image not found' });
    }
    // Update status for the image
    image.status = status;
    await image.save();
    res
      .status(200)
      .send({ message: 'image status updated successfully', image });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: 'Internal server error' });
  }
};
//#endregion

// start region export annotations by admin
const exportAnnotations = async (req, res, next) => {
  try {
    const format = req?.query?.format;
    const imageData = await Image.findAll({
      attributes: ['annotations'],
      where: { status: 'approved' },
    });
    const annotations = imageData
      .map((item) => item.annotations?.annotations)
      .filter(Boolean);
    console.log('Annotations:', annotations);
    if (!annotations) {
      return res.status(404).send({ error: 'approved annotation not found' });
    }
    let exportedData;
    if (format == 'csv') {
      const csvData = converter.convertToCSV(annotations);
      res.setHeader('Content-Type', 'text/csv');
      exportedData = csvData;
    } else if (format == 'xml') {
      const xmlData = converter.convertToXML(annotations);
      res.setHeader('Content-Type', 'application/xml');
      exportedData = xmlData;
    } else {
      res.setHeader('Content-Type', 'application/json');
      exportedData = annotations;
    }
    res.status(200).send(exportedData);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: 'Internal server error' });
  }
};
//#endregion

export default { getPendingList, updateImageStatus, exportAnnotations };
