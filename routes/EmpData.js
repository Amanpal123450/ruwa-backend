// routes/dashboardRoutes.js
const express = require("express");
const router = express.Router();

router.get("/dashboard-data", (req, res) => {
  const dashboardData = {
    dashboardCards: [
      {
        title: "Manage Users",
        description: "View and manage registered users",
        icon: "👥",
        link: "/manage-users",
        color: "primary",
        gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
      },
      {
        title: "Applications",
        description: "Review and process applications",
        icon: "📋",
        link: "/manage-applications",
        color: "success",
        gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)"
      },
      {
        title: "Attendance",
        description: "Puch your daily attandance",
        icon: "🕒",
        link: "/employee-att",
        color: "secondary",
        gradient: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)"
      },
      {
        title: "Reports",
        description: "View analytics and reports",
        icon: "📊",
        link: "/employee-reports",
        color: "info",
        gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)"
      },
      {
        title: "Profile",
        description: "Update your profile information",
        icon: "👤",
        link: "/employee-profile",
        color: "secondary",
        gradient: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)"
      },
      {
        title: "All Users",
        description: "Check Users history",
        icon: "👤",
        link: "/employee-userhistory",
        color: "secondary",
        gradient: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)"
      },
      {
        title: "Settings",
        description: "Manage system settings",
        icon: "⚙️",
        link: "/employee-settings",
        color: "warning",
        gradient: "linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)"
      },
      {
        title: "Help Center",
        description: "Get support and documentation",
        icon: "❓",
        link: "/help-center",
        color: "dark",
        gradient: "linear-gradient(135deg, #c3cfe2 0%, #c3cfe2 100%)"
      }
    ],
    greetings: {
      morning: "Good Morning",
      afternoon: "Good Afternoon",
      evening: "Good Evening"
    },
    welcomeSection: {
      subtitle: "Ready to make a difference today? Here's your dashboard overview.",
      metaLabels: {
        id: "ID:",
        role: "Role:",
        lastLogin: "Last login:"
      },
      profileStats: {
        performance: { value: "98%", label: "Performance" },
        tasksDone: { value: "156", label: "Tasks Done" }
      },
      defaultProfilePic: "https://randomuser.me/api/portraits/men/75.jpg"
    },
    statsCards: {
      totalUsers: {
        icon: "fas fa-users",
        label: "Total Users",
        progressText: "+12% from last month",
        className: "stats-primary"
      },
      pendingApplications: {
        icon: "fas fa-file-alt",
        label: "Pending Applications",
        progressText: "-5% from yesterday",
        className: "stats-success"
      },
      approvedToday: {
        icon: "fas fa-check-circle",
        label: "Approved Today",
        progressText: "+23% from yesterday",
        className: "stats-warning"
      }
    },
    sectionHeaders: {
      quickActions: {
        title: "Quick Actions",
        subtitle: "Access your most used tools and features"
      },
      recentActivity: {
        title: "Recent Activity",
        badge: "Live",
        buttonText: "View All"
      },
      todaysSummary: { title: "Today's Summary" }
    },
    recentActivityItems: [
      {
        type: "user-registration",
        avatar: { icon: "fas fa-user-plus", bgColor: "bg-primary" },
        title: "New user registration",
        description: "John Doe registered for Arogya Card",
        time: "2 minutes ago",
        status: { text: "New", className: "status-new" }
      },
      {
        type: "application-approved",
        avatar: { icon: "fas fa-check", bgColor: "bg-success" },
        title: "Application approved",
        description: "Ambulance service application processed",
        time: "15 minutes ago",
        status: { text: "Approved", className: "status-approved" }
      },
      {
        type: "system-update",
        avatar: { icon: "fas fa-cog", bgColor: "bg-info" },
        title: "System update",
        description: "Database backup completed successfully",
        time: "1 hour ago",
        status: { text: "System", className: "status-system" }
      }
    ],
    quickStatsItems: [
      { icon: "fas fa-tasks", bgColor: "bg-primary", number: "12", label: "Tasks Completed" },
      { icon: "fas fa-clock", bgColor: "bg-success", number: "7h 30m", label: "Hours Worked" },
      { icon: "fas fa-bell", bgColor: "bg-warning", number: "3", label: "Notifications" }
    ],
    apiEndpoint: "https://ruwa-backend.onrender.com/api/employee/dash",
    defaultStats: {
      totalApplications: 0,
      pendingApplications: 0,
      todayAppliedCount: 0
    }
  };

  res.json(dashboardData);
});

module.exports = router;
