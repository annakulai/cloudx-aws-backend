import {
  CopyObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
  S3,
} from '@aws-sdk/client-s3';
import { S3Event } from 'aws-lambda';
import csv from 'csv-parser';
import {
  BUCKET,
  REGION,
  parsedPrefix,
  uploadedPrefix,
} from 'src/common/constants';
import { sdkStreamMixin } from '@aws-sdk/util-stream-node';

const importFileParser = async (event: S3Event) => {
  try {
    const s3 = new S3({ region: REGION });

    for (const record of event.Records) {
      const getCommand = new GetObjectCommand({
        Bucket: BUCKET,
        Key: record.s3.object.key,
      });

      const file = await s3.send(getCommand);

      const sdkStream = sdkStreamMixin(file.Body).pipe(csv());

      for await (const data of sdkStream) {
        console.log(data);
      }

      const copyParams = new CopyObjectCommand({
        Bucket: BUCKET,
        CopySource: `${BUCKET}/${record.s3.object.key}`,
        Key: record.s3.object.key.replace(uploadedPrefix, parsedPrefix),
      });

      try {
        await s3.send(copyParams);
      } catch (err) {
        console.error(err);
      }

      const deleteParams = new DeleteObjectCommand({
        Bucket: BUCKET,
        Key: record.s3.object.key,
      });

      try {
        await s3.send(deleteParams);
      } catch (err) {
        console.error(err);
      }

      console.log(`${record.s3.object.key.split('/')[1]} is created`);
    }
  } catch (error) {
    console.log(error);
  }
};

export const main = importFileParser;
