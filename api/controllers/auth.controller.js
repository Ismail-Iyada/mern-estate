import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";

// ! This function handles the signup process for a user.
export const signup = async (req, res, next) => {
  // * Destructuring the username, email, and password from the request body.
  const { username, email, password } = req.body;

  // ! gotta hash the password before saving it to the database.
  const hasheedPassword = bcryptjs.hashSync(password, 10);

  // * Creating a new User instance with the provided username, email, and password.
  const newUser = new User({ username, email, password: hasheedPassword });

  // ! error handling,
  /**
   * * the best practice is to use a function or a
   * * middleware to handle the error instead of
   * * directly writing in this block.
   */
  try {
    // ? Saving the new user to the database.
    await newUser.save();

    // ? Sending a success response with a status code of 201 and a JSON message.
    res.status(201).json("User created successfully!");
  } catch (error) {
    next(error);
  }
};
