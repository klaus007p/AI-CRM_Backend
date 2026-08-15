import { GoogleGenAI } from "@google/genai";
import { ApiError } from "../utils/ApiError";
import { Schema } from "mongoose";
import { response } from "express";

let client = null;

// Initializing the gemini api key

const getClient = () => {

    const apiKey = process.env.GEMINI_API_KEY;
    if(!apiKey) {
        throw new ApiError(503, 
            "Gemini API key is not configured. Add GEMINI_API_KEY to the backend .env file"
        );
    }
    if(!client) client = new GoogleGenAI({ apiKey });
    return client;
};


const MODEL = () => process.env.GEMINI_MODEL || "gemini-2.5-flash";

export const isAIConfigured = () => Boolean(process.env.GEMINI_API_KEY);

// Function to generate the response from the gemini AI.

const generateJSON = async(prompt, schema) => {
    const ai = getClient();
    try {
        const response = await ai.models.generateContent({
            model: MODEL(),
            contents: prompt,
            config: {
               responseMimeType:  "application/json",
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