import { Lead } from '../models/Lead.models.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';


export const getLeads = asyncHandler(async (req,res) => {
    const { status, priority, source, search } = req.query;

    const filter = { owner: req.user._id };
    if(status) filter.status = status;
    if(priority) filter.priority = priority;
    if(source) filter.source = source;

    if(search) {
        const rx = new RegExp(search, "i");
    }
})