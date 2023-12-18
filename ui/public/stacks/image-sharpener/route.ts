import Replicate from 'replicate';

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN!,
});

export const maxDuration = 300;

export async function POST(request: Request) {
  const form = await request.formData();
  const imgFile = form.get('img') as Blob;
  const imgBuffer = Buffer.from(await imgFile.arrayBuffer());
  const imgBase64 = imgBuffer.toString('base64');
  const imgUri = `data:${imgFile.type};base64,${imgBase64}`;

  try {
    const esrganVersion =
      'nightmareai/real-esrgan:42fed1c4974146d4d2414e2be2c5277c7fcf05fcc3a73abf41610695738c1d7b';
    const esrgan = await replicate.run(esrganVersion, {
      input: {
        image: imgUri,
        face_enhance: true,
      },
    });

    return new Response(JSON.stringify(esrgan), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.log(error);
    return new Response(JSON.stringify({ error }), {
      status: 500,
    });
  }
}
