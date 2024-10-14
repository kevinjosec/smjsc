import axios from "axios";

const studentURL = "http://localhost:3000/api";

// Get all students
const getAllStudents = async () => {
  try {
    const res = await axios.get(`${studentURL}/student`);
    return res.data;
  } catch (err) {
    console.error("Error: ", err);
    throw err;
  }
};

// Update an existing student
const updateStudent = async (id, studentData) => {
  try {
    const res = await axios.patch(`${studentURL}/student/${id}`, studentData);
    return res.data;
  } catch (err) {
    console.error("Error: ", err);
    throw err;
  }
};

// Delete a student
const deleteStudent = async (id) => {
  try {
    await axios.delete(`${studentURL}/student/${id}`);
  } catch (err) {
    console.error("Error: ", err);
    throw err;
  }
};

// Create a new student
const createStudent = async (studentData) => {
  try {
    const res = await axios.post(`${studentURL}/student`, studentData);
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
