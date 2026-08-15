import { GoogleGenAI } from "@google/genai";
import { ApiError } from "../utils/ApiError";
import { Schema } from "mongoose";
import { response } from "express";
import { config } from "dotenv";

let client = null;

// Initializing the gemini api key

const getClient = () => {

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        throw new ApiError(503,
            "Gemini API key is not configured. Add GEMINI_API_KEY to the backend .env file"
        );
    }
    if (!client) client = new GoogleGenAI({ apiKey });
    return client;
};


const MODEL = () => process.env.GEMINI_MODEL || "gemini-2.5-flash";

export const isAIConfigured = () => Boolean(process.env.GEMINI_API_KEY);

// Function to generate the response from the gemini AI.

const generateJSON = async (prompt, schema) => {
    const ai = getClient();
    try {
        const response = await ai.models.generateContent({
            model: MODEL(),
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: schema,
                temperature: 0.6,
            },
        });

        return JSON.parse(response.text);
    } catch (err) {
        console.error("Gemini JSON error: ", err?.message || err);
        throw new ApiError(502, "AI request failed. Please Try again in a moment");

    }
};


// Function to Generate the Text 

const generateText = async (prompt, temperature = 0.7) => {
    const ai = getClient();
    try {
        const response = await ai.models.generateContent({
            model: MODEL(),
            contents: prompt,
            config: { temperature }
        });
        return response.text.trim();
    } catch (err) {
        console.error("Gemini Text error: ", err?.message || err);
        throw new ApiError(502, "AI request failed. Please Try again in a moment");
    }
};


// AI feature 1:  To Generate the lead summary

export const generateLeadSummary = async (lead) => {    // will update the CRM name TO NEXA, or ARC
    const prompt = `You are an expert B2B sales analyst for a CRM called TTP CRM  
Analyse the following sales lead and produce a consise statement.
    
Lead Details:
— Name: ${lead.name || "N/A"} 
— Company: ${lead.company || "N/A"}
— Email: ${lead.email || "N/A"}
— Current pipeline stage: ${lead.status || "New"}
— Potential Deal Value: ${lead.value || 0}
— Source: ${lead.source || "Unknown"}
— Notes: ${lead.notes || "None"}
    
    
Return JSON only.`;

    const schema = {
        type: "object",
        properties: {
            summary: {
                type: "string",
                description: "2-3 sentence executive summary of the lead",
            },

            riskScore: {
                type: "integer",
                description: "Risk of loosing this deal, 0 (safe) to 100 (high risk)",
            },

            suggestedPriority: {
                type: "string",
                enum: ["Low", "Medium", "High"],
            },

            nextBestAction: {
                type: "string",
                description: "one concrete recommended next step",
            },

        },
        required: ["summary", "riskScore", "suggestedPriority", "nextBestAction"],

    };
    return generateJSON(prompt, schema);
}

// AI feature 2: to Generate the emails

export const generateEmail =  async({ lead, purpose, tone, sender}) => {
    const prompt = `You are a senior sales representative writing on behalf of ${
        sender?.name || "our team"
    } ${sender?.company ? `at ${sender.company}`: ""}.
    
Write a professional sales email.
Purpose: ${purpose || "follow-up"}
Desired tone: ${tone || "friendly or professional"}

Recipient (lead) details:
— Name: ${lead?.name || "there"}
— Company: $${lead?.company || "N/A"}
— Pipeline stage: ${lead?.status || "New"}
— Context / notes: ${lead?.notes || "none"}

Return JSON only with a compelling subject line and a complete email body.
use line breaks (\\n) in the body. keep it under 180 words sign off as ${
    sender?.name || "the TTM CRM team"
    }.`;

    const schema = {
        type: "object",
        properties: {
            subject: { type: "string" },
            body: { type: "string" },
        },
        required: ["subject", "body"],
    };

    return generateEmail(prompt, schema);

};