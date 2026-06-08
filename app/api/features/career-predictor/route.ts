import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/current-user";
import { predictCareerGrowth } from "@/lib/ai-advanced";
import { incrementMatchUsage } from "@/lib/usage";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser(request);
    const { resumeText, skills } = (await request.json()) as { resumeText: string; skills: string };

    if (!resumeText || resumeText.trim().length < 50) {
      return NextResponse.json({ error: "Resume text required" }, { status: 400 });
    }

    const prediction = await predictCareerGrowth(resumeText, skills || "");
    await incrementMatchUsage(user.id, 1);

    return NextResponse.json({ success: true, prediction });
  } catch (error) {
    console.error("Career prediction error:", error);
    return NextResponse.json({ error: error instanceof Error ? error.message : "Prediction failed" }, { status: 500 });
  }
}
