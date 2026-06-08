import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/current-user";
import { optimizeForCompany } from "@/lib/ai-advanced";
import { incrementMatchUsage } from "@/lib/usage";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser(request);
    const { resumeText, companyName, jobTitle } = (await request.json()) as {
      resumeText: string;
      companyName: string;
      jobTitle: string;
    };

    if (!resumeText || resumeText.trim().length < 50) {
      return NextResponse.json({ error: "Resume text required" }, { status: 400 });
    }

    const optimized = await optimizeForCompany(resumeText, companyName || "Target Company", jobTitle || "Target Role");
    await incrementMatchUsage(user.id, 1);

    return NextResponse.json({ success: true, optimized });
  } catch (error) {
    console.error("Company optimization error:", error);
    return NextResponse.json({ error: error instanceof Error ? error.message : "Optimization failed" }, { status: 500 });
  }
}
