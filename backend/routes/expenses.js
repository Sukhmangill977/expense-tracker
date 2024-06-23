const express = require("express");
const router = express.Router();
const Expense = require("../models/expense");
const { auth } = require("./auth");

// Get all expenses
router.get("/", auth, async (req, res) => {
  try {
    const expenses = await Expense.find({ user: req.user.id });
    res.json(expenses);
  } catch (err) {
    console.error("Error fetching expenses:", err);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
});

// Get a single expense
router.get("/:id", auth, async (req, res) => {
  try {
    const expense = await Expense.findOne({
      _id: req.params.id,
      user: req.user.id,
    });
    if (!expense) return res.status(404).json({ message: "Expense not found" });
    res.json(expense);
  } catch (err) {
    console.error("Error fetching expense:", err);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
});

// Create a new expense
router.post("/", auth, async (req, res) => {
  const expense = new Expense({
    name: req.body.name,
    amount: req.body.amount,
    category: req.body.category,
    date: req.body.date,
    user: req.user.id,
  });

  try {
    const newExpense = await expense.save();
    res.status(201).json(newExpense);
  } catch (err) {
    console.error("Error creating expense:", err);
    res.status(400).json({ message: "Bad request. Please check your input." });
  }
});

// Update an expense
router.put("/:id", auth, async (req, res) => {
  try {
    const expense = await Expense.findOne({
      _id: req.params.id,
      user: req.user.id,
    });
    if (!expense) return res.status(404).json({ message: "Expense not found" });

    expense.name = req.body.name;
    expense.amount = req.body.amount;
    expense.category = req.body.category;
    expense.date = req.body.date;

    const updatedExpense = await expense.save();
    res.json(updatedExpense);
  } catch (err) {
    console.error("Error updating expense:", err);
    res.status(400).json({ message: "Bad request. Please check your input." });
  }
});

// Delete an expense
router.delete("/:id", auth, async (req, res) => {
  const expenseId = req.params.id;
  const userId = req.user.id;

  try {
    const expense = await Expense.findOneAndDelete({
      _id: expenseId,
      user: userId,
    });

    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    res.json({ message: "Expense deleted successfully" });
  } catch (err) {
    console.error("Error deleting expense:", err);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
});

module.exports = router;
