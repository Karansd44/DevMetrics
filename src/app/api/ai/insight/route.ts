import { NextResponse } from "next/server";
import OpenAI from "openai";

export async function POST(request: Request) {
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
        console.error("[AI Insight] OPENAI_API_KEY is not set in .env");
        return NextResponse.json({ insight: "AI analysis unavailable — API key not configured." });
    }

    const openai = new OpenAI({ apiKey });

    const { stats } = await request.json();

    const prompt = `
    Analyze this GitHub developer's stats:
    - Total Repos: ${stats.totalRepos}
    - Total Stars: ${stats.totalStars}
    - Top Languages: ${stats.topLanguages.map((l: any) => l.language).join(", ")}
    
    Write 2 short, punchy sentences analyzing their developer profile. 
    Mention their strongest language and give a constructive tip for career growth.
  `;

    try {
        const completion = await openai.chat.completions.create({
            messages: [{ role: "system", content: "You are a helpful technical career coach." },
            { role: "user", content: prompt }],
            model: "gpt-4o-mini",
        });

        return NextResponse.json({ insight: completion.choices[0].message.content });
    } catch (error: any) {
        console.error("[AI Insight] OpenAI API error:", error?.message || error);
        return NextResponse.json({ insight: "AI analysis unavailable. Keep coding!" });
    }
}
