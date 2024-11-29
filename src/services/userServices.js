import axios from "axios";
import { REACT_APP_SERVER_URL } from "../server/config";

const userURL = `${REACT_APP_SERVER_URL}`;

// Helper function to get the authentication token and email
const getAuth = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  return user ? user : null;
};

const getUserRole = async () => {
  try {
    const authData = getAuth();
    // Check if the user data is available
    if (!authData) {
      throw new Error("User not authenticated. Please login.");
    }
    const token = authData.token;
    const email = authData.email;
    const res = await axios.get(`${userURL}/user/${email}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data.role; 
  } catch (e) {
    console.error(
      "Error fetching user role:",
      e.response ? e.response.data : e.message
    );
    throw new Error("Couldn't identify user. Please logout and login again");
  }
};

export default getUserRole;
