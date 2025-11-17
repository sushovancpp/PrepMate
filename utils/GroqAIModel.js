// utils/GroqAIModel.js

const GROQ_API_KEY = process.env.NEXT_PUBLIC_GROQ_API_KEY;

export async function groqChat(prompt) {
  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",  
        messages: [
          { role: "user", content: prompt }
        ],
        temperature: 0.4,
      }),
    });

    const data = await response.json();

    // Handle API errors
    if (!response.ok) {
      console.error("❌ Groq API Error:", data);
      throw new Error(data?.error?.message || "Groq API error");
    }

    // Validate final content
    if (!data.choices?.length) {
      throw new Error("No choices returned from Groq API");
    }

    return data.choices[0].message.content;

  } catch (err) {
    console.error("🔥 Groq Exception:", err);
    throw err;
  }
}
