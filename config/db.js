import mongoose from 'mongoose';

export const connectDB = async () => {
    // To fetch DB
    const uri = process.env.MONGO_URI;

    if (!uri) {
        throw new Error("MONGO_URI is not defined!");
    }

    mongoose.set("strictQuery", true);

    const conn = await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 10000,
    });

    console.log(`MongoDB connected: ${conn.connection.host}/${conn.connection.name}`);
    return conn;
    // Returns the connection
}