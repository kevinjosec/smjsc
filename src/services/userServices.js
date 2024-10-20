import axios from "axios";

const userURL = "http://localhost:3000/api";

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
    // Make the API request to fetch the user role
    const res = await axios.get(`${userURL}/user/${email}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data.role; // Return the user's role
  } catch (e) {
    // Improved error handling to log the actual error
    console.error(
      "Error fetching user role:",
      e.response ? e.response.data : e.message
    );
    throw new Error("Couldn't identify user. Please logout and login again");
  }
};

export default getUserRole;