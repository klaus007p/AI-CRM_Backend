import { Lead } from "../models/Lead.models.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { generateLeadSummary, generateSalesInsights, generateEmail, isAIConfigured } from "../services/ai.service.js";
import { config } from "dotenv";



const resolveLead = async(req) => {
    if(req.body.leadId) {
        const lead = await Lead.findOne({ _id: req.body.leadId, owner: req.user._id });
        if(!lead) throw new ApiError(404, "Lead not found");
        return lead;
    }

    if(req.body.lead) return req.body.lead;
    throw new ApiError(400, "Provide a leadId or an inline lead object");
};


// Function to create AI status Handler

export const aiStatus = asyncHandler(async(req, res) => {
    res.json({
        success: true,
        configured: isAIConfigured(),
        model: process.env.GEMINI_MODEL || "gemini-2.5-flash",
    });
});