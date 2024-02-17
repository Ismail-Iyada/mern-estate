import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";

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

/**
 * Sign in a user.
 *  req - The request object.
 *  res - The response object.
 *  next - The next middleware function.
 * returns - A promise that resolves when the sign in process is complete.
 */

export const signin = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    // ! look for the user in the database.
    const validUser = await User.findOne({ email });
    // * if the user is not found, throw an error.
    if (!validUser) return next(errorHandler(404, "User not found"));
    // ! compare the password from the request with the password in the database.
    const validPassword = bcryptjs.compareSync(password, validUser.password);
    // * if the password is not valid, throw an error.
    if (!validPassword) return next(errorHandler(401, "Wrong credentials!"));
    // ! create a token for the user.
    // * the token should contain the user's id, email, and username.
    // * the token should expire in 24 hours.
    const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET);
    // * destructure the password from the user object.
    // ! we don't want to send the password to the client.
    // * we only want to send the user's id, email, and username.
    // ! in destructuring assignment, the syntax { password: psw, ...rest } = validUser._doc;
    // ! is saying "take the property password from validUser._doc and assign it to a new variable psw,
    // ! and then take all the remaining properties and put them into a new object rest".
    const { password: psw, ...rest } = validUser._doc;
    // ? send the token to the user as a cookie.
    // * the cookie should be httpOnly. because we don't want the client to access it. and it should be secure.
    res
      .cookie("access_token", token, { httpOnly: true })
      .status(200)
      .json(rest);
  } catch (error) {
    // ! if there is an error, pass it to the next middleware.
    next(error);
  }
};
