// routes/employeeDashboardRoute.js
const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const pageContent = {
      greetingBadge: "Employee Portal 👋",
      title: "Assist Users with Healthcare & Welfare Services",
      subtitle:
        "Select a service below and complete the process on behalf of the user",
      mainIcon: "👨‍💼",
    };

     const employeeServices = [
    {
      icon: "🧑‍🤝‍🧑",
      title: "Jan Swabhiman Seva (for User)",
      description:
        "Assist users with welfare services, employment access, and social support under Jan Swabhiman Seva.",
      btnText: "Apply for User",
      gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
     
    },
    {
      icon: "🪪",
      title: "Jan Arogya Card (for User)",
      description:
        "Help users avail affordable health services with the Jan Arogya Card for access to top hospitals and cashless treatments.",
      btnText: "Apply for User",
      gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
     
    },
    {
      icon: "🚑",
      title: "Emergency Ambulance Service",
      description:
        "Book reliable ambulance services on behalf of users to ensure timely medical transport and support during emergencies.",
      btnText: "Book for User",
      gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
      
    },
    {
      icon: "🛡️",
      title: "Health Insurance Coverage",
      description:
        "Help users apply for affordable and comprehensive insurance plans, ensuring cashless treatments and peace of mind.",
      btnText: "Apply for User",
      gradient: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
     
    },
    {
      icon: "🏢",
      title: "Jan Arogya Kendra",
      description:
        "Assist users in applying to set up a Jan Arogya Kendra with clear, streamlined steps.",
      btnText: "Apply for User",
      gradient: "linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)",
     
    },
  ];

   res.status(200).json({
  success: true,
  data: { pageContent, services: employeeServices },
});
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

module.exports = router;
