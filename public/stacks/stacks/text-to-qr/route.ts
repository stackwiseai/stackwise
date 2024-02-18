import Replicate from 'replicate';

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN!,
});

export const maxDuration = 300;

export async function POST(req: Request) {
  const { qrPrompt, url } = await req.json();

  try {
    const controlNetVersion =
      'zylim0702/qr_code_controlnet:628e604e13cf63d8ec58bd4d238474e8986b054bc5e1326e50995fdbc851c557';
    const qrCode = await replicate.run(controlNetVersion, {
      input: {
        url: url,
        prompt: qrPrompt,
        qr_conditioning_scale: 1.3,
      },
    });

    return new Response(
      JSON.stringify({
        img: qrCode,
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      },
    );
  } catch (error) {
    console.log(error);
    return new Response(JSON.stringify({ error }), {
      status: 500,
    });
  }
}
