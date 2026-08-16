import jwt from "jsonwebtoken";

const getJwtSecret = () => {
    const secret = process.env.JWT_SECRET;

    if (!secret || !secret.trim()) {
        console.warn("JWT_SECRET is missing; using a development fallback secret.");
        return "dev-fallback-secret-change-me";
    }

    return secret;
};

// Created a jwt sign in function for signup

export const generateToken = (userId) => {
    return jwt.sign({ id: userId }, getJwtSecret(), {
        expiresIn: process.env.JWT_EXPIRES_IN || "7d",
    });
}

