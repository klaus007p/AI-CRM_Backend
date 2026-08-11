import { ApiError } from "../utils/ApiError.js";


// 404 Error for unmatched routes

export const notFound = (req, res, next) => {
    next(new ApiError(404, `Route not found: ${req.method} ${req.originalUrl}`))
};

export const errorHandler = (err, req, res, next) => {
    let statusCode = err.statusCode || 500;
    let message = err.message || "Internal Server Error"

    // will add ObjectId later

    // if email already registered then return 
    if (err.code === 11000) {
        statusCode = 409;
        const field = Object.keys(err.keyValue || {})[0] || "field";
        message = `A record with that ${field} already exists`;
    }

    // Mongo DB Schema validation 
    if (err.name === "ValidationError") {
        statusCode = 400;
        message = Object.values(err.errors).map((e) => e.message)
            .join(" , ");
    }

    // For better optimization use in Node Environment
    if (process.env.NODE_ENV !== "Production" && statusCode === 500) {
        console.error(err);

    }

    // IF node env doesnt exists throw an error 500
    res.status(statusCode).json({
        success: false,
        message,
        ...(process.env.NODE_ENV !== "Production" && statusCode === 500
        ? { stack: err.stack }
        : {})
    });
};

