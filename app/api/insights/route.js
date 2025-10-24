import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

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

    const ai = new GoogleGenAI({ apiKey });

    const systemInstruction = `Analyze the following expenses and provide detailed financial insights and recommendations based on the user's question. The expenses provided are: ${JSON.stringify(
        expenses
    )}`;

    const responseSchema = {
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
    };

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: [{ role: "user", parts: [{ text: question }] }],
            config: {
                systemInstruction: systemInstruction,
                responseMimeType: "application/json",
                responseSchema: responseSchema,
            },
        });

        const jsonText = response.text.trim();
        const parsedData = JSON.parse(jsonText);

        const insights = parsedData.insights;

        if (!insights) {
            return NextResponse.json(
                {
                    error: "No insights found in the response body from the model.",
                },
                { status: 500 }
            );
        }

        return NextResponse.json({ insights });
    } catch (error) {
        console.error("Gemini API error:", error);
        return NextResponse.json(
            {
                error: "Failed to fetch insights from Gemini API",
                details: error.message,
            },
            { status: 500 }
        );
    }
}
