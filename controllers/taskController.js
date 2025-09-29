// controllers/taskController.js
const Task = require("../model/task");
const User = require("../model/ser");

exports.assignTask = async (req, res) => {
  try {
    const { employeeId, title, description, dueDate } = req.body;

    const employee = await User.findById(employeeId);
    if (!employee || employee.role !== "EMPLOYEE") {
      return res.status(404).json({ message: "Employee not found" });
    }

    const task = new Task({
      title,
      description,
      dueDate,
      employee: employeeId,
      admin: req.user.id // from JWT
    });

    await task.save();

    res.status(201).json({ success: true, task });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};


exports.getTodaysTasks = async (req, res) => {
  try {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    const end = new Date();
    end.setHours(23, 59, 59, 999);

    const tasks = await Task.find({
      employee: req.user.id,
      assignedDate: { $gte: start, $lte: end }
    });

    res.json({ success: true, tasks });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
exports.completeTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) return res.status(404).json({ message: "Task not found" });
    if (task.employee.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not your task" });
    }

    task.status = "COMPLETED";
    await task.save();

    res.json({ success: true, message: "Task completed" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
exports.getPerformance = async (req, res) => {
  try {
    const total = await Task.countDocuments({ employee: req.user.id });
    const completed = await Task.countDocuments({ employee: req.user.id, status: "COMPLETED" });

    const performance = total > 0 ? (completed * 100) / total : 0;

    res.json({
      success: true,
      totalTasks: total,
      completedTasks: completed,
      performancePercentage: performance.toFixed(2)
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

