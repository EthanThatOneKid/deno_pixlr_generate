import { decodeBase64 } from "https://deno.land/std@0.204.0/encoding/base64.ts";

if (import.meta.main) {
  await generate({
    width: 512,
    height: 512,
    amount: 2,
    prompt: [
      {
        text:
          "futuristic city, neon lights, centered shot, wide angle, full body, dd, fantasy, highly detailed, digital painting, artstation, smooth, sharp focus, digital art",
        weight: 0.5,
      },
      {
        text:
          "missing legs, missing feet, worst quality, low quality, jpeg artifacts, signature, logo, watermark, text, realistic, hyper-realistic, ultra-detailed, RAW photo",
        weight: -1,
      },
    ],
  });
}

interface GenerateOptions {
  width: number;
  height: number;
  amount: number;
  prompt: {
    text: string;
    weight: number;
  }[];
}

async function generate(o: GenerateOptions) {
  await fetch("https://pixlr.com/api/openai/generate", {
    headers: {
      accept: "*/*",
      "accept-language": "en-US,en;q=0.9",
      "content-type": "application/json",
      "sec-ch-ua":
        '"Google Chrome";v="117", "Not;A=Brand";v="8", "Chromium";v="117"',
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": '"Windows"',
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-origin",
    },
    referrerPolicy: "no-referrer",
    body: JSON.stringify(o),
    method: "POST",
    mode: "cors",
    credentials: "include",
  })
    .then((res) => res.json())
    .then((res) => {
      console.log(res);
      return res.data as string[];
    })
    .then((res) =>
      Promise.all(
        res.map((uri: string, i) => writeFile(`./out_${i}.png`, uri)),
      )
    )
    .catch(console.error);
}

async function writeFile(path: string, uri: string) {
  const { 1: b64url } = uri.split(",");
  const data = decodeBase64(b64url);
  await Deno.writeFile(path, data);
}
