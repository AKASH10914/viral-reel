import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/current-user";
import { improveResume } from "@/lib/ai-advanced";
import { incrementMatchUsage } from "@/lib/usage";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser(request);
    const { resumeText } = (await request.json()) as { resumeText: string };

    if (!resumeText || resumeText.trim().length < 50) {
      return NextResponse.json({ error: "Resume text must be at least 50 characters" }, { status: 400 });
    }

    const improvedResume = await improveResume(resumeText);
    await incrementMatchUsage(user.id, 1);

    return NextResponse.json({ success: true, improved: improvedResume, original: resumeText });
  } catch (error) {
    console.error("Resume improvement error:", error);
    return NextResponse.json({ error: error instanceof Error ? error.message : "Resume improvement failed" }, { status: 500 });
  }
}
