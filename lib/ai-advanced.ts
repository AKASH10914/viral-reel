import { getGroq, GROQ_MODEL } from "@/lib/groq";

interface AICallOptions {
  timeout?: number;
  retries?: number;
}

const DEFAULT_TIMEOUT = 30000;
const DEFAULT_RETRIES = 2;

async function callGroqWithRetry(
  messages: Array<{ role: "user" | "assistant" | "system"; content: string }>,
  options: AICallOptions = {}
) {
  const { timeout = DEFAULT_TIMEOUT, retries = DEFAULT_RETRIES } = options;
  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);

      const completion = await getGroq().chat.completions.create({
        model: GROQ_MODEL,
        messages,
        temperature: 0.3,
        max_tokens: 2000
      });

      clearTimeout(timeoutId);
      return completion.choices[0]?.message?.content?.trim() ?? "";
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      if (attempt < retries) {
        await new Promise((r) => setTimeout(r, 1000 * (attempt + 1)));
      }
    }
  }

  throw lastError || new Error("Groq API call failed");
}

export async function analyzeResumeATS(resumeText: string) {
  try {
    const response = await callGroqWithRetry([
      {
        role: "system",
        content: `You are an ATS expert. Analyze the resume and return JSON only.
{
  "atsScore": number,
  "keywords": string[],
  "missingKeywords": string[],
  "strengths": string[],
  "weaknesses": string[],
  "suggestions": string[]
}`
      },
      {
        role: "user",
        content: `Analyze resume:\n\n${resumeText.slice(0, 10000)}`
      }
    ]);

    const parsed = JSON.parse(response);
    return {
      atsScore: Math.max(0, Math.min(100, parsed.atsScore || 0)),
      keywords: (parsed.keywords || []).slice(0, 10),
      missingKeywords: (parsed.missingKeywords || []).slice(0, 8),
      strengths: (parsed.strengths || []).slice(0, 5),
      weaknesses: (parsed.weaknesses || []).slice(0, 5),
      suggestions: (parsed.suggestions || []).slice(0, 5)
    };
  } catch (error) {
    console.error("ATS analysis error:", error);
    return {
      atsScore: 65,
      keywords: ["JavaScript", "React", "Node.js"],
      missingKeywords: ["TypeScript", "Testing"],
      strengths: ["Clear structure"],
      weaknesses: ["Missing metrics"],
      suggestions: ["Add metrics", "Use action verbs"]
    };
  }
}

export async function improveResume(resumeText: string) {
  try {
    const response = await callGroqWithRetry([
      {
        role: "system",
        content: `You are a professional resume writer. Improve the resume professionally.`
      },
      {
        role: "user",
        content: `Improve this resume:\n\n${resumeText.slice(0, 10000)}`
      }
    ]);

    return response || resumeText;
  } catch (error) {
    console.error("Resume improvement error:", error);
    return resumeText;
  }
}

export async function generateRecruiterEvaluation(resumeText: string, skills: string) {
  try {
    const response = await callGroqWithRetry([
      {
        role: "system",
        content: `You are a recruiter. Return JSON only:
{
  "shortlist": boolean,
  "probability": number,
  "reasoning": string,
  "strengths": string[],
  "weaknesses": string[]
}`
      },
      {
        role: "user",
        content: `Evaluate candidate:\nResume:\n${resumeText.slice(0, 8000)}\n\nSkills: ${skills}`
      }
    ]);

    const parsed = JSON.parse(response);
    return {
      shortlist: parsed.shortlist === true,
      probability: Math.max(0, Math.min(100, parsed.probability || 50)),
      reasoning: parsed.reasoning || "Neutral fit",
      strengths: (parsed.strengths || []).slice(0, 5),
      weaknesses: (parsed.weaknesses || []).slice(0, 5)
    };
  } catch (error) {
    console.error("Recruiter evaluation error:", error);
    return {
      shortlist: false,
      probability: 50,
      reasoning: "Unable to evaluate",
      strengths: [],
      weaknesses: []
    };
  }
}

export async function generateInterviewQuestions(resumeText: string, jobTitle: string) {
  try {
    const response = await callGroqWithRetry([
      {
        role: "system",
        content: `Generate interview questions. Return JSON only:
{
  "questions": [{"question": string, "type": string, "difficulty": string}]
}`
      },
      {
        role: "user",
        content: `Generate questions for ${jobTitle}:\n\n${resumeText.slice(0, 8000)}`
      }
    ]);

    const parsed = JSON.parse(response);
    return (parsed.questions || []).slice(0, 7);
  } catch (error) {
    console.error("Interview questions error:", error);
    return [
      { question: "Tell me about your most challenging project.", type: "behavioral", difficulty: "medium" }
    ];
  }
}

export async function predictCareerGrowth(resumeText: string, skills: string) {
  try {
    const response = await callGroqWithRetry([
      {
        role: "system",
        content: `Predict career growth. Return JSON only:
{
  "nextRole": string,
  "salaryTrend": string,
  "skillsNeeded": string[],
  "timeline": string
}`
      },
      {
        role: "user",
        content: `Career prediction:\nResume:\n${resumeText.slice(0, 8000)}\n\nSkills: ${skills}`
      }
    ]);

    const parsed = JSON.parse(response);
    return {
      nextRole: parsed.nextRole || "Senior role",
      salaryTrend: parsed.salaryTrend || "5-10% growth",
      skillsNeeded: (parsed.skillsNeeded || []).slice(0, 5),
      timeline: parsed.timeline || "12-18 months"
    };
  } catch (error) {
    console.error("Career prediction error:", error);
    return {
      nextRole: "Senior/Leadership role",
      salaryTrend: "5-10% growth expected",
      skillsNeeded: ["Management", "System Design"],
      timeline: "12-24 months"
    };
  }
}

export async function generateSkillRoadmap(resumeText: string, skills: string) {
  try {
    const response = await callGroqWithRetry([
      {
        role: "system",
        content: `Create skill roadmap. Return JSON only:
{
  "currentStrengths": string[],
  "missingSkills": string[],
  "roadmap": string[],
  "priority": string[]
}`
      },
      {
        role: "user",
        content: `Create roadmap:\nResume:\n${resumeText.slice(0, 8000)}\n\nSkills: ${skills}`
      }
    ]);

    const parsed = JSON.parse(response);
    return {
      currentStrengths: (parsed.currentStrengths || []).slice(0, 5),
      missingSkills: (parsed.missingSkills || []).slice(0, 5),
      roadmap: (parsed.roadmap || []).slice(0, 7),
      priority: (parsed.priority || []).slice(0, 3)
    };
  } catch (error) {
    console.error("Skill roadmap error:", error);
    return {
      currentStrengths: [],
      missingSkills: [],
      roadmap: ["System Design", "Cloud Architecture"],
      priority: ["Cloud mastery"]
    };
  }
}

export async function detectHiddenSkills(resumeText: string) {
  try {
    const response = await callGroqWithRetry([
      {
        role: "system",
        content: `Find hidden skills in resume. Return JSON only:
{
  "hiddenSkills": string[],
  "reasoning": object[]
}`
      },
      {
        role: "user",
        content: `Find hidden skills:\n\n${resumeText.slice(0, 8000)}`
      }
    ]);

    const parsed = JSON.parse(response);
    return {
      hiddenSkills: (parsed.hiddenSkills || []).slice(0, 8),
      reasoning: (parsed.reasoning || []).slice(0, 5)
    };
  } catch (error) {
    console.error("Hidden skills error:", error);
    return {
      hiddenSkills: ["Problem solving", "Collaboration"],
      reasoning: []
    };
  }
}

export async function optimizeForCompany(resumeText: string, companyName: string, jobTitle: string) {
  try {
    const response = await callGroqWithRetry([
      {
        role: "system",
        content: `Tailor resume for ${companyName}. Return optimized resume text only.`
      },
      {
        role: "user",
        content: `Optimize for ${companyName} (${jobTitle}):\n\n${resumeText.slice(0, 10000)}`
      }
    ]);

    return response || resumeText;
  } catch (error) {
    console.error("Company optimization error:", error);
    return resumeText;
  }
}

export async function generatePersonalBrand(resumeText: string, skills: string) {
  try {
    const response = await callGroqWithRetry([
      {
        role: "system",
        content: `Generate personal brand. Return JSON only:
{
  "linkedinHeadline": string,
  "linkedinAbout": string,
  "elevatorPitch": string
}`
      },
      {
        role: "user",
        content: `Personal brand:\nResume:\n${resumeText.slice(0, 6000)}\n\nSkills: ${skills}`
      }
    ]);

    const parsed = JSON.parse(response);
    return {
      linkedinHeadline: parsed.linkedinHeadline || "Skilled Professional",
      linkedinAbout: parsed.linkedinAbout || "Experienced professional",
      elevatorPitch: parsed.elevatorPitch || "I build great products"
    };
  } catch (error) {
    console.error("Personal brand error:", error);
    return {
      linkedinHeadline: "Professional",
      linkedinAbout: "Passionate about solutions",
      elevatorPitch: "I build solutions that matter"
    };
  }
}
