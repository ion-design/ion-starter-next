import { tool } from "@opencode-ai/plugin"

export default tool({
  description:
    'Download an image from a URL and upload it to S3. Returns the S3 URL. Used by the asset-tagger agent.',
  args: {
    imageUrl: tool.schema.string().describe('The source URL of the image to download and upload'),
    filename: tool.schema.string().describe('Desired filename for the S3 object (e.g. "hero-image.png"). Will be placed under brand-assets/ prefix.'),
  },
  async execute(args) {
    const { PutObjectCommand, S3Client } = await import('@aws-sdk/client-s3')
    const crypto = await import('node:crypto')

    const accessKeyId = process.env.AWS_S3_ACCESS_KEY_ID
    const secretAccessKey = process.env.AWS_S3_SECRET_ACCESS_KEY
    const bucketName = process.env.AWS_S3_BUCKET_NAME
    const region = process.env.AWS_S3_REGION || process.env.AWS_REGION

    if (!accessKeyId || !secretAccessKey || !bucketName || !region) {
      const missing = [
        !accessKeyId && 'AWS_S3_ACCESS_KEY_ID',
        !secretAccessKey && 'AWS_S3_SECRET_ACCESS_KEY',
        !bucketName && 'AWS_S3_BUCKET_NAME',
        !region && 'AWS_S3_REGION',
      ].filter(Boolean).join(', ')
      return `S3 upload skipped — missing env vars: ${missing}. Asset URL: ${args.imageUrl}`
    }

    const response = await fetch(args.imageUrl)
    if (!response.ok) {
      return `Failed to download image: ${response.status} ${response.statusText} — ${args.imageUrl}`
    }

    const buffer = Buffer.from(await response.arrayBuffer())
    const contentType = response.headers.get('content-type') || 'image/png'

    const hash = crypto.createHash('md5').update(buffer).digest('hex').slice(0, 8)
    const key = `brand-assets/${hash}-${args.filename}`

    const s3Client = new S3Client({
      region,
      credentials: { accessKeyId, secretAccessKey },
    })

    await s3Client.send(new PutObjectCommand({
      Bucket: bucketName,
      Key: key,
      Body: buffer,
      ContentType: contentType,
    }))

    const s3Url = `https://${bucketName}.s3.${region}.amazonaws.com/${key}`
    return `Uploaded to ${s3Url} (${Math.round(buffer.byteLength / 1024)}KB, ${contentType})`
  },
})