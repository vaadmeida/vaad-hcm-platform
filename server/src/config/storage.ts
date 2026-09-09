import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";

import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { AppError } from "../errors/appError.ts";

const region = process.env.STORAGE_REGION;
const bucket = process.env.STORAGE_BUCKET;

if (!region || !bucket) {
  throw new AppError(
    "Missing required S3 environment variables",
    500,
    "INTERNAL_SERVER_ERROR"
  );
}

const client = new S3Client({
  region,
});

export async function uploadFileToS3(
  key: string,
  buffer: Buffer,
  mimeType: string
) {
  await client.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: buffer,
      ContentType: mimeType,
    })
  );

  return key;
}

export async function getPresignedUrl(
  key: string,
  expiresIn: number = 900
): Promise<string> {
  const command = new GetObjectCommand({
    Bucket: bucket,
    Key: key,
  });

  return getSignedUrl(client, command, { expiresIn });
}

export async function deleteFromStorage(key: string): Promise<void> {
  await client.send(
    new DeleteObjectCommand({
      Bucket: bucket,
      Key: key,
    })
  );
}
