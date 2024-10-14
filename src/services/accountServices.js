import axios from "axios";

// Base URL for the API
const accountURL = "http://localhost:3000/api";

// Get all accounts
const getAllAccounts = async () => {
  try {
    const res = await axios.get(`${accountURL}/accounts`);
    return res.data;
  } catch (err) {
    console.error("Error: ", err);
    throw err;
  }
};

// Get an account by year and month
const getAccountByYearMonth = async (year, month) => {
  try {
    const res = await axios.get(`${accountURL}/accounts/?year=${year}&month=${month}`);
    return res.data;
  } catch (err) {
    console.error("Error: ", err);
    throw err;
  }
};

// Create a new account
const createAccount = async (accountData) => {
  try {
    const res = await axios.post(`${accountURL}/accounts`, accountData);
    return res.data;
  } catch (err) {
    console.error("Error: ", err);
    throw err;
  }
};

const accountServices = {
  getAllAccounts,
  getAccountByYearMonth,
  createAccount,
};

export default accountServices;
