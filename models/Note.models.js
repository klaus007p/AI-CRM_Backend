import mongoose from "mongoose";

const noteSchema = new mongoose.Schema({

    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true,
    },

    content: {
        type: String,
        required: [true, "Note Content is required"],
        trim: true,
    },

    lead: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Lead",
        default: null,
    },

    contact: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Contact",
        default: null,
    },

    pinned: {
        type: Boolean,
        default: false,
    }


}, { timestamps: true })


export const Notes = mongoose.model("Notes", noteSchema);