const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");
const validator = require("validator");

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['headmaster', 'teacher', 'vicar'],
    default: 'teacher'
  }
});

userSchema.statics.signup = async function (email, password, role ) {
  if (!email || !password) {
    throw Error("Please enter all the fields");
  }
  if (!validator.isEmail(email)) {
    throw Error("Email not valid");
  }
  if (!validator.isStrongPassword(password)) {
    throw Error("Password not strong enough");
  }

  const exists = await this.findOne({ email });
  if (exists) {
    throw Error("Email already in use");
  }

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);
  const user = await this.create({ email, password: hash, role });
  return user;
};

userSchema.statics.login = async function (email, password) {
  if (!email || !password) {
    throw Error("Please enter all the required fields");
  }

  const user = await this.findOne({ email });
  if (!user) {
    throw Error("No such user. Sign up to continue.");
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    throw Error("Password mismatch");
  }
  return user;
};

module.exports = mongoose.model("User", userSchema);
