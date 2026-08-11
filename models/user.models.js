import mongoose, { Schema } from "mongoose";
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Name is Required"],
            trim: true, 
        },

        email: {
            type: String,
            required: [true, " Email is Required"],
            unique: true,
            lowercase: true,
            trim: true,
            match: [/^[\w\-\.]+@([\w-]+\.)+[\w-]{2,}$/gm, "Please provide a valid email"]
        },

        password: {
            type: String,
            required: [true, "Password is Required"],
            minlength: [6, "Password must contain atleast 6 characters "],
            maxlength: [40, "Password should not be longer than 40 characters"],
            select: false
        },

        role: {
            type: String,
            enum: ["Owner", "member"],
            default: "Owner",
        },

        company: {
            type: String,
            trim: true,
            default: "",
        },

        avatar: {
            type: String,
            default: ""
        },
    },
    {timestamps: true}
);