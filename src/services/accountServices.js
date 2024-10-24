import axios from "axios";
import { REACT_APP_SERVER_URL } from "../server/config";
// Base URL for the API
const accountURL = `${REACT_APP_SERVER_URL}`;

const getAuthToken = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  return user ? user.token : null;
};

// Get all accounts
const getAllAccounts = async () => {
  try {
    const token = getAuthToken();
    const res = await axios.get(`${accountURL}/account`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (err) {
    console.error("Error: ", err);
    throw err;
  }
};

// Get an account by year and month
const getAccountByYearMonth = async (year, month) => {
  try {
    const token = getAuthToken();
    console.log("TOKEN : ", token);
    const res = await axios.get(
      `${accountURL}/account/?year=${year}&month=${month}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return res.data;
  } catch (err) {
    console.error("Error: ", err);
    throw err;
  }
};

// Create a new account
const createAccount = async (accountData) => {
  try {
    const token = getAuthToken();
    const res = await axios.post(`${accountURL}/account`, accountData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
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
