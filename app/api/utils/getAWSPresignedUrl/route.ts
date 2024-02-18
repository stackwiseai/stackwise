import AWS from 'aws-sdk';

AWS.config.update({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const s3 = new AWS.S3();
    const { fileName, fileType } = body;
    const params = {
      Bucket: 'cover-image-and-subtitle-stack',
      Key: fileName,
      Expires: 60, // URL expiration time in seconds
      ContentType: fileType,
    };

    try {
      const presignedUrl = await s3.getSignedUrlPromise('putObject', params);
      return new Response(JSON.stringify({ url: presignedUrl }), {
        status: 200,
      });
    } catch (error) {
      return new Response(
        JSON.stringify({ error: 'Error creating presigned URL' }),
        { status: 500 },
      );
    }
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Bad Request' }), {
      status: 400,
    });
  }
}
