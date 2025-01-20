const { Schema } = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new Schema({
  email: {
    type: String,
    required: [true, "Your email address is required"],
    unique: true,
  },
  username: {
    type: String,
    required: [true, "Your username is required"],
  },
  password: {
    type: String,
    required: [true, "Your password is required"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  verificationCode: {
    type: Number,
  },
  isVerified: {
    type: Boolean,
    default: false,
  }
});

// userSchema.pre("save", async function () {              // for this when save pass it will hash the password
//   this.password = await bcrypt.hash(this.password, 12);
// });

module.exports = { userSchema };