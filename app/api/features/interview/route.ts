import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/current-user";
import { generateInterviewQuestions } from "@/lib/ai-advanced";
import { incrementMatchUsage } from "@/lib/usage";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser(request);
    const { resumeText, jobTitle } = (await request.json()) as { resumeText: string; jobTitle: string };

    if (!resumeText || resumeText.trim().length < 50) {
      return NextResponse.json({ error: "Resume text required" }, { status: 400 });
    }

    const questions = await generateInterviewQuestions(resumeText, jobTitle || "Software Engineer");
    await incrementMatchUsage(user.id, 1);

    return NextResponse.json({ success: true, questions });
  } catch (error) {
    console.error("Interview questions error:", error);
    return NextResponse.json({ error: error instanceof Error ? error.message : "Question generation failed" }, { status: 500 });
  }
}
