const express = require("express");

const app = express();
app.use(express.json());

app.get("/getTodos", async (req, res) => {
  const lists = ["Exercise", "Coding", "Classwork", "Groceries", "Packing", "Reading", "Work"];

  res.json(lists);
});

module.exports = app;
