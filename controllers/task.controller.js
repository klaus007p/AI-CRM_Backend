import { Task } from "../models/Task.model.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js";


// Function to get the task info

export const getTasks = asyncHandler(async(req, res) => {
    const { status, priority, relatedLead } = req.query;
    const filter = { owner: req.user._id };
    if(status) filter.status = status;
    if(priority) filter.priority = priority;
    if(relatedLead) filter.relatedLead = relatedLead;

    const Tasks =  await Task.find(filter)
    .sort({ status: 1, dueDate: 1, createdAt: -1 })
    .populate("relatedLead", "name company")
    .populate("relatedContact", "name company");

    res.json({ success: true, count: Tasks.length, Tasks});
});