import monggoose from 'mongoose';

export const connectDB = async () => {
    try {
        const conn = await monggoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);                   
    } catch (error) {
        console.log(`Error: ${error.message}`);   
    }
}