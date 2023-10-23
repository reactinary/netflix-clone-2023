import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();


const connectToDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI;
    if (!mongoURI) {
      throw new Error("MongoDB URI is not defined in .env");
    }

    await mongoose.connect(mongoURI);

    console.log("MongoDB is connected");
  } catch (e) {
    console.error(e);
  }
};

export default connectToDB;
