import jwt from "jsonwebtoken";

// Created a jwt sign in function for signup

export const generateToken = (userId) => {
    jwt.sign({ id: userId}, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || "7d",
    });
}

