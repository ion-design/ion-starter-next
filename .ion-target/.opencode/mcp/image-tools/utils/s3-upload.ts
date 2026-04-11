import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';

/**
 * Uploads a buffer to S3
 * @param buffer - The file buffer to upload
 * @param key - The S3 object key (path/filename)
 * @param contentType - The MIME type of the file
 * @returns URL of the uploaded file or throws if upload fails
 */
export async function uploadToS3(
  buffer: Buffer,
  key: string,
  contentType: string
): Promise<string> {
  // Check if AWS credentials are configured
  const accessKeyId = process.env.AWS_S3_ACCESS_KEY_ID;
  const secretAccessKey = process.env.AWS_S3_SECRET_ACCESS_KEY;
  const bucketName = process.env.AWS_S3_BUCKET_NAME;
  const region = process.env.AWS_S3_REGION || process.env.AWS_REGION;

  if (!accessKeyId || !secretAccessKey || !bucketName || !region) {
    throw new Error(
      `AWS S3 credentials not configured. Missing: ${[
        !accessKeyId && 'AWS_S3_ACCESS_KEY_ID',
        !secretAccessKey && 'AWS_S3_SECRET_ACCESS_KEY',
        !bucketName && 'AWS_S3_BUCKET_NAME',
        !region && 'AWS_S3_REGION',
      ]
        .filter(Boolean)
        .join(', ')}`
    );
  }

  const s3Client = new S3Client({
    region,
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
  });

  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: key,
    Body: buffer,
    ContentType: contentType,
  });

  await s3Client.send(command);

  return `https://${bucketName}.s3.${region}.amazonaws.com/${key}`;
}
