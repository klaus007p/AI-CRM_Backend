import { Lead } from "../models/Lead.models.js";
import { Contact } from "../models/Contact.models.js";
import { Task } from "../models/Task.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";


// Function to create a get overview handler

export const getOverview  = asyncHandler(async(req, res) => {
    const owner = req.user._id;

    const [leads, contactCount, openTasks] = await Promise.all([
        Lead.find({ owner }),
        Contact.countDocuments({ owner }),
        Task.countDocuments({ owner, status: { $ne: "Completed"}}),
    ]);

    const stages = ["New", "Qualified", "Proposal", "Won", "Lost"];
    const byStage = Object.fromEntries(stages.map((f) => [f, { count: 0, value: 0}]));
    let totalValue = 0;
    let wonValue = 0;

    for(const l of leads) {
        const bucket = byStage[l.status] || (byStage[l.status] = { count: 0, value: 0 });
        bucket.count += 1;
        bucket.value += l.value || 0;
        totalValue += l.value || 0;
        if(l.status === 'Won') wonValue += l.value || 0;
    }

    
})