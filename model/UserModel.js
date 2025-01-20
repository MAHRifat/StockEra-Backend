const mongoose = require("mongoose");

const { userSchema } = require("../schemas/UserSchema");

module.exports = mongoose.model("User", userSchema);