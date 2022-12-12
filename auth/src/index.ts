import mongoose from "mongoose";
import { app } from "./app";
import { configs } from "./configs";

const startServer = async () => {
  try {
    await mongoose.connect(configs.MONGO_URI);

    console.info("Auth Database connected successfully!");

    app.listen(3000, () => {
      console.info("Auth service listening on port 3000!");
    });
  } catch (err) {
    console.error("Error connecting to database! ", err);
  }
};

startServer();
