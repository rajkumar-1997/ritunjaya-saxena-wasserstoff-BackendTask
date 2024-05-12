import { parse } from 'json2csv';
import { parse as parseXML } from 'js2xmlparser';

//function to convert annotations to CSV format
const convertToCSV = (annotations) => {
  try {
    const fields = ['label', 'topLeft', 'bottomRight'];
    const opts = { fields };
    const csvData = [];
    // Iterate over each image's annotations
    annotations.forEach((ele) => {
      const csv = parse(ele, opts);
      csvData.push(csv);
    });

    // Combine CSV data for all images
    return csvData.join('\n');
  } catch (error) {
    console.error('Error converting to CSV:', error);
    throw error;
  }
};

//function to convert annotations to XML format
const convertToXML = (annotations) => {
  try {
    const xmlData = [];
    // Iterate over each image's annotations
    annotations.forEach((ele) => {
      const xml = parseXML('Annotations', { Annotation: ele });
      xmlData.push(xml);
    });
    // Combine XML data for all images
    return xmlData.join('\n');
  } catch (error) {
    console.error('Error converting to XML:', error);
    throw error;
  }
};

export default { convertToCSV, convertToXML };
