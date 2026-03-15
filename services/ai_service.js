import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export default async function generateAIReply(message) {

  try {

    const response = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        {
          role: "system",
          content: "You are NDE Automotive AI assistant helping customers find auto parts and accessories."
        },
        {
          role: "user",
          content: message
        }
      ]
    });

    return response.choices[0].message.content;

  } catch (error) {

    console.error("AI Error:", error);

    return "Hello 👋\nHow can I help you with automotive parts today?";
  }

}
