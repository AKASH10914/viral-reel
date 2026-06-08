import Groq from "groq-sdk";

let client: Groq | null = null;

export function getGroq() {
  const apiKey = process.env.GROQ_API_KEY;
  
  if (!apiKey || apiKey.trim() === "") {
    throw new Error("GROQ_API_KEY environment variable is not set or is empty");
  }

  if (!client) {
    try {
      client = new Groq({ apiKey });
    } catch (error) {
      throw new Error(`Failed to initialize Groq client: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  }

  return client;
}

export const GROQ_MODEL = process.env.GROQ_MODEL || "mixtral-8x7b-32768";
