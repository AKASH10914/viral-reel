import { SignedIn, SignedOut, SignInButton, SignUpButton } from "@clerk/nextjs";
import Link from "next/link";
import { ArrowRight, BriefcaseBusiness, FileText, Sparkles, Target } from "lucide-react";

import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const metrics = [
  { label: "Resume parsed", value: "PDF + text" },
  { label: "AI model", value: "Groq Mixtral" },
  { label: "Free tier", value: "20 matches/day" }
];

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <header className="border-b bg-background/80 backdrop-blur">
        <div className="container flex h-16 items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-sm font-bold text-primary-foreground">
              AI
            </span>
            <span className="font-semibold">AI Job Application Autopilot</span>
          </Link>
          <div className="flex items-center gap-2">
            <Link className="hidden text-sm text-muted-foreground hover:text-foreground sm:inline" href="/pricing">
              Pricing
            </Link>
            <ModeToggle />
            <SignedOut>
              <SignInButton mode="modal">
                <Button variant="outline">Sign in</Button>
              </SignInButton>
              <SignUpButton mode="modal">
                <Button>Start free</Button>
              </SignUpButton>
            </SignedOut>
            <SignedIn>
              <Button asChild>
                <Link href="/dashboard">Dashboard</Link>
              </Button>
            </SignedIn>
          </div>
        </div>
      </header>

      <section className="container grid min-h-[calc(100vh-4rem)] items-center gap-10 py-14 lg:grid-cols-[1fr_0.9fr]">
        <div>
          <div className="inline-flex items-center gap-2 rounded-md border bg-card px-3 py-1 text-sm text-muted-foreground">
            <Sparkles className="h-4 w-4 text-primary" />
            Resume intelligence for serious job searches
          </div>
          <h1 className="mt-6 max-w-4xl text-balance text-4xl font-semibold tracking-normal sm:text-5xl lg:text-6xl">
            AI Job Application Autopilot
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-muted-foreground">
            Upload a resume, extract skills, match against live remote roles, generate tailored applications, and track every opportunity.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <SignedOut>
              <SignUpButton mode="modal">
                <Button size="lg">
                  Start free
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </SignUpButton>
            </SignedOut>
            <SignedIn>
              <Button size="lg" asChild>
                <Link href="/dashboard">
                  Open dashboard
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </SignedIn>
            <Button size="lg" variant="outline" asChild>
              <Link href="/pricing">View pricing</Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
