// Importing the 'jsonwebtoken' library to work with JSON Web Tokens
import jwt from "jsonwebtoken";

// Defining a middleware function to verify the token
export const verifyToken = (req, res, next) => {
  // Extracting the token from the 'access_token' cookie in the request
  const token = req.cookies.access_token;

  // Checking if the token exists
  if (!token) {
    // If the token doesn't exist, calling the 'next' function with an error indicating unauthorized access
    return next(errorHandler(401, "Unauthorized"));
  }

  // Verifying the token using the secret key defined in the environment variable 'JWT_SECRET'
  // ! how does the jswt verify function work?
  // ? The jwt.verify function takes three arguments: the token to verify, the secret key, and a callback function.
  // ? The callback function takes two arguments: an error and the decoded user object.
  // ? If there is an error while verifying the token, the callback function calls the 'next' function with an error indicating forbidden access.
  // ? If the token is successfully verified, the user object is attached to the request object and the 'next' function is called to proceed to the next middleware or route handler.
  // * The verifyToken middleware function is used to verify the token and attach the user object to the request object.
  // * The user object is then used in the updateUser route handler to update the user's information.
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    // If there is an error while verifying the token, calling the 'next' function with an error indicating forbidden access
    if (err) {
      return next(errorHandler(403, "Forbidden"));
    }

    // If the token is successfully verified, attaching the user object to the request object
    req.user = user;

    // Calling the 'next' function to proceed to the next middleware or route handler
    next();
  });
};
