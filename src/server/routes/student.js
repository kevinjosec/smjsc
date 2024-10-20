const express = require("express");
const router = express.Router();
const Student = require("../models/students");
const authorizeAdmin  = require("../middleware/roleAuth")

const requireAuth = require('../middleware/requireAuth')
router.use(requireAuth);

router.get("/", async (req, res) => {
  try {
    const student = await Student.find();
    res.json(student);
  } catch (err) {
    res.status(404).send({ message: err.message });
  }
});

router.get("/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const student = await Student.findById(id);
    if (!student) {
      return res.status(404).send("Student not found");
    } else {
      res.json(student);
    }
  } catch (err) {}
});

router.post("/", authorizeAdmin,async (req, res) => {
  // Create a new student instance with the provided data
  const student = new Student({
    name: req.body.name,
    gender: req.body.gender,
    class: req.body.class,
    unit: req.body.unit,
    number: req.body.number,
    email: req.body.email,
    fees: req.body.fees,
    dateOfBirth: req.body.dateOfBirth, // Ensure this is in the correct format (ISO Date)
    dateOfBaptism: req.body.dateOfBaptism,
    baptismName: req.body.baptismName,
    category: req.body.category,
    fathersName: req.body.fathersName,
    mothersName: req.body.mothersName,
    homeParish: req.body.homeParish,
    addressIndia: req.body.addressIndia,
    addressKuwait: req.body.addressKuwait,
  });
  
  try {
    // Save the student to the database
    const newStudent = await student.save();
    res.status(200).json(newStudent);
  } catch (err) {
    // Return an error message if there's an issue
    res.status(400).json({ message: err.message });
  }
});

router.patch("/:id", authorizeAdmin,async (req, res) => {
  try {
    const updatedStudent = await Student.findByIdAndUpdate(
      req.params.id,
      { $set: req.body }, // Update only the provided fields
      { new: true, runValidators: true }
    );
    if (!updatedStudent) {
      return res.status(404).send({ message: "Student not found" });
    }
    res.send(updatedStudent);
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});

router.delete("/:id", authorizeAdmin,async (req, res) => {
  const id = req.params.id;
  try {
    const deletedStudent = await Student.findByIdAndDelete(id);
    if (!deletedStudent) {
      return res.status(404).send({ message: "Student not found" });
    }
    res
      .status(200)
      .send({
        message: "Student deleted successfully",
        student: deletedStudent,
      });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
});



module.exports = router;
