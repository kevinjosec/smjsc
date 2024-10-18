const express = require("express");
const router = express.Router();
const Account = require("../models/accounts");

const requireAuth = require('../middleware/requireAuth')
router.use(requireAuth);

// GET accounts by year and month
router.get("/", async (req, res) => {
  const { year, month } = req.query;
  try {
    const accounts = await Account.find({
      year: parseInt(year, 10),
      month: month.charAt(0).toUpperCase() + month.slice(1),
    });

    const income = [];
    const expense = [];

    accounts.forEach((account) => {
      if (account.income) {
        income.push(...account.income);
      }
      if (account.expense) {
        expense.push(...account.expense);
      }
    });

    res.json({ income, expense });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST create accounts
router.post("/", async (req, res) => {
  const { year, month, income, expense } = req.body;

  if (!year || !month) {
    return res.status(400).json({ message: "Year and month are required" });
  }

  const accountData = {
    year,
    month,
    createdAt: new Date(), // Add the createdAt timestamp here
  };

  if (income && income.length > 0) {
    accountData.income = income;
  }

  if (expense && expense.length > 0) {
    accountData.expense = expense;
  }

  const account = new Account(accountData);

  try {
    const newAccount = await account.save();
    res.status(201).json(newAccount);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
