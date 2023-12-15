import Replicate from 'replicate';

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN as string,
});

export const maxDuration = 300;

export async function POST(request: Request) {
  const form = await request.formData();
  const musicLength = Number(form.get('length'));
  const imgFile = form.get('img') as Blob;
  const imgBuffer = Buffer.from(await imgFile.arrayBuffer());
  const imgBase64 = imgBuffer.toString('base64');
  const imgUri = `data:${imgFile.type};base64,${imgBase64}`;

  try {
    const llavaVersion =
      'yorickvp/llava-13b:e272157381e2a3bf12df3a8edd1f38d1dbd736bbb7437277c8b34175f8fce358';
    const llava: string[] = (await replicate.run(llavaVersion, {
      input: {
        image: imgUri,
        prompt: `Describe what kind of music this image invokes. Give a brief few word description of the image, then comment on the composition of musical elements to recreate this image through music.
Example responses:
Description: Sunrise illuminating a mountain range, with rays of light breaking through clouds, creating a scene of awe and grandeur.
Music: Edo25 major G melodies that sound triumphant and cinematic, leading up to a crescendo that resolves in a 9th harmonic, beginning with a gentle, mysterious introduction that builds into an epic, sweeping climax.

Description: A cozy, dimly lit room with a warm ambience, filled with soft shadows and a sense of quiet introspection.
Music: A jazz piece in B flat minor with a smooth saxophone solo, featuring complex rhythms and a moody, reflective atmosphere, starting with a soft, contemplative melody that evolves into an expressive, passionate finale.

Description: A bustling, neon-lit metropolis at night, alive with vibrant energy and a sense of futuristic progress.
Music: A techno track in A minor, characterized by fast-paced electronic beats, a pulsating bassline, and futuristic synth melodies, opening with a high-energy rhythm that climaxes in a whirlwind of electronic ecstasy.

Description: Urban streets at dusk, vibrant with street art and a pulse of lively, youthful energy.
Music: A rap beat in D minor, with heavy bass, crisp snare hits, and a catchy, repetitive melody suitable for dynamic flow, begins with a bold, assertive introduction that leads into a rhythmically complex and compelling outro.

Description: A peaceful beach with gentle waves, clear skies, and a sense of serene joy and relaxation.
Music: A reggae tune in E major, with a relaxed tempo, characteristic off-beat rhythms, and a laid-back, feel-good vibe, starts with a soothing, cheerful melody that gradually builds into a joyful, uplifting chorus.

Description: An electrifying rock concert, filled with intense energy, dramatic lighting, and a crowd caught up in the excitement.
Music: A heavy metal track in F sharp minor, driven by aggressive guitar riffs, fast drumming, and powerful, energetic vocals, opens with an intense, thunderous intro that crescendos into a fiery, explosive climax.

Description: A serene, mist-covered forest at dawn, bathed in a gentle, ethereal light that creates a sense of calm and wonder.
Music: An ambient piece in A flat major, featuring slow, ethereal synth pads, creating a calm, dreamy soundscape, begins with a delicate, otherworldly sound that slowly unfolds into a serene, peaceful conclusion.

Description: A lively party scene, bursting with color and energy, where people are lost in the moment of celebration and dance.
Music: An electronic dance music (EDM) anthem in B major, with a catchy hook, upbeat tempo, and an infectious rhythm designed for dance floors, starts with a vibrant, exhilarating beat that builds to a euphoric, dance-inducing peak.`,
      },
    })) as string[];

    const llavaPrediction: string = llava.join('');

    console.log(llavaPrediction);

    const regex = /Description:\s*(.*?)\s*Music:\s*(.*)/s;
    const match = llavaPrediction.match(regex);

    const musicGenVersion =
      'meta/musicgen:b05b1dff1d8c6dc63d14b0cdb42135378dcb87f6373b0d3d341ede46e59e2b38';
    const musicGen = await replicate.run(musicGenVersion, {
      input: {
        model_version: 'stereo-melody-large',
        prompt: match[1],
        duration: musicLength,
      },
    });

    return new Response(
      JSON.stringify({
        llavaResponse: { description: match[1], prompt: match[2] },
        audio: musicGen,
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.log(error);
    return new Response(JSON.stringify({ error }), {
      status: 500,
    });
  }
}
