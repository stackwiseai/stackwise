import * as fal from '@fal-ai/serverless-client';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '50mb',
    },
  },
};

fal.config({
  credentials: `${process.env.FAL_KEY_ID}:${process.env.FAL_KEY_SECRET}`,
});

export async function POST(request: Request) {
  let resp = null;

  const { img, mask } = await request.json();

  const payload = {
    subscriptionId: '110602490-svd',
    input: {
      image_url: img,
      mask_image_url: mask,
      sync_mode: true,
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
