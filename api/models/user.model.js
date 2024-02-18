import mongoose from "mongoose";

// ! create the rules for the user model = schema

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true, // * this means that every username should be different
    },
    email: {
      type: String,
      required: true,
      unique: true, // * this means that every username should be different
    },
    password: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
      default:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Default_pfp.svg/1200px-Default_pfp.svg.png",
    },
  },
  {
    timestamps: true, // * it will add createdAt and updatedAt fields automatically in the database
  }
);

// *** create the model from the schema
const User = mongoose.model("User", userSchema);
// ! export the model to be used in other files
export default User;
