import { errorResponse, successResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import {
  PutObjectCommand,
  PutObjectCommandInput,
  S3,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { BUCKET, contentType, uploadedFolder } from 'src/common/constants';

const importProductsFile = async (event) => {
  const s3 = new S3({ region: 'us-east-1' });

  const fileName = event?.queryStringParameters?.name;

  if (!fileName) {
    return errorResponse({
      message: 'Please provide file name ...',
      statusCode: 400,
    });
  }

  const catalogPath = `${uploadedFolder}${fileName}`;

  const params: PutObjectCommandInput = {
    Bucket: BUCKET,
    Key: catalogPath,
    ContentType: contentType,
  };

  try {
    const command = new PutObjectCommand(params);

    const url = await getSignedUrl(s3, command, {
      expiresIn: 3600,
    });

    return successResponse({ url });
  } catch (error) {
    console.log(error);
    return errorResponse({ message: error?.message });
  }
};

export const main = middyfy(importProductsFile);
