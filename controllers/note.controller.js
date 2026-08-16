import { Notes } from '../models/Note.models.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';


// Function to get the notes data

export const getNotes = asyncHandler(async(req, res) => {
    const { lead, contact, search } = req.query;
    const filter = { owner: req.user._id };
    if(lead) filter.lead = lead;
    if(contact) filter.contact = contact;
    if(search) filter.content = new RegExp(search, "i");

    const notes = await Notes.find(filter)
    .sort({ pinned: -1, createdAt: -1}) // pinned notes always comes first
    .populate("lead", "name company")
    .populate("contact", "name company");

    res.json({ success: true, count: notes.length, notes});
});


// Function to create the notes

export const createNote = asyncHandler(async(req, res) => {
    const { content, lead, contact, pinned } = req.body;
    if(!content) throw new ApiError(400, "Note Content is Required");

    const note = await Notes.create({
        owner: req.user._id,
        content,
        lead: lead || null,
        contact: contact || null,
        pinned: Boolean(pinned),
    });

    res.status(201).json({ success: true, note});
});


// Function to update the notes 

export const updateNote = asyncHandler(async(req, res) => {
    const { owner,...updates } = req.body;
    const note = await Notes.findOneAndUpdate(
        { _id: req.params.id, owner: req.user._id },
        updates,
        { new: true, runValidators: true}
    );
    if(!note) throw new ApiError(404, "Note not found");
    res.json({ success: true, note});

});

// Function to delete a note\

export const deleteNote = asyncHandler(async(req, res) => {
    const note = await Notes.findOneAndDelete({ _id: req.params.id, owner: req.user._id });
    if(!note) throw new ApiError(404, "Note not found");
    res.json({ success: true, message: "Note Deleted"});
});