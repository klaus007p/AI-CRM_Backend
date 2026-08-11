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


// We will use bcrypt so we dont have to hash the password again and again if user didnt save the credentials

userSchema.pre("save", async function (next) {
    if(!this.isModified("password")) return next();

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
})