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
          content: "You are NDE Automotive AI helping customers find automotive parts and accessories."
        },
        {
          role: "user",
          content: message
        }
      ]
    });

    return completion.choices[0].message.content;

  } catch (error) {

    console.error("AI error:", error);

    return "Hello 👋 How can I help you with automotive parts today?";
  }

}
