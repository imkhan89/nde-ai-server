import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export default async function generateAIReply(message) {

  try {

    const completion = await client.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        {
          role: "system",
          content: "You are NDE Automotive AI assistant helping customers find auto parts."
        },
        {
          role: "user",
          content: message
        }
      ]
    });

    return completion.choices[0].message.content;

  } catch (err) {

    console.error("AI error:", err);

    return "Hello 👋\n\nHow can I help you with automotive parts today?";
  }
}
