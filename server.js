import 'dotenv/config';
import express from 'express';
import cors from 'cors'
import morgan from 'morgan';

import { connectDB } from './config/db.js';
import { notFound, errorHandler } from './middleware/error.middleware.js';

import authRoutes from "./routes/auth.routes.js"; // Check file name in route incase of error
import leadRoutes from "./routes/lead.routes.js";
import contactRoutes from "./routes/contact.routes.js";
import noteRoutes from "./routes/note.routes.js";
import taskRoutes from "./routes/task.routes.js";

import aiRoutes from "./routes/ai.routes.js";

import analyticsRoutes from "./routes/analytics.routes.js";

const app = express();

// Adding middleware to our sever

app.use(
    cors({
        origin: process.env.CLIENT_URL || "https://localhost:5173",
        credentials: true,
    })
);

app.use(express.json({ limit: "1mb"}));
app.use(express.urlencoded({ extended: true}))
if(process.env.NODE_ENV !== "production") app.use(morgan("dev"))


// Api rotes

app.get("/api/health", (req, res) =>
res.json({ success: true, status: "ok", service: "TTM CRM API"}))

app.use("/api/auth", authRoutes); // Route for Authentication
app.use("/api/leads", leadRoutes); // Routes for Lead service

app.use("/api/contacts", contactRoutes); // Route for contact services
app.use("/api/notes", noteRoutes); // Route for Notes Services
app.use("/api/tasks", taskRoutes); // Route for Task Services

app.use("/api/ai", aiRoutes); // Route for Accessing AI services

app.use("/api/analytics", analyticsRoutes);  // Route for accessing analytics service

// Error Handling

app.use(notFound);
app.use(errorHandler)


// Starting The Express Server

const PORT = process.env.PORT || 8000;

const start = async () => {
    try {
        await connectDB();
        app.listen(PORT, () => 
            console.log(`TTP CRM API is running on https://localhost:${PORT}`)
        );
    } catch (err) {
        console.log("Failed to Start the server", err.message);
        process.exit(1);
    }
};

start();

export default app;