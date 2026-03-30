import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  ListObjectsV2Command,
  DeleteObjectsCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

function getR2Client() {
  return new S3Client({
    region: "auto",
    endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: process.env.R2_ACCESS_KEY_ID!,
      secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
    },
  });
}

export async function generateUploadUrl(key: string, contentType: string, maxSize?: number) {
  const client = getR2Client();
  const command = new PutObjectCommand({
    Bucket: process.env.R2_BUCKET_NAME!,
    Key: key,
    ContentType: contentType,
    ...(maxSize ? { ContentLength: maxSize } : {}),
  });

  const signedUrl = await getSignedUrl(client, command, { expiresIn: 600 });
  const publicUrl = `${process.env.R2_PUBLIC_URL}/${key}`;

  return { signedUrl, publicUrl };
}

export async function uploadToR2(
  key: string,
  body: Buffer,
  contentType: string,
): Promise<string> {
  const client = getR2Client();
  const command = new PutObjectCommand({
    Bucket: process.env.R2_BUCKET_NAME!,
    Key: key,
    Body: body,
    ContentType: contentType,
  });
  await client.send(command);
  return `${process.env.R2_PUBLIC_URL}/${key}`;
}

export async function deleteFromR2(key: string): Promise<void> {
  const client = getR2Client();
  await client.send(
    new DeleteObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME!,
      Key: key,
    }),
  );
}

export async function deleteUserR2Files(userId: string): Promise<void> {
  const client = getR2Client();
  const bucket = process.env.R2_BUCKET_NAME!;
  const prefix = `uploads/${userId}/`;

  let continuationToken: string | undefined;

  do {
    const listCommand = new ListObjectsV2Command({
      Bucket: bucket,
      Prefix: prefix,
      ContinuationToken: continuationToken,
    });

    const listResult = await client.send(listCommand);

    if (listResult.Contents && listResult.Contents.length > 0) {
      const objects = listResult.Contents
        .filter((obj) => obj.Key)
        .map((obj) => ({ Key: obj.Key! }));

      if (objects.length > 0) {
        const deleteCommand = new DeleteObjectsCommand({
          Bucket: bucket,
          Delete: { Objects: objects },
        });
        await client.send(deleteCommand);
      }
    }

    continuationToken = listResult.IsTruncated
      ? listResult.NextContinuationToken
      : undefined;
  } while (continuationToken);
}
