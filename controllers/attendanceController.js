const Attendance = require("../model/attendance");

// ✅ Check In
exports.checkIn = async (req, res) => {
  try {
    const userId = req.user.id;

    // Normalize today's date to 00:00:00
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Check if attendance exists today
    let record = await Attendance.findOne({ user: userId, date: today });
    if (record) {
      return res.status(400).json({ message: "Already checked in today." });
    }

    const now = new Date();
    const status = now.getHours() > 9 ? "late" : "present";

    // Create attendance with normalized date
    record = await Attendance.create({
      user: userId,
      date: today, // only date for comparison
      checkIn: now, // actual timestamp
      status,
    });

    res.status(201).json({ success: true, record });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Check Out
exports.checkOut = async (req, res) => {
  try {
    const userId = req.user.id;

    // Normalize today's date
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Find today's attendance
    let record = await Attendance.findOne({ user: userId, date: today });
    if (!record || !record.checkIn) {
      return res.status(400).json({ message: "No check-in found for today." });
    }
    if (record.checkOut) {
      return res.status(400).json({ message: "Already checked out." });
    }

    const now = new Date();
    const diffHrs = (now - record.checkIn) / (1000 * 60 * 60);

    // Update status if leaving early
    if (diffHrs < 8) record.status = "early-departure";

    record.checkOut = now;
    record.workingHours = diffHrs.toFixed(2);

    await record.save();

    res.json({ success: true, record });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Apply Leave
exports.applyLeave = async (req, res) => {
  try {
    const userId = req.user.id;
    const { date, type, reason } = req.body;

    const leaveDate = new Date(date);
    leaveDate.setHours(0, 0, 0, 0);

    let record = await Attendance.findOne({ user: userId, date: leaveDate });
    if (record) {
      return res.status(400).json({ message: "Attendance/leave already exists for this date." });
    }

    record = await Attendance.create({
      user: userId,
      date: leaveDate,
      status: type === "paid" ? "paid-leave" : "unpaid-leave",
      leaveReason: reason,
    });

    res.status(201).json({ success: true, record });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Get Attendance History
exports.getAttendanceHistory = async (req, res) => {
  try {
    const userId = req.user.id;

    const history = await Attendance.find({ user: userId }).sort({ date: -1 });
    res.json({ success: true, history });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Get Work Day Status
exports.getWorkDayStatus = async (req, res) => {
  try {
    const userId = req.user.id;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let record = await Attendance.findOne({ user: userId, date: today });

    if (!record) {
      return res.json({
        success: true,
        workDayStatus: {
          status: "absent",
          checkInTime: "-",
          hoursWorked: "0",
          breaksTaken: 0,
          remainingHours: "8h",
        },
      });
    }

    const checkInTime = record.checkIn
      ? record.checkIn.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      : "-";

    let hoursWorked = 0;
    if (record.checkIn) {
      const endTime = record.checkOut ? record.checkOut : new Date();
      hoursWorked = ((endTime - record.checkIn) / (1000 * 60 * 60)).toFixed(2);
    }

    let remainingHours = (8 - hoursWorked).toFixed(2);
    if (remainingHours < 0) remainingHours = 0;

    res.json({
      success: true,
      workDayStatus: {
        status: record.status,
        checkInTime,
        hoursWorked: `${hoursWorked}h`,
        breaksTaken: record.breaks ? record.breaks.length : 0,
        remainingHours: `${remainingHours}h`,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
