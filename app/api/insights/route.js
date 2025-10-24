import { NextResponse } from "next/server";

export async function POST(req) {
    const { question, expenses } = await req.json();
    console.log(question, expenses);

    if (!question || !expenses) {
        return NextResponse.json(
            { error: "Missing question or expenses data" },
            { status: 400 }
        );
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        return NextResponse.json(
            { error: "Gemini API key is missing" },
            { status: 500 }
        );
    }

    const messages = [
        {
            role: "user",
            parts: [{ text: question }],
        },
        {
            role: "system",
            parts: [
                {
                    text: `Analyze the following expenses and provide insights: ${JSON.stringify(
                        expenses
                    )}`,
                },
            ],
        },
    ];

    const body = JSON.stringify({
        contents: messages,
        generationConfig: {
            responseMimeType: "application/json",
            responseSchema: {
                type: "object",
                properties: {
                    insights: {
                        type: "array",
                        items: {
                            type: "object",
                            properties: {
                                title: { type: "string" },
                                description: { type: "string" },
                            },
                            required: ["title", "description"],
                        },
                    },
                },
                required: ["insights"],
            },
        },
    });

    try {
        const response = await fetch(
            "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-goog-api-key": apiKey,
                },
                body,
            }
        );

        if (!response.ok) {
            const errorData = await response.json();
            return NextResponse.json(errorData, { status: response.status });
        }

        const data = await response.json();
        const insights =
            data.candidates?.[0]?.content?.parts?.[0]?.json?.insights;

        if (!insights) {
            return NextResponse.json(
                { error: "No insights found in the response" },
                { status: 500 }
            );
        }

        return NextResponse.json({ insights });
    } catch (error) {
        console.error("Gemini API error:", error);
        return NextResponse.json(
            { error: "Failed to fetch insights from Gemini API" },
            { status: 500 }
        );
    }
}
