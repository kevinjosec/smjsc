import axios from "axios";
import { REACT_APP_SERVER_URL } from "../server/config";

const studentURL = `${REACT_APP_SERVER_URL}`;
const getAuthToken = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  return user ? user.token : null;
};
// Get all students
const getAllStudents = async () => {
  try {
    const token = getAuthToken();
    console.log("Token: ", token);
    const res = await axios.get(`${studentURL}/student`, {
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

// Update an existing student
const updateStudent = async (id, studentData) => {
  try {
    const token = getAuthToken();
    const res = await axios.patch(`${studentURL}/student/${id}`, studentData, {
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

// Delete a student
const deleteStudent = async (id) => {
  try {
    const token = getAuthToken();
    await axios.delete(`${studentURL}/student/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (err) {
    console.error("Error: ", err);
    throw err;
  }
};

// Create a new student
const createStudent = async (studentData) => {
  try {
    console.log("HERE 1:");
    const token = getAuthToken();
    console.log("TOKEN : ", token);
    const res = await axios.post(`${studentURL}/student`, studentData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("HERE 2:");
    console.log("RES : ", res);
    console.log("RES 2 : ", res.data);
    return res.data;
  } catch (err) {
    console.error("Error: ", err);
    throw err;
  }
};

const studentServices = {
  getAllStudents,
  updateStudent,
  deleteStudent,
  createStudent,
};

export default studentServices;
