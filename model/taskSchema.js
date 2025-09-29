const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  assignedDate: { type: Date, default: Date.now },
  dueDate: Date,
  status: {
    type: String,
    enum: ["PENDING", "COMPLETED"],
    default: "PENDING"
  },
  // Who the task is assigned to
  employee: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  // Who assigned the task
  admin: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
});

module.exports = mongoose.model("Task", taskSchema);
