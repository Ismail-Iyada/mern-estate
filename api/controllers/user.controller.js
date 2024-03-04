import bcrypjs from "bcryptjs";
import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";
import Listing from "../models/listing.model.js";

/**
 * Test API route.
 * ? req - The request object.
 * ? res - The response object.
 * ? returns - The JSON response with a message indicating that the API route is working.
 */
export const test = (req, res) => {
  res.json({
    message: "api route is working!",
  });
};

/**
 * Update user information.
 * ? req - The request object.
 * ? res - The response object.
 * ? next - The next middleware function.
 * ? returns  - The updated user object.
 */
export const updateUser = async (req, res, next) => {
  // Check if the user is authorized to update the account
  if (req.user.id !== req.params.id)
    return next(errorHandler(401, "You can only update your own account!"));

  try {
    // Hash the password if provided
    if (req.body.password) {
      req.body.password = bcrypjs.hashSync(req.body.password, 10);
    }

    /**
     * Updates a user in the database and returns the updated user object.
     *
     * * req.params.id - The ID of the user to update.
     * * req.body - The updated user data.
     * * req.body.username - The updated username.
     * * req.body.email - The updated email.
     * * req.body.password - The updated password.
     * * req.body.avatar - The updated avatar.
     * * returns:  The updated user object.
     * * new: true - Return the updated user object. By default, it returns the original user object.
     *
     * ? $set - The update operator. It replaces the value of a field
     * ! with the specified value. If the field does not exist, $set
     * ! will add a new field with the specified value. If the field
     * ! exists, $set will update the value of the field.
     *
     * ? findByIdAndUpdate() - Finds a matching document, updates it, and
     * ! returns the updated document. The first argument is the ID of
     * ! the document to update. The second argument is the updated user
     * ! data. The third argument is an options object. The new option
     * ! is set to true to return the updated user object.
     *
     */
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          username: req.body.username,
          email: req.body.email,
          password: req.body.password,
          avatar: req.body.avatar,
        },
      },
      { new: true }
    );

    // Exclude the password field from the response
    const { password, ...rest } = updatedUser._doc;

    // Send the updated user object as the response
    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  if (req.user.id !== req.params.id)
    return next(errorHandler(401, "You can only delete your own account!"));
  try {
    await User.findByIdAndDelete(req.params.id);
    res
      .status(200)
      .clearCookie("access_token")
      .json("User has been deleted...");
  } catch (error) {
    next(error);
  }
};

export const getUserListings = async (req, res, next) => {
  if (req.user.id === req.params.id) {
    try {
      const listings = await Listing.find({ userRef: req.params.id });
      res.status(200).json(listings);
    } catch (error) {
      next(error);
    }
  } else return next(errorHandler(401, "You can only view your own listings!"));
};

export const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) return next(errorHandler(404, "User not found!"));

    const { password, ...rest } = user._doc;

    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};
