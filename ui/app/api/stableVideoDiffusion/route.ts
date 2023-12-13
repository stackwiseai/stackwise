import * as fal from '@fal-ai/serverless-client';
import fs from 'fs-extra';

export const config = { api: { bodyParser: false } };

fal.config({
  credentials: `${process.env.FAL_KEY_ID}:${process.env.FAL_KEY_SECRET}`,
});

export async function POST(request: Request) {
  let resp = null;

  const form = await request.formData();
  const imgFile = form.get('img') as Blob;
  const maskFile = form.get('mask') as Blob;

  const imgBuffer = Buffer.from(await imgFile.arrayBuffer());
  const maskBuffer = Buffer.from(await maskFile.arrayBuffer());

  const imgBase64 = imgBuffer.toString('base64');
  const maskBase64 = maskBuffer.toString('base64');

  // Generate a full URI
  const imgUri = `data:${imgFile.type};base64,${imgBase64}`;
  const maskUri = `data:${maskFile.type};base64,${maskBase64}`;

  const payload = {
    subscriptionId: '110602490-svd',
    input: {
      image_url: imgUri,
      mask_image_url: maskUri,
      motion_bucket_id: 15,
      cond_aug: 0.02,
      steps: 100,
    },
    pollInterval: 500,
    logs: true,
  };

  try {
    const result: any = await fal.subscribe(payload.subscriptionId, payload);

    resp = result;
  } catch (error) {
    console.log(error);
    return new Response(JSON.stringify({ error }), {
      status: 500,
    });
  }

  return new Response(JSON.stringify(resp), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}
