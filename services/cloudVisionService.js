import fs from 'fs';
import axios from 'axios';

const automaticAnnotation = async (imagePath) => {
  const apiUrl = 'https://vision.googleapis.com/v1/images:annotate';
  const headers = {
    'Content-Type': 'application/json',
  };
  const apiKey = process.env.CLOUD_VISION_KEY;
  // Read the image file and convert it to base64 encoding
  const imageResponse = await axios.get(imagePath, {
    responseType: 'arraybuffer',
  });
  const imageData = Buffer.from(imageResponse.data, 'binary').toString(
    'base64'
  );
  // Prepare the image data for API request
  const requestData = {
    requests: [
      {
        image: {
          content: imageData,
        },
        features: [
          {
            type: 'LABEL_DETECTION',
          },
          {
            type: 'OBJECT_LOCALIZATION',
          },
        ],
      },
    ],
  };

  try {
    const response = await axios.post(apiUrl, requestData, {
      params: { key: apiKey },
      headers: headers,
    });

    if (response.status === 200) {
      const annotations = response.data;
      // Process and format the response
      const formattedAnnotations = processAnnotations(annotations);
      const annotationBodyForFrontend =
        getAnnotationBodyForFrontend(formattedAnnotations);
      return annotationBodyForFrontend;
    } else {
      console.error('Error:', response.statusText);
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
};

const processAnnotations = (annotationResponse) => {
  const processedAnnotations = {
    labelAnnotations: [],
    localizedObjectAnnotations: [],
  };

  // Extract label annotations
  if (annotationResponse?.responses[0]?.labelAnnotations) {
    processedAnnotations.labelAnnotations =
      annotationResponse.responses[0].labelAnnotations.map((ele) => ({
        description: ele.description,
        score: ele.score,
      }));
  }

  // Extract localized object annotations
  if (annotationResponse?.responses[0]?.localizedObjectAnnotations) {
    processedAnnotations.localizedObjectAnnotations =
      annotationResponse.responses[0].localizedObjectAnnotations.map((ele) => ({
        name: ele.name,
        score: ele.score,
        boundingPoly: ele.boundingPoly.normalizedVertices,
      }));
  }

  return processedAnnotations;
};

const getAnnotationBodyForFrontend = (formattedAnnotations) => {
  const body = {
    annotations: [],
  };
  const labelAnnotations = formattedAnnotations?.labelAnnotations;
  const localizedObjectAnnotations =
    formattedAnnotations?.localizedObjectAnnotations;
  body.annotations = labelAnnotations.map((annotation) => ({
    label: annotation.description,
    // No bounding box for label annotations
    topLeft: null,
    bottomRight: null,
  }));

  body.annotations.push(
    ...localizedObjectAnnotations.map((annotation) => ({
      label: annotation.name,
      // First normalized vertex represents top-left corner
      topLeft: annotation.boundingPoly[0],
      // Third normalized vertex represents bottom-right corner
      bottomRight: annotation.boundingPoly[2],
    }))
  );
  return body;
};

export default { automaticAnnotation };
