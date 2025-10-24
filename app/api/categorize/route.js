import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

const CATEGORIES = [
    "Food",
    "Transport",
    "Entertainment",
    "Shopping",
    "Utilities",
    "Health",
    "Education",
    "Other",
];

export async function POST(req) {
    const { name, description } = await req.json();

    if (!name) {
        return NextResponse.json(
            { error: "Missing expense name" },
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

    const systemInstruction = `You are an intelligent expense categorizer. Based on the following item name and description, select the SINGLE most appropriate category from the allowed list: ${CATEGORIES.join(
        ", "
    )}. You must only select a category that exists in this list.`;

    const responseSchema = {
        type: "object",
        properties: {
            category: {
                type: "string",
                description: `The suggested expense category, must be one of: ${CATEGORIES.join(
                    ", "
                )}`,
            },
        },
        required: ["category"],
    };

    const userPrompt = `Item: "${name}". Description: "${
        description || "No specific description provided."
    }". Suggest the best category.`;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: [{ role: "user", parts: [{ text: userPrompt }] }],
            config: {
                systemInstruction: systemInstruction,
                responseMimeType: "application/json",
                responseSchema: responseSchema,
            },
        });

        const jsonText = response.text.trim();
        const parsedData = JSON.parse(jsonText);

        const suggestedCategory = parsedData.category;

        if (suggestedCategory && CATEGORIES.includes(suggestedCategory)) {
            return NextResponse.json({ category: suggestedCategory });
        } else if (suggestedCategory) {
            console.warn(
                `Model suggested non-listed category: ${suggestedCategory}. Defaulting to 'Other'.`
            );
            return NextResponse.json({ category: "Other" });
        } else {
            return NextResponse.json(
                {
                    error: "AI failed to return a valid category.",
                },
                { status: 500 }
            );
        }
    } catch (error) {
        console.error("Gemini API error during categorization:", error);
        return NextResponse.json(
            {
                error: "Failed to fetch AI category suggestion",
                details: error.message,
            },
            { status: 500 }
        );
    }
}
