/**
 * This is the main entry point of the API server.
 */
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
// ? import routes
import userRouter from "./routes/user.route.js";


// initialize the dotenv package
dotenv.config();

/**
 * mongoose package for connecting to the database
 * is connect to the database using the connect method, which returns
 * a promise that resolves if the connection was successful or rejects
 * with an error if it was not. and handling data models
 *
 * * but for the connection string to be private and secure, it should be stored in an environment variable
 * * so i will use the dotenv package to load the environment variables from a .env file
 * * and then use the process.env object to access the environment variables
 */

/**
 * ? connect to MDB, then log success,
 * ! else log error
 */
mongoose
  .connect(process.env.MONGOLOCAL)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error(`Error connecting to MongoDB: ${err}`);
  });

const app = express();

/**
 * Starts the server on port 3000.
 * but as its normal state, the server will not automatically
 * restart when the code changes.
 * thats why i installed nodemon to restart the server automatically
 * using a script in the package.json file
 * npm run dev -> "dev": "nodemon src/index.js"
 * npm start -> "start": "node src/index.js"
 */
app.listen(3000, () => {
  console.log("Server is running on port 3000!");
});

// * use the route, localhost:3000/api/user/test
// ? /test is the route of the userRouter
app.use("/api/user", userRouter);