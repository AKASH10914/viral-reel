import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/current-user";
import { analyzeResumeATS } from "@/lib/ai-advanced";
import { incrementMatchUsage } from "@/lib/usage";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser(request);
    const { resumeText } = (await request.json()) as { resumeText: string };

    if (!resumeText || resumeText.trim().length < 50) {
      return NextResponse.json({ error: "Resume text must be at least 50 characters" }, { status: 400 });
    }

    const analysis = await analyzeResumeATS(resumeText);
    await incrementMatchUsage(user.id, 1);

    return NextResponse.json({ success: true, analysis });
  } catch (error) {
    console.error("ATS analysis error:", error);
    return NextResponse.json({ error: error instanceof Error ? error.message : "ATS analysis failed" }, { status: 500 });
  }
}
