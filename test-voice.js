require('dotenv').config();
const { PollyClient, SynthesizeSpeechCommand } = require("@aws-sdk/client-polly");

const polly = new PollyClient({
  region: process.env.AWS_REGION || "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  },
});

async function run() {
  try {
    const command = new SynthesizeSpeechCommand({
      Engine: "neural",
      LanguageCode: "es-ES",
      OutputFormat: "mp3",
      Text: "<speak>Hola mundo</speak>",
      TextType: "ssml",
      VoiceId: "Lucia",
    });
    console.log("Sending Polly Request...");
    const response = await polly.send(command);
    console.log("Response:", response.AudioStream ? "Success" : "No Stream");
  } catch (err) {
    console.error("Polly API Error:", err);
  }
}
run();
