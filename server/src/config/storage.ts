import  { DeleteObjectCommand, GetObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { AppError } from '../errors/appError.ts';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const region = process.env.STORAGE_REGION;
const accessKey = process.env.STORAGE_ACCESS_KEY;
const secretKey = process.env.STORAGE_SECRET_KEY;

if (!region || !accessKey || !secretKey) {
  throw new AppError(
            "Missing required environment variables for S3 configuration",
            500,
            "INTERNAL_SERVER_ERROR"
   );
}

const client = new S3Client({
  region,
  credentials: {
    accessKeyId: accessKey,
    secretAccessKey: secretKey,
  },
});

export async function uploadFileToS3( key: string, buffer: Buffer, mimeType: string) {
     await client.send( new PutObjectCommand({
       Bucket: process.env.STORAGE_BUCKET,
       Key: key,
       Body: buffer,
       ContentType: mimeType
     }))

     return key;
}

export async function getPresignedUrl(
  key: string,
  expiresIn: number = 900
): Promise<string> {
  const command = new GetObjectCommand({
    Bucket: process.env.STORAGE_BUCKET,
    Key: key,
  });

  return getSignedUrl(client, command, { expiresIn });
}

export async function deleteFromStorage(
  key: string
): Promise<void> {
  await client.send(
    new DeleteObjectCommand({
      Bucket: process.env.STORAGE_BUCKET!,
      Key: key,
    })
  );
}