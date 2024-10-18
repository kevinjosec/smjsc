const express = require("express");
const router = express.Router();
const Teacher = require("../models/facultys");
const requireAuth = require('../middleware/requireAuth')
router.use(requireAuth);

router.get("/", async (req, res) => {
  try {
    const teachers = await Teacher.find();
    res.json(teachers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.params.id);
    if (!teacher) {
      return res.status(404).send("Teacher not found");
    } else {
      res.json(teacher);
    }
  } catch (err) {
    res.status(500).send(err.message);
  }
});

router.post("/", async (req, res) => {
  const teacher = new Teacher({
    name: req.body.name,
    gender: req.body.gender,
    number: req.body.number,
    email: req.body.email,
    branch: req.body.branch,
    address: req.body.address,
    photo: req.body.gender,
    class: req.body.class,
  });

  try {
    const newTeacher = await teacher.save();
    res.status(201).json(newTeacher);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
});

router.patch("/:id", (req, res) => {});

router.delete("/:id", (req, res) => {});

module.exports = router;
