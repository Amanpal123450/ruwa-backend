const Dashboard = require("../model/Dashboard");

// 📌 Get Dashboard Content
const getDashboard = async (req, res) => {
  try {
    const dashboard = await Dashboard.findOne(); // only one dashboard document
    res.json(dashboard);
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
};

// 📌 Create or Update Dashboard Content
const upsertDashboard = async (req, res) => {
  try {
    let dashboard = await Dashboard.findOne();
    if (dashboard) {
      dashboard.set(req.body);
      await dashboard.save();
    } else {
      dashboard = new Dashboard(req.body);
      await dashboard.save();
    }
    res.json(dashboard);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

module.exports = { getDashboard, upsertDashboard };
