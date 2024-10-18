const express = require("express");
const router = express.Router();
const Committee = require("../models/committees");
const requireAuth = require('../middleware/requireAuth')
router.use(requireAuth);

router.get("/", async (req, res) => {
  try {
    const members = await Committee.find();
    res.json(members);
  } catch (err) {
    res.status(404).send({ message: err.message });
  }
});

router.get("/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const members = await Committee.findById(id);
    if (!members) {
      return res.status(404).send("Member not found");
    } else {
      res.json(members);
    }
  } catch (err) {}
});

router.post("/", async (req, res) => {
  const member = new Committee({
    name: req.body.name,
    gender: req.body.gender,
    number: req.body.number,
    assosciation: req.body.assosciation,
    address: req.body.address,
    photo: req.body.photo,
    post: req.body.post
  });

  try {
    const newMember = await member.save();
    res.status(200).json(newMember);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
});

router.patch("/:id", async (req, res) => {});

router.delete("/:id", async (req, res) => {});

module.exports = router;
