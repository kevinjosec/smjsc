const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      required: true,
    },
    class: {
      type: Number,
      required: true,
    },
    unit: {
      type: String,
      required: true,
    },
    number: {
      type: Number,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    fees: {
      type: Boolean,
      default: false,
    },
    dateOfBirth: {
      type: Date,
      required: true,
    },
    dateOfBaptism: {
      type: Date,
      required: false,
    },
    baptismName: {
      type: String,
      required: false,
    },
    category: {
      type: String,
      required: false,
    },
    fathersName: {
      type: String,
      required: false,
    },
    mothersName: {
      type: String,
      required: false,
    },
    homeParish: {
      type: String,
      required: false,
    },
    addressIndia: {
      type: String,
      required: false,
    },
    addressKuwait: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

// Virtual property for calculating age
studentSchema.virtual("age").get(function () {
  if (!this.dateOfBirth) return null;
  const today = new Date();
  const birthDate = new Date(this.dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  // Adjust age if the current month and day are before the birth month and day
  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }

  return age;
});

// Ensure virtuals are serialized in JSON
studentSchema.set("toJSON", {
  virtuals: true,
});
studentSchema.set("toObject", {
  virtuals: true,
});

module.exports = mongoose.model("Student", studentSchema);
