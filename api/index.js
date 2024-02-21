/**
 * This is the main entry point of the API server.
 */
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
// ? import routes
import userRouter from "./routes/user.route.js";
import authRouter from "./routes/auth.route.js";
import cookieParser from "cookie-parser";

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

// ! by default we arent allowed to send json
// ! data to the server,  so we need to enable it
app.use(express.json());

// ! The code uses a middleware called
// ! "cookie parser" to read and understand
// ! the cookies sent by the client in the
// ! incoming requests. It then stores the parsed
// ! cookies in the req.cookies object, allowing
// ! us to easily access and use
// ! the cookies in our code.
app.use(cookieParser());

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
  console.log("Server is running on port 3000!!");
});

// * use the route, localhost:3000/api/user/test
// ? /test is the route of the userRouter
app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);

// ! This block of code is a middleware function that handles errors in the API server.

app.use((err, req, res, next) => {
  // ? The function takes four parameters: err, req, res, and next.
  // ? The err parameter represents the error object.
  // ? The req parameter represents the request object.
  // ? The res parameter represents the response object.
  // ? The next parameter represents the next middleware function in the request-response cycle.

  const statusCode = err.statusCode || 500;
  // ? This line assigns the status code of the error to the statusCode variable.
  // ? If the error object has a statusCode property, it is used.
  // ? Otherwise, a default status code of 500 (Internal Server Error) is used.

  const message = err.message || "Internal Server Error";
  // ? This line assigns the error message to the message variable.
  // ? If the error object has a message property, it is used.
  // ? Otherwise, a default message of "Internal Server Error" is used.

  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
  // ? This line sends a JSON response with the status code, success status, and error message.
});
