const mongoose = require("mongoose");

// Define the income schema
const incomeSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  source: {
    type: String,
    required: true,
  },
  receivedBy: {
    type: String,
    required: true,
  },
  donatedBy: {
    type: String,
    required: true,
  },
});

// Define the expense schema
const expenseSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  spentOn: {
    type: String,
    required: true,
  },
  spentBy: {
    type: String,
    required: true,
  },
  issuedBy: {
    type: String,
    required: true,
  },
});

const accountSchema = new mongoose.Schema({
  year: {
    type: Number,
    required: true,
  },
  month: {
    type: String,
    required: true,
    enum: [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ],
  },
  income: {
    type: [incomeSchema],
    default: undefined,
  }, 
  expense: {
    type: [expenseSchema],
    default: undefined,
  }, 
  createdAt: {
    type: Date,
    default: Date.now, 
  },
});

accountSchema.pre("save", function (next) {
  if (this.income && this.income.length === 0) {
    this.income = undefined;
  }
  if (this.expense && this.expense.length === 0) {
    this.expense = undefined;
  }
  next();
});

const Account = mongoose.model("Account", accountSchema);

module.exports = Account;
