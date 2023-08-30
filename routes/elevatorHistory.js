var express = require("express");
var router = express.Router();

const fetch = require("node-fetch");
require("../models/connection");
const ElevatorHistory = require("../models/elevatorHistory");

// ROUTE GET for all elevators moves from the most recent to the oldest
router.get("/", async (req, res) => {
  try {
    const moves = await ElevatorHistory.find().sort({ _id: -1 });
    res.json({ result: true, length: moves.length, moves: moves });
  } catch (error) {
    res.json({
      result: false,
      error: "An error occurred while retrieving history",
    });
  }
});

// ROUTE POST : Add a move of an elevator to the DB

router.post("/addmove/:elevatorID/:departureFloor/:arrivalFloor", async (req, res) => {
    try {
      const { elevatorID, departureFloor, arrivalFloor } = req.params;

      const newMovement = new ElevatorHistory({
        elevatorID,
        departureFloor: parseInt(departureFloor),
        arrivalFloor: parseInt(arrivalFloor)
      });
  
      await newMovement.save();
  
      res.status(201).json({ message: "Movement added successfully" });
    } catch (error) {
      res.status(500).json({ error: "An error occurred while adding the movement" });
    }
  });

// ROUTE DELETE ALL : Clear history

router.delete("/clear", async (req, res) => {
  try {
    const result = await ElevatorHistory.deleteMany({});
    res.json({ message: "History successfully cleared", result });
  } catch (error) {
    res.status(500).json({ message: "Error clearing history", error });
  }
});


module.exports = router;