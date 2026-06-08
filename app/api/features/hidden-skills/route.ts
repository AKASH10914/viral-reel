import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/current-user";
import { detectHiddenSkills } from "@/lib/ai-advanced";
import { incrementMatchUsage } from "@/lib/usage";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser(request);
    const { resumeText } = (await request.json()) as { resumeText: string };

    if (!resumeText || resumeText.trim().length < 50) {
      return NextResponse.json({ error: "Resume text required" }, { status: 400 });
    }

    const hidden = await detectHiddenSkills(resumeText);
    await incrementMatchUsage(user.id, 1);

    return NextResponse.json({ success: true, hidden });
  } catch (error) {
    console.error("Hidden skills error:", error);
    return NextResponse.json({ error: error instanceof Error ? error.message : "Skill detection failed" }, { status: 500 });
  }
}
